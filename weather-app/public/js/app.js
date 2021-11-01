(function() {
    document.getElementById('submit').onclick = () => {
        const text = document.getElementById('address').value
        fetch('http://localhost:3000/weather/forecast?address=' + text).then((res) => {
            res.json().then((data) => {
                document.getElementById('pressure').innerHTML = "Pressure: " + data.pressure
                document.getElementById('humidity').innerHTML = "Humidity: " + data.humidity
            })
        })
    }
 })();