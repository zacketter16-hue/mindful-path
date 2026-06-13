document.addEventListener("DOMContentLoaded", function () {
  function runGate() {
    window.$memberstackDom.getCurrentMember().then(function (res) {
      if (!res.data) {
        window.$memberstackDom.openModal("LOGIN").then(function (res2) {
          if (!res2.data) {
            window.location.href = "/index.html";
          }
        });
      }
    });
  }

  if (window.$memberstackDom) {
    runGate();
  } else {
    document.addEventListener("memberstack.ready", runGate);
  }
});
