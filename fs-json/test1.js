const fs = require('fs')
const user = JSON.parse(fs.readFileSync('user.json').toString())
user.age = 31
fs.writeFileSync('user.json', JSON.stringify(user))