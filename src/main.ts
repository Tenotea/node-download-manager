#!/usr/bin/env node

import yargs from 'yargs'
import NDMStart from './cmd/NDMStart.controller';

class Main {
  constructor () {
    yargs.command(
      'start', 
      'Initiates a new download', 
      NDMStart.builder,
      NDMStart.handler
    )
    .help()
    .argv
  }
}

new Main();
