# mirror-mirror-att
ATT Hackathon


## Full Stack API so far...
### Music
+ POST '/music' - queries artist or user (can be record labels) from SoundCloud and automatically plays first track
  + expects json in body (ex: { artist: "ghostly" })

### Weather
+ POST '/weather' - displays current weather

### Twitter
+ POST '/twitter' - displays twitter feed based on last keyword spoken
  + expects FOUR WORDS (ex: twitter search for golf)
