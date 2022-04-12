import https from 'https'
import fs from 'fs'
import { ObjectDownloaderPayload } from '../types/ObjectDowloader.interface'
import path from 'path'

export default class ObjectDownloader {

  download (data:ObjectDownloaderPayload) {
   // Download the file
    https.get(data.url, (res) => {

        // resolve the path
        const tmpFolder = path.resolve(__dirname, '../../tmp/')
        if (!fs.existsSync(tmpFolder)){
          fs.mkdirSync(tmpFolder)
        }
        // Open file in local filesystem
        const file = fs.createWriteStream(`${tmpFolder}/${data.fileName}`);

        // Write data into local file
        res.pipe(file);

        // Close the file
        file.on('finish', () => {
            file.close();
            console.log(`File downloaded!`);
        });

      }).on("error", (err) => {
          console.log("Error: ", err.message);
      }) 
  }
}
