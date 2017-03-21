// content.js
var article_count = 0;

var $button = 
	$("<div>" + 
		"<button data-emoji='sweaty'class='btn btn-emoji'>😅</button>" +
		"<button data-emoji='blush' class='btn btn-emoji'>😊</button>" +
		"<button data-emoji='shocky' class='btn btn-emoji'>😲</button>" +
		"</div>"
	);

var $summary =
	$("<div class=''></div>")

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
		.append($button);

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

	$summary.removeClass().addClass("summary-" + article_count);
	$(this).append($summary);	

	article_count ++;
})

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
	});	
});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	if( request.message === "clicked_browser_action" ) {
		var firstHref = $("a[href^='http']").eq(0).attr("href");

		// This line is new!
	    chrome.runtime.sendMessage({"message": "open_new_tab", "url": firstHref});
	} else if (request.message == "got_summary") {
		console.log('got a summary: ');
		console.log(request.emojiHtml);
		console.log(request.article_count);

		var emojiHtml = request.emojiHtml;

		//if (request.emojis.)

		//add the summary to the element
		$(".summary-" + request.article_count).html(emojiHtml);
	}
});