var numOfDrum = document.querySelectorAll(".drum").length;

for (var i = 0; i < numOfDrum; i++){
    document.querySelectorAll(".drum")[i].addEventListener("click", buttonClick);
};

// Detecting button press
function buttonClick (){
    var buttonInnerHtml = this.innerHTML;
    makeSound(buttonInnerHtml);
    buttonAnimation(buttonInnerHtml);
};

//Detection keyboard press
document.addEventListener("keydown", function (event){
    makeSound(event.key);
    buttonAnimation(event.key);
});

function makeSound (key){
    switch (key) {
        case "i":
            var tom1 = new Audio('sounds/tom-1.mp3');
            tom1.play();
            break;
        case "e":
            var tom2 = new Audio('sounds/tom-2.mp3');
            tom2.play();
            break;
        case "s":
            var tom3 = new Audio('sounds/tom-3.mp3');
            tom3.play();
            break;            
        case "r":
            var tom4 = new Audio('sounds/tom-4.mp3');
            tom4.play();
            break;
        case "o":
            var crash = new Audio('sounds/crash.mp3');
            crash.play();
            break;
        case "k":
            var kick = new Audio('sounds/kick-bass.mp3');
            kick.play();
            break;
        case "h":
            var snare = new Audio('sounds/snare.mp3');
            snare.play();
            break; 
        default:
            console.log(buttonInnerHtml);                                 
    }
};

function buttonAnimation (currentKey){
    var activebutton = document.querySelector("."+ currentKey);
    activebutton.classList.add("pressed");
    setTimeout( function (){
        activebutton.classList.remove("pressed");
    }, 100);
};