# example-gulp-template
 An example of what you can make with gulp, includes server, watching  files, build etc. with PHP support

# How to install
``npm && npm i --save-dev``
and
``npm i gulp-cli -g && npm i sass -g``

Then place / make your .php / .html files,
To use the JS scripts andd SCSS do this:

Put in `<head>` tag:
```html
    <link rel="stylesheet" href="css/main.css">
```

Put directly above of `</body>` element:
```html
<script src="js/app.js"></script>
```

use `gulp build` to build files or `gulp watchServe` for live development.

Happy developing!
