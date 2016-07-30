(function() {
  $(document).ready(function() {

    SC.initialize({
      client_id: '7b9c5b47c81e949b866695aaee59f001'
    });

    SC.stream('/tracks/293').then(function(player){
      player.play();
    });
  });
})();
