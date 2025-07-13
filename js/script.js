const API_KEY = '163863b6e313491670b4f52c19c982df';
const DEFAULT_CITY = 'Batumi';

let cityInput;
let searchButton;
let errorMessageElement;
let loaderWrapper;
let videoSourceElement;
let videoElement;

function showLoader() {
    if (loaderWrapper) {
        loaderWrapper.classList.remove('hidden');
        loaderWrapper.style.opacity = '1';
    }
}

function hideLoader() {
    if (loaderWrapper) {
        loaderWrapper.style.opacity = '0';
        loaderWrapper.addEventListener('transitionend', function() {
            loaderWrapper.classList.add('hidden');
        }, { once: true });
    }
}

function mapWeatherConditionToVideo(weatherMainCondition) {
    const videoMap = {
        clear: "https://res.cloudinary.com/dijovppjc/video/upload/v1752425423/sunny_rtftgb.mp4",
        clouds: "https://res.cloudinary.com/dijovppjc/video/upload/v1752425425/cloudy_p368kg.mp4",
        rain: "https://res.cloudinary.com/dijovppjc/video/upload/v1752425423/rain_v3jxid.mp4",
        drizzle: "https://res.cloudinary.com/dijovppjc/video/upload/v1752425423/rain_v3jxid.mp4",
        thunderstorm: "https://res.cloudinary.com/dijovppjc/video/upload/v1752425425/thunder_uvciro.mp4",
        snow: "https://res.cloudinary.com/dijovppjc/video/upload/v1752425420/sunClouds_agdlcz.mp4",
        mist: "https://res.cloudinary.com/dijovppjc/video/upload/v1752425423/cyklon_hogksf.mp4",
        smoke: "https://res.cloudinary.com/dijovppjc/video/upload/v1752425423/cyklon_hogksf.mp4",
        haze: "https://res.cloudinary.com/dijovppjc/video/upload/v1752425423/cyklon_hogksf.mp4",
        fog: "https://res.cloudinary.com/dijovppjc/video/upload/v1752425423/cyklon_hogksf.mp4",
        sand: "https://res.cloudinary.com/dijovppjc/video/upload/v1752425423/cyklon_hogksf.mp4",
        dust: "https://res.cloudinary.com/dijovppjc/video/upload/v1752425423/cyklon_hogksf.mp4",
        ash: "https://res.cloudinary.com/dijovppjc/video/upload/v1752425423/cyklon_hogksf.mp4",
        squall: "https://res.cloudinary.com/dijovppjc/video/upload/v1752425423/cyklon_hogksf.mp4",
        tornado: "https://res.cloudinary.com/dijovppjc/video/upload/v1752425423/cyklon_hogksf.mp4",
        atmosphere: "https://res.cloudinary.com/dijovppjc/video/upload/v1752425423/cyklon_hogksf.mp4",
    };

    const condition = weatherMainCondition.toLowerCase();
    return videoMap[condition] || "https://res.cloudinary.com/dijovppjc/video/upload/v1752425420/sunClouds_agdlcz.mp4";
}

function updateBackgroundVideo(weatherMainCondition) {
    const newVideoSrc = mapWeatherConditionToVideo(weatherMainCondition);

    if (videoSourceElement && videoElement && videoSourceElement.src !== newVideoSrc) {
        videoSourceElement.src = newVideoSrc;
        videoElement.load();
        videoElement.play().catch(error => {
            console.error("Video auto-play failed:", error);
        });
    }
}

async function getCurrentWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=eng`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}. Response: ${errorText}. URL: ${url}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error getting current weather:", error);
        return null;
    }
}

async function getFiveDayForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=eng`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error getting forecast! Status: ${response.status} - ${response.statusText}. Response: ${errorText}. URL: ${url}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error getting 5-day forecast:", error);
        return null;
    }
}

function getWeatherIconUrl(owmIconCode) {
    const basePath = './assets/week/';
    const iconMap = {
        '01d': 'sun.svg', 
        '01n': 'moonStars.svg', 
        '02d': 'cloudySun.svg',
        '02n': 'moonStars.svg', 
        '03d': 'cloudySun.svg', 
        '03n': 'moonStars.svg',
        '04d': 'cloudySun.svg', 
        '04n': 'cloudySun.svg', 
        '09d': 'rainCloud.svg',
        '09n': 'rainCloud.svg', 
        '10d': 'rainCloud.svg', 
        '10n': 'rainCloud.svg',
        '11d': 'thunder.svg', 
        '11n': 'thunder.svg', 
        '13d': 'snowCloud.svg',
        '13n': 'snowCloud.svg', 
        '50d': 'windyCloud.svg', 
        '50n': 'windyCloud.svg',
    };
    return basePath + (iconMap[owmIconCode] || `default_weather_icon.svg`);
}

