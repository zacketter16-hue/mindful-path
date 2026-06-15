(function () {
  function update(attempts) {
    if (!window.$memberstackDom) {
      if (attempts < 50) setTimeout(function () { update(attempts + 1); }, 100);
      return;
    }
    window.$memberstackDom.getCurrentMember().then(function (res) {
      var member = res && res.data;
      var loginLi = document.getElementById("nav-login");
      var joinLi = document.getElementById("nav-join");
      var logoutLi = document.getElementById("nav-logout");
      var mobileAuth = document.querySelector(".nav-auth-mobile");
      if (member) {
        if (loginLi) loginLi.style.display = "none";
        if (joinLi) joinLi.style.display = "none";
        if (mobileAuth) mobileAuth.style.display = "none";
        if (logoutLi) {
          logoutLi.style.display = "";
          logoutLi.addEventListener("click", function (e) {
            e.preventDefault();
            window.$memberstackDom.logout().then(function () {
              window.location.href = "/index.html";
            });
          });
        }
      } else {
        if (logoutLi) logoutLi.style.display = "none";
      }
    });
  }
  update(0);
})();
