// Đợi cho tài liệu HTML được tải hoàn toàn
document.addEventListener('DOMContentLoaded', function() {
    // Chọn nút "Login"
    var loginButton = document.querySelector('#btn-login');

    // Thêm sự kiện click cho nút "Login"
    loginButton.addEventListener('click', function() {
        // Lấy thông tin đăng nhập từ các trường input
        var email = $("#email").val();
        var password = $("#password").val();
        console.log(email);
        console.log(password);

        // Gửi yêu cầu đăng nhập đến máy chủ
        $.ajax({
            url: "/account/login",
            method: "POST",
            data: { email: email, password: password },
            success: function(response) {
                // Xử lý phản hồi từ máy chủ khi đăng nhập thành công
                showToast("Login success!!!"); // Hiển thị toast "Login success!!!"
                console.log(accessToken);
                setTimeout(function() {
                    window.location.href = "/home"; // Navigate đến trang homeView.html sau 2 giây
                }, 2000);
            },
            error: function(xhr, status, error) {
                // Xử lý phản hồi từ máy chủ khi đăng nhập thất bại
                alert(xhr.responseJSON.message);
            }
        });
    });
});

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
