// Đợi cho tài liệu HTML được tải hoàn toàn
document.addEventListener('DOMContentLoaded', function() {
    var signupButton = document.querySelector('#btn-signup');

    // Thêm sự kiện click cho nút "Login"
    signupButton.addEventListener('click', function() {
        // Hiển thị toast "Create account success!!!"
        showToast("Create account success!!!");

        // Navigate đến trang homeView.html
        setTimeout(function() {
            window.location.href ="../../UserPage/homeView.html";
        }, 2000); // Chờ 2 giây trước khi navigate
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
