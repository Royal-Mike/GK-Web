$(document).ready(function () {
    const linkedPopup = $('#customAddTestRun');
    const addTestRunBtn = $('#add-testrun-btn');
    const saveBtn = $('.save-btn');
    const cancelBtn = $('.cancel-btn');
    const successMessage = $('#successMessage');

    saveBtn.click(function () {
        linkedPopup.hide();
        successMessage.show(); // Hiển thị thông báo thành công
        setTimeout(function () {
            successMessage.hide(); // Ẩn thông báo sau 3 giây
        }, 3000); // 3000 milliseconds = 3 giây
    });

    cancelBtn.click(function () {
        linkedPopup.hide();
    });

    addTestRunBtn.click(function () {
        linkedPopup.show();
    });
});