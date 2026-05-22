const cityInput = document.getElementById("city-input");
const getBtn = document.getElementById("get-data-btn");
const errorArea = document.querySelector(".error-notification");

async function getCordinates(city){
    try {
        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
        );

        const data = await response.json();

        const result = data.results?.[0];

        if (!result) {
            throw new Error("City not found");
        }

        return {
            latitude: result.latitude,
            longitude: result.longitude
        };

    } catch (error) {
        console.log(error);
    }
}


getBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const city = cityInput.value.trim().toLowerCase();

    try{
        localStorage.setItem("city", city);

        const coordinates = await getCordinates(city);

        localStorage.setItem("coordinates", JSON.stringify(coordinates));

        const show = handleClick(city);

        if(show) window.location.href = "weather.html";

    }catch(error){
        errorArea.textContent = `${error}`;
        errorArea.classList.add("visible");

        setTimeout(() => {
            errorArea.classList.remove("visible");
        }, 4000);
    }
});

function handleClick(city){

    if(!city){
        errorArea.textContent = "Please enter a city to generate weather data!";
        errorArea.classList.add("visible");

        setTimeout(() => {
            errorArea.classList.remove("visible");
        }, 4000);

        return false;
    }

    getBtn.disabled = true;
    getBtn.textContent = "Loading...";
    getBtn.style.cursor = "wait";
    cityInput.disabled = true;

    return true;
}