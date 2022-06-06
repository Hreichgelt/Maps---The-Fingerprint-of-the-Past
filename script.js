// https://www.loc.gov/FORMAT/?q=civilwar&fo=json |Search with format
var searchResultsEl = document.querySelector('#search-results');
var qEl = document.querySelector('#q');
var formEl = document.querySelector('#search-form');
var mapTitle = document.querySelector(".city-head")

var apiKey = '062ac5aed23ac309d8aa8d7807a42e70';

function getMap(city, lat, lon){
    console.log(lat, lon)
    var map; 
    // map.innerText = null; 
    mapTitle.textContent = city.toUpperCase();
    map = L.map('map').setView([lat, lon], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);
    var marker = L.marker([lat, lon]).addTo(map);
    

}

function init() {

}

// Gets the geographical longitude and latitude of the city
function getLocation(city) {
    // Allow cities with spaces in their names to be inserted in the URL
    var newCity = city.replace(/ /g, "+");
    // Fetches geocode data via Open Weather Map
    // Reference: https://openweathermap.org/api/geocoding-api
    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + newCity + '&limit=1&appid=' + apiKey)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // TODO: create getMap function
            getMap(city, data[0].lat, data[0].lon);
            console.log(data);
        })
        .catch(function (err) {
            console.log(err);
        });
}

function getHistory(city) {
    fetch('https://www.loc.gov/maps/?q=' + city + '&fo=json&c=10')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            searchResultsEl.innerHTML = null;
            console.log(data.results);
            // <article class="card p-3 bg-dark text-light my-4">
            //     <h3>Story Title</h3>
            //     <img>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laudantium voluptatum esse tenetur,
            //         numquam
            //         pariatur expedita laboriosam quo officiis, animi eaque vero quae dignissimos minus explicabo
            //         praesentium dicta eos perferendis blanditiis.</p>
            //     <button class="btn btn-light text-dark mt-3">Learn More</button>
            // </article>

            for (var result of data.results) {
                var articleEl = document.createElement('article');
                articleEl.className = 'card p-3 bg-dark text-light my-4';

                var h3El = document.createElement('h3');
                h3El.textContent = result.title;

                var imgEl = document.createElement('img');
                imgEl.src = result.image_url[2];

                var btnEl = document.createElement('a');
                btnEl.className = 'btn btn-light text-dark mt-3';
                btnEl.textContent = 'Learn More';
                btnEl.href = result.url;
                btnEl.target = "_blank";

                searchResultsEl.append(articleEl);
                articleEl.append(h3El, imgEl, btnEl);
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

    getLocation(q);
    getHistory(q);
});

init();