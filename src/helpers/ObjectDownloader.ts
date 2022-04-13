import https from 'https'
import http from 'http'
import fs from 'fs'
import os from 'os';
import { ObjectDownloaderPayload, ObjectMetadata } from '../types/ObjectDownloader.interface'
import path from 'path'
import cliProgress from 'cli-progress'
import colors from 'ansi-colors'

export default class ObjectDownloader {
  metadata: ObjectMetadata = { } as any
  private url: string
  public fileName: string
  private _http: typeof http | typeof https = http
  private progressBar = new cliProgress.SingleBar({
    format: 'CLI Progress |' + colors.cyan('{bar}') + '| {percentage}% || {value}MB/{total}MB Downloaded',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
  });

  constructor ({ fileName, url }: ObjectDownloaderPayload) {
    this.fileName = fileName
    this.url = url
    this.setProtocol()
    this.getFileMetaData()
  }

  private setProtocol () {
    this._http = this.url.startsWith('https://') ? https : http
  }

  private getFileMetaData () {
    const fileExtension = path.extname(this.url);
    const fileName = path.basename(this.url, fileExtension)
    if (!this.fileName) this.fileName = fileName
    this._http.get(this.url, (res) => {
      let fileSize = parseFloat(res.headers['content-length'] || '0')
      fileSize = parseFloat((fileSize / 1024 / 1024).toFixed(2))
      this.metadata = {
        name: fileName,
        ext: fileExtension,
        size: fileSize
      }
      res.on('error', (err) => {
        throw(err.message)
      })
    })
  }

  getFile() {
    this._http.get(this.url, (res) => {
      const downloadFolder = path.resolve(os.homedir(), './Downloads/ndm')
      
      if (!fs.existsSync(downloadFolder)) {
        fs.mkdirSync(downloadFolder)
      }

      const file = fs.createWriteStream(`${downloadFolder}/${this.fileName}`);

      let fileSize = parseFloat(res.headers['content-length'] || '0')
      fileSize = parseFloat((fileSize / 1024 / 1024).toFixed(2))

      let totalDownloaded = 0
      this.progressBar.start(fileSize, 0)

      res.on('data', (chunk) => {
        file.write(chunk);
        totalDownloaded += chunk.length / 1024 / 1024
        this.progressBar.increment()
        this.progressBar.update(parseFloat(totalDownloaded.toFixed(2)))
      })

      res.on('end', () => {
        this.progressBar.stop();
        file.close();
        console.log("File download completed successfully!")
      })

    }).on("error", (err) => {
      console.log("Error: ", err.message);
    })
  }
}
