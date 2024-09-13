let levelBlock = document.querySelector(".level-block");
let gameBlock = document.querySelector(".game-block");
let body = document.querySelector("body");
let lvl;
let numberN1;
let numberN2;
let isClicked = 0;
let score = 0;
let secretNumbers = [];
let cubeName;
let randomImgNumber;
let isClosed = true;
let imgsArr = [
  "imgs/images (1).png",
  "imgs/images (2).png",
  "imgs/images (3).png",
  "imgs/images (4).png",
  "imgs/images (5).png",
  "imgs/images (6).png",
  "imgs/images (7).png",
  "imgs/images (8).png",
  "imgs/images (9).png",
  "imgs/images (10).png",
  "imgs/images (11).png",
  "imgs/images (12).png",
  "imgs/images (13).png",
  "imgs/images (14).png",
  "imgs/images (15).png",
  "imgs/images (16).png",
  "imgs/images (17).png",
  "imgs/images (18).png",
];

if (localStorage.getItem('lvl')) { lvl = localStorage.getItem('lvl') }
else { lvl = 1 }

class ImgObj {
  constructor(src, number) {
    this.src = src;
    this.number = number;
  }
}

let clickLevel = function (btn, n) {
  let whatLevel = 4 + n * 2;

  btn.addEventListener("click", () => {
    gameBlock.innerHTML = "";
    levelBlock.className = `level-block d-flex d-none`;
    gameBlock.className = `game-block d-flex`;

    let scoreBlock = document.createElement("div");
    scoreBlock.className = "score";
    gameBlock.prepend(scoreBlock);

    let complatedButton = document.createElement("button");
    complatedButton.className = "complated";
    complatedButton.innerText = "Complated";
    gameBlock.append(complatedButton);

    for (i = 1; i <= whatLevel; i++) {
      if (i <= whatLevel / 2) {
        number = i;
      } else {
        number = i - whatLevel / 2;
      }
      secretNumbers.push(number);
    }

    secretNumbers.sort(() => Math.random() - 0.5);

    for (i = 1; i <= whatLevel; i++) {
      let gameCube = document.createElement("div");
      let gameCubeSecret = document.createElement("div");
      let gameCubeColor = document.createElement("div");
      let img = document.createElement("img");
      gameCube.className = "cube";
      gameCubeSecret.className = `secret secret-${secretNumbers[i - 1]}`;
      gameCubeColor.className = "color";



      img.setAttribute("src", `${imgsArr[secretNumbers[i - 1] - 1]}`);
      img.className = "imgs";

      gameCubeSecret.setAttribute(
        "aria-placeholder",
        `${secretNumbers[i - 1]}`
      );
      // gameCubeSecret.innerHTML = `<p>${secretNumbers[i - 1]}</p>`;
      scoreBlock.innerHTML = `Score-${score}`;
      gameCubeSecret.append(img);

      gameBlock.append(gameCube);
      gameCube.append(gameCubeSecret);
      gameCube.append(gameCubeColor);
      game(gameCube, gameCubeSecret, scoreBlock, whatLevel, complatedButton);
      gameCube.setAttribute("name", `${i}`);
    }
  });
};

let time = function (gameCubeSecret) {
  gameCubeSecret.style.zIndex = "-1";
  document.querySelectorAll(`.secret-${numberN1}`)[0].style.zIndex = "-1";
  document.querySelectorAll(`.secret-${numberN1}`)[1].style.zIndex = "-1";
  isClicked = 0;
};

let game = function (
  gameCube,
  gameCubeSecret,
  scoreBlock,
  whatLevel,
  complatedButton
) {
  gameCube.addEventListener("click", () => {
    if (isClosed) {
      if (isClicked == 0 && gameCubeSecret.style.zIndex != "1") {
        numberN1 = gameCubeSecret.getAttribute("aria-placeholder");
        isClicked = 1;
        cubeName = gameCube.attributes.name.value;
      } else if (
        isClicked == 1 &&
        gameCubeSecret.style.zIndex != "1" &&
        gameCube.attributes.name.value != cubeName
      ) {
        numberN2 = gameCubeSecret.getAttribute("aria-placeholder");

        isClicked = 0;
        cubeName = undefined;
      }
      gameCubeSecret.style.zIndex = "1";
    }
    if (numberN1 != undefined && numberN2 != undefined) {
      if (numberN1 != numberN2) {
        isClosed = false;
        setTimeout(() => {
          isClosed = true;
          time(gameCubeSecret);
          numberN1 = undefined;
          numberN2 = undefined;
        }, 1000);

      } else {
        isClicked = 0;
        score++;
        console.log(numberN1);

        let audio = document.createElement('audio');
        audio.src = `./sound/audio(${numberN1}).mp4`;
        audio.play();

        if (audio.ended) {
          audio.remove();
        }


        scoreBlock.innerHTML = `<p>Score-${score}</p>`;
        if (score == whatLevel / 2) {
          score = 0;
          complatedButton.classList += " complated-active";
          complatedButton.addEventListener("click", () => {
            levelBlock.className = `level-block d-flex`;
            gameBlock.className = `game-block d-flex d-none`;
            lvl = whatLevel / 2 - 1;
            localStorage.setItem('lvl', lvl);
            levelBlock.innerHTML = "";
            createLvlButtons();
            secretNumbers = [];
          });
        }
        numberN1 = undefined;
        numberN2 = undefined;
      }

      // func();
    }
  });
};

let createLvlButtons = function () {
  for (i = 1; i <= 16; i++) {
    let levelButton = document.createElement("div");
    levelButton.className = `level-button d-flex`;
    levelButton.setAttribute("name", `${i}`);
    levelBlock.append(levelButton);
    levelButton.innerHTML = `<p>Level-${i}</p>`;
    if (lvl >= i) {
      levelButton.classList += " level-active";
      clickLevel(levelButton, i);
    }
  }
};
createLvlButtons();
