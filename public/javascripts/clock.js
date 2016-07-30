(function() {
  $(document).ready(function() {
    var clock = $('#clock');

    function updateClock() {
      clock.text(moment().format('LTS'));
    }

    setInterval(updateClock, 1000);
  });
})();
