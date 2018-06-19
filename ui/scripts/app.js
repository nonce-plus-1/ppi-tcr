var dayAuctionEnds = "Sep 5, 2018 15:37:25";
var countdownDate = new Date(dayAuctionEnds).getTime();

// Update the count down every 1 second
var timerCountdown = setInterval(function() {
    var currentTime = new Date().getTime();
    var countdown = countdownDate - currentTime;
    
    var daysLeft = Math.floor(countdown / (1000 * 60 * 60 * 24));
    var hoursLeft = Math.floor((countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutesLeft = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60));
    var secondsLeft = Math.floor((countdown % (1000 * 60)) / 1000);
    
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
