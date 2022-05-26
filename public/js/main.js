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
        const response = await fetch("/login", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (response.status === 200) {
          if (data.firstLogin) {
            location.href = "/change-password";
          } else {
            location.href = "/";
          }
        } else {
          $("[class^='block']").append("<div class='notification'></div>");
          $(".notification").html(data.message);
          setTimeout(() => {
            $(".notification").addClass("hidden");
          }, 2000);
          setTimeout(() => {
            $(".notification").remove();
          }, 3000);
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
        const response = await fetch("/forgot-password", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (response.status === 200) {
          if (data.firstLogin) {
            location.href = "/change-password";
          } else {
            location.href = "/";
          }
        } else {
          $("[class^='block']").append("<div class='notification'></div>");
          $(".notification").html(data.message);
          setTimeout(() => {
            $(".notification").addClass("hidden");
          }, 2000);
          setTimeout(() => {
            $(".notification").remove();
          }, 3000);
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
        const response = await fetch("/register", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (data.code === 200) {
          if (data.firstLogin) {
            location.href = "/change-password";
          } else {
            location.href = "/";
          }
        } else {
          $("[class^='block']").append("<div class='notification'></div>");
          $(".notification").html(data.message);
          setTimeout(() => {
            $(".notification").addClass("hidden");
          }, 2000);
          setTimeout(() => {
            $(".notification").remove();
          }, 3000);
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
  
  //transfer form
  if (location.pathname == "/wallet/transfer") {
    $("#form-transfer").submit(async (e) => {
      e.preventDefault();
      const phone_number = $("#phone_number").val();
      const message = $("#message").val();
      const transfer_money = $("#transfer_money").val();
      const fee_payer = $("#fee_payer").val();
  
      try {
        const response = await fetch("/wallet/transfer", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ phone_number, transfer_money, message, fee_payer }),
        });
        const data = await response.json();
        console.log(data);
        if (data.code === 200) {
          location.href = "/wallet";
          alert(data.message);
        } else {
          $(".btn").next().remove();
          $(".btn").after(`<div class='alert alert-danger my-2'>${data.message}</div>`);
        }
      } catch (error) {
        console.log(error);
      }
    });
  }


  // back button
  $('#back').click(() => {
    history.back();
  });
});
