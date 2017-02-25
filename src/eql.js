const {decompose} = require('./decompose')

/**
 */
function eqlInfo (objArg, compareObjArg) {

  return decompose(objArg)

}

function isEql (objArg, compareObjArg) {

}

function eql (objArg, compareObjArg) {

}

eql.info = eqlInfo

exports = module.exports = {
  __esModule: true,
  default: eql,
  eql,
  isEql,
  eqlInfo
}

