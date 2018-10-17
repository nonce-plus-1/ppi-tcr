    const registryContractABI = [ABI];
    const contractAddress = `0x...`;
    let registryContractInstance;

    function setupSubmission(){
        const registryContract = web3.eth.contract(registryContractABI);
        registryContractInstance = registryContract.at(contractAddress);
    }

    // Upload Area
    var input = document.querySelector('input');
    var preview = document.querySelector('.preview');

    input.style.opacity = 0;input.addEventListener('change', updateImageDisplay);function updateImageDisplay() {
    while(preview.firstChild) {
        preview.removeChild(preview.firstChild);
    }

    // TODO: REMOVE NUMBERING SYSTEM AND FORMAT PHOTOS TO BE RESPONSIVE.
    var curFiles = input.files;
    if(curFiles.length === 0) {
        var para = document.createElement('h1');
        para.textContent = 'No files currently selected for upload';
        preview.appendChild(para);
    } else {
        var list = document.createElement('ul');
        preview.appendChild(list);
        for(var i = 0; i < curFiles.length; i++) {
            var listItem = document.createElement('p');
            var para = document.createElement('p');
            if(validFileType(curFiles[i])) {
                para.textContent = 'FILE NAME: ' + curFiles[i].name + ', FILE SIZE: ' + returnFileSize(curFiles[i].size) + '.';
                
                var image = document.createElement('img');
                image.className = "w3-image w3-center";
                image.src = window.URL.createObjectURL(curFiles[i]);

                listItem.appendChild(image);
                listItem.appendChild(para);

            } else {
                para.textContent = 'FILE NAME: ' + curFiles[i].name + ': Not a valid file type. Update your selection.';
                listItem.appendChild(para);
            }

            list.appendChild(listItem);
        }
    }
    }var fileTypes = [
    'image/jpeg',
    'image/pjpeg',
    'image/png'
    ]

    function validFileType(file) {
    for(var i = 0; i < fileTypes.length; i++) {
        if(file.type === fileTypes[i]) {
        return true;
        }
    }

    return false;
    }function returnFileSize(number) {
    if(number < 1024) {
        return number + 'bytes';
    } else if(number >= 1024 && number < 1048576) {
        return (number/1024).toFixed(1) + 'KB';
    } else if(number >= 1048576) {
        return (number/1048576).toFixed(1) + 'MB';
    }
    }

    function getMinDeposit(){
        registryContractInstance.getMinDeposit(account, function(error, result){
            if (!error){
                document.getElementById('minDeposit').value = 'Minimum Deposit: ' + result;
            } else
                console.log(error);
        })
    }

    function sendListing(){
        if(document.getElementById('urlField').value !== undefined && document.getElementById('minDeposit').value !== undefined && document.getElementById('AMOUNTIDHERE').value >= document.getElementById('minDeposit').value){
            registryContractInstance.addSubmission(document.getElementById('urlField').value, document.getElementById('AMOUNTIDHERE').value, function(error, transactionHash){
                if(error){
                    console.log(transactionHash);
                }
            });
            document.getElementById('AMOUNTIDHERE').value = '';
            document.getElementById('urlField').value = '';
        }
        else
            console.log("Error: One of two fields not filled out");
    }