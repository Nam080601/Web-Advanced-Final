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
        if (data.code === 200) {
          alert(data.message);
          location.href = `/wallet/transfer/verifyOTP`;
        } else {
          $(".btn").next().remove();
          $(".btn").after(`<div class='alert alert-danger my-2'>${data.message}</div>`);
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  //verify OTP
  if (location.pathname == "/wallet/transfer/verifyOTP") {
    $("#form-transfer-OTP").submit(async (e) => {
      e.preventDefault();
      const OTP_number = $("#OTP_number").val();
      console.log(OTP_number)
  
      try {
        const response = await fetch("/wallet/transfer/verifyOTP", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ OTP_number }),
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

  //recharge form
  if (location.pathname == "/wallet/recharge") {
    $("#form-recharge").submit(async (e) => {
      e.preventDefault();
      const card_number = $("#card_number").val();
      const expiry_date = $("#expiry_date").val();
      const recharge_money = $("#recharge_money").val();
      const cvv = $("#cvv").val();

      try {
        const response = await fetch("/wallet/recharge", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            card_number,
            expiry_date,
            recharge_money,
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

  //phone cards
  if (location.pathname == "/wallet/phonecards") {
    let menhgia = $("#menhgia").val()
    let soluong = $("#soluong").val()
    let tongtien
    console.log(menhgia, soluong);
    $("#menhgia").change(()=> {
      menhgia = $("#menhgia").val()
      tongtien = menhgia * soluong
      $('#tongtien').html(tongtien)
      console.log(tongtien);
    })

    $("#soluong").change(()=> {
      soluong = $("#soluong").val()
      tongtien = menhgia * soluong
      $('#tongtien').html(tongtien)
    })

    $("#form-phonecards").submit(async (e) => {

      e.preventDefault()

      let nhacungcap = $('#nhacungcap').val()
      const response = await fetch('http://localhost:3000/wallet/phonecards', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nhacungcap, menhgia, soluong
        })
        
      }).then(res => res.json())
      .then(data => {
        
        if (data.code === 200) {
          data = data.data
          
          $('#nhacungcap_bought').html(data.nhacungcap)
          $('#menhgia_bought').html(data.menhgia)
          $('#soluong_bought').html(data.soluong)
          $('#tonggia_bought').html(data.total_monney)
          $('#danhsachthe').html(data.id_card.join("</p>------------<p>"))
          $('#buycard').modal('show')           
        } else {
          console.log(data)
          $(".btn").next().remove();
          $(".btn").after(
            `<div class='alert alert-danger my-2'>${data.message}</div>`
          );
        }
      })
    })
  }


  // back button
  $('#back').click(() => {
    history.back();
  });
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
