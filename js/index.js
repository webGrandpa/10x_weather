

const apiKey = '163863b6e313491670b4f52c19c982df';
const defaultCity = 'Batumi';

let inputCity;
let btnSearch;
let errorBox;
let loadingDiv;
let videoTag;
let videoSrc;

function showLoading() {
    if (loadingDiv) {
        loadingDiv.classList.remove("hidden");
        loadingDiv.style.opacity = "1";
    }
}

function hideLoading() {
    if (loadingDiv) {
        loadingDiv.style.opacity = "0";
        loadingDiv.addEventListener("transitionend", function () {
            loadingDiv.classList.add("hidden");
        }, { once: true });
    }
}

function chooseVideoByWeather(conditionText) {
    let fileName = "sunClouds.mp4";
    let cond = conditionText.toLowerCase();

    if (cond === "clear") {
        fileName = "sunny.mp4";
    } else if (cond === "clouds") {
        fileName = "cloudy.mp4";
    } else if (cond === "rain" || cond === "drizzle") {
        fileName = "rain.mp4";
    } else if (cond === "thunderstorm") {
        fileName = "thunder.mp4";
    } else if (cond === "snow") {
        fileName = "snowfall.mp4";
    } else if (
        cond === "mist" || cond === "smoke" || cond === "haze" ||
        cond === "fog" || cond === "sand" || cond === "dust" ||
        cond === "ash" || cond === "squall" || cond === "tornado" || cond === "atmosphere"
    ) {
        fileName = "cloudy.mp4";
    } else {
        console.log("Unknown weather: " + conditionText);
    }

    return "./assets/bg/" + fileName;
}

function changeVideoBackground(weatherCondition) {
    const videoPath = chooseVideoByWeather(weatherCondition);
    if (videoSrc && videoTag && videoSrc.src !== videoPath) {
        videoSrc.src = videoPath;
        videoTag.load();
        videoTag.play().catch(function (err) {
            console.log("Video play failed", err);
        });
    }
}

function getWeatherData(cityName) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric&lang=eng`;

    return fetch(apiUrl)
        .then(function (response) {
            if (!response.ok) {
                return response.text().then(function (text) {
                    throw new Error("API Error: " + text);
                });
            }
            return response.json();
        })
        .catch(function (error) {
            console.log("Fetch error:", error);
            return null;
        });
}

function getIconPath(code) {
    const base = "./assets/week/";
    const iconList = {
        "01d": "sun.svg",
        "01n": "moonStars.svg",
        "02d": "cloudySun.svg",
        "02n": "moonStars.svg",
        "03d": "cloudySun.svg",
        "03n": "moonStars.svg",
        "04d": "cloudySun.svg",
        "04n": "cloudySun.svg",
        "09d": "rainCloud.svg",
        "09n": "rainCloud.svg",
        "10d": "rainCloud.svg",
        "10n": "rainCloud.svg",
        "11d": "thunder.svg",
        "11n": "thunder.svg",
        "13d": "snowCloud.svg",
        "13n": "snowCloud.svg",
        "50d": "windyCloud.svg",
        "50n": "windyCloud.svg"
    };
    if (iconList[code]) {
        return base + iconList[code];
    } else {
        return base + "default_weather_icon.svg";
    }
}

function showWeatherInfo(data) {
    if (!data) return;

    const nameEl = document.querySelector(".currentCity");
    const tempEl = document.querySelector(".cityDegree");
    const feelsEl = document.querySelector(".feelsLike");
    const windEl = document.querySelector(".windSpeed");
    const humEl = document.querySelector(".humidity");
    const visEl = document.querySelector(".visibility");
    const pressEl = document.querySelector(".pressure");
    const riseEl = document.querySelector(".sunriseTime");
    const setEl = document.querySelector(".sunsetTime");
    const descEl = document.querySelector(".weatherDescription");
    const airQEl = document.querySelector(".airQuality");
    const uvEl = document.querySelector(".uvIndex");

    if (nameEl) nameEl.textContent = data.name;
    if (tempEl) tempEl.textContent = Math.round(data.main.temp) + "°C";
    if (feelsEl) feelsEl.textContent = Math.round(data.main.feels_like) + "°C";
    if (windEl) windEl.textContent = Math.round(data.wind.speed * 3.6) + " km/h";
    if (humEl) humEl.textContent = data.main.humidity + "%";
    if (visEl) visEl.textContent = (data.visibility / 1000).toFixed(1) + " km";
    if (pressEl) pressEl.textContent = data.main.pressure + " hPa";

    let riseTime = "--:--";
    let setTime = "--:--";

    if (data.sys.sunrise && data.sys.sunset) {
        const rise = new Date(data.sys.sunrise * 1000);
        const set = new Date(data.sys.sunset * 1000);
        riseTime = rise.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
        setTime = set.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
    }

    if (riseEl) riseEl.textContent = riseTime;
    if (setEl) setEl.textContent = setTime;

    if (descEl) {
        const descText = data.weather[0]?.description || "No info";
        descEl.innerHTML = `${descText}<br>Sunrise: ${riseTime}<br>Sunset: ${setTime}`;
    }

    if (airQEl) {
        const airOptions = ["Good", "Fair", "Moderate"];
        const randomIndex = Math.floor(Math.random() * airOptions.length);
        airQEl.innerHTML = "Air Quality - <span class='air-quality-status'>" + airOptions[randomIndex] + "</span>";
    }

    if (uvEl) {
        const uvIndex = Math.floor(Math.random() * 3) + 3;
        uvEl.textContent = "UV : " + uvIndex;
    }
}

function showErrorMessage(text) {
    if (errorBox) {
        errorBox.textContent = text;
    }
}

function loadCityWeather(city) {
    showErrorMessage("");
    showLoading();

    getWeatherData(city).then(function (weather) {
        if (weather && weather.weather && weather.weather.length > 0) {
            changeVideoBackground(weather.weather[0].main);
        } else {
            changeVideoBackground("default");
        }

        if (weather) {
            showWeatherInfo(weather);
        } else {
            showErrorMessage("City not found. Check spelling.");
        }
    }).catch(function (error) {
        console.log("Big error", error);
        showErrorMessage("Something went wrong.");
    }).finally(function () {
        hideLoading();
    });
}

document.addEventListener("DOMContentLoaded", function () {
    inputCity = document.getElementById("city-input");
    btnSearch = document.getElementById("search-button");
    errorBox = document.getElementById("error-message");
    loadingDiv = document.getElementById("loader-wrapper");
    videoTag = document.querySelector(".video-background video");
    videoSrc = document.querySelector(".video-background video source");

    if (btnSearch) {
        btnSearch.addEventListener("click", function (event) {
            event.preventDefault();
            const cityText = inputCity.value.trim();
            if (cityText !== "") {
                showErrorMessage("");
                loadCityWeather(cityText);
                inputCity.value = "";
            } else {
                showErrorMessage("Please enter a city name.");
            }
        });
    }

    if (inputCity) {
        inputCity.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                btnSearch.click();
            }
        });
    }

    loadCityWeather(defaultCity);
});

