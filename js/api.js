import { API_KEY } from './config.js';

export async function getCurrentWeather(city) {
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

export async function getFiveDayForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=eng`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error getting forecast! Status: ${response.status} - ${response.statusText}. Response: ${errorText}. URL: ${url}`);
        }
        const data = await response.json();
        console.log(data)
        return data;
    } catch (error) {
        console.error("Error getting 5-day forecast:", error);
        return null;
    }
}