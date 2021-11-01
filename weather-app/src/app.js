const express = require('express')
const chalk = require('chalk')
const path = require('path')
const hbs = require('hbs')
const { getWeather } = require('./forecast')

const publicPath = path.join(__dirname, '../public')
const viewPath = path.join(__dirname, '../templates/views')
const partialPath = path.join(__dirname, '../templates/partials')
const app = express()
app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialPath)
app.use(express.static(publicPath))
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Andrew Mead'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Andrew Mead'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'About Me',
        name: 'Andrew Mead',
        helpText: 'This is some helpful text.'
    })
})

app.get('/weather/forecast', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Provide address'
        })
    }
    getWeather(req.query.address).then((data) => {
        res.send({
            pressure: data.pressure,
            humidity: data.humidity,
            address: req.query.address
        })
    })
})

app.get('/weather', (req, res) => {
        res.render('weather', {
            title: 'About Me',
            name: 'Andrew Mead',
            // pressure: data.pressure,
            // humidity: data.humidity,
            // src: data.weather_icons[0]
        })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        errorMessage: 'Help article not found.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        errorMessage: 'Page not found.'
    })
})

app.listen(3000, () => {
    console.log(chalk.green('server is running at port ' + 3000 + '.'))
})