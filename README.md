# gulp-demo
在package.json所在目录下运行npm install命令，会自动安装package.json里面的所有依赖。
由于个人pc装的gulp有问题，在运行gulp命令时要有gulp.cmd这个文件。

运行效果是会对css、js文件生成hash版本号,在html文件中引入css、js文件时会在路径末尾加入v=版本号。
condition为false表示不压缩文件，发生产时改为true压缩文件。
