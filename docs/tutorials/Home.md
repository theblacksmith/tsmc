## What is it?

`tsm` is a [TypeScript](http://typescriptlang.org) module compiler. It's a tool to tackle complexity of large apps allowing you to define the app's modules and have them compiled and agregated into supermodules at your will.

## Why should I use it?

If you have a medium to large sized app or library that you want to compile both broken down by modules and to a single file, then `tsm` is the right tool for the job.

`tsm` allows you to configure multiple module definitions (which will work as compilation targets) to generate diferent combinations of your source code.

As an example, lets say you are creating a component based javascript framework, and you have the following module structure:

    AwesomeJS
      - ui
        - modals
        - carousel
        - menu
      - data
        - rest
        - binding
      - ajax

Now, let's say you want every submodule available separately as well as each group and a package with the entire framework. The following `tsm` config would give it you:

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

For each of those files, you'll also get a declaration (.d.ts) file and a sourcemap (.js.map) file.

## I want it, so what do I do now?

Check out [Quick Start](https://github.com/theblacksmith/tsm/wiki/Quick-Start) to see how to get it working on your project.