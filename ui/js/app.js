//Importing Contract
const registryContractABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMinDeposit","outputs":[{"name":"amount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"listingHash","type":"bytes32"},{"name":"amount","type":"uint256"}],"name":"upvote","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"submissionsMapping","outputs":[{"name":"submitter","type":"address"},{"name":"expirationTime","type":"uint256"},{"name":"upvoteTotal","type":"uint256"},{"name":"downvoteTotal","type":"uint256"},{"name":"submittedDataHash","type":"bytes32"},{"name":"completed","type":"bool"},{"name":"exists","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minDeposit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"listingHash","type":"bytes32"}],"name":"removeListing","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"hashSearched","type":"bytes32"}],"name":"getListingData","outputs":[{"name":"data","type":"uint256[3]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"submissionsArray","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"givenDataHash","type":"bytes32"},{"name":"amount","type":"uint256"}],"name":"addSubmission","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"listingHash","type":"bytes32"},{"name":"amount","type":"uint256"}],"name":"downvote","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"Reigistry","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"calculateVotes","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_name","type":"string"}],"name":"init","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAllHashes","outputs":[{"name":"allListings","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"upvoter","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"_UpvoteCast","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"downvoter","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"_DownvoteCast","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"listingHash","type":"bytes32"}],"name":"_SubmissionPassed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"listingHash","type":"bytes32"}],"name":"_SubmissionDenied","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"listingHash","type":"bytes32"}],"name":"_ListingSubmitted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"listingHash","type":"bytes32"}],"name":"_ListingRemoved","type":"event"}];
const contractAddress = `0x...`;
const PocketProvider = require('web3-pocket-provider');
const Web3 = require('web3');
let registryContractInstance;
let account, web3, pocketProvider;

function setup(){
    var transactionSigner = {
        hasAddress: function(address, callback) {
            // insert your implementation
        },
        signTransaction: function(txParams, callback) {
            // insert your implementation
        }
    };
    var options = {
        // Connect to the Rinkeby chain
        networkId: '4',
        // Set the timeout in ms, set to 0 for no timeout
        timeout: 0
    }
    pocketProvider = new PocketProvider('https://ethereum.pokt.network', transactionSigner, options);
    web3 = new Web3(pocketProvider);
    console.log(web3.eth.accounts);
    account = web3.eth.accounts[0];
    
    const registryContract = web3.eth.contract(registryContractABI);
    registryContractInstance = registryContract.at(contractAddress);
    console.log(registryContractInstance);
    getSubmissions();
}

// Fake Auction Count Down
let dayAuctionEnds = "Sep 5, 2018";
// let dayAuctionEnds = "Sep 5, 2018 15:37:25";
let countdownDate = new Date(dayAuctionEnds).getTime();

// Update the count down every 1 second
let timerCountdown = setInterval(function() {
    let currentTime = new Date().getTime();
    let countdown = countdownDate - currentTime;
    
    let daysLeft = Math.floor(countdown / (1000 * 60 * 60 * 24));
    let hoursLeft = Math.floor((countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutesLeft = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60));
    let secondsLeft = Math.floor((countdown % (1000 * 60)) / 1000);
    
    document.getElementById("auctionCountdownDays").innerHTML = daysLeft;
    document.getElementById("auctionCountdownHours").innerHTML = hoursLeft;
    document.getElementById("auctionCountdownMinutes").innerHTML = minutesLeft;
    document.getElementById("auctionCountdownSeconds").innerHTML = secondsLeft;
    
    
    // If the count down is over, write some text 
    if (countdown < 0) {
        clearInterval(timerCountdown);
    }
}, 1000);

document.getElementById("auctionCountdownEndDate").innerHTML = dayAuctionEnds;

function getSubmissions(){
    registryContractInstance.getAllHashes(account, function(error, result){
        if(!error){
            let hashes = [];
            for(let i = 0; i < result.length; i++){
                hashes[i] = result[i].c[0];
            }
            let submissionsData = []; //Array of JSON objects

            //JSON object for each entry
            let tempJSONObject = {entry, 
                expirationTime, 
                totalTokens, 
                upvote : function(){
                    if(document.getElementById('AMOUNTIDHERE').value !== undefined){
                        registryContractInstance.upvote(this.entry, amount, function(error,transactionHash){
                            if (error)
                                console.log(transactionHash);
                            });
                            document.getElementById('AMOUNTIDHERE').value = '';
                        }
                    else
                        console.log("Please enter an amount before clicking this button.");
                }, 
                downvote : function(){
                    if(document.getElementById('AMOUNTIDHERE').value !== undefined){
                        registryContractInstance.downvote(this.entry, amount, function(error,transactionHash){
                            if (error)
                                console.log(transactionHash);
                            });
                            document.getElementById('AMOUNTIDHERE').value = '';
                        }
                    else
                        console.log("Please enter an amount before clicking this button.");
            }};

            //Getting each submissions data and putting them into an array
            for (let i = 0; i < hashes.length ; i++){
                registryContractInstance.getListingData(hash, function(error, result){
                    //Turn received array into JSON object to store
                    if(!error){
                        tempJSONObject.entry = hashes[i];
                        tempJSONObject.expirationTime = result[0].c[0];
                        tempJSONObject.totalTokens = result[0].c[1] + result[0].c[2];
                        submissionsData.push(tempJSONObject);
                    }
                    else
                        console.error(error);
                })
            }
            displaySubmissions(submissionsData);
        }else
            console.error(error);
    })
}

//Dynamically display all submissions on site
function displaySubmissions(allSubmissions){
    for(let i = 0 ; i < allSubmissions.length ; i++){
        addElement('PARENTIDHERE', 'listing', i, allSubmissions[i]);
    }
}

function addElement(parentId, elementTag, elementId, submission) {
    let time = new Date();
    // Adds an element to the document
    let p = document.getElementById(parentId);
    let newElement = document.createElement(elementTag);
    newElement.setAttribute('id', elementId);

    newElement.image.innerHTML = submission.entry;
    newElement.expiryTime.innerHTML = time.getTime() - submission.expirationTime; //hope
    newElement.totalTokens.innerHTML = submission.totalTokens;
    p.appendChild(newElement);
}