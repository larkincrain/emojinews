// content.js

console.log(document.all[0]);



var url_smile = chrome.runtime.getURL('images/blackAndWhite/2639.svg');
var url_frown = chrome.runtime.getURL('images/blackAndWhite/263a.svg');
var url_heart = chrome.runtime.getURL('images/blackAndWhite/2764.svg');

var $button = 
	$("<div><button class='btn btn-info'>😅</button>" +
	"<button id='btn-emoji-smiley' class='btn btn-info'>😊</button>" +
	"<button class='btn btn-info'>😲</button>" +
	"</div>");

/*
var $button = 
	$("<div><button class='btn btn-info'><img src='" + url_smile + "'>Smile!</button>" +
	"<button class='btn btn-info'><img src='" + url_heart + "'>Heart!</button>" +
	"<button class='btn btn-info'><img src='" + url_frown + "'>Frown</button>" +
	"</div>");
*/

$(".esc-lead-article-title-wrapper")
		.append($button);

$('#btn-emoji-smiley').click(function() {
	alert(':)');
});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	if( request.message === "clicked_browser_action" ) {
		var firstHref = $("a[href^='http']").eq(0).attr("href");

		console.log(firstHref);

		// This line is new!
	    chrome.runtime.sendMessage({"message": "open_new_tab", "url": firstHref});
	}
});