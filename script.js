// https://www.loc.gov/FORMAT/?q=civilwar&fo=json |Search with format
var searchResultsEl = document.querySelector('#search-results');
var qEl = document.querySelector('#q');
var formEl = document.querySelector('.search-form');
var mapTitle = document.querySelector('.city-head')
var wrap = document.querySelector('.textWrap');

var apiKey = '062ac5aed23ac309d8aa8d7807a42e70';


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


function initializeMap() {
    var container = L.DomUtil.get('map');
    if (container != null) {
        container._leaflet_id = null;
    }
}
function init() {
    if (location.search) {
        var storedCity = JSON.parse(localStorage.getItem('cities')) || [];
        var q = storedCity.pop();
        getHistory(q);
        getLocation(q);
    }
};

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
            // TODO: create getMap function
            initializeMap();
            getMap(city, data[0].lat, data[0].lon);
        })
        .catch(function (err) {
            console.log(err);
        });
}

function storeCity(city) {
    var storedCity = JSON.parse(localStorage.getItem('cities')) || [];
    storedCity.push(city);
    localStorage.setItem('cities', JSON.stringify(storedCity));
}

function getHistory(city) {
    fetch('https://www.loc.gov/maps/?q=' + city + '&fo=json&c=9')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            document.querySelectorAll('.mapResult').forEach(e=>e.remove());
            // <article class='card p-3 bg-dark text-light my-4'>
            //     <h3>Story Title</h3>
            //     <img>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laudantium voluptatum esse tenetur,
            //         numquam
            //         pariatur expedita laboriosam quo officiis, animi eaque vero quae dignissimos minus explicabo
            //         praesentium dicta eos perferendis blanditiis.</p>
            //     <button class='btn btn-light text-dark mt-3'>Learn More</button>
            // </article>

            for (var result of data.results) {
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
                btnEl.href = result.url;
                btnEl.target = '_blank';

                cardEl.append(h3El, imgEl, btnEl);
                articleEl.append(cardEl);
                wrap.append(articleEl);
            }
        })

        .catch(function (err) {
            console.log(err);
        });
}

formEl.addEventListener('submit', function (event) {
    event.preventDefault();
    var q = qEl.value.trim();

    if (!q) return;

    if (searchResultsEl) {
        getHistory(q);
        storeCity(q);
        getLocation(q);
    } else {
        location.replace('./results.html?q=' + q);
        storeCity(q);
    }
});

init();