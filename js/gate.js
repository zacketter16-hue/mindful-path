(function () {
  function runGate() {
    window.$memberstackDom
      .getCurrentMember()
      .then(function (res) {
        if (!res || !res.data) {
          try {
            window.$memberstackDom.openModal("LOGIN").then(function (res2) {
              if (!res2 || !res2.data) {
                window.location.href = "/index.html";
              }
            }).catch(function () {
              window.location.href = "/index.html";
            });
          } catch (e) {
            window.location.href = "/index.html";
          }
        }
      })
      .catch(function () {
        window.location.href = "/index.html";
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
