const { query } = require('express')
const request = require('request')

const getForeCastWithLocation = (query) => {  
    const url = 'http://api.weatherstack.com/current?access_key=5453be41220b624ca6712036303c76eb&query=' + query + '&unit=m'
    return new Promise((resolve, reject) => {
        request({ url, json: true }, (error, response) => {
            resolve(response.body.current)
        })
    })
}


// Geocoding
// Address -> Lat/Long -> Weather

const getLocation = (address) => {
    const geocodeURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + address + '.json?access_token=pk.eyJ1IjoiZHVzaHlhbnRlYzcxIiwiYSI6ImNrdjl1cWMzMDBibnQycG56cXB1dGlibWwifQ.xh5s55gqn2o3y4lUqxliLw&limit=1'
    return new Promise((resolve, reject) => {
        request({ url: geocodeURL, json: true }, (error, response) => {
            const latitude = response.body.features[0].center[0]
            const longitude = response.body.features[0].center[1]
                resolve({latitude, longitude})
            })
    })
}

const getWeather = (address) => {
    return new Promise((resolve, reject) => {
        getLocation(address).then(({latitude, longitude}) => {
            const query = `${longitude},${latitude}`
            getForeCastWithLocation(query).then((response) => {
                resolve(response)
            })
        })
    })
}

module.exports = {
    getWeather
}