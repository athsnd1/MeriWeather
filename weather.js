
//TODO add carousel effect in hourly section


const locationPin = document.querySelector("#location-pin");
const locationText = document.querySelector("#location-text");

const dateArea = document.getElementById("date-area");

//degrees:
const degreesArea = document.getElementById("degrees");

//weather report area:
const weatherIcon =document.getElementById("weather-icon");
const description = document.getElementById("description");

//metrics area:
const precipIcon = document.getElementById("precip-icon");
const precipPercent = document.getElementById("precip-percent");

const humidityIcon = document.getElementById("humidity-icon");
const humidityPercent = document.getElementById("humidity-percent");

const speedIcon = document.getElementById("speed-icon");
const speedPercent = document.getElementById("speed-percent");

const sevenLink = document.getElementById("7-day-link");
const arrow = document.getElementById("arrow");

//Hourly metrics:
const hourlyForecasts = document.getElementById("hourly-forecasts-area");
const thisHour = document.getElementById("hour");
const hourIcon = document.getElementById("icon");
const hourDeg = document.getElementById("deg");


const now = new Date();
const year = now.getFullYear();

const coordinates = JSON.parse(localStorage.getItem("coordinates"));

function updateClock() {
    const now = new Date();

    let hours = String(now.getHours()).padStart(2, "0");
    let minutes = String(now.getMinutes()).padStart(2, "0");
    let seconds = String(now.getSeconds()).padStart(2, "0");

    dateArea.textContent = `${day}, ${date} ${monthName} ${year} | ${hours}:${minutes}:${seconds} WAT`;
}

setInterval(updateClock, 1000);


//Getting date:
let dateNum = now.getDate();
let date;

if(String(dateNum).endsWith("1")){
    date = dateNum + "st";
}else if(String(dateNum).endsWith("2")){
    date = dateNum + "nd";
}else if(String(dateNum).endsWith("3")){
    date = dateNum + "rd";
}else{
    date = dateNum + "th";
}

//Getting month:
const monthIndex = now.getMonth();

let monthName;

switch (monthIndex) {
    case 0:
        monthName = "January";
        break;
    case 1:
        monthName = "February";
        break;
    case 2:
        monthName = "March";
        break;
    case 3:
        monthName = "April";
        break;
    case 4:
        monthName = "May";
        break;
    case 5:
        monthName = "June";
        break;
    case 6:
        monthName = "July";
        break;
    case 7:
        monthName = "August";
        break;
    case 8:
        monthName = "September";
        break;
    case 9:
        monthName = "October";
        break;
    case 10:
        monthName = "November";
        break;
    case 11:
        monthName = "December";
        break;
}

//Getting day:
let dayNum = now.getDay();
let day;

switch(dayNum){
    case 0:
        day = "Sunday";
        break;
    case 1:
        day = "Monday";
        break; 
    case 2:
        day = "Tuesday";
        break;
    case 3:
        day = "Wednesday";
        break;
    case 4:
        day = "Thursday";
        break;
    case 5:
        day = "Friday";
        break;
    case 6:
        day = "Saturday";
        break;
    default:
        day = "Today";
        break;
}

