const cityInput = document.getElementById("city-input");
const getBtn = document.getElementById("get-data-btn");

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

        window.location.href = "weather.html";
    }catch(error){
        console.error(error);
    }
});