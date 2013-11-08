// https://github.com/Marak/colors.js

// import _colors = module("colors");
// var colors = require('colors');

declare module "colors" {
	export function setTheme(theme: any);
	export function addSequencer(name: string, callback: Function);

	// none, browser, console
	export var mode: string;
}

interface String {
	bold: string;
	italic: string;
	underline: string;
	inverse: string;
	white: string;
	grey: string;
	black: string;
	blue: string;
	cyan: string;
	green: string;
	magenta: string;
	red: string;
	yellow: string;
}