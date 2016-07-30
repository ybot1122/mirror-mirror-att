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
        console.log(tweets);
        var output;
        for each(i in tweets) {
          output.push('"'+i["text"]+'');
        }
        $("#bottom").append(output);
    },
    error: function(xhr, ajaxOptions, error) {
        console.log("That didn't go so well.");
        return error;
    },
    dataType: 'json'
});
