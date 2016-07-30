(function() {
  $(document).ready(function() {
    var clock = $('#clock');

    function updateClock() {
      clock.text(moment().format('LT'));
    }

    updateClock();
    setInterval(updateClock, 60000);
  });
})();
