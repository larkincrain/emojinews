// content.js
var article_count = 0;

/*
😀 -grin
😂 -goodcry
😉 -wink
😆 -lol
😎 -sunglasses
😍 -inlove
😘 -smooch
🙂 -smile
😊 -blush
🤔 -ponder
😐 -neutral
🙄 -ugh
😏 -smirk
😮 -oface
😕 -hmm
😞 -disappointed
😖 -cringe
😲 -shock
😭 -bigcry
😨 -scare
😇 -halo
🤖 -roboto
💩 -poop
🖕 -middlefinger
🤘 -horns
🙌 -praise
💋 -kiss
*/

var $buttons = 
	$("<div>" + 
		"<button data-emoji='grin'class='btn btn-emoji'>😀</button>" +
		"<button data-emoji='goodcry'class='btn btn-emoji'>😂</button>" +
		"<button data-emoji='wink'class='btn btn-emoji'>😉</button>" +
		"<button data-emoji='lol'class='btn btn-emoji'>😆</button>" +
		"<button data-emoji='sunglasses'class='btn btn-emoji'>😎</button>" +
		"<button data-emoji='inlove'class='btn btn-emoji'>😍</button>" +
		"<button data-emoji='smooch'class='btn btn-emoji'>😘</button>" +
		"<button data-emoji='smile'class='btn btn-emoji'>🙂</button>" +
		"<button data-emoji='blush'class='btn btn-emoji'>😊</button>" +
		"<button data-emoji='ponder'class='btn btn-emoji'>🤔</button>" +
		"<button data-emoji='neutral'class='btn btn-emoji'>😐</button>" +
		"<button data-emoji='ugh'class='btn btn-emoji'>🙄</button>" +
		"<button data-emoji='smirk'class='btn btn-emoji'>😏</button>" +
		"<button data-emoji='oface'class='btn btn-emoji'>😮</button>" +
		"<button data-emoji='hmm'class='btn btn-emoji'>😕</button>" +
		"<button data-emoji='disappointed'class='btn btn-emoji'>😞</button>" +
		"<button data-emoji='cringe'class='btn btn-emoji'>😖</button>" +
		"<button data-emoji='shock'class='btn btn-emoji'>😲</button>" +
		"<button data-emoji='bigcry'class='btn btn-emoji'>😭</button>" +
		"<button data-emoji='scare'class='btn btn-emoji'>😨</button>" +
		"<button data-emoji='halo'class='btn btn-emoji'>😇</button>" +
		"<button data-emoji='roboto'class='btn btn-emoji'>🤖</button>" +
		"<button data-emoji='poop'class='btn btn-emoji'>💩</button>" +
		"<button data-emoji='middlefinger'class='btn btn-emoji'>🖕</button>" +
		"<button data-emoji='horns'class='btn btn-emoji'>🤘</button>" +
		"<button data-emoji='praise'class='btn btn-emoji'>🙌</button>" +
		"<button data-emoji='kiss'class='btn btn-emoji'>💋</button>" +
		"</div>"
	);

$(".esc-lead-article-title-wrapper").each( function(index) {
	// call our server to see if we have this article already
	var source = $(this)
		.next(".esc-lead-article-source-wrapper")
			.children("table")
				.children("tbody")
					.children("tr")
						.children(".source-cell")
							.children(".al-attribution-source")
								.html();

	var headline = $(this)
		.children("h2")
			.children(".article")
				.children(".titletext")
					.html();

	chrome.runtime.sendMessage({"message": "add_article", "source": source, "headline": headline});

	// $.post( "http://198.199.126.203:8005/api/articles", {source: '', headline: '' })
	// 	.done(function( data ) {
	//     	alert( "Article Sent: " + data );
	// 	});
})

$(".esc-lead-article-title-wrapper")
		.append($buttons);

$(".esc-lead-article-title").each( function(index) {
	//first make a call to get the summary
	var source = $(this)
		.parent()
			.next(".esc-lead-article-source-wrapper")
				.children("table")
					.children("tbody")
						.children("tr")
							.children(".source-cell")
								.children(".al-attribution-source")
									.html();

	var headline = $(this)
			.children(".article")
				.children(".titletext")
					.html();

	chrome.runtime.sendMessage({
		"message": "get_summary", 
		"source": source, 
		"headline": headline, 
		"article_count": article_count
	});

	var $summary = $("<div class='summary summary-" + article_count + "'></div>")
	$(this).append($summary);	

	article_count ++;
});

$('.btn-emoji').click(function() {
	var emoji = $(this).data('emoji');

	var headline = $(this)
		.parent()
			.parent()
				.children(".esc-lead-article-title")
					.children(".article")
						.children(".titletext").html()

	var source = $(this)
		.parent()
			.parent()
				.parent()
					.children(".esc-lead-article-source-wrapper")
						.children("table")
							.children("tbody")
								.children("tr")
									.children(".source-cell")
										.children(".al-attribution-source")
											.html();

	console.log('source: ' + source);
	console.log('headline: ' + headline);
	console.log('emoji: ' + emoji);		

	chrome.runtime.sendMessage({
		"message": "add_emoji", 
		"source": source,
		"headline": headline,
		"emoji": emoji
	}, function(data) {
		setTimeout(function(){
			refreshSummaries();
		}, 800);
		
	});

	//refreshSummaries();	
});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	if( request.message === "clicked_browser_action" ) {
		var firstHref = $("a[href^='http']").eq(0).attr("href");

		// This line is new!
	    chrome.runtime.sendMessage({"message": "open_new_tab", "url": firstHref});
	} else if (request.message == "got_summary") {
		var emojiHtml = request.emojiHtml;

		//add the summary to the element
		$(".summary-" + request.article_count).html(emojiHtml);
	}
});

function refreshSummaries() {

	// reset the article count for the refresh of the page summaries
	article_count = 0;

	//remove all elements with the class summary
	$(".summary").remove();	

	$(".esc-lead-article-title").each( function(index) {
		//first make a call to get the summary
		var source = $(this)
			.parent()
				.next(".esc-lead-article-source-wrapper")
					.children("table")
						.children("tbody")
							.children("tr")
								.children(".source-cell")
									.children(".al-attribution-source")
										.html();

		var headline = $(this)
				.children(".article")
					.children(".titletext")
						.html();

		chrome.runtime.sendMessage({
			"message": "get_summary", 
			"source": source, 
			"headline": headline, 
			"article_count": article_count
		});

		var $summary = $("<div class='summary summary-" + article_count + "'></div>")
		$(this).append($summary);	

		article_count ++;
	});
}