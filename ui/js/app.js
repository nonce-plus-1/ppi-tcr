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

