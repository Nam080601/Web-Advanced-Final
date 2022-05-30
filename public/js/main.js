$(document).ready(() => {
  function showValidate(loginInput) {
    const thisAlert = $(loginInput).parent();
    $(thisAlert).addClass("alert-validate");
  }
  function hideValidate(loginInput) {
    const thisAlert = $(loginInput).parent();
    $(thisAlert).removeClass("alert-validate");
  }
  $(".input").each(function () {
    $(this).focus(function () {
      hideValidate(this);
    });
  });
  $(".input-square").each(function () {
    $(this).focus(function () {
      hideValidate(this);
    });
  });
  // Login page
  if (location.pathname == "/login") {
    const input = $(".validate-input .input");

    $("#form-login").submit(async (e) => {
      e.preventDefault();
      const username = $("#username").val();
      const password = $("#password").val();

      let invalidInput = false;

      for (let i = 0; i < input.length; i++) {
        if ($(input[i]).val().length == 0) {
          showValidate(input[i]);
          invalidInput = true;
        }
      }

      if (invalidInput) {
        return;
      }

      try {
        $(".progress-spinner").attr("style", "display: flex");
        const response = await fetch("/login", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (response.status === 200) {
          $(".progress-spinner").attr("style", "display: none");
          if (data.data.firstLogin) {
            location.href = "/change-password";
          } else {
            location.href = "/";
          }
        } else {
          Alert(data.message);
        }
      } catch (error) {
        console.log(error);
      }
    });
  }
  // Forgot password page
  if (location.pathname == "/forgot-password") {
    const input = $(".validate-input .input-square");

    $("#form-forgot").submit(async (e) => {
      e.preventDefault();
      const email = $("#email").val();

      let invalidInput = false;

      for (let i = 0; i < input.length; i++) {
        if ($(input[i]).val().length == 0) {
          showValidate(input[i]);
          invalidInput = true;
        }
      }

      if (invalidInput) {
        return;
      }

      try {
        $(".progress-spinner").attr("style", "display: flex");
        const response = await fetch("/forgot-password", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (response.status === 200) {
          Alert(data.message, "/login");
        } else {
          Alert(data.message);
        }
      } catch (error) {
        console.log(error);
      }
    });
  }
  // Register page
  if (location.pathname == "/register") {
    const input = $(".validate-input .input-square");

    $("#form-register").submit(async (e) => {
      e.preventDefault();
      const phone = $("#phone").val();
      const email = $("#email").val();
      const name = $("#name").val();
      const birthday = $("#birthday").val();
      const address = $("#address").val();
      const cmnd_front = $("#cmnd_front")[0].files[0];
      const cmnd_end = $("#cmnd_end")[0].files[0];

      let invalidInput = false;

      for (let i = 0; i < input.length; i++) {
        if ($(input[i]).val().length == 0) {
          showValidate(input[i]);
          invalidInput = true;
        }
      }

      if (invalidInput) {
        return;
      }

      const formData = new FormData();
      formData.append("phone", phone);
      formData.append("email", email);
      formData.append("name", name);
      formData.append("birthday", birthday);
      formData.append("address", address);
      formData.append("front_cmnd", cmnd_front);
      formData.append("back_cmnd", cmnd_end);

      try {
        $(".progress-spinner").attr("style", "display: flex");
        const response = await fetch("/register", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (response.status === 200) {
          Alert(data.message, "/login");
        } else {
          Alert(data.message);
        }
      } catch (error) {
        console.log(error);
      }
    });
  }
  // Change password page
  if (location.pathname == "/change-password") {
    const input = $(".validate-input .input-square");

    $("#form-change").submit(async (e) => {
      e.preventDefault();
      const oldPassword = $("#oldPassword").val() || "";
      const newPassword = $("#newPassword").val();
      const newPassword2 = $("#newPassword2").val();

      let invalidInput = false;

      for (let i = 0; i < input.length; i++) {
        if ($(input[i]).val().length == 0) {
          showValidate(input[i]);
          invalidInput = true;
        }
      }

      if (invalidInput) {
        return;
      }

      if (newPassword != newPassword2) {
        Alert("Mật khẩu không khớp");
        return;
      }

      try {
        $(".progress-spinner").attr("style", "display: flex");
        const response = await fetch("/change-password", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ oldPassword, newPassword }),
        });
        const data = await response.json();
        if (response.status === 200) {
          Alert(data.message, "/");
        } else {
          Alert(data.message);
        }
      } catch (error) {
        console.log(error);
      }
    });
  }
  // Withdraw form
  if (location.pathname == "/wallet/withdraw") {
    $("#form-withdraw").submit(async (e) => {
      e.preventDefault();
      const card_number = $("#card_number").val();
      const expiry_date = $("#expiry_date").val();
      const withdraw_money = $("#withdraw_money").val();
      const cvv = $("#cvv").val();

      try {
        const response = await fetch("/wallet/withdraw", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            card_number,
            expiry_date,
            withdraw_money,
            cvv,
          }),
        });
        const data = await response.json();
        console.log(data);
        if (data.code === 200) {
          location.href = "/wallet";
          alert(data.message);
        } else {
          $(".btn").next().remove();
          $(".btn").after(
            `<div class='alert alert-danger my-2'>${data.message}</div>`
          );
        }
      } catch (error) {
        console.log(error);
      }
    });
  }
});
function Alert(message, href = "") {
  $(".progress-spinner").attr("style", "display: none");
  $("[class^='block']").append("<div class='notification'></div>");
  $(".notification").html(message);
  setTimeout(() => {
    $(".notification").addClass("hidden");
  }, 2000);
  setTimeout(() => {
    $(".notification").remove();
    if (href) {
      location.href = href;
    }
  }, 3000);
}
