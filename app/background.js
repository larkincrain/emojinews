// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when the user clicks on the browser action.

// Todo: Add logic here...


// Sample code to see how the extension interacts with the browser

chrome.browserAction.onClicked.addListener(function(tab) {
  var action_url = "javascript:window.print();";
  chrome.tabs.update(tab.id, {url: action_url});
});

var function readPageHeader ()
{

}
var function updateDictionary ()
{

}
var function emojiScore ()
{

}