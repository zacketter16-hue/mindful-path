(function () {
  var banner = document.createElement("div");
  banner.style.position = "fixed";
  banner.style.top = "0";
  banner.style.left = "0";
  banner.style.right = "0";
  banner.style.zIndex = "999999";
  banner.style.background = "#222";
  banner.style.color = "#fff";
  banner.style.fontSize = "14px";
  banner.style.padding = "8px";
  banner.style.fontFamily = "monospace";
  banner.textContent = "Gate debug: starting...";
  document.documentElement.appendChild(banner);

  function waitForMemberstack(attempts) {
    if (window.$memberstackDom) {
      window.$memberstackDom.getCurrentMember().then(function (res) {
        var member = res && res.data;
        if (member) {
          banner.textContent = "Gate debug: logged in as " + member.id;
          return;
        }
        banner.textContent = "Gate debug: not logged in. Opening modal...";
        try {
          var modalResult = window.$memberstackDom.openModal("LOGIN");
          banner.textContent += " | openModal returned: " + typeof modalResult;
          if (modalResult && typeof modalResult.then === "function") {
            modalResult.then(function (res2) {
              banner.textContent = "Gate debug: modal closed. result=" + JSON.stringify(res2);
            }).catch(function (err) {
              banner.textContent = "Gate debug: modal ERROR: " + (err && err.message ? err.message : JSON.stringify(err));
            });
          }
        } catch (e) {
          banner.textContent = "Gate debug: openModal threw: " + e.message;
        }
      }).catch(function (err) {
        banner.textContent = "Gate debug: getCurrentMember ERROR: " + (err && err.message ? err.message : JSON.stringify(err));
      });
    } else if (attempts < 50) {
      setTimeout(function () { waitForMemberstack(attempts + 1); }, 100);
    } else {
      banner.textContent = "Gate debug: $memberstackDom never loaded after 5s.";
    }
  }

  waitForMemberstack(0);
})();
