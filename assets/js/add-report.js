$(document).ready(function () {
    // Function để hiển thị form add report
    $("#add-report-btn").click(function () {
        $(".overlay").show(); // hiển thị overlay
        $(".add-report-table").show(); // hiển thị add report table
    });

    // Function để save report
    $("#save-report-btn").click(function () {
        $(".overlay, .add-report-table").hide(); // ẩn overlay và add report table
        showToast("Save successfully!!!");
    });

    // Function để cancel add report
    $("#cancel-report-btn").click(function () {
        $(".overlay, .add-report-table").hide(); // ẩn overlay và add report table
    });
    
    // Function để đóng bảng thêm report
    $("#close-report-btn").click(function () {
        $(".overlay, .add-report-table").hide(); // ẩn overlay và add report table
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

