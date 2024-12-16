// ==UserScript==
// @name        GitHub Easy Approve
// @version     1.0.0
// @description Add an approve button next to the 'Review changes 🔽' button
// @author      carpusherw
// @match       https://github.com/*
// @require     https://code.jquery.com/jquery-3.7.1.min.js
// @require     https://gist.github.com/raw/2625891/waitForKeyElements.js
// @icon        https://github.githubassets.com/favicons/favicon.svg
// @grant       none
// ==/UserScript==

(function() {
  'use strict';

  waitForKeyElements('button#overlay-show-review-changes-modal', (reviewButton) => {
    const approveRadioButton = $('input[value="approve"]');
    const submitButtons = $('button[type="submit"]');
    let submitReviewButton;
    submitButtons.each(function() {
      if ($(this).text().includes('Submit review')) {
        submitReviewButton = this;
      }
    });

    if (reviewButton.length && approveRadioButton.length && submitReviewButton) {
      const easyApprove = $('<button>Easy Approve</button>');
      easyApprove.addClass(reviewButton.attr('class'));
      easyApprove.css('margin-left', '5px');

      easyApprove.on('click', function() {
        approveRadioButton.click();
        submitReviewButton.click();
      });

      reviewButton.parent().append(easyApprove);
    } else {
      if (!approveRadioButton.length) {
        console.error('Approve radio button not found');
      }
      if (!submitReviewButton) {
        console.error('Submit review button not found');
      }
    }
  })
})();
