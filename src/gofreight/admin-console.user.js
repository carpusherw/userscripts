// ==UserScript==
// @name        admin-console
// @version     1.1.1
// @description GoFreight Admin Console helper
// @author      carpusherw
// @match       https://admin.hardcoretech.co/
// @require     https://code.jquery.com/jquery-3.7.1.min.js
// @icon        https://www.gofreight.com/wp-content/uploads/2023/10/cropped-favicon-150x150-1-32x32.png
// @grant       GM.getValue
// @grant       GM.setValue
// ==/UserScript==

(async function() {
  'use strict';

  const GM_KEY_SHORTCUTS = 'admin-console-shortcuts'

  class Shortcuts {
    async load() {
      const stored = await GM.getValue(GM_KEY_SHORTCUTS, null);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('shortcuts', parsed);
        this.recent = parsed.recent;
        this.favorites = parsed.favorites;
      } else {
        this.recent = [];
        this.favorites = [];
      }
    }

    addRecent(domain) {
      if (this.favorites.includes(domain)) {
        return;
      }
      if (this.recent.includes(domain)) {
        this.recent = this.recent.filter(d => d !== domain);
      } else {
        this.recent = this.recent.slice(0, 9);
      }
      this.recent.unshift(domain);
      this.save();
    }

    addFavorite(domain) {
      this.favorites.push(domain);
      this.recent = this.recent.filter(d => d !== domain);
      this.save();
    }

    removeFavorite(domain) {
      this.favorites = this.favorites.filter(d => d !== domain);
      this.save();
    }

    save() {
      GM.setValue(GM_KEY_SHORTCUTS, JSON.stringify({
        recent: this.recent,
        favorites: this.favorites,
      }));
    }
  }

  let shortcuts = new Shortcuts();
  await shortcuts.load();

  let domain_input = $('[name="host_domain_id"]')
  let submit_button = $('input[type="submit"]')
  submit_button.on('click', function() {
    let domain = $('[name="host_domain_id"]').val();
    shortcuts.addRecent(domain);
  });

  let place_for_shortcuts = $('form').closest('div')
  place_for_shortcuts.append('<h3>Favorites</h3>');
  place_for_shortcuts.append('<div id="favorites"/>');
  place_for_shortcuts.append('<h3>Recent domains</h3>');
  place_for_shortcuts.append('<div id="recent-domains"/>');

  function loadShortcuts() {
    $('#favorites').empty();
    $('#recent-domains').empty();
    shortcuts.favorites.forEach(domain => {
      let favorite_id = `${domain}-favorite`;
      let remove_favorite_id = `${domain}-remove-favorite`;
      $('#favorites').append(`
        <div>
          <input type="button" id="${favorite_id}" value="${domain}"/>
          <input type="button" id="${remove_favorite_id}" value="❌"/>
        </div>
      `);
      $(`#${favorite_id.replace(/\./g, '\\.')}`).click(function() {
        domain_input.val(domain);
        submit_button.click();
      });
      $(`#${remove_favorite_id.replace(/\./g, '\\.')}`).click(function() {
        shortcuts.removeFavorite(domain);
        loadShortcuts();
      });
    });

    shortcuts.recent.forEach(domain => {
      let recent_id = `${domain}-recent`;
      let add_favorite_id = `${domain}-add-favorite`;
      $('#recent-domains').append(`
        <div>
          <input type="button" id="${recent_id}" value="${domain}"/>
          <input type="button" id="${add_favorite_id}" value="❤️"/>
        </div>
      `);
      $(`#${recent_id.replace(/\./g, '\\.')}`).click(function() {
        domain_input.val(domain);
        submit_button.click();
      });
      $(`#${add_favorite_id.replace(/\./g, '\\.')}`).click(function() {
        shortcuts.addFavorite(domain);
        loadShortcuts();
      });
    });
  }

  loadShortcuts();
})();
