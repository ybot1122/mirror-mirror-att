(function() {
  $(document).ready(function() {
    var socket = io();
    var $music = $('<div id="music">');
    var $logo = $('<img src="/images/sc_logo.png">');

    SC.initialize({
      client_id: '7b9c5b47c81e949b866695aaee59f001'
    });

    socket.on('query', function(query) {
      console.log(query);
      SC.get(`/users/${query.artist}/tracks`, { limit: 1 })
        .then(function(track) {
          console.log(track);
          SC.stream(`/tracks/${track[0].id}`).then(function(player){
            player.play();
            $music.append($logo);
          });
      });
    });

    // testing
  //   $.ajax({
  //     type: 'GET',
  //     dataType: 'json',
  //     url: '/music'
  //   })
  //   .then(function(response) {});
  //
  // });
})();
