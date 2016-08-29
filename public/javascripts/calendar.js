var today = new Date();

var CLIENT_ID = '490281370148-air65152ljmjiqh3unpoa3j7tlb42s1n.apps.googleusercontent.com';
var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

function checkAuth() {
  gapi.auth.authorize(
    {
      'client_id': CLIENT_ID,
      'scope': SCOPES.join(' '),
      'immediate': true
    }, handleAuthResult);
}

function handleAuthResult(authResult) {
  var authorizeDiv = document.getElementById('authorize-div');
  if (authResult && !authResult.error) {
    authorizeDiv.style.display = 'none';
    loadCalendarApi();
  } else {
    authorizeDiv.style.display = 'inline';
  }
}

function handleAuthClick(event) {
  gapi.auth.authorize(
    {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
    handleAuthResult);
  return false;
}

function loadCalendarApi() {
  gapi.client.load('calendar', 'v3', listUpcomingEvents);
}

function listUpcomingEvents() {
  var request = gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
  });

  request.execute(function(resp) {
    var events = resp.items;
    // $('#calendar').append('<h3> Your events </h3>')

    function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
    }

    var dayOfWeek = {
      0 : "Sun",
      1 : "Mon",
      2 : "Tue",
      3 : "Wed",
      4 : "Thu",
      5 : "Fri",
      6 : "Sat"
    }
    console.log(events);
    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        if (!when) {
          var begin = new Date(event.start.date);
          var end = new Date(event.end.date);
          if (begin < today) {
            appendPre(event.summary, '<em>ends in ' + diffDays(end, today) + ' days</em>')
          } else if (diffDays(begin, today) == 0) {
            appendPre(event.summary, '<em>tomorrow all day</em>');
          } else {
            appendPre(event.summary, '<em>in ' + diffDays(begin, today) + ' days.</em>')
          }
        } else {
          var begin = new Date(when);
          if (diffDays(begin, today) == 0) {
            appendPre(event.summary,  '<em>today at ' + begin.getHours() + ':' + addZero(begin.getMinutes()) + '</em>');
          } else if (diffDays(begin, today) == 1) {
            appendPre(event.summary, '<em>tomorrow at ' + begin.getHours() + ':' + addZero(begin.getMinutes()) + '</em>');
          } else {
            appendPre(event.summary, '<em>in ' + diffDays(begin, today) + ' days </em>');
          }
        }
      }
    } else {
      appendPre('No upcoming events found.');
    }
  });
}

function diffDays(later, earlier) {
  var oneDay = 24*60*60*1000;
  var result = Math.round(Math.abs((later.getTime() - earlier.getTime()) / (oneDay)));
  return result;
}

function appendPre(eventName, eventDate) {
  $('#calendar > #heading').append(eventName +'<br>');
  $('#calendar > #date').append(eventDate +'<br>');
}
