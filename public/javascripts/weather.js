(function() {
 $(document).ready(function() {
   var clientID = '1aea91f901544d2a';
   var zip = '98101';
   var currentForecast = $('#forecast');
   var temp = $('#temp');
   var currentTime = moment()
   var night;
   var socket = io();
   var weatherEndpoint = 'https://api.wunderground.com/api/'+clientID+'/conditions/q/'+zip+'.json';
   var sunTimes = 'https://api.wunderground.com/api/'+clientID+'/astronomy/q/'+zip+'.json';


   function getIcon(iconName, night) {

     console.log(night);
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
       currentForecast.load('/weatherIcons/'+weatherIconsDay[iconName]);
     } else {
       currentForecast.load('/weatherIcons/'+weatherIconsNight[iconName])
     }
   }

   $("#topRightCorner").removeClass("hidden");

   socket.on('weather', function(weather) {
     $("#topRightCorner").removeClass("hidden");
   });

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
       var sunsetHour = parseInt(output["sun_phase"]["sunset"]["hour"]);
       var sunsetMinute = parseInt(output["sun_phase"]["sunset"]["minute"]);
       var sunriseHour = parseInt(output["sun_phase"]["sunrise"]["hour"]);
       var sunriseMinute = parseInt(output["sun_phase"]["sunrise"]["minute"]);
       var currentHour = parseInt(output["moon_phase"]["current_time"]["hour"]);
       var currentMinute = parseInt(output["moon_phase"]["current_time"]["minute"]);

       console.log(currentHour);
       if ((currentHour > sunsetHour || (currentHour == currentMinute && currentMinute > sunsetMinute)) ||  (currentHour < sunriseHour || (currentHour == sunriseHour && currentMinute < sunriseMinute))) {
         night = "true";
       } else {
         night = "false";
       }

       var $current = response.current_observation;

       getIcon($current.icon, night);

       var currentTemp = $current.temp_f;
       temp.append(currentTemp + "°");
     })
   });

  //  $.ajax({
  //    type: 'POST',
  //    dataType: 'json',
  //    url: '/weather'
  //  })
  //  .then(function(response) {
  //    console.log(response);
  //  })
 });
})();
