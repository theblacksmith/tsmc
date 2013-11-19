#!/usr/bin/env node

/**
 * TSM command line tool
 *
 * @todo Add an init command
 */

var tsm = require('../');

var inquirer = require('inquirer');
var program = require('commander');
var _ = require('underscore');

require('colors');

program
  .version('0.0.1')
  .description('TypeScript module compiler. Compiles tsm definitions.')
  .usage('[options] <module_path>')
  .option('<module_path>', 'The path to a module folder or configuration file (*.tsm or package.json)')
  .option('--debug', 'Enable tsm debug output')
  .option('-v, --verbose', 'Enable verbose output')
  .on('--help', showExamples)
  .parse(process.argv);

if (!program.args.length) {
  showError('module_path is required');
  showHelp();
  process.exit(1);
};

var path = program.args[0];

if(program.debug) tsm.enableDebug();
if(program.verbose) tsm.setVerboseOn();
// All set, let's go!
try {
  tsm.compile(path);  
}
catch(err) {
  if(program.debug) {
    throw err;
  }
  else {
    console.log('We got a problem...'.red);
    _((err.message||err).split("\n")).each(function(msg) {
      console.log('>> '.red + msg.trim().white);  
    })
    console.log();
    process.exit(-1);
  }
}


// Helpers

function showError(err) {
  console.log( ('  Error: '+err).red );
}

function showHelp() {
  program.parse(['', '', '-h']);
}

// custom help
function showExamples(){
  console.log('  Examples:');
  console.log('');
  console.log('    $ tsm module.tsm');
  console.log('    $ tsm package.json');
  console.log('    $ tsm my/module');
  console.log('');
}