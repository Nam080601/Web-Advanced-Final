window.onload = () => {
  // Login page
  if (location.pathname == "/login") {
    const loginInput = $(".validate-input .input");

    $(".login-form-btn").on("click", async function (e) {
      e.preventDefault();

      for (let i = 0; i < loginInput.length; i++) {
        if ($(loginInput[i]).val().length == 0) {
          showValidate(loginInput[i]);
          showValidate(loginInput[i + 1]);
          return;
        }
      }
      const body = {
        username: $("#username").val(),
        password: $("#password").val(),
      };
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-type": "application/json" },
      });
      const data = await response.json();
      if (data.code !== 200) {
        console.log(data.message);
      } else {
        location.replace("/");
      }
    });

    $(".validate-form .input").each(function () {
      $(this).focus(function () {
        hideValidate(this);
      });
    });

    function showValidate(loginInput) {
      const thisAlert = $(loginInput).parent();

      $(thisAlert).addClass("alert-validate");
    }

    function hideValidate(loginInput) {
      const thisAlert = $(loginInput).parent();

      $(thisAlert).removeClass("alert-validate");
    }
  }
};
