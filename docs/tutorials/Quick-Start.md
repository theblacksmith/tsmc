### 1. Install

    npm install -g tsm

### 2. Configure

You have two options available to cofigure your module: create a `.tsm` file with your module configuration or
if you have a add a `package.json` file you can simply add `tsm` property to your json config.

Both ways have the same configuration options available. Check the api docs for the [ModuleConfig class](ModuleConfig.html) for more the details on the options, but here goes a quick summary.

<div class='flash alert alert-info'>
<strong>Note:</strong> The only required properties are <code>name</code> and <code>moduleRoot</code>
</div>

    {
      "name": "MyCompanyUtils",
      "src": ["**/*.ts", "!**/*.d.ts"],
      "moduleRoot": ".",
      "parentModule": "",

      "submodules": {
        "server": "server/server.tsm",
        "ui": "ui",
        "ajax": {
          "src": ["**/*.ts", "!**/*.d.ts"],
          "moduleRoot": "ajax",
          "dependencies": {
            "jack.ui": "../ui"
          }
        }
      },

      "dependencies": {},

      "options": {
        "allowbool": false,
        "allowimportmodule": false,
        "declaration": true,
        "mapRoot": "",
        "moduleKind": ModuleKind.None,
        "noImplicitAny": false,
        "noResolve": false,
        "outDir": "",
        "removeComments": false,
        "sourcemap": true,
        "sourceRoot": ""
      }
    }

##### Wondering how `submodules` and `dependencies` work?

The straigh to the point explanation is: 

**Submodules** are modules that you want compiled individually **and** as part of a parent module. Think `bootstrap.js` and `modal.js`, they are the parent module and submodule.

**Dependencies** are modules that need to be referenced, but you don't want as part of the compile code.

Both are configured in the same way: a hash where each property is a module's or reference's name and the value is a reference to a module. 

A **reference** can take onde of these three forms: 

- a path to a file which contains the configuration of a module (either a `.tsm` or a `package.json`)
- a path to a folder which contains a file (like above) with the module config
- a hash with the referenced module configuration following the same rules as any other config

### 3. Compile

Just call

    $ tsm MODULE_PATH

Where `MODULE_PATH` can be

- A path to a config file (either a `.tsm` or a `package.json`)
- A folder which contains a config file

<div class='flash-global alert alert-info'>
<strong>Note:</strong> The folder MUST NOT contain both
</div>