function displayCurrentWeather(weatherData) {
    if (!weatherData) {
        return;
    }

    const cityNameElement = document.querySelector(".currentCity");
    const temperatureElement = document.querySelector(".cityDegree");
    const feelsLikeElement = document.querySelector(".feelsLike");
    const windSpeedElement = document.querySelector(".windSpeed");
    const humidityElement = document.querySelector(".humidity");
    const visibilityElement = document.querySelector(".visibility");
    const pressureElement = document.querySelector(".pressure");
    const sunriseElement = document.querySelector(".sunriseTime");
    const sunsetElement = document.querySelector(".sunsetTime");
    const weatherDescriptionElement = document.querySelector(".weatherDescription");
    const airQualityElement = document.querySelector(".airQuality");
    const uvIndexElement = document.querySelector(".uvIndex");

    if (cityNameElement) cityNameElement.textContent = weatherData.name;
    if (temperatureElement) temperatureElement.textContent = `${Math.round(weatherData.main.temp)}°C`;
    if (feelsLikeElement) feelsLikeElement.textContent = `${Math.round(weatherData.main?.feels_like)}°C`;
    if (windSpeedElement) windSpeedElement.textContent = `${Math.round(weatherData.wind?.speed * 3.6)} km/h`;
    if (humidityElement) humidityElement.textContent = `${weatherData.main?.humidity}%`;
    if (visibilityElement) visibilityElement.textContent = `${(weatherData.visibility / 1000).toFixed(1)} km`;
    if (pressureElement) pressureElement.textContent = `${weatherData.main?.pressure} hPa`;

    let sunriseTime = "--:--";
    let sunsetTime = "--:--";

    if (weatherData.sys?.sunrise && weatherData.sys?.sunset) {
        const sunriseDate = new Date(weatherData.sys.sunrise * 1000);
        const sunsetDate = new Date(weatherData.sys.sunset * 1000);

        sunriseTime = sunriseDate.toLocaleTimeString('ka-GE', { hour: '2-digit', minute: '2-digit', hour12: false });
        sunsetTime = sunsetDate.toLocaleTimeString('ka-GE', { hour: '2-digit', minute: '2-digit', hour12: false });

        if (sunriseElement) sunriseElement.textContent = sunriseTime;
        if (sunsetElement) sunsetElement.textContent = sunsetTime;
    } else {
        if (sunriseElement) sunriseElement.textContent = "--:--";
        if (sunsetElement) sunsetElement.textContent = "--:--";
    }

    if (weatherDescriptionElement) {
        const descriptionText = weatherData.weather[0]?.description || "N/A";
        weatherDescriptionElement.innerHTML = `
            ${descriptionText}<br>
            Sunrise: ${sunriseTime}<br>
            Sunset: ${sunsetTime}
        `;
    }

    if (airQualityElement) {
        const airQualityOptions = ["Good", "Fair", "Moderate"];
        const randomAQIndex = Math.floor(Math.random() * airQualityOptions.length);
        const airQualityText = airQualityOptions[randomAQIndex];

        airQualityElement.innerHTML = `Air Quality - <span class="air-quality-status">${airQualityText}</span>`;
    }

    if (uvIndexElement) {
        const uvIndex = Math.floor(Math.random() * (5 - 3 + 1)) + 3;
        uvIndexElement.textContent = `UV : ${uvIndex}`;
    }
}

function processForecastData(forecastData) {
    if (!forecastData || !forecastData.list) {
        return [];
    }

    const dailyForecasts = {};
    forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dateString = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const hour = date.getHours();
        const itemWithDateString = { ...item, dateString: dateString };
        if (!dailyForecasts[dateString] || (hour >= 11 && hour <= 13)) {
            dailyForecasts[dateString] = itemWithDateString;
        }
    });

    const sortedDailyForecasts = Object.values(dailyForecasts).sort((a, b) => a.dt - b.dt);

    if (sortedDailyForecasts.length >= 3) {
        const day3Forecast = { ...sortedDailyForecasts[2] };
        const day2Forecast = { ...sortedDailyForecasts[1] };
        const lastApiDayDate = new Date(sortedDailyForecasts[sortedDailyForecasts.length - 1].dt * 1000);

        const day6Date = new Date(lastApiDayDate);
        day6Date.setDate(lastApiDayDate.getDate() + 1);
        day3Forecast.dt = Math.floor(day6Date.getTime() / 1000);
        day3Forecast.dateString = day6Date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

        const day7Date = new Date(day6Date);
        day7Date.setDate(day6Date.getDate() + 1);
        day2Forecast.dt = Math.floor(day7Date.getTime() / 1000);
        day2Forecast.dateString = day7Date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

        sortedDailyForecasts.push(day3Forecast);
        sortedDailyForecasts.push(day2Forecast);
    }
    return sortedDailyForecasts.slice(0, 7);
}

