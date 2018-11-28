const registryContractABI = [{"constant":false,"inputs":[{"name":"listingIndex","type":"uint256"},{"name":"amount","type":"uint256"}],"name":"downvote","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"getMinDeposit","outputs":[{"name":"amount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"}],"name":"init","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"givenDataIndex","type":"uint256"},{"name":"amount","type":"uint256"}],"name":"addSubmission","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"givenDataIndex","type":"uint256"}],"name":"getTotalVotes","outputs":[{"name":"voteTotal","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minDeposit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"listingIndex","type":"uint256"}],"name":"removeListing","outputs":[{"name":"removed","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"listingIndex","type":"uint256"},{"name":"amount","type":"uint256"}],"name":"upvote","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"givenDataIndex","type":"uint256"}],"name":"getExpirationTime","outputs":[{"name":"expirationTime","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"submissionsArray","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"setMinDeposit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"calculateVotes","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"upvoter","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"_UpvoteCast","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"downvoter","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"_DownvoteCast","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"listingIndex","type":"uint256"}],"name":"_SubmissionPassed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"listingIndex","type":"uint256"}],"name":"_SubmissionDenied","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"listingIndex","type":"uint256"}],"name":"_ListingSubmitted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"listingIndex","type":"uint256"}],"name":"_ListingRemoved","type":"event"}];
const contractAddress = `0x7973ec0116884be37a3fc217aea08cd8dba139c5`;
const schedule = require('node-schedule');
let minDeposit, registryContractInstance, account, web3;
var submissionLinks = ["http://www.slate.com/content/dam/slate/articles/news_and_politics/the_slate_quiz/authorPortraits/pronounce_doge4.jpg.CROP.promovar-mediumlarge.jpg"];

function getSubmissions(){
            //JSON object for each entry
            let tempJSONObject = {entry : '', 
                expirationTime : 604800, 
                totalTokens : 0, 
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

            let submissionsData = [];

            for(let i = 1 ; i < submissionLinks.length ; i++){
                if(submissionLinks[i] !== 0){
                    tempJSONObject.entry = submissionLinks[i];
                registryContractInstance.getExpirationTime(i, function(error, result){
                    if(!error){
                    tempJSONObject.expirationTime = result.c;
                    }
                });
                registryContractInstance.getTotalVotes(i, function(error, result){
                    if(!error){
                    tempJSONObject.totalTokens = result.c;
                    }
                });
                submissionsData.push(tempJSONObject);
            }
            }
            for(let i = 0 ; i < submissionsData.length ; i++){
                addElement('listingPanel', i, submissionsData[i]);
            }
}

function addElement(container_ID, i, submission) {
    let time = new Date();
    // Adds an element to the document
    container = document.getElementById(container_ID);

    let subElement = "<article class='listing'><section id='spacer'></section>" +
    "<div class='memePic img'><img src='" + submission.entry + "' class='w3-border w3-padding-small'></div><section id='spacer'></section>"+
    "<button class='w3-button w3-hover-white w3-ripple w3-round-large ppiCTA' onclick='"+ submission.upvote('amountField'+i) +"'>▲</button>"+
    "<button class='w3-button w3-hover-white w3-ripple w3-round-large ppiCTA' onclick='"+ submission.downvote('amountField'+i) +"'>▼</button>"+
    "<span style='white-space:nowrap'></span><section id='tiny_spacer'></section>"+
    "<span style='white-space:nowrap'><label for='amountField" + i + "'>enter bid amount:</label><input type='text' id='amountField" + i + "' required='required' placeholder='# of tokens'/></span>"+
    "<div class='w3-large'>meme poll ends in:<span id='pollendtime'>"+ time.getTime()-time.getTime(submission.expirationTime) +"</span></div>"+
    "<div class='w3-large' id='currentTokens'>Current Value:<span id='currentauctionvalue'>"+ submission.totalTokens +"</span><span class='w3-medium'> coins </span></div>"+
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

function removeListing(index){
    registryContractInstance.removeListing(index, function(error,result){
        if (!error){
            submissionLinks[index] = 0;
        } else
            console.log(error);
    });
}

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
    console.log(window.web3.eth.accounts);
    account = window.web3.eth.accounts[0];
    console.log(account);
    
    const registryContract = window.web3.eth.contract(registryContractABI);
    registryContractInstance = registryContract.at(contractAddress);
    getSubmissions();
    minDeposit = getMinDeposit();
});