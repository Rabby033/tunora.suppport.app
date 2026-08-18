/* ==========================================================================
   Tunora Support — main.js
   Lightweight progressive enhancement: config links, mobile nav, search,
   contact form (mailto fallback). No dependencies.
   ========================================================================== */
(function () {
  "use strict";

  var cfg = window.TUNORA_CONFIG || {};

  /* -------------------------------------------------------------------
     1. Apply configurable links (email / privacy / terms / subscriptions)
     HTML ships with default hrefs, so this only overrides when needed.
  ------------------------------------------------------------------- */
  function applyConfig() {
    if (cfg.supportEmail) {
      var mail = "mailto:" + cfg.supportEmail;
      document.querySelectorAll("[data-support-email]").forEach(function (el) {
        el.setAttribute("href", mail);
        if (el.hasAttribute("data-support-email-text")) {
          el.textContent = cfg.supportEmail;
        }
      });
    }
    if (cfg.privacyUrl) {
      document.querySelectorAll("[data-privacy-link]").forEach(function (el) {
        el.setAttribute("href", cfg.privacyUrl);
      });
    }
    if (cfg.termsUrl) {
      document.querySelectorAll("[data-terms-link]").forEach(function (el) {
        el.setAttribute("href", cfg.termsUrl);
      });
    }
    if (cfg.manageSubscriptionsUrl) {
      document.querySelectorAll("[data-manage-subs]").forEach(function (el) {
        el.setAttribute("href", cfg.manageSubscriptionsUrl);
      });
    }
    // Current year for footer
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* -------------------------------------------------------------------
     2. Mobile navigation toggle
  ------------------------------------------------------------------- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("primary-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // Close menu when a link is tapped or on Escape.
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* -------------------------------------------------------------------
     3. Client-side search / filtering
     Any input[data-search] filters elements matching data-search-item
     inside the container named by data-search-target. Shows an empty state
     element with data-search-empty when nothing matches.
  ------------------------------------------------------------------- */
  function normalize(s) {
    return (s || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function initSearch() {
    document.querySelectorAll("[data-search]").forEach(function (input) {
      var targetSel = input.getAttribute("data-search-target");
      var target = targetSel ? document.querySelector(targetSel) : document;
      if (!target) return;

      var items = target.querySelectorAll("[data-search-item]");
      var emptySel = input.getAttribute("data-search-empty");
      var emptyEl = emptySel ? document.querySelector(emptySel) : null;

      function run() {
        var q = normalize(input.value);
        var shown = 0;
        items.forEach(function (item) {
          var hay = normalize(
            item.getAttribute("data-keywords") + " " + item.textContent
          );
          var match = q === "" || hay.indexOf(q) !== -1;
          item.classList.toggle("is-hidden", !match);
          if (match) shown++;
        });
        // Hide group headings that have no visible items (help page groups).
        target.querySelectorAll("[data-search-group]").forEach(function (grp) {
          var vis = grp.querySelectorAll(
            "[data-search-item]:not(.is-hidden)"
          ).length;
          grp.classList.toggle("is-hidden", vis === 0);
        });
        if (emptyEl) {
          emptyEl.style.display = shown === 0 ? "block" : "none";
        }
      }

      input.addEventListener("input", run);
      // Prevent full-page reload if wrapped in a form.
      var form = input.closest("form");
      if (form) {
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          run();
        });
      }
    });
  }

  /* -------------------------------------------------------------------
     3b. Search suggestions dropdown (used by the home hero search).
     Filters a small in-page index and shows matching answers as you type.
  ------------------------------------------------------------------- */
  var SEARCH_INDEX = [
    // Playback
    { t: "Starting playback", u: "help.html#playback", c: "Playback" },
    { t: "Using the play queue", u: "help.html#playback", c: "Playback" },
    { t: "Shuffle and Repeat", u: "help.html#playback", c: "Playback" },
    { t: "Seeking and skipping tracks", u: "help.html#playback", c: "Playback" },
    { t: "How does the Sleep Timer work?", u: "help.html#faq-sleep-timer", c: "Playback" },
    { t: "Gapless Playback", u: "help.html#playback", c: "Playback" },
    { t: "Lock Screen & Control Center", u: "help.html#playback", c: "Playback" },
    { t: "How do I use the Equalizer?", u: "help.html#faq-equalizer", c: "Playback" },
    // Search & Discovery
    { t: "Searching for songs", u: "help.html#search", c: "Search" },
    { t: "Searching for artists", u: "help.html#search", c: "Search" },
    { t: "Search filters", u: "help.html#search", c: "Search" },
    { t: "Why can't I find a particular song?", u: "help.html#faq-missing-song", c: "Search" },
    { t: "Streaming availability", u: "help.html#search", c: "Search" },
    // Library
    { t: "How do I import music into Tunora?", u: "help.html#faq-import-files", c: "Library" },
    { t: "Apple Music import", u: "help.html#library", c: "Library" },
    { t: "How do I transfer music using Wi-Fi?", u: "help.html#faq-wifi", c: "Library" },
    { t: "Local & offline playback", u: "help.html#library", c: "Library" },
    { t: "Artwork for imported songs", u: "help.html#library", c: "Library" },
    { t: "Recently Played", u: "help.html#library", c: "Library" },
    { t: "Storage usage", u: "help.html#library", c: "Library" },
    // Playlists & Favorites
    { t: "How do I create a playlist?", u: "help.html#faq-create-playlist", c: "Playlists" },
    { t: "Editing a playlist", u: "help.html#playlists", c: "Playlists" },
    { t: "Custom playlist covers", u: "help.html#playlists", c: "Playlists" },
    { t: "Saving remote playlists", u: "help.html#playlists", c: "Playlists" },
    { t: "Favorites & personalization", u: "help.html#playlists", c: "Playlists" },
    // Premium
    { t: "What is Tunora Pro?", u: "premium.html", c: "Premium" },
    { t: "What features are premium?", u: "help.html#premium", c: "Premium" },
    { t: "How subscriptions work", u: "premium.html#how-it-works", c: "Premium" },
    { t: "How do I manage my Tunora Pro subscription?", u: "premium.html#manage", c: "Premium" },
    { t: "Canceling your subscription", u: "premium.html#cancel", c: "Premium" },
    { t: "How do I restore my purchase?", u: "premium.html#restore", c: "Premium" },
    { t: "Subscription not recognized", u: "premium.html#not-recognized", c: "Premium" },
    // Settings
    { t: "Region", u: "help.html#settings", c: "Settings" },
    { t: "Audio settings", u: "help.html#settings", c: "Settings" },
    { t: "Appearance", u: "help.html#settings", c: "Settings" },
    { t: "Backup & Restore settings", u: "help.html#settings", c: "Settings" },
    { t: "Connectivity issues", u: "help.html#settings", c: "Settings" },
    // Troubleshooting
    { t: "Why isn't a song playing?", u: "troubleshooting.html#music-not-playing", c: "Troubleshooting" },
    { t: "Search isn't returning results", u: "troubleshooting.html#search-no-results", c: "Troubleshooting" },
    { t: "Local music isn't appearing", u: "troubleshooting.html#local-music-missing", c: "Troubleshooting" },
    { t: "Wi-Fi transfer isn't working", u: "troubleshooting.html#wifi-transfer", c: "Troubleshooting" },
    { t: "Equalizer isn't working", u: "troubleshooting.html#equalizer-issue", c: "Troubleshooting" },
    { t: "Premium feature isn't unlocked", u: "troubleshooting.html#premium-not-unlocked", c: "Troubleshooting" },
    { t: "Purchase completed but Tunora Pro isn't active", u: "troubleshooting.html#pro-not-active", c: "Troubleshooting" },
    { t: "App isn't detecting my music", u: "troubleshooting.html#not-detecting-music", c: "Troubleshooting" },
    { t: "Why is streaming unavailable?", u: "troubleshooting.html#streaming-unavailable", c: "Troubleshooting" },
    // Pages
    { t: "Contact Tunora Support", u: "contact.html", c: "Contact" },
    { t: "Music & Content", u: "music-content.html", c: "Content" }
  ];

  function initSuggest() {
    var input = document.querySelector("[data-search-suggest]");
    if (!input) return;
    var panelId = input.getAttribute("data-search-results");
    var panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) return;

    var results = [];
    var active = -1;

    function esc(str) {
      return str.replace(/[&<>"]/g, function (ch) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch];
      });
    }

    function score(item, tokens) {
      var hay = normalize(item.t + " " + item.c);
      for (var i = 0; i < tokens.length; i++) {
        if (hay.indexOf(tokens[i]) === -1) return false;
      }
      return true;
    }

    function render() {
      var q = normalize(input.value);
      active = -1;
      if (q === "") {
        close();
        return;
      }
      var tokens = q.split(" ");
      results = SEARCH_INDEX.filter(function (it) {
        return score(it, tokens);
      }).slice(0, 8);

      if (results.length === 0) {
        panel.innerHTML =
          '<p class="no-res">No matching answers. <a href="contact.html">Contact support</a> and we\'ll help.</p>';
      } else {
        panel.innerHTML = results
          .map(function (it, i) {
            return (
              '<a role="option" id="sr-' + i + '" href="' + it.u + '">' +
              '<span>' + esc(it.t) + "</span>" +
              '<span class="tag">' + esc(it.c) + "</span>" +
              "</a>"
            );
          })
          .join("");
      }
      panel.hidden = false;
      input.setAttribute("aria-expanded", "true");
    }

    function close() {
      panel.hidden = true;
      panel.innerHTML = "";
      input.setAttribute("aria-expanded", "false");
      active = -1;
    }

    function setActive(idx) {
      var links = panel.querySelectorAll("a");
      if (!links.length) return;
      active = (idx + links.length) % links.length;
      links.forEach(function (l, i) {
        l.classList.toggle("is-active", i === active);
      });
      links[active].scrollIntoView({ block: "nearest" });
    }

    input.addEventListener("input", render);
    input.addEventListener("focus", function () {
      if (input.value.trim() !== "") render();
    });

    input.addEventListener("keydown", function (e) {
      var links = panel.hidden ? [] : panel.querySelectorAll("a");
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (links.length) setActive(active + 1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (links.length) setActive(active - 1);
      } else if (e.key === "Enter") {
        if (!panel.hidden && links.length) {
          e.preventDefault();
          (links[active] || links[0]).click();
        }
      } else if (e.key === "Escape") {
        close();
      }
    });

    document.addEventListener("click", function (e) {
      if (!panel.contains(e.target) && e.target !== input) close();
    });
  }

  /* -------------------------------------------------------------------
     4. Contact form -> builds a mailto: so email support always works,
     even without a backend. Falls back gracefully.
  ------------------------------------------------------------------- */
  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    var status = document.getElementById("form-status");
    var email = cfg.supportEmail || "tunora.support@gmail.com";

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name = (data.get("name") || "").toString().trim();
      var from = (data.get("email") || "").toString().trim();
      var category = (data.get("category") || "").toString().trim();
      var iosVersion = (data.get("ios") || "").toString().trim();
      var appVersion = (data.get("appVersion") || "").toString().trim();
      var description = (data.get("description") || "").toString().trim();

      var subject = "Tunora Support" + (category ? " — " + category : "");
      var lines = [
        description,
        "",
        "———",
        name ? "Name: " + name : "",
        from ? "Reply-to: " + from : "",
        category ? "Category: " + category : "",
        iosVersion ? "iOS version: " + iosVersion : "",
        appVersion ? "Tunora version: " + appVersion : ""
      ].filter(Boolean);

      var href =
        "mailto:" +
        email +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(lines.join("\n"));

      window.location.href = href;

      if (status) {
        status.textContent =
          "Opening your email app… If nothing happens, email us directly at " +
          email +
          ".";
      }
    });
  }

  /* -------------------------------------------------------------------
     5. Open a <details> FAQ when it is targeted by the URL hash, so deep
     links from Popular Questions land on the answer already expanded.
  ------------------------------------------------------------------- */
  function openFromHash() {
    var hash = window.location.hash;
    if (!hash || hash.length < 2) return;
    var el;
    try {
      el = document.querySelector(hash);
    } catch (err) {
      return;
    }
    if (!el) return;
    var details = el.closest ? el.closest("details") : null;
    if (el.tagName === "DETAILS") details = el;
    if (details) {
      details.open = true;
      window.setTimeout(function () {
        details.scrollIntoView({ block: "start", behavior: "smooth" });
      }, 60);
    }
  }

  /* ------------------------------------------------------------------- */
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    applyConfig();
    initNav();
    initSearch();
    initSuggest();
    initContactForm();
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
  });
})();
