(function() {
  $(document).ready(function() {
    var clientID = '1aea91f901544d2a';
    var zip = '98101';
    var currentForecast = $('#forecast');
    var today = $('#today');

    var weatherEndpoint = `http://api.wunderground.com/api/${clientID}/conditions/q/${zip}.json`;

    function getIcon(iconName) {
      var iconHTML = $.ajax({
        
      })
    }

    $.ajax({
      type: 'GET',
      dataType: 'jsonp',
      url: weatherEndpoint
    })
    .then(function(response) {
      var $current = response.current_observation;
      console.log($current);

      var $icon = $('<img class="weather-icon">');
      var iconName = $current.icon;

      $icon.attr('src', $current.icon_url);

      var currentTemp = $current.temp_f;

      var $temp = $('<p class="temps">');
      $temp.text(currentTemp + '° F');

      today.append($icon);
      today.append($temp);

    });
  });
})();
