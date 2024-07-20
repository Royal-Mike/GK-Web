function getProjectIdFromURL() {
    const pathArray = window.location.pathname.split('/');
    const projectId = pathArray[2];
    return projectId;
}

$(document).ready(function () {
    // Function để hiển thị form add issue
    $("#add-issue-btn").click(function () {
        $(".overlay").show(); // hiển thị overlay
        $(".add-issue-table").show(); // hiển thị add issue table
    });

    // Function để save issue
    $("#save-issue-btn").click(function () {
        $(".overlay, .add-issue-table").hide(); // ẩn overlay và add issue table
    });

    // Function để cancel add issue
    $("#cancel-issue-btn").click(function () {
        $(".overlay, .add-issue-table").hide(); // ẩn overlay và add issue table
    });
    
    // Function để đóng bảng thêm vấn đề
    $("#close-issue-btn").click(function () {
        $(".overlay, .add-issue-table").hide(); // ẩn overlay và add issue table
    });

    $('#add-issue-form').on('submit', function (e) {
        e.preventDefault(); // Prevent the default form submission

        // Collect form data
        var formData = $(this).serialize();
        var projectId = getProjectIdFromURL();
        var url = '/project/' + projectId + '/issues/create';

        // Send form data via AJAX
        $.ajax({
            type: 'POST',
            url: url,
            data: formData,
            success: function (response) {
                // Handle success response
                showToast('Issue added successfully!');
                location.reload();
            },
            error: function (error) {
                // Handle error response
                showToast('Error adding issue. Please try again.');
            }
        });
    });

    $('#cancel-issue-btn').on('click', function () {
        // Clear form fields and close the form
        $('#add-issue-form')[0].reset();
        $('.add-issue-table').hide();
    });
});


