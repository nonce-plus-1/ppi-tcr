pragma solidity ^0.4.21;

import "http://github.com/ConsenSys/Tokens/contracts/eip20/EIP20Interface.sol";

contract Registry {
    event _UpvoteCast(address upvoter, uint amount);
    event _DownvoteCast(address downvoter, uint amount);
    event _SubmissionPassed(uint indexed listingIndex);
    event _SubmissionDenied(uint indexed listingIndex);
    event _ListingSubmitted(uint indexed listingIndex);
    event _ListingRemoved(uint indexed listingIndex);

    struct Submission {
        address submitter; //Include submitter and initial token stake as first TokenStake
        uint submittedDataIndex;
        uint expirationTime; //
        uint upvoteTotal;
        uint downvoteTotal;
        address[] promoters;
        address[] challengers;
        mapping(address => uint) balances;
        bool completed;
    }
    
    // Global Variables
    address private owner;
    mapping( uint => Submission ) submissionsMapping; //Ensures uniqueness of submissions
    uint[] public submissionsArray; //Indexes mapping
    EIP20Interface public token;
    uint public minDeposit;
    
    //Constructor
    function Registry() public {
        owner = msg.sender;
        minDeposit = 50;
        init(0x5a3c9a1725aa82690ee0959c89abe96fd1b527ee);
    }

    /**
    @dev Initializer. Can only be called once.
    @param _token The address where the ERC20 token contract is deployed
    */
    function init(address _token) public {
        token = EIP20Interface(_token);
    }
    
    //Modifiers
    modifier submitterOnly (Submission memory sub) {
        require(msg.sender == sub.submitter || msg.sender == owner);
        _;
    }
    
    modifier ownerOnly {
        require(msg.sender == owner);
        _;
    }

    modifier timeTested (Submission memory sub) {
        require(sub.expirationTime < now);
        _;
    }
    
    function addSubmission(uint givenDataIndex, uint amount) public payable {
        require(amount >= minDeposit);
        token.transferFrom(msg.sender, address(this), amount);
        
        //set exipration after one week (could make adjustable)
        Submission memory newSub;
        newSub.submitter = msg.sender;
        newSub.submittedDataIndex = givenDataIndex;
        newSub.upvoteTotal = amount;
        newSub.downvoteTotal = 0;
        newSub.completed = false;
        newSub.expirationTime = now + 604800;

        submissionsArray.push(givenDataIndex);
        submissionsMapping[givenDataIndex] = newSub;
        submissionsMapping[givenDataIndex].promoters.push(msg.sender);
        submissionsMapping[givenDataIndex].balances[msg.sender] = amount;
    }
    
    function upvote(uint listingIndex, uint amount) public timeTested(submissionsMapping[listingIndex]) payable {
        token.transferFrom(msg.sender, address(this), amount);
        submissionsMapping[listingIndex].promoters.push(msg.sender);
        submissionsMapping[listingIndex].balances[msg.sender] += amount;
        emit _UpvoteCast(msg.sender, amount);
    }

    function downvote(uint listingIndex, uint amount) public timeTested(submissionsMapping[listingIndex]) payable {
        token.transferFrom(msg.sender, address(this), amount);
        submissionsMapping[listingIndex].challengers.push(msg.sender);
        submissionsMapping[listingIndex].balances[msg.sender] += amount;
        emit _DownvoteCast(msg.sender, amount);
    }
    
    //Run daily from javascript code
    function calculateVotes() public {
        for (uint i = 0 ; i < submissionsArray.length ; i++) {
            if (submissionsMapping[i].expirationTime > now && submissionsMapping[i].completed == false) {
                if (submissionsMapping[i].upvoteTotal > submissionsMapping[i].downvoteTotal) {
                    submissionPublish(i);
                } else if (submissionsMapping[i].downvoteTotal > submissionsMapping[i].upvoteTotal) {
                    submissionReject(i);
                } else {
                    removeListing(i);
                }
            }
        }
    }
    
    function submissionPublish(uint listingIndex) internal {
        for (uint i = 0 ; i < submissionsMapping[listingIndex].promoters.length ; i++) {
            uint ratio = ((submissionsMapping[listingIndex].balances[submissionsMapping[listingIndex].promoters[i]]*100) / (submissionsMapping[listingIndex].upvoteTotal*100));
            uint amountWon = (ratio*(submissionsMapping[listingIndex].downvoteTotal*100));
            token.transfer(submissionsMapping[listingIndex].promoters[i], (amountWon/100));
            submissionsMapping[listingIndex].balances[submissionsMapping[listingIndex].promoters[i]] = 0;
        }
        submissionsMapping[listingIndex].completed = true;
        
        emit _SubmissionPassed(submissionsMapping[listingIndex].submittedDataIndex);
    }
    
    function submissionReject(uint listingIndex) internal {
        for (uint i = 0 ; i < submissionsMapping[listingIndex].challengers.length ; i++) {
            uint ratio = ((submissionsMapping[listingIndex].balances[submissionsMapping[listingIndex].challengers[i]]*100) / (submissionsMapping[listingIndex].downvoteTotal*100));
            uint amountWon = (ratio*(submissionsMapping[listingIndex].upvoteTotal*100));
            token.transfer(submissionsMapping[listingIndex].challengers[i], (amountWon/100));
            submissionsMapping[listingIndex].balances[submissionsMapping[listingIndex].challengers[i]] = 0;
        }
        delete submissionsArray[listingIndex];
        emit _SubmissionDenied(submissionsMapping[listingIndex].submittedDataIndex);
    }

    function removeListing(uint listingIndex) public submitterOnly(submissionsMapping[listingIndex]) timeTested(submissionsMapping[listingIndex]) returns(bool removed){
        for (uint i = 0 ; i < submissionsMapping[listingIndex].promoters.length ; i++) {
            uint share = submissionsMapping[listingIndex].balances[submissionsMapping[listingIndex].promoters[i]];
            submissionsMapping[listingIndex].balances[submissionsMapping[listingIndex].promoters[i]] = 0;
            token.transfer(submissionsMapping[listingIndex].promoters[i], share);
        }
        for (i = 0 ; i < submissionsMapping[listingIndex].challengers.length; i++) {
            share = submissionsMapping[listingIndex].balances[submissionsMapping[listingIndex].challengers[i]];
            submissionsMapping[listingIndex].balances[submissionsMapping[listingIndex].challengers[i]] = 0;
            token.transfer(submissionsMapping[listingIndex].challengers[i], submissionsMapping[listingIndex].balances[submissionsMapping[listingIndex].challengers[i]]);
        }
        submissionsArray[listingIndex]=0;
        emit _ListingRemoved(submissionsMapping[listingIndex].submittedDataIndex);
        return true;
    }

    function getExpirationTime(uint givenDataIndex) public view returns(uint expirationTime){
        return (submissionsMapping[givenDataIndex].expirationTime);
    }

    function getTotalVotes(uint givenDataIndex) public view returns(uint voteTotal){
        return (submissionsMapping[givenDataIndex].upvoteTotal + submissionsMapping[givenDataIndex].downvoteTotal);
    }
    
    function getMinDeposit() public view returns(uint amount) {
        return (minDeposit);
    }

    function setMinDeposit(uint amount) public ownerOnly {
        minDeposit = amount;
    }
}
