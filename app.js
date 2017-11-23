document.addEventListener('DOMContentLoaded', function() {

var username = "";
var token = "";
var table = document.createElement("table"); 
	chrome.storage.local.get('username', function (result) {
	username = result.username;
	});
	
	chrome.storage.local.get('token', function (result) {
	token = result.token;
	start();
	}); 
	
	setInterval(function(){ 
    start();
	document.getElementById("friendActivity").innerHTML = "";
	}, 30000);
	
	function start()
	{
		var Friends = "";
		var index = 0;
		var currentUser = "";

		var xhr = new XMLHttpRequest();
		xhr.onload = function() {
			var json = xhr.responseText;                         // Response
			json = json.replace(/^[^(]*\(([\S\s]+)\);?$/, '$1'); // Turn JSONP in JSON
			json = JSON.parse(json);                             // Parse JSON
			
			Friends = json;
			
			processFriends(0);
		};

		xhr.open('GET', 'http://ws.audioscrobbler.com/2.0/?method=user.getfriends&user=' + username + '&api_key=' + token + '&format=json');
		xhr.send();

		var recentTrackRequest = new XMLHttpRequest();
		var recentTrack = "";

		function processFriends(index)
		{	
			if(Friends.friends != undefined && index < Friends.friends.user.length)
			{
				var requestLink = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=' + Friends.friends.user[index].name + '&api_key=' + token + '&format=json';
				currentUser = Friends.friends.user[index].name;
				recentTrackRequest.open('GET', requestLink);
				recentTrackRequest.send();
			}
		}


		recentTrackRequest.onload = function()
		{
			var json = recentTrackRequest.responseText;                         // Response
			json = json.replace(/^[^(]*\(([\S\s]+)\);?$/, '$1'); // Turn JSONP in JSON
			json = JSON.parse(json);                             // Parse JSON
			
			recentTrack = json;
			
			if(isEmpty(recentTrack.recenttracks.track[0]['@attr']) === false)
				var currentSong = "<a href='https://www.last.fm/user/" + currentUser + "'>" + currentUser + "</a> " + "<a class='artistname' href='https://www.last.fm/music/" +  recentTrack.recenttracks.track[0].artist['#text'] + "'>" +
			recentTrack.recenttracks.track[0].artist['#text'] + "</a> - " + 
			"<a class='trackname' href='https://www.last.fm/music/" +  recentTrack.recenttracks.track[0].artist['#text'] + "/_/" + recentTrack.recenttracks.track[0].name + "'>" +  recentTrack.recenttracks.track[0].name + "</a>"
			
			if(currentSong != undefined)
			{
				var tet = document.getElementById("recent-tracks-section");
				table.className = "CurrentFriendActivity chartlist-name";
				table.id = "friendActivity";
				// document.body.appendChild(table); 
				var songRow = document.createElement("tr");
				songRow.className = "js-link-block js-focus-controls-container chartlist-row--even";			
				var songRowItem = document.createElement("td");
				songRowItem.className = "songRow chartlist-ellipsis-wrap";
				songRowItem.innerHTML = currentSong;
				songRow.appendChild(songRowItem);
				table.appendChild(songRow);
				
				tet.appendChild(table);
			}
			index++;
			
			processFriends(index);
		}
		// Check if a JSON object is empty
		function isEmpty(obj) {
			for(var prop in obj) {
				if(obj.hasOwnProperty(prop))
					return false;
			}
			return true;
		}
	}

	
	var link = document.getElementById('getcredentials');
	link.addEventListener('click', function() {
		getcredentials.style.display='none';
		var usernamefield = document.getElementById("username");
		usernamefield.value=username;

		var tokenfield = document.getElementById("token");
		tokenfield.value=token;
	});
	
	var link = document.getElementById('credentials');
	link.addEventListener('click', function() {		
		// Get entered username from the form by it's ID and save it
			var newusername = document.getElementById("username").value;
			chrome.storage.local.set({'username': newusername}, function (result) {
			});
		
			// Get entered token from the form by it's ID and save it
			var newtoken = document.getElementById("token").value; 
			chrome.storage.local.set({'token': newtoken}, function (result) {
			});
		});
});
