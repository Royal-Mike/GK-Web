document.addEventListener("DOMContentLoaded", function () {
    const modulePopup = document.getElementById("customModulePopup");
    const createBtn = document.getElementById("save-module-btn");
    const cancelBtn = document.getElementById("cancel-module-btn");
    const addModuleBtn = document.getElementById("add-module-btn"); 
    const closePopupBtn = document.getElementById("closePopup");
    cancelBtn.addEventListener("click", function () {
        closePopup();
    });

    addModuleBtn.addEventListener("click", function () { 
        showPopup();
    });

    closePopupBtn.addEventListener('click', function () {
        closePopup();
    });

    function closePopup() {
        modulePopup.style.display = "none";
        document.getElementById('module-name').value = "";
        document.getElementById('language-select').value = "";
        document.getElementById('module-description').value = "";
        document.getElementById('module-code').value = "";
    }

    function showPopup() {
        modulePopup.style.display = "block";
    }

    function getProjectIdFromURL() {
        const pathArray = window.location.pathname.split('/');
        const projectId = pathArray[2]; 
        return projectId;
    }

    createBtn.addEventListener("click", async function () {
        const moduleName = document.getElementById('module-name').value;
        const moduleLanguage = document.getElementById('language-select').value;
        const moduleDescription = document.getElementById('module-description').value; 
        const moduleCode = document.getElementById('module-code').value;
        const projectId = getProjectIdFromURL();

        if (moduleName === '') {
            showToast('Module name is required.');
            return;
        }

        if (moduleLanguage === '') {
            showToast('Language of module is required.');
            return;
        }

        if (moduleCode === '') {
            showToast('Module code is required.');
            return;
        }


        try {
            const response = await fetch(`/project/${projectId}/module/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: moduleName, description: moduleDescription, language: moduleLanguage, datacode: moduleCode })
            });

            if (!response.ok) {
                throw new Error('Failed to create module');
            }

            const data = await response.json();
            
            showToast('Module created');

            closePopup(); // Đóng cửa sổ popup sau khi tạo thành công
            window.location.reload();
        } catch (error) {
            showToast('Error creating module:', error.message);
            // Xử lý lỗi ở đây
        }
    });
});
