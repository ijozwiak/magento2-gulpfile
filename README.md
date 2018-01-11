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

src:  Array of theme and modules you want to compile

dest: Path in pub/static of your theme

area: area, one of (frontend|adminhtml|doc),

name: theme name in format theme-name,

locale: array of language to compile,

files: Files to compile
        
4. Create configuration file **dev/tools/gulp/configs/browser-sync.js** with the following contents.

        module.exports = {
          proxy : "m22ce.demo"
        }

proxy: Local address of your site


Commands
--------
 
1. **CSS**. Compiles less to CSS.       
        
        gulp css --Theme-name

1. **Watch**. Watches for less changes in vendor modules/themes and compile them in pub/static.       
        
        gulp watch --Theme-name
        
1. **Deploy**. Clean old assets and run deployments commands.    
        
        gulp clean --Theme-name

1. **Cache clean**. Clean local cache in var/page_cache/ var/cache/ /var/di/ /var/generation/
        
        gulp clean-cache --Theme-name

1. **Browsersync**. Initiate browsersync (already included in the watch task).   
        
        gulp browser-sync --Theme-name

