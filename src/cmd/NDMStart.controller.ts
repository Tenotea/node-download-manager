import inquirer from 'inquirer';
import yargs from 'yargs';

export default class NDMStart {
  constructor () {
    // this.start()
  }
  
  static builder (yargs: yargs.Argv<{}>) {
    yargs.option('u', {
      alias: 'url',
      describe: 'Pass this value and the file will begin downloading.'
    })
  }

  static handler (argv: yargs.Arguments) {
    console.log(argv)
    const url = argv?.u || argv?.url
    if (!url) {
      inquirer.prompt([
        'Provide a URL: ',
        'Provide a file name'
      ]).then(answers => {
        console.log(answers);
      })
    }
    console.log("You already provided a URL")
  }
}
