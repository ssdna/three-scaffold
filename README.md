## A scaffold of three.js with gulp.

本脚手架没用webpack，只用了gulp，暂时也没有添加非js的脚本和非css的的处理，主要是为了更适和小型项目。

目前支持两种模式：

- development
- production

### development

[`CMD`: `gulp dev`]

开发模式没有uglify和minify，dev-server使用`browser-sync`，为方便开发过程调试增加了文件改动自动刷新，使用`browserify`+`watchify`+`babelify`实现对js文件的改动监听和编译，使用`gulp.watch`实现对html和css的改动监听自动刷新。

### production

[`CMD`: `gulp build`]

开发模式有对js文件的uglify、对css+html+image文件的minify，对css文件还有autoprefixer。
