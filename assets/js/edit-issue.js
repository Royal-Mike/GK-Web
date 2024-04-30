document.addEventListener("DOMContentLoaded", function() {
    // Bắt sự kiện click cho nút Save
    document.getElementById("saveButton").addEventListener("click", function(event) {
        // Ngăn chặn hành động mặc định của nút Save (chuyển hướng)
        event.preventDefault();

        // Lấy giá trị từ các trường input
        var status = document.getElementById("status").value;
        var priority = document.getElementById("priority").value;
        var severity = document.getElementById("severity").value;
        var issueType = document.getElementById("issueType").value;
        var environment = document.getElementById("environment").value;
        var assignedTo = document.getElementById("assignedTo").value;

        // Kiểm tra nếu giá trị của các ô đã thay đổi
        // Nếu không thay đổi, giữ nguyên giá trị từ Local Storage
        if (status !== localStorage.getItem("status")) {
            localStorage.setItem("status", status);
        }
        if (priority !== localStorage.getItem("priority")) {
            localStorage.setItem("priority", priority);
        }
        if (severity !== localStorage.getItem("severity")) {
            localStorage.setItem("severity", severity);
        }
        if (issueType !== localStorage.getItem("issueType")) {
            localStorage.setItem("issueType", issueType);
        }
        if (environment !== localStorage.getItem("environment")) {
            localStorage.setItem("environment", environment);
        }
        if (assignedTo !== localStorage.getItem("assignedTo")) {
            localStorage.setItem("assignedTo", assignedTo);
        }
        showToast("Save successfully!!!");

        // Sau khi hiển thị toast, chuyển hướng sang trang issues-detail
        setTimeout(function() {
            window.location.href = "issues-detail.html";
        }, 500); // Chờ 3 giây trước khi chuyển hướng
    });
});

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
