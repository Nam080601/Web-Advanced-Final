$(document).ready(async () => {
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
  // Reset password page
  if (location.pathname.match(/\/reset-password\/*/g)) {
    const input = $(".validate-input .input-square");

    $("#form-reset").submit(async (e) => {
      e.preventDefault();
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
        const response = await fetch(location.pathname, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ newPassword }),
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
  // Home page
  if (location.pathname == "/") {
    $(".function#home").attr(
      "style",
      "background-color: rgba(255, 255, 255, 0.3)"
    );
    // Form nap tien
    $("#form-nap-tien").submit(async (e) => {
      e.preventDefault();
      const body = {
        card_number: $("#card-number").val(),
        exp_date: $("#exp-date").val(),
        cvv: $("#cvv").val(),
        amount: $("#amount").val(),
      };
      const depositResponse = await fetch("/wallet/deposit", {
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(body),
      });
      const data = await depositResponse.json();
      if (depositResponse.status == 200) {
        $("#card-number").val("");
        $("#exp-date").val("");
        $("#cvv").val("");
        $("#amount").val("");
        $(".current-money").html(
          MoneyDigit(
            Number.parseInt(
              GetCurrentMoney($(".current-money").html().trim())
            ) + Number.parseInt(body.amount)
          )
        );
        Alert(data.message);
      } else {
        $("#card-number").val("");
        $("#exp-date").val("");
        $("#cvv").val("");
        $("#amount").val("");
        Alert(data.message);
      }
    });
    // Form rut tien
    $("#form-rut-tien").submit(async (e) => {
      e.preventDefault();
      const body = {
        card_number: $("#w-card-number").val(),
        exp_date: $("#w-exp-date").val(),
        cvv: $("#w-cvv").val(),
        amount: $("#w-amount").val(),
        message: $("#w-message").val(),
      };
      const withdrawResponse = await fetch("/wallet/withdraw", {
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(body),
      });
      const data = await withdrawResponse.json();
      if (withdrawResponse.status == 200) {
        const isPending =
          data.message == "Thực hiện thành công, chờ admin xác minh";
        $("#w-card-number").val("");
        $("#w-exp-date").val("");
        $("#w-cvv").val("");
        $("#w-amount").val("");
        $("#w-message").val("");
        $(".current-money").html(
          MoneyDigit(
            Number.parseInt(
              GetCurrentMoney($(".current-money").html().trim())
            ) - (isPending ? 0 : Number.parseInt(body.amount))
          )
        );
        Alert(data.message);
      } else {
        $("#w-card-number").val("");
        $("#w-exp-date").val("");
        $("#w-cvv").val("");
        $("#w-amount").val("");
        $("#w-message").val("");
        Alert(data.message);
      }
    });
    let tmp_amount = 0;
    // Form chuyen tien
    $("#form-chuyen-tien").submit(async (e) => {
      e.preventDefault();
      const body = {
        phone_number: $("#t-phone-number").val(),
        amount: $("#t-amount").val(),
        message: $("#t-message").val(),
        fee: $("#t-fee").find(":selected").val(),
      };
      tmp_amount = body.amount;
      const withdrawResponse = await fetch("/wallet/transfer", {
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(body),
      });
      const data = await withdrawResponse.json();
      if (withdrawResponse.status == 200) {
        $("#btn-otp").click();
      }
      $("#t-phone-number").val("");
      $("#t-amount").val("");
      $("#t-message").val("");
      $("#t-fee").val("");
      Alert(data.message);
    });
    // Form OTP
    $("#form-otp").submit(async (e) => {
      e.preventDefault();
      const body = {
        OTP: $("#otp").val(),
      };
      const withdrawResponse = await fetch("/wallet/otp", {
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(body),
      });
      const data = await withdrawResponse.json();
      if (withdrawResponse.status == 200) {
        const isPending =
          data.message == "Giao dịch thành công, chờ admin xử lý";
        $("#otp").val("");
        $(".current-money").html(
          MoneyDigit(
            Number.parseInt(
              GetCurrentMoney($(".current-money").html().trim())
            ) - (isPending ? 0 : Number.parseInt(tmp_amount))
          )
        );
        Alert(data.message);
      } else {
        $("#otp").val("");
        Alert(data.message);
      }
    });
    // Form Mua The
    $("#form-mua-the").submit(async (e) => {
      e.preventDefault();
      const body = {
        nhacungcap: $("#nhacungcap").find(":selected").val(),
        menhgia: $("#menhgia").find(":selected").val(),
        soluong: $("#soluong").find(":selected").val(),
      };
      const withdrawResponse = await fetch("/wallet/phonecards", {
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(body),
      });
      const data = await withdrawResponse.json();
      if (withdrawResponse.status == 200) {
        $("#nhacungcap").val("");
        $("#menhgia").val("");
        $("#soluong").val("");
        $(".current-money").html(
          MoneyDigit(
            Number.parseInt(
              GetCurrentMoney($(".current-money").html().trim())
            ) - Number.parseInt(body.menhgia * body.soluong)
          )
        );
        $(".card-data").append(`
          <div class="px-5 py-3">
            <div class="d-flex">
              <div class="py-3 col-4">Nhà cung cấp:</div>
              <div class="py-3 col-8">${data.data.nhacungcap}</div>
            </div>
            <div class="d-flex">
              <div class="py-3 col-4">Mệnh giá:</div>
              <div class="py-3 col-8">${data.data.menhgia}</div>
            </div>
            <div class="d-flex">
              <div class="py-3 col-4">Số lượng:</div>
              <div class="py-3 col-8">${data.data.soluong}</div>
            </div>
            <div class="d-flex">
              <div class="py-3 col-4">Tổng tiền:</div>
              <div class="py-3 col-8">${data.data.total_monney}</div>
            </div>
            <div class="d-flex">
              <div class="py-3 col-4">Mã thẻ:</div>
              <div class="py-3 col-8">${data.data.id_card}</div>
            </div>
          </div>
        `);
        $("#card-detail").click();
        Alert(data.message);
      } else {
        $("#nhacungcap").val("");
        $("#menhgia").val("");
        $("#soluong").val("");
        Alert(data.message);
      }
    });
  }
  // History page
  if (location.pathname == "/history") {
    $(".function#history").attr(
      "style",
      "background-color: rgba(255, 255, 255, 0.3)"
    );
    $(".history-data").click(function (e) {
      e.preventDefault();
      $("#history-detail").click();
      const data = {
        type: {
          name: "Loại GD",
          data: $(this).children(".type").html().trim(),
        },
        money: {
          name: "Số tiền",
          data: $(this).children(".money").html().trim(),
        },
        message: {
          name: "Ghi chú",
          data: $(this).children(".message").html().trim(),
        },
        time: {
          name: "Thời gian",
          data: $(this).children(".time").html().trim(),
        },
        status: {
          name: "Trạng thái",
          data: $(this).children(".status").html().trim(),
        },
      };
      $(".history-detail-data").append(`
      <div class="px-5 py-3">
        <div class="d-flex">
          <div class="py-3 col-4">${data.type.name}:</div>
          <div class="py-3 col-8">${data.type.data}</div>
        </div>
        <div class="d-flex">
          <div class="py-3 col-4">${data.money.name}:</div>
          <div class="py-3 col-8">${data.money.data}</div>
        </div>
        <div class="d-flex">
          <div class="py-3 col-4">${data.message.name}:</div>
          <div class="py-3 col-8">${data.message.data}</div>
        </div>
        <div class="d-flex">
          <div class="py-3 col-4">${data.time.name}:</div>
          <div class="py-3 col-8">${data.time.data}</div>
        </div>
        <div class="d-flex">
          <div class="py-3 col-4">${data.status.name}:</div>
          <div class="py-3 col-8">${data.status.data}</div>
        </div>
      </div>
      `);
    });
  }
  // Account page
  if (location.pathname == "/account") {
    $(".function#account").attr(
      "style",
      "background-color: rgba(255, 255, 255, 0.3)"
    );
  }
  //phone cards
  if (location.pathname == "/wallet/phonecards") {
    let menhgia = $("#menhgia").val();
    let soluong = $("#soluong").val();
    let tongtien;
    console.log(menhgia, soluong);
    $("#menhgia").change(() => {
      menhgia = $("#menhgia").val();
      tongtien = menhgia * soluong;
      $("#tongtien").html(tongtien);
      console.log(tongtien);
    });

    $("#soluong").change(() => {
      soluong = $("#soluong").val();
      tongtien = menhgia * soluong;
      $("#tongtien").html(tongtien);
    });

    $("#form-phonecards").submit(async (e) => {
      e.preventDefault();

      let nhacungcap = $("#nhacungcap").val();
      const response = await fetch("http://localhost:3000/wallet/phonecards", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nhacungcap,
          menhgia,
          soluong,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code === 200) {
            data = data.data;

            $("#nhacungcap_bought").html(data.nhacungcap);
            $("#menhgia_bought").html(data.menhgia);
            $("#soluong_bought").html(data.soluong);
            $("#tonggia_bought").html(data.total_monney);
            $("#danhsachthe").html(data.id_card.join("</p>------------<p>"));
            $("#buycard").modal("show");
          } else {
            console.log(data);
            $(".btn").next().remove();
            $(".btn").after(
              `<div class='alert alert-danger my-2'>${data.message}</div>`
            );
          }
        });
    });
  }

  // back button
  $("#back").click(function () {
    if ($(this).hasClass("first")) {
      location.href = "/logout";
    } else {
      history.back();
    }
  });
  // Wallet Function
  $(".function").click(function (e) {
    $(".function").attr("style", "background-color: none");
    $(this).attr("style", "background-color: rgba(255, 255, 255, 0.3)");
    location.href = $(this).attr("href");
  });
});
function Alert(message, href = "") {
  $(".progress-spinner").attr("style", "display: none");
  $("[class^='block'].show-alert").append("<div class='notification'></div>");
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
function MoneyDigit(money) {
  return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
function GetCurrentMoney(money) {
  return money.toString().replaceAll(".", "");
}
