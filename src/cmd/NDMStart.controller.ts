import inquirer from 'inquirer';
import yargs from 'yargs';
import ObjectDownloader from '../helpers/ObjectDownloader';
import { ObjectDownloaderPayload } from '../types/ObjectDowloader.interface';

export default class NDMStart {

  static builder (yargs: yargs.Argv<{}>) {
    yargs.option('url', {
      alias: 'u',
      describe: 'Pass this value and the file will begin downloading.'
    })
  }

  static async handler (argv: yargs.Arguments) {
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

    args.fileName = (await inquirer.prompt([
      {
        type: 'input',
        name: 'fileName',
        message: 'Change file name?',
        default: args.url
      }
    ])).fileName

  new ObjectDownloader().download( args)

  }


}
