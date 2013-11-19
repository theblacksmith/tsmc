// glob updated: 3.1.14
// https://github.com/isaacs/node-glob

///<reference path="node.d.ts"/>

declare module "glob" {
	import glob = require("glob");

	export function sync(pattern: string, options?: Options) : string[];

	export interface Glob extends EventEmitter {
		// event: end
		// event: match
		// event: error
		// event: abort

		constructor (pattern: string, callback: (err: Error, files: string[]) => void);
		constructor (pattern: string, options: Options, callback: (err: Error, files: string[]) => void);

		abort();

		minimatch: any;
		options: Options;
		error: Error;
		aborted: boolean;
	}

	export interface Options {
		cwd?: string;
		root?: string;
		nomount?: boolean;
		mark?: string;
		nosort?: boolean;
		stat?: boolean;
		silent?: boolean;
		strict?: boolean;
		statCache?;
		sync?: boolean;
		nounique?: boolean;
		nonull?: boolean;
		nocase?: boolean;
		debug?: boolean;
		globDebug?: boolean;
	}
}