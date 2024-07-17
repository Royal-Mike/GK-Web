document.addEventListener('DOMContentLoaded', function () {
    const detailPopup = document.getElementById('moduleDetailPopup');
    const closeDetailPopup = document.getElementById('closeDetailPopup');
    const editButton = document.getElementById('editModuleButton');
    const saveButton = document.getElementById('saveModuleButton');
    const cancelButton = document.getElementById('cancelEditModuleButton');

    const detailId = document.getElementById('detail-id');
    const detailName = document.getElementById('detail-name');
    const detailLanguage = document.getElementById('detail-language');
    const detailDescription = document.getElementById('detail-description');
    const detailCode = document.getElementById('detail-code');
    const detailCreatedAt = document.getElementById('detail-created-at');
    const detailCreatedBy = document.getElementById('detail-created-by');
    const detailUpdatedAt = document.getElementById('detail-updated-at');


    function getProjectIdFromURL() {
        const pathArray = window.location.pathname.split('/');
        return pathArray[2];
    }

    document.querySelectorAll('.bi-eye').forEach(eyeIcon => {
        eyeIcon.addEventListener('click', function () {
            const moduleId = this.getAttribute('data-id');
            const projectId = getProjectIdFromURL();

            fetch(`/project/${projectId}/module/${moduleId}`)
                .then(response => response.json())
                .then(module => {
                    detailId.value = module.id;
                    detailName.value = module.name;
                    detailLanguage.value = module.language;
                    detailDescription.value = module.description;
                    detailCode.value = module.datacode;
                    detailCreatedAt.value = module.createdAt;
                    detailCreatedBy.value = module.developer ? module.developer.username : 'Unknown';
                    detailUpdatedAt.value = module.updatedAt;

                    detailPopup.style.display = 'flex';

                    // Hide edit mode and save button initially
                    editButton.style.display = 'inline-block';
                    saveButton.style.display = 'none';
                    cancelButton.style.display = 'none';
                })
                .catch(error => console.error('Error fetching module details:', error));
        });
    });

    closeDetailPopup.addEventListener('click', function () {
        detailPopup.style.display = 'none';
    });

    editButton.addEventListener('click', function () {
        // Enable edit mode
        detailName.removeAttribute('readonly');
        detailLanguage.removeAttribute('readonly');
        detailDescription.removeAttribute('readonly');
        detailCode.removeAttribute('readonly');


        // Show save and cancel buttons
        editButton.style.display = 'none';
        saveButton.style.display = 'inline-block';
        cancelButton.style.display = 'inline-block';
    });

    saveButton.addEventListener('click', function () {
        const moduleId = detailId.value;
        const projectId = getProjectIdFromURL();
        const updatedModule = {
            name: detailName.value,
            language: detailLanguage.value,
            description: detailDescription.value,
            datacode: detailCode.value,
        };

        fetch(`/project/${projectId}/module/${moduleId}/edit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedModule)
        })
            .then(response => response.json())
            .then(updatedModule => {
                // Update UI with updated test case details
                detailName.value = updatedModule.name;
                detailLanguage.value = updatedModule.language;
                detailDescription.value = updatedModule.description;
                detailCode.value = updatedModule.datacode;
                detailUpdatedAt.value = updatedModule.updatedAt;

                // Disable edit mode
                detailName.setAttribute('readonly', '');
                detailLanguage.setAttribute('readonly', '');
                detailDescription.setAttribute('readonly', '');
                detailCode.setAttribute('readonly', '');


                // Hide save and cancel buttons
                editButton.style.display = 'inline-block';
                saveButton.style.display = 'none';
                cancelButton.style.display = 'none';
            })
            .catch(error => {
                console.error('Error updating module:', error);
                alert('An error occurred while updating the module.');
            });
    });

    cancelButton.addEventListener('click', function () {
        // Disable edit mode and reset the fields
        detailName.setAttribute('readonly', '');
        detailLanguage.setAttribute('readonly', '');
        detailDescription.setAttribute('readonly', '');
        detailCode.setAttribute('readonly', '');

        // Reset the fields to their original values
        const moduleId = detailId.value;
        const projectId = getProjectIdFromURL();

        fetch(`/project/${projectId}/module/${moduleId}`)
            .then(response => response.json())
            .then(module => {
                detailName.value = module.name;
                detailLanguage.value = module.language;
                detailDescription.value = module.description;
                detailCode.value = module.datacode;
  

                // Hide save and cancel buttons
                editButton.style.display = 'inline-block';
                saveButton.style.display = 'none';
                cancelButton.style.display = 'none';
            })
            .catch(error => console.error('Error fetching module details:', error));
    });
});
