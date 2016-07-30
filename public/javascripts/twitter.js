(function() {
  $(document).ready(function() {
    var socket = io();
    const data = {
        query: 'query { searchTwitterTweets(q: "Trump", count: 5, result_type:popular) { id created_at text }  }   ',
        variables: ""
    };

    $.ajax({
        type: "POST",
        url: "https://api.scaphold.io/graphql/7db5b0fd-0970-42d1-97d0-49b2fe88f364",
        data: data,
        success: function(result) {
            var tweets = result["data"]["searchTwitterTweets"];
            var output = [];
            for(var i=0; i<tweets.length; i++) {
              var singleTweet = "      '"+tweets[i]["text"]+"'  -------- "
              console.log(singleTweet);
              output.push(singleTweet);
            }
            $("#marquee").append(output);
        },
        error: function(xhr, ajaxOptions, error) {
            console.log("That didn't go so well.");
            return error;
        },
        dataType: 'json'
    });

    socket.on('twitter', function(weather) {
      $("#bottom").removeClass("hidden");
    });
  });
})();
