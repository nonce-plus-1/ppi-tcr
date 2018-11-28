const registryContractABI = [{"constant":false,"inputs":[{"name":"listingIndex","type":"uint256"},{"name":"amount","type":"uint256"}],"name":"downvote","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"getMinDeposit","outputs":[{"name":"amount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"}],"name":"init","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"givenDataIndex","type":"uint256"},{"name":"amount","type":"uint256"}],"name":"addSubmission","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"givenDataIndex","type":"uint256"}],"name":"getTotalVotes","outputs":[{"name":"voteTotal","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minDeposit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"listingIndex","type":"uint256"}],"name":"removeListing","outputs":[{"name":"removed","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"listingIndex","type":"uint256"},{"name":"amount","type":"uint256"}],"name":"upvote","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"givenDataIndex","type":"uint256"}],"name":"getExpirationTime","outputs":[{"name":"expirationTime","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"submissionsArray","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"setMinDeposit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"calculateVotes","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"upvoter","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"_UpvoteCast","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"downvoter","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"_DownvoteCast","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"listingIndex","type":"uint256"}],"name":"_SubmissionPassed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"listingIndex","type":"uint256"}],"name":"_SubmissionDenied","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"listingIndex","type":"uint256"}],"name":"_ListingSubmitted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"listingIndex","type":"uint256"}],"name":"_ListingRemoved","type":"event"}];
const contractAddress = `0x7973ec0116884be37a3fc217aea08cd8dba139c5`;
let registryContractInstance;
let account;
let minDeposit = getMinDeposit();

function sendListing(){
    let url = document.getElementById('urlField').value
    submissionLinks.push(url);
    let amount = document.getElementById('amountField').value
    if(url !== undefined && amount >= minDeposit){
        registryContractInstance.addSubmission(submissionLinks.length, amount, function(error, transactionHash){
            if(error){
                console.log(transactionHash);
            }
        });
        let image = document.createElement('img');
        image.className = "w3-image w3-center";
        image.src = url;
        document.getElementById('formy').appendChild(image);
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
            minDeposit = result;
        } else{
            console.log(error);
            minDeposit = 50;
        }
    })
}

window.addEventListener('load', async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            await ethereum.enable();
            // Acccounts now exposed
            web3.eth.sendTransaction({/* ... */});
        } catch (error) {
            // User denied account access...
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */});
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
    const registryContract = window.web3.eth.contract(registryContractABI);
    registryContractInstance = registryContract.at(contractAddress);
    account = window.web3.eth.accounts[0];
    getMinDeposit();
});