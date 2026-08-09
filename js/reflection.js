(function () {
  var SUPABASE_URL = "https://zoqceibrpfscjnjetpyb.supabase.co";
  var SUPABASE_KEY = "sb_publishable_vpFdsZTstcb-GoVUYqavxw_zRzuqLeh";

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
    if (!window.$memberstackDom || !window.supabase) {
      if (attempts < 50) setTimeout(function () { init(attempts + 1); }, 100);
      return;
    }

    window.$memberstackDom.getCurrentMember().then(function (res) {
      var member = res && res.data;
      if (!member) return;
      var memberId = member.id;
      var client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
        global: { headers: { "x-member-id": memberId } }
      });
      var playbook = getPlaybookSlug();

      var byModule = {};
      items.forEach(function (item) {
        var moduleEl = item.closest(".module");
        var numEl = moduleEl && moduleEl.querySelector(".module-num");
        var moduleNum = numEl ? parseInt(numEl.textContent, 10) : 0;
        byModule[moduleNum] = byModule[moduleNum] || [];
        var index = byModule[moduleNum].length;
        byModule[moduleNum].push(item);
        item.dataset.moduleNum = moduleNum;
        item.dataset.index = index;
      });

      client
        .from("reflection_responses")
        .select("module_num,question_index,answer")
        .eq("playbook", playbook)
        .then(function (result) {
          if (result.error || !result.data) return;
          result.data.forEach(function (row) {
            var item = document.querySelector(
              '.reflect-item[data-module-num="' + row.module_num + '"][data-index="' + row.question_index + '"]'
            );
            var textarea = item && item.querySelector(".reflect-answer");
            if (textarea) textarea.value = row.answer;
          });
        });

      items.forEach(function (item) {
        var textarea = item.querySelector(".reflect-answer");
        var status = item.querySelector(".reflect-status");
        var questionEl = item.querySelector(".reflect-question");
        if (!textarea || !questionEl) return;
        var questionText = questionEl.textContent.trim();

        var save = debounce(function () {
          if (status) status.textContent = "Saving…";
          client
            .from("reflection_responses")
            .upsert(
              {
                member_id: memberId,
                playbook: playbook,
                module_num: parseInt(item.dataset.moduleNum, 10),
                question_index: parseInt(item.dataset.index, 10),
                question_text: questionText,
                answer: textarea.value,
                updated_at: new Date().toISOString()
              },
              { onConflict: "member_id,playbook,module_num,question_index" }
            )
            .then(function (result) {
              if (result.error) {
                console.error("reflection save error:", result.error);
                if (status) status.textContent = "Error: " + result.error.message;
              } else if (status) {
                status.textContent = "Saved";
              }
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
