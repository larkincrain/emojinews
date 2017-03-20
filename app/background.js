// background.js

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
	// Send a message to the active tab
	chrome.tabs.query(
		{active: true, currentWindow: true}, 
		function(tabs) {
			var activeTab = tabs[0];
			chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
		});
});

// This block is new!
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.message == "add_article") {

		var postdata = 'source=' + request.source + '&headline='+request.headline;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "http://198.199.126.203:8005/api/articles", true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.setRequestHeader("Content-length", postdata.length);

		xhr.onreadystatechange = function() {

			alert('state change' + xhr.readyState);

			if (xhr.readyState == 4) {
		  		alert('source: ' + request.source + ": " + xhr.responseText);
		  	
		    	// WARNING! Might be evaluating an evil script!
		    	var resp = eval("(" + xhr.responseText + ")");
			}
		}

		xhr.send(postdata);
	}
});

