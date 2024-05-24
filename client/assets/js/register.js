// Đợi cho tài liệu HTML được tải hoàn toàn

document.addEventListener('DOMContentLoaded', function() {
    var signupButton = document.querySelector('#btn-signup');

    signupButton.addEventListener('click', function() {
        var name = document.querySelector('#name').value;
        var email = document.querySelector('#email').value;
        var password = document.querySelector('#password').value;
        var confirmPassword = document.querySelector('#confirmPassword').value;

        // Kiểm tra xác nhận mật khẩu
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // Gửi yêu cầu đăng ký
        $.ajax({
            url: "/account/register",
            method: "POST",
            data: { name: name, email: email, password: password },
            success: function(response) {
                // Xử lý phản hồi từ server
                console.log(response);
                if (response.success) {
                    showToast("Create account success!!!");

                    // Nếu đăng ký thành công, lưu token vào cookie
                    document.cookie = "token=" + response.accessToken + "; path=/;";
                    // Redirect đến trang sau khi đăng ký thành công (nếu cần)
                    window.location.href = "/home";
                }
            },
            error: function(xhr, status, error) {
                console.error("Failed to register:", error);
            }
        });
    });
});




// Hàm hiển thị toast
function showToast(message) {
    // Tạo một thẻ div để chứa toast
    var toast = document.createElement('div');
    toast.classList.add('toast');
    toast.classList.add('show');
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

    // Xóa toast sau 3 giây
    setTimeout(function() {
        toast.remove();
    }, 3000);
}
