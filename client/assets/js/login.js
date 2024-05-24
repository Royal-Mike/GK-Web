// Đợi cho tài liệu HTML được tải hoàn toàn
document.addEventListener('DOMContentLoaded', function() {
    var loginButton = document.querySelector('#btn-login');

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
