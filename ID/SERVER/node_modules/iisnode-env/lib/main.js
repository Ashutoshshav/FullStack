var fs = require('fs')

/*
 * Parses a string or buffer into an object
 * @param {(string|Buffer)} src - source to be parsed
 * @returns {Object} keys and values from appSettings in src
*/
function parse (src) {
  var obj = {}
  // convert Buffers before splitting into lines and processing
  var content = src.toString()
  // get appSettings node
  var appSettings = content.split('<appSettings>')[1]
                           .split('</appSettings>')[0]
                           .trim()
  // Turn "<add key="x" value="y" />"" into "x=y"
  appSettings.split('\n').filter(function (line) {
    // remove lines that are not settings
    return /^<add key="/.test(line.trim())
  })
  .map(function (line) {
    var key = line.split('key="')[1].split('" value="')[0]
    var value = line.split('value="')[1].split(/"\s?\/>/)[0]
    return key + '=' + value
  }).forEach(function (line) {
    // matching "KEY' and 'VAL' in 'KEY=VAL'
    var keyValueArr = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/)
    // matched?
    if (keyValueArr != null) {
      var key = keyValueArr[1]

      // default undefined or missing values to empty string
      var value = keyValueArr[2] || ''

      // expand newlines in quoted values
      var len = value ? value.length : 0
      if (len > 0 && value.charAt(0) === '"' && value.charAt(len - 1) === '"') {
        value = value.replace(/\\n/gm, '\n')
      }

      // remove any surrounding quotes and extra spaces
      value = value.replace(/(^['"]|['"]$)/g, '').trim()

      obj[key] = value
    }
  })

  return obj
}

/*
 * Main entry point into iisnode-env.
 * @param {Object} options - options for parsing .env file
 * @param {string} [options.path=web.config] - path to web.config file
 * @param {string} [options.encoding=utf8] - encoding of web.config file
 * @returns {Object} parsed object or error
*/
function config (options) {
  // return if iisnode_version in env
  if (process.env.hasOwnProperty('IISNODE_VERSION')) {
    return {}
  }
  var path = 'web.config'
  var encoding = 'utf8'

  if (options) {
    if (options.path) {
      path = options.path
    }
    if (options.encoding) {
      encoding = options.encoding
    }
  }

  try {
    // specifying an encoding returns a string instead of a buffer
    var parsedObj = parse(fs.readFileSync(path, { encoding: encoding }))

    Object.keys(parsedObj).forEach(function (key) {
      if (!process.env.hasOwnProperty(key)) {
        process.env[key] = parsedObj[key]
      }
    })

    return { parsed: parsedObj }
  } catch (e) {
    return { error: e }
  }
}

module.exports.parse = parse
module.exports.config = config
module.exports.load = config
