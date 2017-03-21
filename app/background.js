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
			if (xhr.readyState == 4) {
		    	// WARNING! Might be evaluating an evil script!
		    	var resp = eval("(" + xhr.responseText + ")");

		    	chrome.tabs.sendMessage(
		    		activeTab.id,
		    		{
		    			"data": resp
		    		});
			}
		}

		xhr.send(postdata);
	} else if (request.message == "add_emoji") {
		var postdata = 'source=' + request.source + '&headline='+request.headline + "&emoji=" + request.emoji;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "http://198.199.126.203:8005/api/emojis", true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.setRequestHeader("Content-length", postdata.length);

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
		    	// WARNING! Might be evaluating an evil script!
		    	var resp = eval("(" + xhr.responseText + ")");
			}
		}

		xhr.send(postdata);
	} else if (request.message == "get_summary") {
		var postdata = 'source=' + request.source + '&headline='+request.headline;
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "http://198.199.126.203:8005/api/articles/" + encodeURIComponent(request.source) + "/" + encodeURIComponent(request.headline), true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.setRequestHeader("Content-length", postdata.length);

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
		    	// WARNING! Might be evaluating an evil script!
		    	//var resp = eval("(" + xhr.responseText + ")");
		    	//alert('got a summary: ' + xhr.responseText);

		    	// here we need to parse out the emojis from the response and create an array of them to return 
		    	var emojis = JSON.parse(xhr.responseText)[0].emojis;
		    	var emojiHtml = "";

		    	for(var count = 0; count < emojis.length; count ++) {

		    		if(emojis[count].emoji == "grin") 
		    			emojiHtml += "😀";
		    		else if(emojis[count].emoji == "goodcry") 
		    			emojiHtml += "😂";
		    		else if(emojis[count].emoji == "wink") 
		    			emojiHtml += "😉";
		    		else if(emojis[count].emoji == "lol") 
		    			emojiHtml += "😆";
		    		else if(emojis[count].emoji == "sunglasses") 
		    			emojiHtml += "😎";
		    		else if(emojis[count].emoji == "inlove") 
		    			emojiHtml += "😍";
		    		else if(emojis[count].emoji == "smooch") 
		    			emojiHtml += "😘";
		    		else if(emojis[count].emoji == "smile") 
		    			emojiHtml += "🙂";
		    		else if(emojis[count].emoji == "blush") 
		    			emojiHtml += "😊";
		    		else if(emojis[count].emoji == "ponder") 
		    			emojiHtml += "🤔";
		    		else if(emojis[count].emoji == "neutral") 
		    			emojiHtml += "😐";
		    		else if(emojis[count].emoji == "ugh") 
		    			emojiHtml += "🙄";
		    		else if(emojis[count].emoji == "smirk") 
		    			emojiHtml += "😏";
		    		else if(emojis[count].emoji == "oface") 
		    			emojiHtml += "😮";
		    		else if(emojis[count].emoji == "hmm") 
		    			emojiHtml += "😕";
		    		else if(emojis[count].emoji == "disappointed") 
		    			emojiHtml += "😞";
		    		else if(emojis[count].emoji == "cringe") 
		    			emojiHtml += "😖";
		    		else if(emojis[count].emoji == "shock") 
		    			emojiHtml += "😲";
		    		else if(emojis[count].emoji == "bigcry") 
		    			emojiHtml += "😭";
		    		else if(emojis[count].emoji == "scare") 
		    			emojiHtml += "😨";
		    		else if(emojis[count].emoji == "halo") 
		    			emojiHtml += "😇";
		    		else if(emojis[count].emoji == "roboto") 
		    			emojiHtml += "🤖";
		    		else if(emojis[count].emoji == "poop") 
		    			emojiHtml += "💩";
		    		else if(emojis[count].emoji == "middlefinger") 
		    			emojiHtml += "🖕";
		    		else if(emojis[count].emoji == "horns") 
		    			emojiHtml += "🤘";
		    		else if(emojis[count].emoji == "praise") 
		    			emojiHtml += "🙌";
		    		else if(emojis[count].emoji == "kiss") 
		    			emojiHtml += "💋";
		    	}

		    	//alert('got the emojis');
		    	//alert(JSON.parse(xhr.responseText)[0].emojis);

		    	// Send a message to the active tab
				chrome.tabs.query(
					{active: true, currentWindow: true}, 
					function(tabs) {
						var activeTab = tabs[0];

						chrome.tabs.sendMessage(activeTab.id, {
							"message": "got_summary",
							"response": xhr.responseText,
							"emojiHtml": emojiHtml,
							"source": request.source,
							"headline": request.headline,
							"article_count": request.article_count
						});
					});

			}
		}

		xhr.send(postdata);
	}
});

