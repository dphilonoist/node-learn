const yargs = require('yargs')
const noteUtility = require('./note')

yargs.command({
    command: 'add',
    describe: 'Adds note',
    builder: {
        title: {
            describe: "Note Title",
            demandOption: true,
            type: 'string'
        },
        body: {
            describe: "Note Body",
            demandOption: true,
            type: 'string'
        }
    },
    handler: function (argv) {
        noteUtility.addNote(argv.title, argv.body)
    }
})

yargs.command({
    command: 'remove',
    describe: 'Removes note',
    builder: {
        title: {
            describe: "Note Title",
            demandOption: true,
            type: 'string'
        }
    },
    handler: function (argv) {
        noteUtility.removeNote(argv.title)
    }
})

yargs.parse()