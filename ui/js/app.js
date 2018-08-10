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


// Upload Area
    let dropArea = document.getElementById('drop-area')

    ;['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
    })

    ;['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
    })

    function highlight(e) {
    dropArea.classList.add('highlight')
    }

    function unhighlight(e) {
    dropArea.classList.remove('highlight')
    }

    dropArea.addEventListener('drop', handleDrop, false)
    function handleDrop(e) {
    let dt = e.dataTransfer
    let files = dt.files

    handleFiles(files)
    }

    function handleFiles(files) {
    ([...files]).forEach(uploadFormile)
    }

    function uploadFile(file) {
    var url = 'SOME URL HERE'
    var xhr = new XMLHttpRequest()
    var formData = new FormData()
    xhr.open('POST', url, true)

    xhr.addEventListener('readystatechange', function(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
        // Done. Inform the user
        }
        else if (xhr.readyState == 4 && xhr.status != 200) {
        // Error. Inform the user
        }
    })

    formData.append('file', file)
    xhr.send(formData)
    }
  