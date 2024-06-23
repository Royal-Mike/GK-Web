// Đợi cho tài liệu HTML được tải hoàn toàn
document.addEventListener('DOMContentLoaded', function() {
    var loginButton = document.querySelector('#btn-login');
    var flashMessage = getCookie('flash');
    var loginButtonClicked = getCookie('loginButtonClicked');
    var isPageReloaded = performance.navigation.type === performance.navigation.TYPE_RELOAD;

    // Check if login button was previously clicked and show toast if necessary
    if (flashMessage && loginButtonClicked === 'false' && !isPageReloaded) {
        showToast("Please log in to access this page.");
    }
    else {
        setCookie('loginButtonClicked', 'false', 1);
    }


    
    loginButton.addEventListener('click', function() {
        var email = $("#email").val();
        var password = $("#password").val();

        $.ajax({
            url: "/account/login",
            method: "POST",
            data: { email: email, password: password },
            success: function(response) {
                showToast("Login success!!!");
                
                // Kiểm tra và lấy token từ cookie
                var token = getCookie('token');
                if (!token) {
                    // Nếu không có token trong cookie, sử dụng token từ response và lưu vào cookie
                    token = response.accessToken;
                    setCookie('token', token, 1); // Sử dụng hàm setCookie để lưu token vào cookie
                }
                
                // Gửi yêu cầu đến /home chỉ khi access token đã tồn tại
                if (token) {
                    $.ajax({
                        url: "/home",
                        method: "GET",
                        headers: {
                            'Authorization': 'Bearer ' + token
                        },
                        success: function(response) {
                            console.log("Authenticated successfully on /home");
                            window.location.href = "/home";
                        },
                        error: function(xhr, status, error) {
                            console.error("Failed to authenticate on /home:", error);
                            window.location.href = "/account";
                        }
                    });
                }
            },
            error: function(xhr, status, error) {
                alert(xhr.responseJSON.message);
            }
        });
    });
});

// Hàm để lấy giá trị của cookie
function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}

// Hàm để thiết lập giá trị của cookie
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}



// Khi trang /home tải
// document.addEventListener('DOMContentLoaded', function() {
//     // Lấy token từ localStorage
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//         console.log("Token /home load: ", token);
//         // Gửi yêu cầu đến máy chủ để xác thực token
//         $.ajax({
//             url: "/home",
//             method: "GET",
//             headers: {
//                 'Authorization': 'Bearer ' + token
//             },
//             success: function(response) {
//                 console.log("Authenticated successfully on /home");
//                 // Xử lý thành công
//             },
//             error: function(xhr, status, error) {
//                 console.error("Failed to authenticate on /home:", error);
//                 // Xử lý lỗi (ví dụ: điều hướng người dùng về trang đăng nhập)
//                 window.location.href = "/account";
//             }
//         });
//     }
// });

/////////////////////////////////////// FACEBOOK ///////////////////////////////////////////////////////
// login.js
// document.getElementById('facebook-login-btn').onclick = async function() {
//     try {
//         const response = await fetch('/config');
//         const config = await response.json();

//         // Tạo một script element để tải Facebook SDK
//         const script = document.createElement('script');
//         script.src = "https://connect.facebook.net/en_US/sdk.js";
//         script.id = 'facebook-jssdk';
//         document.getElementsByTagName('head')[0].appendChild(script);

//         // Đợi cho Facebook SDK được tải và khởi tạo
//         script.onload = function() {
//             window.fbAsyncInit = function() {
//                 FB.init({
//                     appId: config.facebookAppId,
//                     xfbml: true,
//                     version: 'v20.0'
//                 });