async function getWeather(latitude, longitude){
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m`;

    try{
        const response = await fetch(url);
        
        if(!response.ok){
            throw new Error();
        }

        const weatherData = await response.json();
        console.log(weatherData);
        return weatherData;
    }catch(error){
        console.log(error);
    }
}

async function getHourlyWeather(latitude,longitude){
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m`
    
    try{
        const response = await fetch(url);
        if(!response.ok){
            throw new Error();
        }

        const hourlyWeather = await response.json();
        //const hourlyWeather = await getHourlyWeather(coordinates.latitude, coordinates.longitude);
        console.log(hourlyWeather);
        if (hourlyWeather) {

            const now = new Date();
            let currentHour = now.getHours();
            const hours = [];

            for (let i = 0; i < 5; i++) {

                let index = currentHour + i;
                const timeString = hourlyWeather.hourly.time[index];

                const date = new Date(timeString);

                const hour = String(date.getHours()) + ":00";
                hours.push(hour);

                const hourCard = document.createElement("div");
                hourCard.classList.add("hourly-forecast");

                const hourOnCard = document.createElement("span");
                hourOnCard.classList.add("hour");
                hourOnCard.textContent = hours[i];

                const iconOnCard = document.createElement("span");
                iconOnCard.classList.add("icon");
                iconOnCard.innerHTML = `<i class="fa-solid fa-cloud"></i>`;

                const degOnCard = document.createElement("span");
                degOnCard.classList.add("deg");

                let temp = hourlyWeather.hourly.temperature_2m[index];
                if(temp <= 10){
                    hourCard.style.backgroundColor = "blue";
                    iconOnCard.innerHTML = `<i class="fa-solid fa-temperature-low"></i>`;
                    iconOnCard.style.color = "white";
                }else if(temp > 10 && temp < 20){
                    hourCard.style.backgroundColor = "rgb(32,32,252)";
                    iconOnCard.innerHTML = `<i class="fa-solid fa-temperature-empty"></i>`;
                    iconOnCard.style.color = "white";
                }else if(temp >= 20){
                    hourCard.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
                    degOnCard.style.color = "rgb(32,32,252)";
                    hourOnCard.style.color = "rgb(32,32,252)";
                    iconOnCard.innerHTML = `<i class="fa-solid fa-temperature-high"></i>`;
                }
                degOnCard.textContent = `${temp}ºC`;

                hourCard.appendChild(hourOnCard);
                hourCard.appendChild(iconOnCard);
                hourCard.appendChild(degOnCard);

                hourlyForecasts.appendChild(hourCard);
            }

        }

    }catch(error){
        console.error(error);
    }


}

document.addEventListener("DOMContentLoaded", async () => {

    if (window.location.pathname.includes("weather.html")) {

        const savedCity = localStorage.getItem("city");
        console.log(savedCity);

        if (savedCity) {
            locationText.textContent = savedCity;
        }

        locationPin.classList.add("jump");
        updateClock();
    }
    
    const weatherObject = await getWeather(coordinates.latitude, coordinates.longitude);
    if(weatherObject){
        console.log(weatherObject.current);
        let currentTemp = weatherObject.current.temperature_2m;
        degreesArea.textContent = currentTemp + weatherObject.current_units.temperature_2m;

        if(currentTemp <= 0){
            description.textContent = "Freezing";
            weatherIcon.innerHTML = `<i class="fa-regular fa-snowflake"></i>`;
        }else if(currentTemp > 0 && currentTemp <= 10){
            description.textContent = "Cold";
            weatherIcon.innerHTML = `<i class="fa-regular fa-snowflake"></i>`;
        }else if(currentTemp > 10 && currentTemp <= 20){
            description.textContent = "Cool";
            weatherIcon.innerHTML = `<i class="fa-solid fa-temperature-empty"></i>`;
        }else if(currentTemp > 21 && currentTemp <= 28){
            description.textContent = "Hot";
            weatherIcon.innerHTML = `<i class="fa-solid fa-temperature-arrow-up"></i>`;
        }else if(currentTemp > 28 && currentTemp <= 35){
            description.textContent = "Very Hot";
            weatherIcon.innerHTML = `<i class="fa-solid fa-temperature-high"></i>`;
        }else if(currentTemp > 35){
            description.textContent = "Extreme Heat";
            weatherIcon.innerHTML = `<i class="fa-solid fa-fire"></i>`;
        }
        

        precipPercent.textContent = weatherObject.current.precipitation + "%";
        humidityPercent.textContent = weatherObject.current.relative_humidity_2m + "%";
        speedPercent.textContent =weatherObject.current.wind_speed_10m + "%";
    }

    const intervalId = getHourlyWeather(coordinates.latitude, coordinates.longitude);
    setInterval(intervalId, 3600000);

})


sevenLink.addEventListener("mouseover", e => {
    arrow.classList.add("span-move");

    setTimeout(() => {
        arrow.classList.remove("span-move");
    }, 4000);
})

sevenLink.addEventListener("mouseout", e => {
    arrow.classList.remove("span-move");
})