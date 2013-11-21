# TypeScript Module Compiler

## What is it?

`tsmc` is a [TypeScript](http://typescriptlang.org) module compiler. It's a tool to tackle complexity of large apps allowing you to define the app's modules and have them compiled and agregated into supermodules at your will.

## What problem does it solve?

If all your typescrit files are in the same project on VS, you have two options: 
either compile each `ts` file to a `js` file or bundle everyhing in a single javascript. There is no middle ground.
It does not matter if you are using internal or external modules, and the same goes for manual compilation, you either
set `--out` or `--out-dir`.

## Why should I use it?

Personally, I hate when I have to load a bunch of stuff I'm not going to use. 
So, if you have a medium to large sized app or library, please, break it down by modules so your users can get **only**
what they want. Of course, a have-it-all package is also handy sometimes. If you decide to do that,
then `tsmc` is the right tool for the job.

## How does `tsmc` help me?

`tsmc` allows you to configure multiple module definitions (which will work as compilation targets) to generate 
diferent combinations of your source code.

As an example, lets say you are creating a component based javascript framework, and you have the following 
module structure:

    AwesomeJS
      - ui
        - modals
        - carousel
        - menu
      - data
        - rest
        - binding
      - ajax

Now, let's say you want every submodule available separately, as well as each namespace and a package 
with your entire framework. The following `tsmc` config would give it you:

    {
      "name": "awesomejs"
      "moduleRoot": "."
      "submodules": {
        "ui": {
          "name": "awesomejs-ui",
          "moduleRoot": "ui",
          "submodules": {
            "modals": "modals/module.tsm",
            "carousel": "carousel/module.tsm",
            "menu": "menu/module.tsm"
          }
        },
        "data": {
          "name": "awesomejs-data",
          "moduleRoot": "data",
          "submodules": {
            "rest": "rest/module.tsm",
            "binding": "binding/module.tsm",
          }
        },
        "awesomejs-ajax": "ajax/module.tsm"
      }
    }

That will generate the following files:
  
  - awesomejs-ui.js
  - awesomejs-ui-modals.js 
  - awesomejs-ui-carousel.js 
  - awesomejs-ui-menu.js 
  - awesomejs-data.js
  - awesomejs-data-rest.js
  - awesomejs-data-binding.js
  - awesomejs-ajax.js
  - awesomejs.js

<div class='flash alert alert-info'>
  <strong>Note:</strong>
  For each of those files, you'll also get a declaration (.d.ts) file and a sourcemap (.js.map) file.
</div>

## I want it, so what do I do now?

Check out the [Quick Start](https://github.com/theblacksmith/tsmc/wiki/Quick-Start) to see how to get it working on your project.
