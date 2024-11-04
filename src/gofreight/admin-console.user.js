// ==UserScript==
// @name        admin-console
// @version     1.0.0
// @description GoFreight Admin console helper
// @author      carpusherw
// @match       https://admin.hardcoretech.co/
// @require     https://code.jquery.com/jquery-3.7.1.min.js
// @icon        https://www.gofreight.com/wp-content/uploads/2023/10/cropped-favicon-150x150-1-32x32.png
// @grant       none
// ==/UserScript==

(function() {
  'use strict';

  let shortcuts = [
    {
      name: 'automation-stage',
      domain: 'automation-stage.core',
    },
    {
      name: 'automation-prod',
      domain: 'automation.core',
    },
  ]

  let domain = $('[name="host_domain_id"]')
  shortcuts.forEach(shortcut => {
    $('form').closest('div').append(`<div/><input type="button" id="${shortcut.name}" value="${shortcut.name}"/><div/>`);
    $(`#${shortcut.name}`).click(function() {
      domain.val(shortcut.domain);
      $('input[type="submit"]').click();
    });
  });
})();
