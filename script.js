var searchResultsEl = document.querySelector('#search-results');
var qEl = document.querySelector('#q');
var formEl = document.querySelector('.search-form');
var mapTitle = document.querySelector('.city-head')
var wrap = document.querySelector('.textWrap');
var selectEl = document.querySelector('select');

var apiKey = '062ac5aed23ac309d8aa8d7807a42e70';

function init() {
    // Checks location of user upon initialization
    if (location.search) {
        var storedCity = JSON.parse(localStorage.getItem('cities')) || [];

        // Refreshes select form & creates default selected option
        selectEl.innerHTML = null;
        var selectedEl = document.createElement('option');
        selectedEl.innerHTML = 'SEARCH HISTORY'
        selectedEl.selected = true;
        selectedEl.disabled = true;
        selectEl.append(selectedEl);

        var unique = [];
        // Adds search history to select form
        for (var item of storedCity) {
            if (!unique.includes(item)) {
                unique.push(item);
                var optionEl = document.createElement('option');
                optionEl.innerHTML = item;
                selectEl.append(optionEl);
            }
        }

        // Uses last stored city to populate search results and map
        var q = storedCity.pop();
        getHistory(q);
        getLocation(q);
    }
};

// Stores searched cities in local storage
function storeCity(city) {
    var storedCity = JSON.parse(localStorage.getItem('cities')) || [];
    storedCity.push(city);
    localStorage.setItem('cities', JSON.stringify(storedCity));
}

// Gets the geographical longitude and latitude of the city
function getLocation(city) {
    // Allow cities with spaces in their names to be inserted in the URL
    var newCity = city.replace(/ /g, '+');
    // Fetches geocode data via Open Weather Map
    // Reference: https://openweathermap.org/api/geocoding-api
    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + newCity + '&limit=1&appid=' + apiKey)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            initializeMap();
            getMap(city, data[0].lat, data[0].lon);
        })
        .catch(function (err) {
            console.log(err);
        });
}

// Refreshes map for each search
function initializeMap() {
    var container = L.DomUtil.get('map');
    if (container != null) {
        container._leaflet_id = null;
    }
}

// Uses latitude and longitude from getLocation to display map
// Leaflet Reference: https://leafletjs.com/examples/quick-start/
function getMap(city, lat, lon) {
    mapTitle.textContent = city;
    var map = L.map('map').setView([lat, lon], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);
    var marker = L.marker([lat, lon]).addTo(map);
    marker.bindPopup(city);
}

// Displays search results of historical maps
function getHistory(city) {
    // Fetches maps from Library of Congress using city name
    // Reference: https://libraryofcongress.github.io/data-exploration/requests.html#format
    fetch('https://www.loc.gov/maps/?q=' + city + '&fo=json&c=9')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Resets the articleELs for each search
            document.querySelectorAll('.mapResult').forEach(e => e.remove());
            displayResults(data);
        })

        .catch(function (err) {
            console.log(err);
        });
}

// Display mapResults
function displayResults(data) {
    // Template for cards
    // <article class='col-12 col-md-6 mapResult'>
    //     <div class='card p-3 bg-dark text-light mb-4 h-100'>
    //         <h3>result.title</h3>
    //         <img class='mt-auto'/>
    //         <button class='btn btn-light text-dark mt-auto'>Learn More</button>
    //     </div>
    // </article>

    for (var result of data.results) {
        if (result.image_url.length !== 0) {
            var articleEl = document.createElement('article');
            articleEl.className = 'col-12 col-md-6 mapResult';

            var cardEl = document.createElement('div');
            cardEl.className = 'card p-3 bg-dark text-light mb-4 h-100';

            var h3El = document.createElement('h3');
            h3El.textContent = result.title;

            var imgEl = document.createElement('img');
            imgEl.src = result.image_url[2];
            imgEl.alt = 'Image Failed to Load';
            imgEl.className = 'mt-auto';

            var btnEl = document.createElement('a');
            btnEl.className = 'btn btn-light text-dark mt-auto';
            btnEl.textContent = 'Learn More';
            btnEl.style.fontFamily = "'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', 'Geneva', 'Verdana', 'sans-serif'";
            btnEl.href = result.url;
            btnEl.target = '_blank';

            cardEl.append(h3El, imgEl, btnEl);
            articleEl.append(cardEl);
            wrap.append(articleEl);
        }
    }
}

formEl.addEventListener('submit', function (event) {
    event.preventDefault();
    var q = qEl.value.trim();

    // If there is no input in the form, do nothing.
    if (!q) return;

    q = q.toUpperCase();

    // Checks location of the user before continuing
    if (searchResultsEl) {
        getHistory(q);
        storeCity(q);
        getLocation(q);
    } else {
        location.replace('./results.html?q=' + q);
        storeCity(q);
    }
});

selectEl.addEventListener('change', function () {
    getHistory(this.value);
    getLocation(this.value);
})

init();