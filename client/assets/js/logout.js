document.addEventListener('DOMContentLoaded', function() {
    var logoutButton = document.querySelector('#btn-logout');

    logoutButton.addEventListener('click', function() {
        $.ajax({
            url: "/logout",
            method: "GET",
            success: function() {
                window.location.href = "/account";
            },
            error: function(xhr, status, error) {
                console.error("Failed to logout:", error);
            }
        });
    });
});
