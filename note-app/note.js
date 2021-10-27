const fs = require('fs')
const chalk = require('chalk')

const addNote = function (title, body) {
    let notes = []
    if (fs.existsSync('./notes.json')) {
        notes = JSON.parse(fs.readFileSync('./notes.json').toString())
    }
    notes.push({
        title,
        body
    })
    fs.writeFileSync('./notes.json', JSON.stringify(notes))
}

const removeNote = function (title) {
    if (!fs.existsSync('./notes.json')) {
        return console.log(chalk.red("file doesn't exists"));
    }
    const notes = JSON.parse(fs.readFileSync('./notes.json').toString())
    if (notes.length === 0) {
        return console.log(chalk.red("No notes found to remove"));
    }
    if (notes.findIndex((item) => item.title === title) === -1) {
        return console.log(chalk.red("Title not found"));
    }
    fs.writeFileSync('./notes.json', JSON.stringify(notes.filter((item) => item.title !== title)))
    console.log(chalk.green("Title removed"));
}

module.exports = {
    addNote,
    removeNote,
}