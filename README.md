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
1. Download gulpfile.js into the root folder of your project
2. Add the following dependancies to your local package.json file (into devDependancies):
		
		"browser-sync": "^2.26.3",
		"chalk": "^2.1.0",
		"gulp": "^4.0.0",
		"gulp-clean": "^0.3.2",
		"gulp-less": "^4.0.1",
		"gulp-run": "^1.7.1",
		"gulp-sourcemaps": "^2.6.0",
		"gulp-stylelint": "^8.0.0",
		"gulp-util": "^3.0.8",
		"stylelint": "^9.10.0",
		"stylelint-config-standard": "^18.2.0"
3. Run 
	
		npm install

4. Create configuration file **dev/tools/gulp/configs/themes.js** with the following contents.

		module.exports = {
			<"theme-alias">: {
				"locale": locale,
				"lang": "less",
				"area": "frontend",
				"vendor": <"Vendor">,
				"name": <"Theme-name">,
				"files": [
					"css/styles-m",
					"css/styles-l",
					"css/<custom-css>"
				]
			}
		};
  
- _locale_: local language,
- _lang_: css preprocessor (currently only less is supported)
- _area_: area, one of (frontend|adminhtml|base),
- _vendor_: developing company,
- _name_: theme name,
- _files_: Files to compile
        
5. Create configuration file **dev/tools/gulp/configs/browser-sync.js** with the following contents.

        module.exports = {
          	proxy : "local.magento"
        }

_proxy_: Local address of your site

Usage
--------
**Default usage**

Refresh static assets, lint, compile and watch less files for changes (run `gulp --tasks` for more details):

        gulp theme [--theme-alias]

> Note: [--theme-alias] is optional, the first available theme in themes.js is used by default
---
**Additional commands**

Lint less files: 

	gulp less:lint [--theme-alias]

> Note: _module.less and _widget.less are excluded from linting 

Compile less to CSS:

	gulp less:compile [--theme-alias]

Alias for less:lint and less:compile sequence:

	gulp less [--theme-alias]

Clean local cache in var/page_cache/ var/cache/ /var/di/ /var/generation/: 
        
	gulp clean:cache [--theme-alias]

Clean static assets in pub/static and var/view_preprocessed folders:
        
	gulp clean:static [--theme-alias]
        
Create aliases in pub/static folder:
        
	gulp source [--theme-alias]

Manually trigger static asset deployment for frontend:
        
	gulp deploy:static [--theme-alias]

Manually trigger static asset deployment for admin:
        
	gulp deploy:admin [--theme-alias]

Serves static assets and watches for less file changes in vendor modules/themes:
        
	gulp serve [--theme-alias]

License
-----
This project is licensed under **GNU General Public License v3.0**