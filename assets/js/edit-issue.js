document.addEventListener("DOMContentLoaded", function() {
    // Bắt sự kiện click cho nút Save
    document.getElementById("saveButton").addEventListener("click", function() {
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

        // Chuyển hướng sang trang issues-detail
        window.location.href = "issues-detail.html";
    });
});
