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

var $summary =
	$("<div>😀😟😡</div>")

$(".esc-lead-article-title-wrapper").each( function(index) {
	// call our server to see if we have this article already
	console.log('send a message to background service pls');
	chrome.runtime.sendMessage({"message": "add_article", "source": '', "headline": ''});
})

$(".esc-lead-article-title-wrapper")
		.append($button);

$(".esc-lead-article-title")
		.append($summary);

$('#btn-emoji-smiley').click(function() {

	alert(':)');
});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	if( request.message === "clicked_browser_action" ) {
		var firstHref = $("a[href^='http']").eq(0).attr("href");

		// This line is new!
	    chrome.runtime.sendMessage({"message": "open_new_tab", "url": firstHref});
	}
});