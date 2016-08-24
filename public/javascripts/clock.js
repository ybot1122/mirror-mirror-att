(function() {
  $(document).ready(function() {
    var clock = $('#clock');

    function updateClock() {
      clock.text(moment().format('HH:MM'));
    }

    updateClock();
    setInterval(updateClock, 60000);
  });
})();
