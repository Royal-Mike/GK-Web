document.addEventListener('DOMContentLoaded', function () {
    const projectList = document.getElementById('project-list');

    projectList.addEventListener('click', function (event) {
        const deleteButton = event.target.closest('.delete-project');
        const projectLink = event.target.closest('.nav-link');

        if (deleteButton) {
            // Handle delete button click
            event.preventDefault();
            event.stopPropagation();

            const projectItem = deleteButton.closest('.project-item');
            const projectId = projectItem.querySelector('.key').innerText;

            if (confirm('Are you sure you want to delete this project?')) {
                // AJAX request to delete the project
                const xhr = new XMLHttpRequest();
                xhr.open('DELETE', '/project/delete');
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status === 200) {
                            console.log('Project deleted successfully');

                            projectItem.remove();
                            location.reload();
                        } else {
                            console.error('Failed to delete project');
                            alert('An error occurred while deleting the project. Please try again.');
                        }
                    }
                };

                // Send the request with the project ID
                xhr.send(JSON.stringify({ id: projectId }));
            }
        } else if (projectLink) {
            // Handle project link click
            event.preventDefault();
            const href = projectLink.getAttribute('href');
            window.location.href = href;
        }
    });
});