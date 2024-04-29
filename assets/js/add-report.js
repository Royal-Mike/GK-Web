$(document).ready(function () {
    // Function để hiển thị form add report
    $("#add-report-btn").click(function () {
        $(".overlay").show(); // hiển thị overlay
        $(".add-report-table").show(); // hiển thị add report table
    });

    // Function để save report
    $("#save-report-btn").click(function () {
        $(".overlay, .add-report-table").hide(); // ẩn overlay và add report table
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
