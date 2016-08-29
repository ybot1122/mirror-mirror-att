(function() {
  $(document).ready(function() {
    var socket = io();

    function getTweets(data) {
      var word = String(data.keyword);
      const query = {
        query: 'query { searchTwitterTweets(q: "'+word+'", count: 10, result_type:popular) { id created_at text }  }   ',
        variables: ""
      };

      $.ajax({
        type: "POST",
        url: "https://api.twitter.com/1.1/search/tweets.json?q=%23freebandnames&since_id=24012619984051000&max_id=250126199840518145&result_type=mixed&count=4",
        data: query,
        success: function(result) {
          console.log(result);
          var tweets = result["data"]["searchTwitterTweets"];
          // console.log(tweets);
          var output = [];
          for(var i=0; i<tweets.length; i++) {
            var singleTweet = "      '"+tweets[i]["text"]+"'  -------- "
            output.push(singleTweet);
          }
          $("#marquee").append(output);
        },
        error: function(xhr, ajaxOptions, error) {
          console.log("That didn't go so well.");
          console.log(error);
          return error;
        },
        dataType: 'json'
      });
    }
    var data = {
      keyword: 'golf'
    }

    getTweets(data);
    $("#bottom").removeClass("hidden");

    // DISABLED UNTIL WE RE-ENABLE NUANCE VOICE COMMANDS
    // socket.on('twitter', function(data) {
    //   getTweets(data);
    //   $("#bottom").removeClass("hidden");
    // });
  });
})();
