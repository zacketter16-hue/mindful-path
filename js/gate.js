document.addEventListener("memberstack.ready", function () {
  window.memberstack.getCurrentMember().then(function (res) {
    if (!res.data) {
      window.memberstack.openModal("LOGIN").then(function (res2) {
        if (!res2.data) {
          window.location.href = "/index.html";
        }
      });
    }
  });
});
