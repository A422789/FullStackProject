'use strict';

(function() {
// Video Popup Placeholder

const playBtn =
document.querySelector(".play-btn");

if(playBtn){

    playBtn.addEventListener("click",()=>{

        window.open(
        "https://www.youtube.com/",
        "_blank"
        );

    });

}
})();
