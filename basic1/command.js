const yargs = require('yargs')

yargs.command({
    command: 'add',
    describe: 'Adds note',
    builder: {
        title: {
            describe: "Note Title",
            demandOption: true,
            type: 'string'
        }
    },
    handler: function (argv) {
        console.log(argv.title)
    }
})

yargs.command({
    command: 'remove',
    describe: 'Removes note',
    handler: function () {
        console.log("Removed Note")
    }
})

yargs.parse()