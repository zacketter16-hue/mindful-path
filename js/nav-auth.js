(function () {
  // Remember which page the user was on when they clicked Log In / Join,
  // so the auth handler on index.html can send them back there afterward.
  function rememberRedirectOnAuthClick() {
    var path = window.location.pathname;
    // Don't override a target already set by the gate, and don't bother
    // recording the home page itself as a destination.
    if (/index\.html$/.test(path) || path === "/" || path === "") return;
    var selectors = [
      ".nav-auth-login",
      ".nav-auth-join",
      "#nav-login a",
      "#nav-join a"
    ];
    document.querySelectorAll(selectors.join(",")).forEach(function (link) {
      link.addEventListener("click", function () {
        sessionStorage.setItem("mfl-redirect", path + window.location.search);
      });
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", rememberRedirectOnAuthClick);
  } else {
    rememberRedirectOnAuthClick();
  }

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
      var accountLink = document.getElementById("account-link");
      var mobileAuth = document.querySelector(".nav-auth-mobile");
      if (member) {
        if (loginLi) loginLi.style.display = "none";
        if (joinLi) joinLi.style.display = "none";
        if (mobileAuth) mobileAuth.style.display = "none";
        // Members must be able to update their card or cancel without emailing
        // us. Opens Stripe's own billing portal.
        if (accountLink) {
          accountLink.style.display = "";
          accountLink.addEventListener("click", function (e) {
            e.preventDefault();
            window.$memberstackDom
              .launchStripeCustomerPortal({ returnUrl: "/index.html" })
              .catch(function () {
                window.alert(
                  "Sorry — we couldn't open the billing page just now. " +
                  "Email zack@holisticperformanceconsulting.com and we'll sort it out."
                );
              });
          });
        }
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
        if (accountLink) accountLink.style.display = "none";
      }
    });
  }
  update(0);
})();
