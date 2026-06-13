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
      banner.textContent = "Gate debug: $memberstackDom found. Checking member...";
      window.$memberstackDom.getCurrentMember().then(function (res) {
        var member = res && res.data;
        banner.textContent = "Gate debug: getCurrentMember resolved. member=" + JSON.stringify(member);
      }).catch(function (err) {
        banner.textContent = "Gate debug: getCurrentMember ERROR: " + (err && err.message ? err.message : JSON.stringify(err));
      });
    } else if (attempts < 50) {
      banner.textContent = "Gate debug: waiting for $memberstackDom... attempt " + attempts;
      setTimeout(function () { waitForMemberstack(attempts + 1); }, 100);
    } else {
      banner.textContent = "Gate debug: $memberstackDom never loaded after 5s.";
    }
  }

  waitForMemberstack(0);
})();
