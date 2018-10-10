const json = require('./1009-0840.json')

const parse = longDamnString => {
    return JSON.parse(longDamnString)
}

console.log(parse(json))