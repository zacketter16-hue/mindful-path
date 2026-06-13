(function () {
  function runGate() {
    window.$memberstackDom.getCurrentMember().then(function (res) {
      var member = res && res.data;
      if (!member) {
        document.documentElement.style.visibility = "hidden";
        window.$memberstackDom.openModal("LOGIN").then(function (res2) {
          var loggedInMember = res2 && res2.data;
          if (loggedInMember) {
            document.documentElement.style.visibility = "visible";
          } else {
            window.location.href = "/index.html";
          }
        });
      }
    });
  }

  function waitForMemberstack() {
    if (window.$memberstackDom) {
      runGate();
    } else {
      setTimeout(waitForMemberstack, 100);
    }
  }

  waitForMemberstack();
})();
