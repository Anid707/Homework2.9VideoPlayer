const containerVid = document.querySelector(".container-video"),
mainVideo = containerVid.querySelector("video"),
playPauseBtn = containerVid.querySelector(".play-pause i"),
progressBar = containerVid.querySelector(".progress-bar"),
skipBackward = containerVid.querySelector(".skip-backward i"),
skipForward = containerVid.querySelector(".skip-forward i"),
volumeBtn = containerVid.querySelector(".volume i"),
volumeSlider = containerVid.querySelector(".left input"),
speedBtn = containerVid.querySelector(".playback-speed span"),
speedOptions = containerVid.querySelector(".speed-options"),
picInPicBtn = containerVid.querySelector(".pic-in-pic span"),
fullScreenBtn = containerVid.querySelector(".fullscreen i"),
videoTimeline = containerVid.querySelector(".video-timeline"),
currentVidTime = containerVid.querySelector(".current-time"),
videoDuration = containerVid.querySelector(".video-duration");
let timer;
const photoOfVideo = containerVid.querySelector(".photo-of-video"),
playButton = containerVid.querySelector(".play-button"),
playButtonImg = containerVid.querySelector(".play-button img");
const portfolioBtnAll = document.querySelectorAll(".portfolio__btn"),
portfolioImgAll = document.querySelectorAll(".portfolio__grid-elem img"),
burgerBtn = document.getElementById("burger"),
closeBtn = document.getElementById("menu__close"),
menu = document.querySelector(".menu"),
formInputs = document.querySelectorAll(".contact__form input"),
contactBtn = document.getElementById("contact-btn"),
form = document.querySelector(".contact__form"),
links = document.querySelectorAll("a");

///////////Video Player
const formatTime = time => {
    let seconds = Math.floor(time % 60),
    minutes = Math.floor(time / 60) % 60,
    hours = Math.floor(time / 3600);

    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    hours = hours < 10 ? `0${hours}` : hours;

    if (hours == 0){
        return `${minutes}:${seconds}`;
    }
    return `${hours}:${minutes}:${seconds}`;
}

playPauseBtn.addEventListener('click', () => {
    mainVideo.paused ? mainVideo.play() : mainVideo.pause();
});

mainVideo.addEventListener("play", () => {
    playPauseBtn.classList.replace("fa-play", "fa-pause");
    photoOfVideo.style.zIndex = -3;
    playButton.style.zIndex = -1;
});

mainVideo.addEventListener("pause", () => {
    playPauseBtn.classList.replace("fa-pause", "fa-play");
    playButton.style.zIndex = 2;
});
playButtonImg.addEventListener("mouseenter", () => {
    playButtonImg.src = "/assets/Play_hover.png";
});
playButtonImg.addEventListener("mouseleave", () => {
    playButtonImg.src = "/assets/Play_Unvisited.png";
});
playButtonImg.addEventListener("click", ()=>{
    mainVideo.paused ? mainVideo.play() : mainVideo.pause();
});
mainVideo.addEventListener("click", ()=>{
    if (mainVideo.paused === false){
        mainVideo.pause();
    } 
});


//progressBar timeupdate
mainVideo.addEventListener("timeupdate", e => {
    let {currentTime, duration} = e.target;
    let percent = (currentTime / duration) * 100;
    progressBar.style.width = `${percent}%`;
    currentVidTime.innerText = formatTime(currentTime);
});

//skipBackward/skipForward
skipBackward.addEventListener("click", () => {
    mainVideo.currentTime -= 5;
})

skipForward.addEventListener("click", () => {
    mainVideo.currentTime += 5;
})
//Volume turn on/off
volumeBtn.addEventListener("click", () => {
    if (!volumeBtn.classList.contains("fa-volume-high")){
        mainVideo.volume = 0.5;
        volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
    } else {
        mainVideo.volume = 0.0;
        volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
    }
    volumeSlider.value = mainVideo.volume;  //update slider value acc.to video volume
});
//Volume Slider
volumeSlider.addEventListener("input", e => {
    mainVideo.volume = e.target.value;
    // console.log(e.target.value);
    if (e.target.value === "0"){
        volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
    } else {
        volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
    }
})
//Speed Button
speedBtn.addEventListener("click", () => {
    speedOptions.classList.toggle("show");

})
//Speed Options are hidden when clicking on document
document.addEventListener("click", e => {
    if (e.target.tagName !== "SPAN" || e.target.className !== "material-symbols-rounded"){
        speedOptions.classList.remove("show");
    }
})
//Set up video speed when clicking on Speed Option
speedOptions.querySelectorAll("li").forEach(option => {
    option.addEventListener("click", () => {
        mainVideo.playbackRate = option.dataset.speed; //passing option-dataset-value as video-playback-speed
        speedOptions.querySelector(".active").classList.remove("active");
        option.classList.add("active");
    });
})

//picInPic Button - change video mode to pic-in-pic
picInPicBtn.addEventListener("click", () => {
    mainVideo.requestPictureInPicture();     
})
//fullscreen
fullScreenBtn.addEventListener("click", () => {
    if(document.fullscreenElement){
        fullScreenBtn.classList.replace("fa-compress", "fa-expand");
        return document.exitFullscreen();
    } else{
        fullScreenBtn.classList.replace("fa-expand", "fa-compress");
        containerVid.requestFullscreen();
    }
})

