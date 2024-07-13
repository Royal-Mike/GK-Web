document.addEventListener('DOMContentLoaded', function () {
    const detailPopup = document.getElementById('testcaseDetailPopup');
    const closeDetailPopup = document.getElementById('closeDetailPopup');
    const editButton = document.getElementById('editTestCaseButton');
    const saveButton = document.getElementById('saveTestCaseButton');
    const cancelButton = document.getElementById('cancelEditTestCaseButton');

    const detailId = document.getElementById('detail-id');
    const detailTitle = document.getElementById('detail-title');
    const detailModule = document.getElementById('detail-module');
    const detailDescription = document.getElementById('detail-description');
    const detailPrecondition = document.getElementById('detail-precondition');
    const detailSteps = document.getElementById('detail-steps');
    const detailCreatedAt = document.getElementById('detail-created-at');
    const detailCreatedBy = document.getElementById('detail-created-by');
    const detailUpdatedAt = document.getElementById('detail-updated-at');
    const detailLinkedRequirements = document.getElementById('detail-linked-requirements');
    const detailLinkedIssues = document.getElementById('detail-linked-issues');

    function getProjectIdFromURL() {
        const pathArray = window.location.pathname.split('/');
        return pathArray[2];
    }

    document.querySelectorAll('.bi-eye').forEach(eyeIcon => {
        eyeIcon.addEventListener('click', function () {
            const testCaseId = this.getAttribute('data-id');
            const projectId = getProjectIdFromURL();

            fetch(`/project/${projectId}/test-case/${testCaseId}`)
                .then(response => response.json())
                .then(testcase => {
                    detailId.value = testcase.id;
                    detailTitle.value = testcase.title;
                    detailModule.value = testcase.module;
                    detailDescription.value = testcase.description;
                    detailPrecondition.value = testcase.precondition;
                    detailSteps.value = testcase.steps;
                    detailCreatedAt.value = testcase.created_at;
                    detailCreatedBy.value = testcase.CreatedByUser ? testcase.CreatedByUser.username : 'Unknown';
                    detailUpdatedAt.value = testcase.updated_at;
                    detailLinkedRequirements.value = testcase.linked_requirements || '';
                    detailLinkedIssues.value = testcase.linked_issues || '';
                    detailPopup.style.display = 'flex';

                    // Hide edit mode and save button initially
                    editButton.style.display = 'inline-block';
                    saveButton.style.display = 'none';
                    cancelButton.style.display = 'none';
                })
                .catch(error => console.error('Error fetching test case details:', error));
        });
    });

    closeDetailPopup.addEventListener('click', function () {
        detailPopup.style.display = 'none';
    });

    editButton.addEventListener('click', function () {
        // Enable edit mode
        detailTitle.removeAttribute('readonly');
        detailModule.removeAttribute('readonly');
        detailDescription.removeAttribute('readonly');
        detailPrecondition.removeAttribute('readonly');
        detailSteps.removeAttribute('readonly');
        detailLinkedRequirements.removeAttribute('readonly');
        detailLinkedIssues.removeAttribute('readonly');

        // Show save and cancel buttons
        editButton.style.display = 'none';
        saveButton.style.display = 'inline-block';
        cancelButton.style.display = 'inline-block';
    });

    saveButton.addEventListener('click', function () {
        const testCaseId = detailId.value;
        const projectId = getProjectIdFromURL();
        const updatedTestCase = {
            title: detailTitle.value,
            module: detailModule.value,
            description: detailDescription.value,
            precondition: detailPrecondition.value,
            steps: detailSteps.value,
            linked_requirements: detailLinkedRequirements.value,
            linked_issues: detailLinkedIssues.value 
        };

        fetch(`/project/${projectId}/test-case/${testCaseId}/edit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedTestCase)
        })
            .then(response => response.json())
            .then(updatedTestCase => {
                // Update UI with updated test case details
                detailTitle.value = updatedTestCase.title;
                detailModule.value = updatedTestCase.module;
                detailDescription.value = updatedTestCase.description;
                detailPrecondition.value = updatedTestCase.precondition;
                detailSteps.value = updatedTestCase.steps;
                detailLinkedRequirements.value = updatedTestCase.linked_requirements || '';
                detailLinkedIssues.value = updatedTestCase.linked_issues || '';
                detailUpdatedAt.value = updatedTestCase.updated_at;

                // Disable edit mode
                detailTitle.setAttribute('readonly', '');
                detailModule.setAttribute('readonly', '');
                detailDescription.setAttribute('readonly', '');
                detailPrecondition.setAttribute('readonly', '');
                detailSteps.setAttribute('readonly', '');
                detailLinkedRequirements.setAttribute('readonly', '');
                detailLinkedIssues.setAttribute('readonly', '');

                // Hide save and cancel buttons
                editButton.style.display = 'inline-block';
                saveButton.style.display = 'none';
                cancelButton.style.display = 'none';
            })
            .catch(error => {
                console.error('Error updating test case:', error);
                alert('An error occurred while updating the test case.');
            });
    });

    cancelButton.addEventListener('click', function () {
        // Disable edit mode and reset the fields
        detailTitle.setAttribute('readonly', '');
        detailModule.setAttribute('readonly', '');
        detailDescription.setAttribute('readonly', '');
        detailPrecondition.setAttribute('readonly', '');
        detailSteps.setAttribute('readonly', '');
        detailLinkedRequirements.setAttribute('readonly', '');
        detailLinkedIssues.setAttribute('readonly', '');

        // Reset the fields to their original values
        const testCaseId = detailId.value;
        const projectId = getProjectIdFromURL();

        fetch(`/project/${projectId}/test-case/${testCaseId}`)
            .then(response => response.json())
            .then(testcase => {
                detailTitle.value = testcase.title;
                detailModule.value = testcase.module;
                detailDescription.value = testcase.description;
                detailPrecondition.value = testcase.precondition;
                detailSteps.value = testcase.steps;
                detailLinkedRequirements.value = testcase.linked_requirements || '';
                detailLinkedIssues.value = testcase.linked_issues || '';

                // Hide save and cancel buttons
                editButton.style.display = 'inline-block';
                saveButton.style.display = 'none';
                cancelButton.style.display = 'none';
            })
            .catch(error => console.error('Error fetching test case details:', error));
    });
});
