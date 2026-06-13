(function () {
  function showPage() {
    document.documentElement.style.visibility = "visible";
  }

  function runGate() {
    document.documentElement.style.visibility = "hidden";

    // Failsafe: never leave the page permanently blank
    var failsafe = setTimeout(showPage, 4000);

    window.$memberstackDom.getCurrentMember().then(function (res) {
      var member = res && res.data;
      if (member) {
        clearTimeout(failsafe);
        showPage();
        return;
      }

      try {
        window.$memberstackDom.openModal("LOGIN").then(function (res2) {
          clearTimeout(failsafe);
          var loggedInMember = res2 && res2.data;
          if (loggedInMember) {
            showPage();
          } else {
            window.location.href = "/index.html";
          }
        }).catch(function () {
          clearTimeout(failsafe);
          window.location.href = "/index.html";
        });
      } catch (e) {
        clearTimeout(failsafe);
        window.location.href = "/index.html";
      }
    }).catch(function () {
      clearTimeout(failsafe);
      showPage();
    });
  }

  function waitForMemberstack(attempts) {
    if (window.$memberstackDom) {
      runGate();
    } else if (attempts < 50) {
      setTimeout(function () { waitForMemberstack(attempts + 1); }, 100);
    } else {
      showPage();
    }
  }

  waitForMemberstack(0);
})();
