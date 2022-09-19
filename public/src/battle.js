const leftTransitionDiv = document.querySelector('#leftTransitionDiv')
const rightTransitionDiv = document.querySelector('#rightTransitionDiv')

const battleTransitionDuration = 1.5 //Seconds

leftTransitionDiv.style.height = canvasHeight
rightTransitionDiv.style.height = canvasHeight


function playBattleTransition() {
    resetBattleTransition()
    battleTransition()
}

function resetBattleTransition() {
    leftTransitionDiv.style.width = 0
    
    rightTransitionDiv.style.width = 0
    rightTransitionDiv.style.left = canvasWidth 
}

function battleTransition() {
    gsap.to('#leftTransitionDiv', {
        left: 0,
        width: canvasWidth / 2 + 75, //75 is needed as they don't quite meet
        duration: battleTransitionDuration,
    })
    
    gsap.to('#rightTransitionDiv', {
        left: canvasWidth / 2,
        width: canvasWidth / 2,
        duration: battleTransitionDuration,
    })

}

