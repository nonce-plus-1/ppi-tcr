    const registryContractABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMinDeposit","outputs":[{"name":"amount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"listingHash","type":"bytes32"},{"name":"amount","type":"uint256"}],"name":"upvote","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"submissionsMapping","outputs":[{"name":"submitter","type":"address"},{"name":"expirationTime","type":"uint256"},{"name":"upvoteTotal","type":"uint256"},{"name":"downvoteTotal","type":"uint256"},{"name":"submittedDataHash","type":"bytes32"},{"name":"completed","type":"bool"},{"name":"exists","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minDeposit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"listingHash","type":"bytes32"}],"name":"removeListing","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"hashSearched","type":"bytes32"}],"name":"getListingData","outputs":[{"name":"data","type":"uint256[3]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"submissionsArray","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"givenDataHash","type":"bytes32"},{"name":"amount","type":"uint256"}],"name":"addSubmission","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"listingHash","type":"bytes32"},{"name":"amount","type":"uint256"}],"name":"downvote","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"Reigistry","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"calculateVotes","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_name","type":"string"}],"name":"init","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAllHashes","outputs":[{"name":"allListings","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"upvoter","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"_UpvoteCast","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"downvoter","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"_DownvoteCast","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"listingHash","type":"bytes32"}],"name":"_SubmissionPassed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"listingHash","type":"bytes32"}],"name":"_SubmissionDenied","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"listingHash","type":"bytes32"}],"name":"_ListingSubmitted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"listingHash","type":"bytes32"}],"name":"_ListingRemoved","type":"event"}];
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

    function sendListing(){
        if(document.getElementById('URLIDHERE').value !== undefined && document.getElementById('AMOUNTIDHERE').value !== undefined){
            registryContractInstance.addSubmission(document.getElementById('URLIDHERE').value, document.getElementById('AMOUNTIDHERE').value, function(error, transactionHash){
                if(error){
                    console.log(transactionHash);
                }
            });
            document.getElementById('AMOUNTIDHERE').value = '';
            document.getElementById('URLIDHERE').value = '';
        }
        else
            console.log("Error: One of two fields not filled out");
    }