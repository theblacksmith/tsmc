/// <reference path="../../typings/all.d.ts" />

require("colors");

/**
 * The Logger class
 */
class Logger
{
  private static current_pad = 1;
  private static pad_size = 3;
  private static debugEnabled = false;
  private static verboseOutput = false;

  static enableDebug() {
    Logger.debugEnabled = true;
  }

  static disableDebug() {
    Logger.debugEnabled = false;
  }

  static setVerboseOn() {
    Logger.verboseOutput = true;
  }

  static setVerboseOff() {
    Logger.verboseOutput = false;
  }

  static debug(title: string, msg?: string) {
    if(!Logger.debugEnabled)
      return;

    if(msg)
      Logger.log(title.yellow + ' ' + msg);
    else
      Logger.log(title.yellow);
  }

  static verbose(title: string, msg?: string) {
    if(Logger.verboseOutput) {
      if(msg)
        Logger.log(title.yellow + ' ' + msg);
      else
        Logger.log(title);
    }
  }

  static log(msg: string, padTimes: number = 0) {
    console.log(_.pad("", (Logger.pad_size * (padTimes + Logger.current_pad))) + msg);
  }

  static warn(msg: string) {
    console.log("Warning: ".magenta + msg.magenta);
    process.exit(-1);
  }

  static indent() {
    Logger.current_pad++;
  }

  static unindent() {
    Logger.current_pad--;
  }

  static skipLine() { Logger.log(""); }  

  static logHeader(text: string) {
    Logger.log(text.underline);
  }

  static logSubHeader(text: string) {
    Logger.log('>> '.green + text.white);
  }
}