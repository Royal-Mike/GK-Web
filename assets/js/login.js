// Đợi cho tài liệu HTML được tải hoàn toàn
document.addEventListener('DOMContentLoaded', function() {
    // Chọn nút "Login"
    var loginButton = document.querySelector('#btn-login');

    // Thêm sự kiện click cho nút "Login"
    loginButton.addEventListener('click', function() {
        // Hiển thị toast "Login success"
        showToast("Login success!!!");

        // Navigate đến trang homeView.html
        setTimeout(function() {
            window.location.href = "../../UserPage/homeView.html";
        }, 2000); // Chờ 2 giây trước khi navigate
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
