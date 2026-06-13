(function () {
  function waitForMemberstack(attempts) {
    if (window.$memberstackDom) {
      window.$memberstackDom.getCurrentMember().then(function (res) {
        var member = res && res.data;
        if (!member) {
          sessionStorage.setItem("mfl-redirect", window.location.pathname);
          window.location.href = "/index.html?login=1";
        }
      }).catch(function () {
        sessionStorage.setItem("mfl-redirect", window.location.pathname);
        window.location.href = "/index.html?login=1";
      });
    } else if (attempts < 50) {
      setTimeout(function () { waitForMemberstack(attempts + 1); }, 100);
    }
  }

  waitForMemberstack(0);
})();
