///<reference path="node.d.ts"/>

declare module "minimatch" {
    export function minimatch(path: string, pattern: string, options?: Options): boolean;
    export function filter(pattern: string, options?: Options): (path: string) => boolean;
    export function match(fileList: string[], pattern: string, options?: Options): string[];
    export function makeRe(pattern: string, options?: Options): RegExp;

    export class Minimatch {
        constructor(pattern: string, options: Options);
        public pattern: string;
        public options: Options;
        public regexp: RegExp;
        public set: any[][];
        public negate: boolean;
        public comment: boolean;
        public empty: boolean;
        public makeRe(): RegExp;
        public match(path: string): boolean;
    }


    export interface Options {
        debug?: boolean;
        nobrace?: boolean;
        noglobstar?: boolean;
        dot?: boolean;
        noext?: boolean;
        nonull?: boolean;
        nocase?: boolean;
        matchBase?: boolean;
        nocomment?: boolean;
        nonegate?: boolean;
        flipNegate?: boolean;
	}
}