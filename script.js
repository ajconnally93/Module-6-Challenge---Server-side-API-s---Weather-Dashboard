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
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=afd214452d5095d525a44dde2fd98431&units=imperial";
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
    let cityName = $('#cityName').val();
    if (cityName) {
        getWeather(cityName);
        // clears search input
        $('#cityName').val("");
    } else {
        alert("Error. Please enter a city name.")
    }
};


// need to fix API link. Other console logs work properly.
// getWeather(Birmingham);

// need askBCS help to finish filling this in
let displayWeather = function(weatherData) {

    $("#main-city-name").text(weatherData.name + " (" + dayjs(weatherData.dt * 1000).format("MM/DD/YYYY") + ") ").append(`<img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png"></img>`);

    $("#main-city-temp").text("Temperature: " + weatherData.main.temp.toFixed(1) + " f");
    $("#main-city-humid").text("Humidity: " + weatherData.main.humidity + "%");
    $("#main-city-wind").text("Wind Speed: " + weatherData.wind.speed.toFixed(1) + " mph");

    fetch("https://api.openweathermap.org/data/2.5/uvi?lat=" + weatherData.coord.lat + "&lon="+ weatherData.coord.lon + "&appid=afd214452d5095d525a44dde2fd98431")
        .then(function(response) {
            response.json().then(function(data) {
                $("#uv-box").text(data.value);

                if(data.value >= 11) {
                    $("#uv-box").css("background-color", "purple")
                } else if (data.value < 11 && data.value >= 8) {
                    $("#uv-box").css("background-color", "red")
                } else if (data.value < 8 && data.value >= 6) {
                    $("#uv-box").css("background-color", "orange")
                } else if (data.value < 6 && data.value >= 3) {
                    $("#uv-box").css("background-color", "yellow")
                } else {
                    $("#uv-box").css("background-color", "green")
                }      
            })
        });

    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + weatherData.name + "&appid=afd214452d5095d525a44dde2fd98431&units=imperial")
        .then(function(response) {
            response.json().then(function(data) {
                // clears previous entires in five-day forecast
                $('#five-day').empty();
                // every 8th value is a new day
                for (i = 7; i <= data.list.length; i += 8) {
                    let fDayCard =`
                    <div class="col-md-2 m-2 py-3 card text-white bg-primary">
                        <div class="card-body p-1">
                            <h5 class="card-title">` + dayjs(data.list[i].dt * 1000).format("MM/DD/YYYY") + `</h5>
                            <img src="https://openweathermap.org/img/wn/` + data.list[i].weather[0].icon + `.png" alt="rain">
                            <p class="card-text">Temp: ` + data.list[i].main.temp + `</p>
                            <p class="card-text">Humidity: ` + data.list[i].main.humidity + `</p>
                        </div>
                    </div>
                    `;

                    $('#five-day').append(fDayCard);
                }
            })
    });

    lastCity = weatherData.name;
    saveSearchHistory(weatherData.name);
};

let saveSearchHistory = function (city) {
    // creates empty array and string if local storage is empty
    if (!history.includes(city)) {
        history.pushState(city);

        $('#search-history').append("<a href='#' class='list-group-item list-group-item-action' id='" + city + "'>" + city + "</a>");
    }

    localStorage.setItem('weatherSearchHistory', JSON.stringify(history));

    localStorage.setItem('lastCity', JSON.stringify(lastCity));

    loadSearchHistory();
};


let loadSearchHistory = function() {
    history = JSON.parse(localStorage.getItem('weatherSearchHistory'));
    lastCity = JSON.parse(localStorage.getItem('lastCity'));
    // creates empty array and string if nothing is in local storage
    if (!history) {
        history = []
    } if (!lastCity) {
        lastCity = ""
    }

    $('#search-history').empty();

    for (i=0; i < history.length; i++) {
        $("#search-history").append("<a href='#' class='list-group-item list-group-item-action' id='" + history[i] + "'>" + history[i] + "</a>");
    }
};

loadSearchHistory();

if (lastCity != "") {
    getWeather(lastCity);
}

$('#search-form').submit(submitHandler);

$('#search-history').on('click', function(event) {
    let previousCity = $(event.target).closest("a").attr("id");
    getWeather(previousCity);
});