document.addEventListener('DOMContentLoaded', function () {
    // Lắng nghe sự kiện click vào nút "Save"
    document.getElementById('btn-save-profile').addEventListener('click', function (event) {
        event.preventDefault(); 

        // Lấy giá trị từ các ô input
        var firstName = document.getElementById('first-name').value;
        var lastName = document.getElementById('last-name').value;
        var headline = document.getElementById('headline').value;
        var language = document.getElementById('language').value;
        var link = document.getElementById('link').value;

        // Cập nhật các giá trị của profile
        document.getElementById('first-name').innerText = firstName;
        document.getElementById('last-name').innerText = lastName;
        document.getElementById('headline').innerText = headline;
        document.getElementById('language').innerText = language;
        document.getElementById('link').innerText = link;

     
        showToast("Profile has been updated successfully.");

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

