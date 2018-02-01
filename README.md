# Magento 2 gulp + browser-sync

Sample files required to setup gulp-based FED task automation including browser-sync. Based on Bitbull's Simple Gulpfile for Magento2 (https://github.com/bitbull-team/magento2-gulpfile).

Requirements
-----
- Node.js
- gulp-cli (intalled globally) - npm install -g gulp-cli
- Magento 2 project with LESS based theme 

> If you need SASS support I highly recommend the excellent [Frontools by Snowdog](https://github.com/SnowdogApps/magento2-frontools) 


Installation and setup
----
1. Download gulpfile.js and package.json and put them into the root folder of your project
2. Run 
        npm install

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
            "css/styles-l",
            "css/<custom-css"
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
          proxy : "local.magento"
        }

_proxy_: Local address of your site

>>> If you're getting error message about outdated less module run `npm install --save less`

Usage
--------
 
**CSS**

        gulp css [--theme-name]

Compiles less to CSS.       

**Watch**
        
        gulp watch [--theme-name]

Watches for less changes in vendor modules/themes and compile them in pub/static.

**Clean static files**
        
        gulp clean-static [--theme-name]
        
Clean old static assets

**Deploy**
        
        gulp deploy [--theme-name]

Clean old assets and run deployment commands.    

**Cache clean**
        
        gulp clean-cache [--theme-name]

Clean local cache in var/page_cache/ var/cache/ /var/di/ /var/generation/

**Browsersync**
        
        gulp browser-sync [--theme-name]

Initiate browsersync (already included in the watch task).   