//videoTimeline progressBar - positionX, e.offsetX - mouse positionX, el.clientWidth - width of element
videoTimeline.addEventListener("click", e => {
    let timelineWidth = videoTimeline.clientWidth;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;

})

//videoDuration = duration of mainVideo loadeddata 
mainVideo.addEventListener("loadeddata", e => {
    videoDuration.innerText = formatTime(e.target.duration);
})

//progressBar - draggable
videoTimeline.addEventListener("mousedown", () => {
    videoTimeline.addEventListener("mousemove", draggableProgressBar);
})
const draggableProgressBar = e => {
    let timelineWidth = videoTimeline.clientWidth;
    progressBar.style.width = `${e.offsetX}px`;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
    currentVidTime.innerText = formatTime(mainVideo.currentTime); //ongoing vidTime when dragging
}

containerVid.addEventListener("mouseup", () => {  //to remove mousemove event
    videoTimeline.removeEventListener("mousemove", draggableProgressBar);
})

//videoTimeline span - ongoing vidTime moving
videoTimeline.addEventListener("mousemove", e => {
    const progressTime = videoTimeline.querySelector("span");
    let offsetX = e.offsetX;
    progressTime.style.left = `${offsetX}px`;
    let timelineWidth = videoTimeline.clientWidth;
    let percent = (e.offsetX / timelineWidth) * mainVideo.duration;
    progressTime.innerText = formatTime(percent);
})

//show/hide Controls
const hideControls = () => {
    if (mainVideo.paused) return;
    timer = setTimeout(() => {
        containerVid.classList.remove("show-controls");
    }, 3000);
}
hideControls();

containerVid.addEventListener("mousemove", () => {  
    containerVid.classList.add("show-controls");
    clearTimeout(timer);
    hideControls();
})

/////////////Portfolio Buttons
const buttonsTextList = ["Winter", "Spring", "Summer", "Autumn"];
const images = [
    [
        "/assets/winter-1.png",
        "/assets/winter-2.png",
        "/assets/winter-3.png",
        "/assets/winter-4.png",
        "/assets/winter-5.png",
        "/assets/winter-6.png"
    ],
    [
        "/assets/spring-1.jpg",
        "/assets/spring-2.jpg",
        "/assets/spring-3.jpg",
        "/assets/spring-4.jpg",
        "/assets/spring-5.jpg",
        "/assets/spring-6.jpg"
    ],
    [
        "/assets/summer-1.jpg",
        "/assets/summer-2.jpg",
        "/assets/summer-3.jpg",
        "/assets/summer-4.jpg",
        "/assets/summer-5.jpg",
        "/assets/summer-6.jpg"
    ],
    [
        "/assets/autumn-1.jpg",
        "/assets/autumn-2.jpg",
        "/assets/autumn-3.jpg",
        "/assets/autumn-4.jpg",
        "/assets/autumn-5.jpg",
        "/assets/autumn-6.jpg"
    ]
];

portfolioBtnAll.forEach(button => {
    button.addEventListener("click", () => {
        portfolioBtnAll.forEach(buttonAct =>{
            buttonAct.classList.remove("btn-active");
        })

        for (let i = 0; i < buttonsTextList.length; i++) {
            if (button.innerText === buttonsTextList[i]) {
                button.classList.add("btn-active");
                console.log(images[i]);
                for (let k = 0; k < portfolioImgAll.length; k++) {
                    portfolioImgAll[k].src = images[i][k];
                    
                }
            } 
        }
    })
})

/////////////Menu Burger
burgerBtn.addEventListener("click", ()=>{
    menuToggle();
});

closeBtn.addEventListener("click", () => {
    menuToggle();
})

function menuToggle(){
    burgerBtn.classList.toggle("burger-inactive");
    menu.classList.toggle("menu-active");
}

window.addEventListener("keydown", e => {
    if (e.key === "Escape"){
        burgerBtn.classList.remove("burger-inactive");
        menu.classList.remove("menu-active");
    }
})

///////////Form Inputs focus
formInputs.forEach(input => {
    let val = input.value;
    input.addEventListener("focusin", () => {
        if (input.value === "E-mail" || input.value === "Phone" || input.value === "Message"){
            input.value = "";
        }
    });
    input.addEventListener("focusout", () => {
        if (input.value === ""){
            input.value = val;
        }
    });
})



form.addEventListener("submit", e => {
    e.preventDefault();
    let isFilledIn = true;
    formInputs.forEach(input => {
        if (input.value === "E-mail" || input.value === "Phone" || input.value === "Message" || input.value === ""){
            alert("Please fill in the required fields");
            isFilledIn = false;
        } 
    })
    if (isFilledIn == true) {
        let isConfirmed = confirm("Are you sure you want to submit the form?");
        if(isConfirmed === true){
            alert("Form is submitted");
            window.location.href = "https://online.myfreedom.by/";
        } 
    } 
})

