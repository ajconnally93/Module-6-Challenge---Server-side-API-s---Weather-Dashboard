// empty array and string to be filled in later
let history = [];
let lastCity = "";
const apiKey = "afd214452d5095d525a44dde2fd98431";

// base URL
// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

// always test if moment & jquery are properly linked with console logs
// console.log(moment().format('dddd'));
// console.log($());

let getWeather = function(city) {
    // Need to fix apiUrl
    let apiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}"
    // Need to fix API link
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    displayWeather(data);
                });
            } else {
                alert("ERROR: " + response.statusText);
            }
        console.log(apiUrl);
        console.log("test test test");
    })

    // console.log(apiUrl);

    .catch(function(error) {
        alert("Unable to connect to OpenWeatherMap API");
    })
};

let submitHandler = function(event) {
    event.preventDefault();
    let cityName = $('#cityname').val();
    if (cityName) {
        getWeather(cityName);
        // clears search input
        $('#cityname').val("");
    } else {
        alert("Error. Please enter a city name.")
    }
};


// need to fix API link. Other console logs work properly.
// getWeather();