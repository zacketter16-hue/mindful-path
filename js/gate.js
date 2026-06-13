(function () {
  function runGate() {
    window.$memberstackDom
      .getCurrentMember()
      .then(function (res) {
        if (!res || !res.data) {
          var link = document.createElement("a");
          link.href = "#";
          link.setAttribute("data-ms-modal", "LOGIN");
          link.style.display = "none";
          document.body.appendChild(link);
          link.click();
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
