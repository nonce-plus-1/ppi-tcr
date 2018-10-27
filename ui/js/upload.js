const registryContractABI = [{"constant":true,"inputs":[],"name":"getMinDeposit","outputs":[{"name":"amount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"}],"name":"init","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"listingHash","type":"bytes"},{"name":"amount","type":"uint256"}],"name":"downvote","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"minDeposit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"listingHash","type":"bytes"},{"name":"amount","type":"uint256"}],"name":"upvote","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"listingHash","type":"bytes"},{"name":"g","type":"uint256"}],"name":"removeListing","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"submissionsArray","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"Reigistry","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"hashSearched","type":"bytes"}],"name":"getListingData","outputs":[{"name":"data","type":"uint256[3]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"givenDataHash","type":"bytes"},{"name":"amount","type":"uint256"}],"name":"addSubmission","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"calculateVotes","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAllHashes","outputs":[{"name":"allListings","type":"bytes[]"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"upvoter","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"_UpvoteCast","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"downvoter","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"_DownvoteCast","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"listingHash","type":"bytes"}],"name":"_SubmissionPassed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"listingHash","type":"bytes"}],"name":"_SubmissionDenied","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"listingHash","type":"bytes"}],"name":"_ListingSubmitted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"listingHash","type":"bytes"}],"name":"_ListingRemoved","type":"event"}];
const contractAddress = `0xc0f1dbd1f6cdb7a6e8f2d8002ef7c7e223c568d8`;
const Web3 = require('web3');
let registryContractInstance;
setupSubmission();

function setupSubmission(){
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        web3 = new Web3(web3.currentProvider);
    } else {
        alert('Install MetaMask for proper site functionality at Metamask.io');
        // fallback 
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
    const registryContract = web3.eth.contract(registryContractABI);
    registryContractInstance = registryContract.at(contractAddress);
    getMinDeposit();
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
    let url = document.getElementById('urlField').value
    if(url !== undefined && document.getElementById('amountField').value >= document.getElementById('minDeposit').value){
        registryContractInstance.addSubmission(url, document.getElementById('amountField').value, function(error, transactionHash){
            if(error){
                console.log(transactionHash);
            }
        });
        let image = document.createElement('img');
        image.className = "w3-image w3-center";
        image.src = window.URL.createObjectURL(url);
        document.getElementById('bigboy_spacer').appendChild(image);
        document.getElementById('amountField').value = '';
        document.getElementById('urlField').value = '';
    }
    else
        console.log("Error: One of two fields not filled out or amount does not meet minimum.");
}
function getMinDeposit(){
    registryContractInstance.getMinDeposit(account, function(error, result){
        if (!error){
            document.getElementById('minDeposit').value = 'Minimum Deposit: ' + result;
        } else
            console.log(error);
    })
}