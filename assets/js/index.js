/* check if dom element exist and  run function */
let timeInit = setInterval(() => {
    let stadt = document.getElementById('covid-city');
    if (stadt) {
        getCity();
        clearInterval(timeInit);
    }
}, 200);

/**
 * set data for checked city
 */
function getCity() {
    /* init */
    let stadt = document.getElementById('covid-city');
    let selectedCity = stadt.options[stadt.selectedIndex].value;
    let selectedCityName = stadt.options[stadt.selectedIndex].text;
    let covidData;
    let debug = false;

    /* api endpoinds rki */
    const url = 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?f=json&where=BL%3D%27' + selectedCityName + '%27&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=county%20asc&outSR=102100&resultOffset=0&resultRecordCount=5&resultType=standard&cacheHint=true';
    const urlBundesland = 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/rki_key_data_v/FeatureServer/0/query?f=json&outFields=*&returnGeometry=false&cacheHint=true&orderByFields=AdmUnitId%20asc&where=BundeslandId=' + selectedCity + '&resultOffset=0&resultRecordCount=1';

    /* api request */
    async function covidRestApi(url) {
        const response = await fetch(url, {
            method: 'GET'
        });
        return await response.json();
    }

    covidRestApi(urlBundesland)
        .then((response) => {
            covidData = response;
            debug && log(response);
            if (covidData) {
                document.getElementById('covid-time').innerText = new Date().toLocaleDateString();
                document.getElementById("inz7t").innerText = covidData["features"][0]["attributes"]["Inz7T"];
                document.getElementById("anzfall7t").innerText = covidData["features"][0]["attributes"]["AnzFall7T"];
                document.getElementById("anzfallneu").innerText = covidData["features"][0]["attributes"]["AnzFallNeu"];
                document.getElementById("anzfall").innerText = covidData["features"][0]["attributes"]["AnzFall"];
                document.getElementById("anztodesfallneu").innerText = covidData["features"][0]["attributes"]["AnzTodesfallNeu"];
                document.getElementById("anztodesfall").innerText = covidData["features"][0]["attributes"]["AnzTodesfall"];
            } else {
                debug && log("Data: ", covidData);
            }
        })
        .catch((e) => {
            debug && log("Error: ", e);
        });

    /* debug */
    function log(...message) {
        console.log("COVID:: ", message);
    }
}