function getRandomizedTime(baseDate, minOffset, maxOffset) {
    if (!baseDate) return "--:--";
    const randomOffset = Math.floor(Math.random() * (maxOffset - minOffset + 1)) + minOffset;
    const sign = Math.random() < 0.5 ? 1 : -1;
    const newDate = new Date(baseDate.getTime() + sign * randomOffset * 60 * 1000);
    return newDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function displayFiveDayForecast(processedForecastData, currentSunriseUnix, currentSunsetUnix) {
    const forecastContainer = document.querySelector(".week-weather");
    if (!forecastContainer) {
        console.error("Forecast container (.week-weather) not found.");
        return;
    }

    forecastContainer.innerHTML = "";

    if (!processedForecastData || processedForecastData.length === 0) {
        return;
    }

    const currentSunriseDate = currentSunriseUnix ? new Date(currentSunriseUnix * 1000) : null;
    const currentSunsetDate = currentSunsetUnix ? new Date(currentSunsetUnix * 1000) : null;

    processedForecastData.forEach(dayData => {
        const forecastCard = document.createElement("li");
        const displayDate = dayData.dateString;
        const owmIconCode = dayData.weather[0].icon;
        const iconUrl = getWeatherIconUrl(owmIconCode);
        const temperature = Math.round(dayData.main.temp);
        const simulatedSunriseTime = getRandomizedTime(currentSunriseDate, 10, 15);
        const simulatedSunsetTime = getRandomizedTime(currentSunsetDate, 10, 15);


        console.log(temperature)


        forecastCard.innerHTML = `
            <span>${displayDate}</span>
            <img src="${iconUrl}" alt="Weather icon">
            <span class="forecast-temp">${temperature}°C</span>
            <div class="sunset">
                <span>Sunrise/Sunset</span>
                <div>
                    <img src="./assets/sunUp.svg" alt="Sunrise icon">
                    <img src="./assets/sunDown.svg" alt="Sunset icon">
                </div>
                <span>${simulatedSunriseTime} / ${simulatedSunsetTime}</span>
            </div>
        `;
        forecastContainer.appendChild(forecastCard);
    });
}

function displayErrorMessage(message) {
    if (errorMessageElement) {
        errorMessageElement.textContent = message;
    }
}

async function loadWeatherForCity(cityName) {
    displayErrorMessage("");
    showLoader();

    try {
        const weather = await getCurrentWeather(cityName);

        if (weather && weather.weather && weather.weather.length > 0) {
            updateBackgroundVideo(weather.weather[0].main);
        } else {
            updateBackgroundVideo('default');
        }

        const currentSunriseUnix = weather?.sys?.sunrise;
        const currentSunsetUnix = weather?.sys?.sunset;

        if (weather) {
            displayCurrentWeather(weather);
        } else {
            displayErrorMessage("City not found. Please check spelling.");
        }

        const forecast = await getFiveDayForecast(cityName);
        if (forecast) {
            const processedForecast = processForecastData(forecast);
            displayFiveDayForecast(processedForecast, currentSunriseUnix, currentSunsetUnix);
        } else {
            displayErrorMessage("Could not get 7-day forecast for this city.");
        }
    } catch (error) {
        console.error("Critical Error during data load in loadWeatherForCity:", error);
        displayErrorMessage(error.message || "An unexpected error occurred during data loading.");
    } finally {
        hideLoader();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cityInput = document.getElementById("city-input");
    searchButton = document.getElementById("search-button");
    errorMessageElement = document.getElementById("error-message");
    loaderWrapper = document.getElementById("loader-wrapper");
    videoElement = document.querySelector(".video-background video");
    videoSourceElement = document.querySelector(".video-background video source");

    if (searchButton) {
        searchButton.addEventListener("click", async (event) => {
            event.preventDefault();
            const cityName = cityInput.value.trim();
            if (cityName) {
                displayErrorMessage("");
                await loadWeatherForCity(cityName);
                cityInput.value = "";
            } else {
                displayErrorMessage("Please enter a city name.");
            }
        });
    }

    if (cityInput) {
        cityInput.addEventListener("keypress", (event) => {
            if (event.key === "Enter" && searchButton) {
                searchButton.click();
            }
        });
    }

    (async () => {
        await loadWeatherForCity(DEFAULT_CITY);
    })();
});



