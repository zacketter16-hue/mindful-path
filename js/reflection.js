/*
 * Playbook reflections, stored in the member's own Memberstack member JSON.
 *
 * These used to live in a Supabase table that was read with a public key and
 * no per-member filter, so opening a playbook fetched every member's answers
 * for it. Member JSON is scoped to the signed-in member by Memberstack, so a
 * member can only ever read or write their own.
 *
 * Shape:  state.reflections["anxiety"]["2-0"] = "their answer text"
 *                           ^playbook  ^module number + position in module
 */
(function () {
  function getPlaybookSlug() {
    var match = window.location.pathname.match(/\/([^\/]+)\.html$/);
    return match ? match[1] : "unknown";
  }

  function debounce(fn, wait) {
    var t;
    return function () {
      var args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, wait);
    };
  }

  function init(attempts) {
    var items = document.querySelectorAll(".reflect-item");
    if (!items.length) return;
    if (!window.$memberstackDom || !window.MFLState) {
      if (attempts < 50) setTimeout(function () { init(attempts + 1); }, 100);
      return;
    }

    window.$memberstackDom.getCurrentMember().then(function (res) {
      var member = res && res.data;
      if (!member) return;
      var playbook = getPlaybookSlug();

      // Give every box a stable key: its module number plus its position
      // within that module, so answers reattach on the next visit.
      var byModule = {};
      items.forEach(function (item) {
        var moduleEl = item.closest(".module");
        var numEl = moduleEl && moduleEl.querySelector(".module-num");
        var moduleNum = numEl ? parseInt(numEl.textContent, 10) : 0;
        byModule[moduleNum] = byModule[moduleNum] || [];
        item.dataset.moduleNum = moduleNum;
        item.dataset.index = byModule[moduleNum].length;
        byModule[moduleNum].push(item);
      });

      // Prefill with whatever this member saved previously.
      window.MFLState.get().then(function (state) {
        var saved = (state.reflections && state.reflections[playbook]) || {};
        items.forEach(function (item) {
          var textarea = item.querySelector(".reflect-answer");
          var key = item.dataset.moduleNum + "-" + item.dataset.index;
          if (textarea && typeof saved[key] === "string") textarea.value = saved[key];
        });
      });

      // Saves run one after another rather than in parallel. Each re-reads the
      // member's state first, so answering two boxes in quick succession can't
      // have one write overwrite the other.
      var queue = Promise.resolve();

      items.forEach(function (item) {
        var textarea = item.querySelector(".reflect-answer");
        var status = item.querySelector(".reflect-status");
        if (!textarea) return;
        var key = item.dataset.moduleNum + "-" + item.dataset.index;

        var save = debounce(function () {
          var value = textarea.value;
          if (status) status.textContent = "Saving…";
          queue = queue
            .then(function () { return window.MFLState.get(); })
            .then(function (state) {
              var all = state.reflections || {};
              var book = all[playbook] || {};
              // Drop cleared boxes rather than storing empty strings.
              if (value.trim()) { book[key] = value; } else { delete book[key]; }
              all[playbook] = book;
              return window.MFLState.merge({ reflections: all });
            })
            .then(function (result) {
              if (status) {
                status.textContent = result ? "Saved" : "Not saved — check your connection";
              }
            })
            .catch(function () {
              if (status) status.textContent = "Not saved — check your connection";
            });
        }, 800);

        textarea.addEventListener("input", save);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { init(0); });
  } else {
    init(0);
  }
})();
