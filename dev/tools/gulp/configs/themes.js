module.exports = {
  <theme>: {
   "src": [
     "app/design/frontend/<Vendor>/<theme>"
     ],
   "dest": "pub/static/frontend/<Vendor>/<theme>",
   "locale": ["en_US"],
   "lang": "less",
   "area": "frontend",
   "vendor": "<Vendor>",
   "name": "<theme>",
   "files": [
     "css/styles-m",
     "css/styles-l",
     "css/<custom-css>"
    ]
  }

 };