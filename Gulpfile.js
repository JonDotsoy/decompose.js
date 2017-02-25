const {src, task, watch, dest} = require('lodash/bindAll')(require('gulp'), ['src', 'task', 'watch', 'dest'])

task('build', () =>
  src(['src/decompose.js','src/eql.js'])
  .pipe(require('gulp-babel')())
  .pipe(dest('.'))
)
