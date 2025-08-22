// ==UserScript==
// @name        GitHub Easy Approve
// @version     2.0.1
// @description Add an approve button next to the 'Submit review 🔽' button
// @author      carpusherw
// @match       https://github.com/*
// @require     https://code.jquery.com/jquery-3.7.1.min.js
// @require     https://gist.github.com/raw/2625891/waitForKeyElements.js
// @icon        https://github.githubassets.com/favicons/favicon.svg
// @grant       none
// ==/UserScript==

(function() {
  'use strict';

  // Wait for the outer 'Submit review' button
  waitForKeyElements('button[data-size="small"]:contains("Submit review")', (reviewButton) => {
    console.log('Easy Approve script triggered')

    // Append Easy Approve button
    const easyApprove = $('<button>Easy Approve</button>');
    easyApprove
      .attr('class', reviewButton.attr('class'))
      .attr('data-variant', reviewButton.attr('data-variant'))
      .attr('data-size', reviewButton.attr('data-size'));

    easyApprove.on('click', function() {
      // Open the dialog and wait for elements
      reviewButton.click();
      waitForKeyElements('input[value="approve"]', (approveRadioButton) => {
        console.log('Submit review dialog opened');

        approveRadioButton[0].click();  // must use direct DOM click

        // must query after approve button clicked
        const submitReviewButton = $('button[data-size="medium"]:contains("Submit review")');
        if (!submitReviewButton.length) {
          console.error('Submit review button not found');
          return
        }
        submitReviewButton.click();
      })
    });
    reviewButton.after(easyApprove);
  })
})();
