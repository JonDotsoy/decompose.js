import glob from 'glob'
import fs from 'fs'
import documentation from 'documentation'
const {src, task, watch, dest} = require('lodash/bindAll')(require('gulp'), ['src', 'task', 'watch', 'dest'])

task('build', () =>
  src(['src/decompose.js', 'src/expect.js'])
  .pipe(require('gulp-babel')())
  .pipe(dest('.'))
)

task('doc', async () => {
  const output = await (
    documentation.build(glob.sync('src/**/*.js'), {access: ["public"]})
    .then(documentation.formats.markdown)
  )

  fs.writeFileSync('docs/API.md', output)
})
