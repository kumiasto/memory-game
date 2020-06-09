class memoryGame {
  constructor() {
    this.elementsColor = [
      "green",
      "green",
      "lightgreen",
      "lightgreen",
      "violet",
      "violet",
      "red",
      "red",
      "sand",
      "sand",
      "blue",
      "blue",
      "lightblue",
      "lightblue",
      "darkmagenta",
      "darkmagenta",
      "yellow",
      "yellow",
      "orange",
      "orange",
    ];

    this.elements = null;
    this.elementsArray = [];
    this.pairs = 10;
    this.counter = 0;
    this.timerInterval = 300;
    this.movement = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.local = 0;
    this.gameTime = 0;

    this.getSelectors = {
      elements: "[data-elements]",
    };
  }

  initializeGame() {
    this.elements = document.querySelectorAll(this.getSelectors.elements);
    this.addListener();
    this.randomPairs();
    this.addHiddenToElement(1000);
    this.timer();
  }

  addListener() {
    this.elements.forEach(element => element.addEventListener("click", () => this.checkPairs(element)));
  }

  randomPairs() {
    this.elements.forEach((element) => {
      const index = Math.floor(Math.random() * this.elementsColor.length);
      element.classList.add(this.elementsColor[index]);
      this.elementsColor.splice(index, 1);
    });
  }

  addHiddenToElement(time) {
    setTimeout(() => {
      this.elements.forEach((element) => !element.classList.contains("zindex") ? element.classList.add("hidden") : false);
    }, time);
  }

  removeHiddenFromElement(clickNumber) {
    this.elementsArray[clickNumber].classList.remove("hidden");
  }

  checkPairs(element) {
    const isHidden = element.classList.contains('hidden');

    if (this.elementsArray.length === 0 && isHidden) {
      this.elementsArray.push(element);
      this.removeHiddenFromElement(0);

    } else if (this.elementsArray.length === 1 && isHidden) {
      this.elementsArray.push(element);
      this.removeHiddenFromElement(1);
    }

    if (this.elementsArray.length === 2) {

      if (this.elementsArray[0].className === this.elementsArray[1].className) {
        this.counter++;
        setTimeout(() => {

          this.elementsArray.forEach(element => element.classList.add("zindex"));
          this.clearArray();
          this.counterPairs();
        }, this.timerInterval);
        console.log(this.counter);
      } else {
        this.clearArray();
        this.addHiddenToElement(200);
      }
    } else return;

    this.movementNumbers();
    this.endGame();
  }

  clearArray() {
    this.elementsArray.length = 0;
  }

  movementNumbers() {
    this.movement++;
    document.querySelector(".movement").textContent = `Ruchy: ${Math.floor(this.movement)}`;
  }

  counterPairs() {
    document.querySelector(".pairNumber").textContent = `${this.counter} z 10`;
  }

  timer() {
    let timeCounter = setInterval(() => {
      this.seconds++;
      if (this.seconds >= 60) {
        this.minutes++;
        this.seconds = 0;
        this.minutes = this.minutes < 10 ? `0${this.minutes}` : this.minutes;
      }
      this.seconds = this.seconds < 10 ? `0${this.seconds}` : this.seconds;
      document.querySelector(".timer").textContent = `${this.minutes}:${this.seconds}`;
      if (this.counter === 10) {
        clearInterval(timeCounter);
        this.storageResult();
      }
    }, 1000);
  }

  storageResult() {
    this.gameTime = `${this.minutes}:${this.seconds}`;

    if (localStorage.length === 0) {
      localStorage.setItem('timer', this.gameTime);

    } else if (localStorage.timer > this.gameTime) {
      localStorage.setItem('timer', this.gameTime);
    }
  }

  endGame() {
    const divEnd = document.querySelector('.endGame');
    const btnEnd = document.querySelector('.btnEnd');
    const pEndTime = document.querySelector('.endTime');
    const pBestTime = document.querySelector('.bestTime');
    const pEndMovement = document.querySelector('.endMovement');
    const pNewHighscore = document.querySelector(".newHighscore");
    const timeCounter = document.querySelector(".timer");

    if (this.counter === this.pairs) {
      let actualResult = `${this.minutes}:${this.seconds + 1}`;

      divEnd.classList.add('visible');
      pEndMovement.textContent = `Liczba ruchów: ${this.movement}`;
      pEndTime.textContent = `Twój czas: ${actualResult}`;

      if (localStorage.timer > actualResult) {
        pNewHighscore.classList.add('block');
      }
      btnEnd.addEventListener('click', () => {
        divEnd.classList.remove('visible');
        location.reload();
      })
      if (localStorage.length === 0) return
      else {
        pBestTime.textContent = `Twój najlepszy czas: ${localStorage.timer}`;
        pBestTime.classList.add('block');
      }
    }
  }
}