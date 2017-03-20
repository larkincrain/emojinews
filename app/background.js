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
		$.post( "localhost:8005/api/articles", {source: request.source, headline: request.headline })
			.done(function( data ) {
		    	alert( "Article Sent: " + data );
			});
	}
});
