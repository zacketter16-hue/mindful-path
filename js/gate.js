(function () {
  var cfg = window.MFL_PAYWALL || {};

  function hasActivePlan(member) {
    var connections = (member && member.planConnections) || [];
    return connections.some(function (pc) {
      return pc.planId === cfg.planId && (cfg.activeStatuses || []).indexOf(pc.status) !== -1;
    });
  }

  function redirectToJoin(reason) {
    sessionStorage.setItem("mfl-redirect", window.location.pathname);
    window.location.href = "/index.html?" + reason + "=1";
  }

  function waitForMemberstack(attempts) {
    if (window.$memberstackDom) {
      window.$memberstackDom.getCurrentMember().then(function (res) {
        var member = res && res.data;
        if (!member) {
          redirectToJoin("login");
        } else if (!hasActivePlan(member)) {
          redirectToJoin("upgrade");
        } else if (window.MFLState) {
          window.MFLState.syncToKit(member);
        }
      }).catch(function () {
        redirectToJoin("login");
      });
    } else if (attempts < 50) {
      setTimeout(function () { waitForMemberstack(attempts + 1); }, 100);
    }
  }

  waitForMemberstack(0);
})();
