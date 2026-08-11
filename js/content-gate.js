(function () {
  var cfg = window.MFL_PAYWALL || {};

  function hasActivePlan(member) {
    var connections = (member && member.planConnections) || [];
    return connections.some(function (pc) {
      return pc.planId === cfg.planId && (cfg.activeStatuses || []).indexOf(pc.status) !== -1;
    });
  }

  function reveal(member) {
    var unlocked = hasActivePlan(member);
    document.querySelectorAll("[data-gated]").forEach(function (el) {
      el.style.display = unlocked ? "" : "none";
    });
    document.querySelectorAll("[data-gated-prompt]").forEach(function (el) {
      el.style.display = unlocked ? "none" : "";
    });
  }

  function waitForMemberstack(attempts) {
    if (window.$memberstackDom) {
      window.$memberstackDom.getCurrentMember().then(function (res) {
        reveal(res && res.data);
      }).catch(function () {
        reveal(null);
      });
    } else if (attempts < 50) {
      setTimeout(function () { waitForMemberstack(attempts + 1); }, 100);
    }
  }

  waitForMemberstack(0);
})();
