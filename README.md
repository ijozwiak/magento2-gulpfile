# Magento 2 gulpfile 

Gulp tasks and configuration necessary to setup gulp-based front-end workflow for deploying and watching theme customizations.

Requirements
-----
- Node.js
- gulp-cli (intalled globally) - `npm install -g gulp-cli`
- Magento 2 project with LESS based theme 

> If you need SASS support I highly recommend the excellent [Frontools by Snowdog](https://github.com/SnowdogApps/magento2-frontools) 


Installation
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
		"gulp-image": "^4.4.1",
		"gulp-util": "^3.0.8",
		"stylelint": "^9.10.0",
		"stylelint-config-standard": "^18.2.0",
		"gulp-eslint": "^5.0.0"
3. Run 
	
		npm install

Configuration
----
Copy **dev/tools/gulp/configs/** into your root directory and update configuration using the following templates:

**themes.js** 

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
        
**browser-sync.js**

        module.exports = {
          	proxy : "local.magento"
        }

_proxy_: Local address of your site

**stylelint.js**

    	module.exports = {
			"extends": "stylelint-config-standard",
			"ignoreFiles": ["/**/_module.less", "/**/_widgets.less"],
			"rules": {
				"at-rule-empty-line-before": null,
				"no-descending-specificity": true,
				"indentation": 4,
				"string-quotes": "single",
				"selector-max-id": 0,
				"selector-class-pattern": "^_?[a-z0-9]+(-[a-z0-9]+)*$",
				"max-nesting-depth": 4,
				"number-leading-zero": "never",
				"max-empty-lines": 2
			}
		}

Update _rules_ with your custom ones adding to or overriding the existing [standard rules](https://github.com/stylelint/stylelint-config-standard/blob/master/index.js).

**eslint.js**

	module.exports = {
		"env": {
			"amd": true,
			"browser": true,
			"jasmine": true,
			"node": true,
			"es6": true
		},
		"rules": {
			"consistent-return": 2,
			"eqeqeq": [2, "smart"],
			"guard-for-in": 2,
			"lines-around-comment": [
			2,
			{
				"beforeBlockComment": true
			}
			],
			"max-depth": [2, 2],
			"max-len": [2, 120, 4],
			"max-nested-callbacks": [2, 3],
			"newline-after-var": 2,
			"no-alert": 2,
			"no-array-constructor": 2,
			"no-caller": 2,
			"no-catch-shadow": 2,
			"no-cond-assign": 2,
			"no-constant-condition": 2,
			"no-debugger": 2,
			"no-else-return": 2,
			"no-eval": 2,
			"no-ex-assign": 2,
			"no-extend-native": 2,
			"no-extra-bind": 2,
			"no-extra-boolean-cast": 2,
			"no-extra-parens": 2,
			"no-extra-semi": 2,
			"no-fallthrough": 2,
			"no-floating-decimal": 2,
			"no-func-assign": 2,
			"no-implied-eval": 2,
			"no-inner-declarations": 2,
			"no-invalid-regexp": 2,
			"no-lone-blocks": 2,
			"no-lonely-if": 2,
			"no-loop-func": 2,
			"no-multi-str": 2,
			"no-native-reassign": 2,
			"no-negated-in-lhs": 2,
			"no-new-object": 2,
			"no-proto": 2,
			"no-redeclare": 2,
			"no-regex-spaces": 2,
			"no-return-assign": 2,
			"no-self-compare": 2,
			"no-shadow": 2,
			"no-undef": 2,
			"no-undef-init": 2,
			"no-unreachable": 2,
			"no-unused-vars": [
			2,
			{
				"args": "after-used",
				"vars": "all"
			}
			],
			"no-use-before-define": 2,
			"no-with": 2,
			"operator-assignment": [2, "always"],
			"radix": 2,
			"semi": [2, "always"],
			"semi-spacing": 2,
			"strict": 2,
			"use-isnan": 2,
			"valid-typeof": 2,
			"vars-on-top": 2
		}
	}


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

Lint js files: 

	gulp js:lint [--theme-alias]

Alias for js:lint:

	gulp js [--theme-alias]

Optimize images in the web/images folder

	gulp image:optimize [--theme-alias]

> Note: this task overwrites existing image files. If you want to keep the original files specify optimized images destination folder in gulp.dest pipe

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