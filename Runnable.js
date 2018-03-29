var fs = require('fs')
var path = require('path')
var readline = require('readline')

const commandLineArgs = require('command-line-args')

console.log('Usage: node Runnable.js [--input | -i input.txt] [--output | -o output.txt]')

const optionDefinitions =
[
  { name: 'input', 	alias: 'i', type: String, multiple: false},
  { name: 'output', alias: 'o', type: String, multiple: false}
]

const options = commandLineArgs(optionDefinitions)

var inputData
var inputArray = []

function writeBack(inputArray) {
  if (options.output) {
    console.log('[OUTPUT: FILE][WRITING: START]')
    var writePath
    if (options.input) {
      var fdir = path.resolve(options.input)
      writePath = fdir.replace(path.basename(fdir), options.output)
    }
    else {
      writePath = path.resolve(__dirname) + '/' + options.output
    }
    var writeData
    writeData = '[\n'
    for (var i = 0; i < inputArray.length; i++) {
      if (i + 1 < inputArray.length)
      writeData += '"' + inputArray[i] + '"\n,'
      else
      writeData += '"' + inputArray[i] + '"\n'
    }
    writeData += ']'
    fs.writeFile(writePath, writeData, (err) => {
      if (err) throw err
      console.log('[OUTPUT: FILE][WRITING: DONE][PATH: ' + writePath + ']')
    })
  }
  else {
    console.log('[OUTPUT: STDOUT][WRITING: START]')
    console.log('[')
    for (var i = 0; i < inputArray.length; i++) {
      if (i + 1 < inputArray.length)
        console.log('"' + inputArray[i] + '",')
      else
        console.log('"' + inputArray[i] + '"')
    }
    console.log(']')
    console.log('[OUTPUT: STDOUT][WRITING: DONE]')
  }
}

if (options.input) {
  var fdir = path.resolve(options.input)
  fs.open(fdir, 'r+', (err, fd) => {
    if (err)
      throw err
    console.log('[INPUT: FILE][READING: START]')
    var lineReader = require('readline').createInterface({
      input: require('fs').createReadStream(fdir)
    })
    lineReader.on('line', function (line) {
      inputArray.push(line)
    })
    lineReader.on('close', function() {
      console.log('[INPUT: FILE][READING: DONE]')
      return writeBack(inputArray)
    })
  })
}
else {
  console.log('[INPUT: STDIN][WAITING FOR INPUT LINE BY LINE][WRITE "END" AT THE NED OF INPUT TO CLOSE THE READER]')
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  })
  rl.on('line', function(line){
    if (line !== 'END')
      inputArray.push(line)
    else {
      console.log('[INPUT: STDIN][READING: DONE]')
      return writeBack(inputArray)
    }
  })
}