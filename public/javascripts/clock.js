(function() {
  $(document).ready(function() {
    var $clock = $('#clock');
    var $today = $('#today');
    var today = new Date();
    var todaySplit = today.toString().split(' ', 3);

    function updateClock() {
      $clock.text(moment().format('HH:MM'));
      $today.text(todaySplit[0] + ', ' + todaySplit[1] + ' ' + todaySplit[2]);
    }
    updateClock();
    setInterval(updateClock, 60000);
  });
})();
