# MAGENTO2 GULPFILE #

Based on Bitbull's Simple Gulpfile for Magento2 (https://github.com/bitbull-team/magento2-gulpfile).

Usage
-----

1. Place the gulpfile.js and the package.json in the root of your project.

2. Install the required modules:

        npm install /  yarn install  

3. Create configuration file **dev/tools/gulp/configs/themes.js** with the following contents.

        module.exports = {
        <Theme>: {
          "src": [
            "app/design/frontend/<Vendor>/<Theme-name>"
            ],
          "dest": "pub/static/frontend/<Vendor>/<Theme-name>",
          "locale": [locale,locale],
          "lang": "less",
          "area": "frontend",
          "vendor": <Vendor>,
          "name": <Theme-name>,
          "files": [
            "css/styles-m",
            "css/styles-l"
           ]
         }
        };
  
- _src_:  Array of theme and modules you want to compile
- _dest_: Path in pub/static of your theme
- _area_: area, one of (frontend|adminhtml|doc),
- _name_: theme name in format theme-name,
- _locale_: array of language to compile,
- _files_: Files to compile
        
4. Create configuration file **dev/tools/gulp/configs/browser-sync.js** with the following contents.

        module.exports = {
          proxy : "m22ce.demo"
        }

_proxy_: Local address of your site


Commands
--------
 
**CSS**

        gulp css --Theme-name

Compiles less to CSS.       

**Watch**
        
        gulp watch --Theme-name

Watches for less changes in vendor modules/themes and compile them in pub/static.
        
**Deploy**
        
        gulp deploy --Theme-name

Clean old assets and run deployments commands.    

**Cache clean**
        
        gulp clean-cache --Theme-name

Clean local cache in var/page_cache/ var/cache/ /var/di/ /var/generation/

**Browsersync**
        
        gulp browser-sync --Theme-name

Initiate browsersync (already included in the watch task).   

