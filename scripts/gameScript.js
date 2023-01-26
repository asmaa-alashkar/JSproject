/*******************selectors***************/
let welcomePopUp = document.querySelector(".welcomePopUp");
let playerNameDiv = document.querySelector(".nameOfPlayer");
let playerWelcome = document.querySelector(".welcomePlayer");
let player = location.search.split("=")[1];
playerNameDiv.innerHTML = `<h3>Welcome: ${player}</h3>`;
playerWelcome.innerHTML = `Welcome: ${player}`;
let birdsSrcs = [
  "../images/bird1.gif",
  "../images/bird2.gif",
  "../images/bird3.gif",
];
let createdBirds = [];
let killedBird = document.querySelector(".killedBird");
let playerScore = document.querySelector(".playerScore");
let playAgain = document.querySelector(".PlayAgainBtn");
let resultPopUp = document.querySelector(".result");
let score = 0;
let numberOfKilledBird = 0;
let seconds = 60;
let bombInterval, birdInterval;
let playerResult = document.querySelector(".playerResult");
let birdState = document.querySelector(".birdState");
/** function to create bird **/

const createBird = function () {
  let bird = document.createElement("img");
  bird.src = birdsSrcs[Math.floor(Math.random() * birdsSrcs.length)];
  moveRight(bird, 0);
};

/** on load window */
window.addEventListener("load", function () {
  let startBtn = this.document.querySelector(".startBtn");
  startBtn.addEventListener("click", function () {
    welcomePopUp.style.visibility = "hidden";
    createBird();
    createBomb();
    timer();
    /** bird will fly every 2 seconds **/
    birdInterval = setInterval(createBird, 2000);
    /** bomb will be dropped every 3 seconds **/
    bombInterval = setInterval(createBomb, 3000);
  });
});

/** move tne bird right **/
const moveRight = function (imageObject, left) {
  imageObject.classList.add("bird");
  document.body.append(imageObject);
  setInterval(function () {
    left += 10;
    if (left < innerWidth - imageObject.width) {
      imageObject.style.left = left + "px";
    } else {
      imageObject.style.visibility = "hidden";
    }
  }, 50);
  let top = Math.random() * innerHeight - imageObject.height;
  imageObject.style.top = top + "px";
};

const getPositionOfElement = function (createdBird) {
  let createdBirdPosition = createdBird.getBoundingClientRect();
  return {
    top: createdBirdPosition.top,
    left: createdBirdPosition.left,
    right: createdBirdPosition.right,
    bottom: createdBirdPosition.bottom,
    type: createdBird.src.split("/").pop(),
  };
};

const isCreatedBirdInRange = function (
  positionOfCreatedBomb,
  positionOfCreatedBird
) {
  let newPositionOfCreatedBomb = {
    top: positionOfCreatedBomb.top - 150,
    left: positionOfCreatedBomb.left - 150,
    right: positionOfCreatedBomb.right + 150,
    bottom: positionOfCreatedBomb.bottom + 150,
    type: positionOfCreatedBomb.type,
  };
  if (
    newPositionOfCreatedBomb.right >= positionOfCreatedBird.right &&
    newPositionOfCreatedBomb.left <= positionOfCreatedBird.left &&
    newPositionOfCreatedBomb.top <= positionOfCreatedBird.top &&
    newPositionOfCreatedBomb.bottom >= positionOfCreatedBird.bottom
  ) {
    return true;
  }
  return false;
};

const hideBirdAndCalculateScore = function (bird, source) {
  switch (source) {
    case "bird1.gif":
      score -= 10;
      break;
    case "bird2.gif":
      score += 10;
      break;
    case "bird3.gif":
      score += 5;
      break;
  }
  if (isLose()) {
    exitGame();
  }
  bird.remove();
  playerScore.innerHTML = `<h3>Score: ${score}</h3>`;
  numberOfKilledBird++;
};

const isLose = function () {
  if (score < 0 || (score < 50 && score > 0 && seconds <= 0)) {
    return true;
  }
  return false;
};

/** function to create bomb with conditions of bird killed **/
let createBomb = function () {
  let bomb = document.createElement("img");
  bomb.src = "../images/bomb.gif";
  bomb.classList.add("bomb");
  document.body.appendChild(bomb);
  let left = Math.random() * innerWidth - bomb.width;
  bomb.style.left = left + "px";
  bomb.style.top = "0px";
  moveDown(bomb, 0);
  bomb.addEventListener("click", function () {
    let positionsOfCreatedBirds = [];
    bomb.src = "../images/bombup.png";
    let positionOfBomb = getPositionOfElement(bomb);
    createdBirds = document.querySelectorAll(".bird");

    for (let index = 0; index < createdBirds.length; index++) {
      let positionOfCreatedBird = getPositionOfElement(createdBirds[index]);
      positionsOfCreatedBirds.push(positionOfCreatedBird);
      if (
        isCreatedBirdInRange(positionOfBomb, positionOfCreatedBird) &&
        !isLose()
      ) {
        hideBirdAndCalculateScore(
          createdBirds[index],
          positionOfCreatedBird.type
        );
      }
      killedBird.innerHTML = `<h3>Bird Killed: ${numberOfKilledBird}</h3>`;
    }
  });
};

/** move tne bomb down **/
const moveDown = function (imageObject, top) {
  let id = setInterval(function () {
    top += 10;

    if (top < innerHeight - imageObject.height) {
      imageObject.style.top = top + "px";
      imageObject.addEventListener("click", function () {
        clearInterval(id);
        setTimeout(function () {
          imageObject.style.visibility = "hidden";
        }, 1000);
      });
    } else {
      imageObject.style.visibility = "hidden";
    }
  }, 120);
};

const exitGame = function () {
  resultPopUp.style.visibility = "visible";

  clearInterval(bombInterval);
  clearInterval(birdInterval);
  if (isLose()) {
    playerScore.innerHTML = `<h3>Score: 0</h3>`;
    playerResult.innerHTML = "You Lose";
    birdState.src = "../images/sad.jpg";
  }
  let closeBtn = document.querySelector(".close");
  closeBtn.addEventListener("click", function () {
    resultPopUp.style.visibility = "hidden";
  });
  /** on click play Again Button */

  playAgain.addEventListener("click", function () {
    resultPopUp.style.visibility = "hidden";
    document.location.reload();
  });
};

/** count down timer */
let timer = function () {
  function tick() {
    let counter = document.querySelector(".timeLimit");
    seconds--;
    counter.innerHTML = `<h3>Time Limit: ${seconds < 10 ? "0" : ""}${String(
      seconds
    )}</h3>`;
    if (seconds > 0 && !isLose()) {
      setTimeout(tick, 1000);
    } else {
      exitGame();
    }
  }
  tick();
};
