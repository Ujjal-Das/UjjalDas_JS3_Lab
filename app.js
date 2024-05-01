document.getElementById('search-button').addEventListener('click', function () {
    const cityInput = document.getElementById('search-box');
    const cityName = cityInput.value;
    if (cityName) {
        fetchWeatherData(cityName);
    }
});

function fetchWeatherData(city) {
    document.querySelector('.weather-result').style.display = 'none';

    const geoUrl = `https://geocode.maps.co/search?q=${city}&api_key=66327be7c7715611299484qwu80d4f3`;
    fetch(geoUrl)
        .then(response => response.json())
        .then(locationData => {
            if (locationData.length > 0) {
                const { lat, lon } = locationData[0];
                const weatherUrl = `https://api.tomorrow.io/v4/timelines?location=${lat},${lon}&fields=temperature,windSpeed,windDirection,humidity,weatherCode&timesteps=current&apikey=e19CpQrHhuMbJ6Ei9DYbTXDocuPfBaaP`;
                return fetch(weatherUrl);
            } else {
                throw new Error('Invalid location');
            }
        })
        .then(response => response.json())
        .then(weatherData => {
            const currentWeather = weatherData.data.timelines[0].intervals[0].values;
            updateWeatherDisplay(city, currentWeather);
            document.querySelector('.weather-result').style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching the weather data: ', error);
            alert('Failed to fetch weather data. Please check the city name and try again.');
        });
}

function updateWeatherDisplay(city, weather) {
    const weatherDescriptions = {
        1000: 'Clear',
        1100: 'Mostly Clear',
        1101: 'Partly Cloudy',
        1102: 'Mostly Cloudy',
        1001: 'Cloudy',
        4000: 'Drizzle',
        4200: 'Light Rain',
        4001: 'Rain',
        4201: 'Heavy Rain'
    };

    document.getElementById('city-name').textContent = city;
    document.getElementById('temperature').textContent = `${weather.temperature}°C`;
    document.getElementById('humidity').textContent = `Humidity: ${weather.humidity}%`;
    document.getElementById('wind').textContent = `Wind: ${weather.windSpeed} km/h from ${weather.windDirection} degrees`;
    document.getElementById('weather-desc').textContent = `Weather: ${weatherDescriptions[weather.weatherCode] || weather.weatherCode}`;
    updateDateTime();

    const body = document.body;
    const weatherBackgrounds = {
        1000: 'image/clear_sky.jpg',
        1100: 'image/mostly_clear.jpg',
        1101: 'image/partly_cloudy.jpg',
        1102: 'image/mostly_cloudy.jpg',
        1001: 'image/cloudy.jpg',
        4000: 'image/drizzle.jpg',
        4200: 'image/light_rain.jpg',
        4001: 'image/rain.jpg',
        4201: 'image/heavy_rain.jpg'
    };
    const defaultBackground = 'images/default.jpg';
    body.style.backgroundImage = `url("${weatherBackgrounds[weather.weatherCode] || defaultBackground}")`;

}

function updateDateTime() {
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleString('en-US', { month: 'long' });
    const hour = now.getHours() % 12 || 12;
    const minute = now.getMinutes().toString().padStart(2, '0');
    const amPm = now.getHours() >= 12 ? 'PM' : 'AM';


    const ordinal = ((day % 10 === 1 && day !== 11) ? 'st' : (day % 10 === 2 && day !== 12) ? 'nd' : (day % 10 === 3 && day !== 13) ? 'rd' : 'th');

    const formattedDate = `${day}${ordinal} ${month} ${hour}:${minute} ${amPm}`;
    document.getElementById('date-time').textContent = formattedDate;
}