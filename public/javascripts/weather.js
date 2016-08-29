(function() {
 $(document).ready(function() {
   var clientID = '1aea91f901544d2a';
   var currentWeather = $('#currentWeather');
   var $temp = $('#temp');
   var forecast = $('#forecast');
   var currentTime = moment()
   var night;
   var socket = io();
   var zip;

  //  Get users location
  if ("geolocation" in navigator) {
    console.log("geolocation is available");
    navigator.geolocation.getCurrentPosition(function(position) {
      var locationJSON = $.getJSON("http://maps.googleapis.com/maps/api/geocode/json?latlng="+ position.coords.latitude + "," + position.coords.longitude+"", function(data) {
        var locAddress = data.results[0].address_components;
        zip = (locAddress[locAddress.length - 1].long_name).toString();
        console.log(zip);
        getWeather(zip);
      });
    });
  } else {
    console.log("geolocation is NOT available");
    zip = '98101';
    getWeather(zip);
  }

   function getIcon(iconName, night) {
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
       return ('/weatherIcons/'+weatherIconsDay[iconName]+'');
     } else {
       return ('/weatherIcons/'+weatherIconsNight[iconName]+'');
     }
   }

   $("#topRightCorner").removeClass("hidden");

   socket.on('weather', function(weather) {
     $("#topRightCorner").removeClass("hidden");
   });

   function getWeather(zip) {
     var weatherEndpoint = 'https://api.wunderground.com/api/'+clientID+'/conditions/q/'+zip+'.json';
     var forecastEndpoint = 'https://api.wunderground.com/api/'+clientID+'/forecast10day/q/'+zip+'.json';
     var sunTimes = 'https://api.wunderground.com/api/'+clientID+'/astronomy/q/'+zip+'.json';
     $.ajax({
       type: 'GET',
       dataType: 'jsonp',
       url: weatherEndpoint
     })
     .then(function(weatherResponse) {
       $.ajax({
         type: 'GET',
         dataType: 'jsonp',
         url: forecastEndpoint
       })
       .then(function(forecastResponse) {
         $.ajax({
           type: 'GET',
           dataType: 'jsonp',
           url: sunTimes
         })
         .then(function(output) {
           var sunsetHour = parseInt(output["sun_phase"]["sunset"]["hour"]);
           var sunsetMinute = parseInt(output["sun_phase"]["sunset"]["minute"]);
           var sunriseHour = parseInt(output["sun_phase"]["sunrise"]["hour"]);
           var sunriseMinute = parseInt(output["sun_phase"]["sunrise"]["minute"]);
           var currentHour = parseInt(output["moon_phase"]["current_time"]["hour"]);
           var currentMinute = parseInt(output["moon_phase"]["current_time"]["minute"]);
           if ((currentHour > sunsetHour || (currentHour == currentMinute && currentMinute > sunsetMinute)) ||  (currentHour < sunriseHour || (currentHour == sunriseHour && currentMinute < sunriseMinute))) {
             night = "true";
           } else {
             night = "false";
           }

           var $current = weatherResponse.current_observation;
          //  var icon = getIcon($current.icon, night);
           currentWeather.load(getIcon($current.icon, night));

           var currentTemp = $current.temp_f;
           $temp.append(currentTemp + "°");

           var $forecast = [];
           for (var i=0; i<5; i++) {
             var daily = forecastResponse.forecast.simpleforecast.forecastday[i];
             $('#day'+[i]+' > .icon').load(getIcon(daily.icon, "false"));
             $('#day'+[i]+' > .highTemp').append(daily.high.fahrenheit+"°");
             $('#day'+[i]+' > .lowTemp').append(daily.low.fahrenheit+"°");
             $('#day'+[i]+' > .dayOfWeek').append((daily.date.weekday).substring(0, 3));
           }
         });
       });
     });
   }
 });
})();
