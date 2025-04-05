# HZTL Boilerplate 2021

## Developer Workstation Prerequisites

For local development, the following are required prior to running the project:

- [Node](https://nodejs.org/) (>=12.0.0)
- [Gulp](https://gulpjs.com/) (>=4.0.0)

Installation instructions for each can be found on their respective websites.

**Note:** if you for some reason prefer not to have `Gulp` globally installed, you can prefix `gulp` commands with `npx`.  For example:
```
npx gulp icons
```

## Check Out Project and Install Dependencies

```
$ git clone git@bitbucket.org:horizontal/hztl-open-container-pages.git
$ cd <YOUR PROJECT FOLDER>
$ npm install
```

## Local Development

```
$ cd <YOUR PROJECT FOLDER>
$ npm run dev
```

## Build Icon Font

```
$ cd <YOUR PROJECT FOLDER>
$ gulp icons
```

## Build for Production

```
$ cd <YOUR PROJECT FOLDER>
$ gulp prod
```

## Pattern Library

```
$ gulp patternlibrary
```


---

## Code Standards

- [Horizontal Digital HTML and CSS Style Guide](https://github.com/horizontalintegration/css-standards)
- [Horizontal Digital JavaScript Style Guide](https://github.com/horizontalintegration/javascript-standards)

## Languages & Tools

### Web Services

- [Express](https://expressjs.com/) for handling web requests.

### JavaScript

- [React](http://facebook.github.io/react) is used for UI.

### CSS

- [SASS](https://sass-lang.com) is used to write futureproof CSS.

### Routes
- [BrowserSync](https://browsersync.io/docs/options#option-middleware) Routes - Need to make an ajax call to an external service but it doesn't exist yet?  Create a mock data source route within your project.
### Create Route

* Within the `routes`, create a new folder with the name our your route.
* Within your newly created route folder, create the following file: `data.json`.
* The `data.json` file should contain a mock JSON object that represents the data you need to interact with.
* In `gulpfile.js`, please use below snippet whenever you create a new route (Change paths) inside middleware section.

```
{
    route: "<YOUR-API-URL>",
    handle: function (req, res, next) {
        var data = JSON.parse(fs.readFileSync('routes/<YOUR-FOLDER-NAME>/data.json'));
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data, '', 1));
    }
}
```
## How to manage JS files based on project requirement

* __If you need single compiled and minified js for all vendor, custom, component js files then add respective paths in `customandVendorjsFilesArr` in `gulpfile.js`. see example below__,

```
    const customandVendorjsFilesArr = [
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js',
        'node_modules/slick-slider/slick/slick.min.js',
        'src/Content/scripts/**/*.js',
        'src/components/**/*.js'
        ];
```

* __If you need vendor js files and custom js files separate then use 2 js files arrays `customandVendorjsFilesArr` and `vendorjsFilesArr` in `gulpfile.js`. This one will create compiled custom js as `main.js` and compiled vendor js files as `vendor.js`. Along with, it will have have separate vendor js files as well in `vendor` folder. see example below__,

```
    const customandVendorjsFilesArr = [
        'src/Content/scripts/**/*.js',
        'src/components/**/*.js'
        ];

    const vendorjsFilesArr = [
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js',
        'node_modules/slick-slider/slick/slick.min.js',
        ];
```

* __If you need specific custom js files separate then use 2 js files arrays `customjsFilesArr` for separate custom js files and `customandVendorjsFilesArr` in `gulpfile.js`. This  will create separate custom js  files mentioned in `customjsFilesArr` array. And compiled custom js as `main.js`__. see example below,

```
// To combine custom and vendor js files in single js file use following array
    const customandVendorjsFilesArr = [
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js',
        'node_modules/slick-slider/slick/slick.min.js',
        'src/Content/scripts/**/*.js',
        'src/components/**/*.js',
        '!src/components/accordion/accordion.js'
        ];

// To have custom js files in separate js files use following array
    const customjsFilesArr = [
        'src/components/accordion/accordion.js'
        ];

```