//                 // Xử lý sự kiện đăng nhập bằng Facebook
//                 FB.login(function(response) {
//                     if (response.authResponse) {
//                         console.log('Welcome! Fetching your information.... ');
//                         FB.api('/me', { fields: 'name, email' }, function(profile) {
//                             console.log('Successful login for: ' + profile.name);
//                             // Gửi mã thông báo truy cập đến máy chủ để xác thực
//                             fetch('/auth/facebook/callback', {
//                                 method: 'POST',
//                                 headers: {
//                                     'Content-Type': 'application/json'
//                                 },
//                                 body: JSON.stringify({ accessToken: response.authResponse.accessToken })
//                             }).then(response => {
//                                 return response.json();
//                             }).then(data => {
//                                 if (data.token) {
//                                     // Lưu token vào cookie và điều hướng trang
//                                     document.cookie = `token=${data.token}; path=/`;
//                                     window.location.href = '/';
//                                 } else {
//                                     console.error('Failed to log in');
//                                 }
//                             }).catch(err => {
//                                 console.error('Error:', err);
//                             });
//                         });
//                     } else {
//                         console.log('User cancelled login or did not fully authorize.');
//                     }
//                 }, { scope: 'email' });
//             };
//         };
//     } catch (error) {
//         console.error('Error:', error);
//     }
// };

    //   (function(d, s, id) {
    //     var js, fjs = d.getElementsByTagName(s)[0];
    //     if (d.getElementById(id)) {return;}
    //     js = d.createElement(s); js.id = id;
    //     js.src = "https://connect.facebook.net/en_US/sdk.js";
    //     fjs.parentNode.insertBefore(js, fjs);
    //   }(document, 'script', 'facebook-jssdk'));

      
    //   window.fbAsyncInit = function() {
    //     FB.init({
    //       appId      : config.facebookAppId,
    //       cookie     : true,
    //       xfbml      : true,
    //       version    : 'v20.0',
          
    //     });
        

    //     FB.AppEvents.logPageView();   
  
    //     document.getElementById('facebook-login-btn').onclick = function() {
    //       FB.login(function(response) {
    //         if (response.authResponse) {
    //           console.log('Welcome! Fetching your information.... ');
    //           FB.api('/me', { fields: 'name, email' }, function(profile) {
    //             console.log('Successful login for: ' + profile.name);
    //             fetch('/auth/facebook/callback', {
    //               method: 'POST',
    //               headers: {
    //                 'Content-Type': 'application/json'
    //               },
    //               body: JSON.stringify({ accessToken: response.authResponse.accessToken })
    //             }).then(response => {
    //               return response.json();
    //             }).then(data => {
    //               if (data.token) {
    //                 document.cookie = `token=${data.token}; path=/`;
    //                 window.location.href = '/';
    //               } else {
    //                 console.error('Failed to log in');
    //               }
    //             }).catch(err => {
    //               console.error('Error:', err);
    //             });
    //           });
    //         } else {
    //           console.log('User cancelled login or did not fully authorize.');
    //         }
    //       }, { scope: 'email' });
    //     };
    //   };
  
      
    const ExcelJS = require('exceljs');

    async function importExcel() {
        const file = document.getElementById('fileExcel').files[0];
        if (file) {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.read(file);
            const worksheet = workbook.getWorksheet(1); // Lấy worksheet đầu tiên
    
            // Xử lý dữ liệu sau khi import
            const dataArray = [];
            for (const row of worksheet.eachRow()) {
                const dataRow = [];
                for (const cell of row.eachCell()) {
                    dataRow.push(cell.value);
                }
                dataArray.push(dataRow);
            }
    
            // Hiển thị dữ liệu import trên giao diện web
            // ...
        }
    }
  



// Hàm hiển thị toast
function showToast(message) {
    // Tạo một thẻ div để chứa toast
    var toast = document.createElement('div');
    toast.classList.add('toast');
    toast.classList.add('align-items-center'); // Bootstrap class
    toast.classList.add('text-white'); // Bootstrap class
    toast.classList.add('bg-primary'); // Bootstrap class
    toast.classList.add('fade'); // Bootstrap class
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');

    // Thêm nội dung của toast
    toast.innerHTML = `
        <div class="toast-body">
            ${message}
        </div>
    `;

    // Thêm toast vào body của tài liệu HTML
    document.body.appendChild(toast);

    // Kích hoạt hiệu ứng fade-in
    $(toast).toast('show');

    // Xóa toast sau 3 giây
    setTimeout(function() {
        $(toast).toast('hide'); // Ẩn toast
        setTimeout(function() {
            toast.remove(); // Xóa toast khỏi DOM
        }, 500); // Đợi 0.5 giây trước khi xóa
    }, 3000);
}
