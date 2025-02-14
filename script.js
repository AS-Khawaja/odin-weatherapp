async function getWeather(city) {
    const apiKey = 'JK2Z84RJMK29DQTFBURHJ5ZPW'; // Replace with your actual API key
    const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}`;
    try {
        const response = await fetch(apiUrl, { mode: 'cors' });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const weatherData = await response.json();

        // Process the weather data
        const processedData = {
            city: weatherData.resolvedAddress,
            currentTemp: weatherData.currentConditions.temp,
            condition: weatherData.currentConditions.conditions,
            forecast: weatherData.days.slice(1, 4).map(day => ({
                date: day.datetime,
                temp: day.temp,
                conditions: day.conditions,
                icon: day.icon
            }))
        };

        return processedData; // Return the processed weather data
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null; // Return null in case of an error
    }
}

function getDayName(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
}

// Helper function to convert weather icon to emoji
function getWeatherIcon(icon) {
    const icons = {
        'clear-day': '☀️',
        'clear-night': '🌙',
        'rain': '🌧️',
        'snow': '❄️',
        'sleet': '🌨️',
        'wind': '🌪️',
        'fog': '🌫️',
        'cloudy': '☁️',
        'partly-cloudy-day': '⛅',
        'partly-cloudy-night': '☁️'
    };
    return icons[icon] || '🌡️';
}
  


function getWeatherClass(condition) {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('clear')) return 'weather-clear';
    if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) return 'weather-rain';
    if (lowerCondition.includes('snow')) return 'weather-snow';
    if (lowerCondition.includes('cloud')) return 'weather-clouds';
    if (lowerCondition.includes('thunder') || lowerCondition.includes('storm')) return 'weather-storm';
    if (lowerCondition.includes('mist') || lowerCondition.includes('fog')) return 'weather-mist';
    return '';
}



function updateWeatherUI(data) {
    document.querySelector('.weather-info h2').textContent = data.city;
    document.querySelector('.temprature').textContent = `${Math.round(data.currentTemp)}°C`;
    document.querySelector('.condition').textContent = data.condition;

    const forecastItems = document.querySelectorAll('.forecast-item');
    data.forecast.forEach((day, index) => {
        const forecastItem = forecastItems[index];
        if (forecastItem) {
            forecastItem.querySelector('h3').textContent = getDayName(day.date);
            forecastItem.querySelectorAll('p')[0].textContent = `${Math.round(day.temp)}°C`;
            forecastItem.querySelectorAll('p')[1].textContent = getWeatherIcon(day.icon);
        }
    });

    const weatherClass = getWeatherClass(data.condition);
    document.body.className = weatherClass;
}

// Rest of your existing helper functions and event listener...
document.getElementById('searchbtn').addEventListener('click', () => {
    const CityInput = document.getElementById('city');
    const CityName = CityInput.value.trim();
    
    if (CityName) {
        getWeather(CityName).then(data => {
            if (data) {
                updateWeatherUI(data);
            }
        });
        CityInput.value = '';
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const data = await getWeather('Lahore');
        if (data) {
            updateWeatherUI(data);
        }
    } catch (error) {
        console.error('Initial load error:', error);
    }
});