import inquirer from 'inquirer';
import yargs from 'yargs';
import ObjectDownloader from '../helpers/ObjectDownloader';
import { ObjectDownloaderPayload } from '../types/ObjectDownloader.interface';

export default class NDMStart {

  static builder(yargs: yargs.Argv<{}>) {
    yargs.option('url', {
      alias: 'u',
      describe: 'Pass this value and the file will begin downloading.'
    })
  }

  static async handler(argv: yargs.Arguments) {
    let args = argv as unknown as ObjectDownloaderPayload

    if (!args.url) {
      args.url = (await inquirer.prompt([
        {
          type: 'input',
          name: 'url',
          message: 'Please provide a url: '
        },
      ])).url
    }

    const object = new ObjectDownloader(args)
    args.fileName = (await inquirer.prompt([
      {
        type: 'input',
        name: 'fileName',
        message: 'Change file name?',
        default: object.fileName
      }
    ])).fileName

    object.fileName = args.fileName

    const { proceed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: `Are you sure you wan to continue with download?
          File Name: ${object.fileName}${object.metadata.ext}
          File Size: ${object.metadata.size}MB
        `,
      }
    ])
    args.fileName = args.fileName + object.metadata.ext
    if (proceed) new ObjectDownloader(args).getFile()
  }
}
