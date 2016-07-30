(function() {
  $(document).ready(function() {
    var clientID = '1aea91f901544d2a';
    var zip = '98101';
    var currentForecast = $('#forecast');
    var today = $('#today');
    var currentTime = moment()
    var $icon = $('<div class="weather-icon">');
    var night;

    var weatherEndpoint = `http://api.wunderground.com/api/${clientID}/conditions/q/${zip}.json`;

    var sunTimes = `http://api.wunderground.com/api/${clientID}/astronomy/q/${zip}.json`;

    function getIcon(iconName) {
      console.log(iconName);
      // $icon.load(`/weatherIcons/${iconName}`);

      var weatherIconsDay = {
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

      var weatherIconsNight = {
        "chanceflurries" : "cloudsnow.html",
        "chancerain" : "clouddrizzle.html",
        "chancesleet" : "cloudhailalt.html",
        "chancesnow" : "cloudsnow.html",
        "chancetstorms" : "cloudlightning.html",
        "clear" : "moon.html",
        "cloudy" : "cloudmoon.html",
        "flurries" : "snowflake.html",
        "fog" : "cloudfog.html",
        "hazy" : "cloudmoon.html",
        "mostlycloudy" : "cloudmoon.html",
        "mostlysunny" : "moon.html",
        "partlycloudy" : "cloudmoon.html",
        "sleet" : "cloudhailalt.html",
        "rain" : "cloudrain.html",
        "snow" : "snowflake.html",
        "tstorms" : "cloudlightningmoon.html"
      }

      if (night == "false") {
        currentForecast.load(`/weatherIcons/${weatherIconsDay[iconName]}`);
        console.log(`/weatherIcons/${weatherIconsDay[iconName]}`);
      } else {
        currentForecast.load(`/weatherIcons/${weatherIconsNight[iconName]}`)
      }
    }

    $.ajax({
      type: 'GET',
      dataType: 'jsonp',
      url: weatherEndpoint
    })
    .then(function(response) {
      $.ajax({
        type: 'GET',
        dataType: 'jsonp',
        url: sunTimes
      })
      .then(function(output) {
        console.log(output["sun_phase"]["sunset"]);
        var sunsetHour = parseInt(`${output["sun_phase"]["sunset"]["hour"]}`);
        var sunsetMinute = parseInt(`${output["sun_phase"]["sunset"]["minute"]}`);
        var sunriseHour = parseInt(`${output["sun_phase"]["sunrise"]["hour"]}`);
        var sunriseMinute = parseInt(`${output["sun_phase"]["sunrise"]["minute"]}`);
        var currentHour = parseInt(`${output["moon_phase"]["current_time"]["hour"]}`);
        var currentMinute = parseInt(`${output["moon_phase"]["current_time"]["minute"]}`);

        if ((currentHour > sunsetHour && currentMinute > sunsetMinute) ||  (currentHour < sunriseHour && currentMinute < sunriseMinute)) {
          night = "true";
        } else {
          night = "false";
        }
        console.log(night);

        var $current = response.current_observation;
        console.log($current);

        getIcon($current.icon);

        var currentTemp = $current.temp_f;
        var $temp = $('<p class="temps">');

        $temp.text(currentTemp + '° F');

        today.append($temp);
      })
    });
  });
})();
