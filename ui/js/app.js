//Importing Contract
const registryContractABI = [{"constant":true,"inputs":[],"name":"getMinDeposit","outputs":[{"name":"amount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"}],"name":"init","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"listingHash","type":"bytes"},{"name":"amount","type":"uint256"}],"name":"downvote","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"minDeposit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"listingHash","type":"bytes"},{"name":"amount","type":"uint256"}],"name":"upvote","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"listingHash","type":"bytes"},{"name":"g","type":"uint256"}],"name":"removeListing","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"submissionsArray","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"Reigistry","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"hashSearched","type":"bytes"}],"name":"getListingData","outputs":[{"name":"data","type":"uint256[3]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"givenDataHash","type":"bytes"},{"name":"amount","type":"uint256"}],"name":"addSubmission","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"calculateVotes","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAllHashes","outputs":[{"name":"allListings","type":"bytes[]"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"upvoter","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"_UpvoteCast","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"downvoter","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"_DownvoteCast","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"listingHash","type":"bytes"}],"name":"_SubmissionPassed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"listingHash","type":"bytes"}],"name":"_SubmissionDenied","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"listingHash","type":"bytes"}],"name":"_ListingSubmitted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"listingHash","type":"bytes"}],"name":"_ListingRemoved","type":"event"}];
const contractAddress = `0xc0f1dbd1f6cdb7a6e8f2d8002ef7c7e223c568d8`;
const Web3 = require('web3');
const schedule = require('node-schedule');
let registryContractInstance, account, web3;

// const PocketProvider = require('web3-pocket-provider');
// let pocketProvider;

// var transactionSigner = {
//     hasAddress: function(address, callback) {
//         // insert your implementation
//     },
//     signTransaction: function(txParams, callback) {
//         // insert your implementation
//     }
// };
// var options = {
//     // Connect to the Rinkeby chain
//     networkId: '4',
//     // Set the timeout in ms, set to 0 for no timeout
//     timeout: 0
// }
setup();

function setup(){
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        web3 = new Web3(web3.currentProvider);
      } else {
        alert('Install MetaMask for proper site functionality at Metamask.io');
        // fallback 
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
      }
    // pocketProvider = new PocketProvider('https://ethereum.pokt.network', transactionSigner, options);
    // web3 = new Web3(pocketProvider);
    console.log(web3.eth.accounts);
    account = web3.eth.accounts[0];
    
    const registryContract = web3.eth.contract(registryContractABI);
    registryContractInstance = registryContract.at(contractAddress);
    console.log(registryContractInstance);
    getSubmissions();
}

// Fake Auction Count Down
let dayAuctionEnds = "Dec 5, 2018";
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
                upvote : function(amountField){
                    if(document.getElementById(amountField).value !== undefined){
                        registryContractInstance.upvote(this.entry, document.getElementById(amountField).value, function(error,transactionHash){
                            if (error)
                                console.log(transactionHash);
                            });
                            document.getElementById(amountField).value = '';
                        }
                    else
                        console.log("Please enter an amount before clicking this button.");
                }, 
                downvote : function(amountField){
                    if(document.getElementById(amountField).value !== undefined){
                        registryContractInstance.downvote(this.entry, document.getElementById(amountField).value, function(error,transactionHash){
                            if (error)
                                console.log(transactionHash);
                            });
                            document.getElementById(amountField).value = '';
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
        addElement('listingPanel', i, allSubmissions[i]);
    }
}

function addElement(container_ID, i, submission) {
    let time = new Date();
    // Adds an element to the document
    container = document.getElementById(container_ID);

    let subElement = "<article class='listing'><section id='spacer'></section>" +
    "<div class='memePic img'><img src='" + submission.entry + "' class='w3-border w3-padding-small'></div><section id='spacer'></section>"+
    "<button class='w3-button w3-hover-white w3-ripple w3-round-large ppiCTA' onclick='"+submission.upvote('amountField'+i)+"'>▲</button>"+
    "<button class='w3-button w3-hover-white w3-ripple w3-round-large ppiCTA' onclick='"+submission.downvote('amountField'+i)+"'>▼</button>"+
    "<span style='white-space:nowrap'></span><section id='tiny_spacer'></section>"+
    "<span style='white-space:nowrap'><label for='amountField" + i + "'>enter bid amount:</label><input type='text' id='amountField" + i + "' required='required' placeholder='# of tokens'/></span>"+
    "<div class='w3-large'>meme poll ends in:<span id='pollendtime'>"+time.getTime()-time.getTime(submission.expirationTime)+"</span></div>"+
    "<div class='w3-large' id='currentTokens'>Current Value:<span id='currentauctionvalue'>"+submission.totalTokens+"</span><span class='w3-medium'> coins </span></div>"+
    "<section id='biggboy_spacer'></section></article>";

    container.appendChild(subElement);
}

let timedCountdown = schedule.scheduleJob('0 0 * * *', function(){
    registryContractInstance.calculateVotes(account, function(error, transactionHash){
        if (!error){
            console.log(transactionHash);
        } else
            console.log(error);
    })
});
