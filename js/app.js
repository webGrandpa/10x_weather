
import { DEFAULT_CITY } from './config.js';
import { getDOMElements } from './domElements.js';
import { showLoader, hideLoader, displayErrorMessage, initUIElements } from './ui.js';
import { getCurrentWeather, getFiveDayForecast } from './api.js';
import { processForecastData } from './dataUtils.js';
import { displayCurrentWeather, displayFiveDayForecast, updateBackgroundVideo, initRenderersElements } from './renderers.js';

// Global variable rof DOM elements
let appDOMElements = {};

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
            displayErrorMessage("Could not get 5-day forecast for this city.");
        }
    } catch (error) {
        console.error("Critical Error during data load in loadWeatherForCity:", error);
        displayErrorMessage(error.message || "An unexpected error occurred during data loading.");
    } finally {
        hideLoader();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize DOM elements for all modules
    appDOMElements = getDOMElements();
    initUIElements();
    initRenderersElements();

    const { cityInput, searchButton } = appDOMElements;

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

    //weather data for the default city
    (async () => {
        await loadWeatherForCity(DEFAULT_CITY);
    })();
});