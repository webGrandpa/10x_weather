export function getDOMElements() {
    return {
        cityInput: document.getElementById("city-input"),
        searchButton: document.getElementById("search-button"),
        errorMessageElement: document.getElementById("error-message"),
        loaderWrapper: document.getElementById("loader-wrapper"),
        videoElement: document.querySelector(".video-background video"),
        videoSourceElement: document.querySelector(".video-background video source"),

        // Current Weather elements
        cityNameElement: document.querySelector(".currentCity"),
        temperatureElement: document.querySelector(".cityDegree"),
        feelsLikeElement: document.querySelector(".feelsLike"),
        windSpeedElement: document.querySelector(".windSpeed"),
        humidityElement: document.querySelector(".humidity"),
        visibilityElement: document.querySelector(".visibility"),
        pressureElement: document.querySelector(".pressure"),
        sunriseElement: document.querySelector(".sunriseTime"),
        sunsetElement: document.querySelector(".sunsetTime"),
        weatherDescriptionElement: document.querySelector(".weatherDescription"),
        airQualityElement: document.querySelector(".airQuality"),
        uvIndexElement: document.querySelector(".uvIndex"),

        // Forecast container
        forecastContainer: document.querySelector(".week-weather")
    };
}