// https://www.loc.gov/FORMAT/?q=civil war&fo=json |Search with format
var searchResultsEl = document.querySelector('#search-results');
var qEl = document.querySelector('#q');
var formEl = document.querySelector('#search-form');

var apiKey = '062ac5aed23ac309d8aa8d7807a42e70';

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
        // getMap(data[0].lat, data[0].lon);
        console.log(data);
      })
      .catch(function (err) {
        console.log(err);
      });
  } 

  function getHistory(city) {
    console.log(city);
  }

  formEl.addEventListener('submit', function(event) {
    event.preventDefault();
    
    var q = qEl.value;
    getLocation(q);
    getHistory(q);
  });

  init();