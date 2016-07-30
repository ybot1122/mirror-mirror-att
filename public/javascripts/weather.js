(function() {
  $(document).ready(function() {
    var clientID = '1aea91f901544d2a';
    var zip = '98101';
    var currentForecast = $('#forecast');
    var today = $('#today');
    var $icon = $('<img class="weather-icon">');

    var weatherEndpoint = `http://api.wunderground.com/api/${clientID}/conditions/q/${zip}.json`;

    function getIcon(iconName) {

      $icon.load(`/weatherIcons/${iconName}`);

      var weatherIcons = {
        "chanceflurries" : "cloudsnow.html",
        "chancerain" : "clouddrizzle.html",
        "chancesleet" : "cloudhailalt.html",
        "chancesnow" : "cloudsnow.html",
        "chancetstorms" : "cloudlightning.html",
        "clear" : "sun.html",
        "cloudy" : "cloud.html",
        "flurries" : "snowflake.html",
        "fog" : "cloudfog.html",
        "hazy" : "cloudfogsunalt.html",
        "mostlycloudy" : "cloudsun.html",
        "mostlysunny" : "sun.html",
        "partlycloudy" : "cloudsun.html",
        "sleet" : "cloudhailalt.html",
        "rain" : "cloudrain.html",
        "snow" : "snowflake.html",
        "tstorms" : "cloudlightning.html"
      }

      $icon.load(`/weatherIcons/${weatherIcons.iconName}`);

    }

    $.ajax({
      type: 'GET',
      dataType: 'jsonp',
      url: weatherEndpoint
    })
    .then(function(response) {
      var $current = response.current_observation;
      console.log($current);

      getIcon($current.icon);

      var currentTemp = $current.temp_f;
      var $temp = $('<p class="temps">');

      $temp.text(currentTemp + '° F');

      today.append($temp);
    });
  });
})();
