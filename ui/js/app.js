//Importing Contract
const registryContractABI = [ABI];
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
        addElement('listingpanel', i, allSubmissions[i]);
    }
}

function addElement(container_ID, i, submission) {
    let time = new Date();
    // Adds an element to the document
    container = document.getElementById(contaner_id);
    let subElement = "<div class='memeBits w3-margin-top w3-row w3-container'" +
    "<div class='listing w3-col s9 m9 l9'><img src='"+submission.entry+"' class='w3-border w3-padding'></div><section id='spacer'></section>" +
    "<input type='image' src='images/vote_up3.png' onMouseOver='this.src='images/vote_up_highlight3.png'' onMouseOut='this.src='images/vote_up3.png'' onclick='"+submission.upvote('amountField'+i)+"'>" +
    "<section id='tinyer_spacer'></section><input type='image' src='images/vote_down3.png' onMouseOver='this.src='images/vote_down_highlight3.png'' onMouseOut='this.src='images/vote_down3.png'' onclick='"+submission.downvote('amountField'+i)+"'>" +
    "<section id='tiny_space'></section><input id='amountField"+i+"' type='text' placeholder='enter amount...'><section id='bigger_spacer'></section>"+
    "<div class='w3-large'>meme poll ends in:"+time.getTime()-time.getTime(submission.expirationTime)+"</div><div class='w3-large'>days</div><div class='w3-large' id='currentTokens'>Current Value:"+submission.totalTokens+"</div></div>";
    container.appendChild(subElement);
}