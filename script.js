const diceImg = document.querySelector('.dice');
const newGameBtn = document.querySelector('.btn-new-game');
const rollADiceBtn = document.querySelector('.btn-roll');
const holdBtn = document.querySelector('.btn-hold');

const player1Score = document.getElementById('player-score-0');
const player2Score = document.getElementById('player-score-1');

const player1CurrentScore = document.getElementById('player-current-score-0');
const player2CurrentScore = document.getElementById('player-current-score-1');

const modal = document.getElementById('modal');
const modalCloseSpan = document.querySelector('.close');
const modalParagraphText = document.getElementById('modal-content-paragraph');

const Game = function () {
  this.scoreToWin = 100;
  this.playersScores = [0, 0];
  this.playersCurrentScores = [0, 0];
  this.activePlayer = 0;
  this.dice = 0;

  //event listeners
  newGameBtn.addEventListener('click', this.newGameEvent.bind(this));
  rollADiceBtn.addEventListener('click', this.rollADiceEvent.bind(this));
  holdBtn.addEventListener('click', this.holdDiceScoreEvent.bind(this));
  modalCloseSpan.addEventListener('click', this.closeModalEvent.bind(this));
  //if modal opened & clicked anywhere but modal - close modal
  window.addEventListener('click', this.closeModalEvent.bind(this));

  //hide dice img
  diceImg.classList.contains('hidden') || diceImg.classList.add('hidden');
  //disable [Hold] button
  this.disableEnableHoldButton();
};

Game.prototype.reset = function () {
  // reset scores
  this.playersScores = [0, 0];
  this.playersCurrentScores = [0, 0];
  this.activePlayer = 0;
  this.dice = 0;
  //disable [Hold] button
  this.disableEnableHoldButton();
  //update data view
  this.updateDiceView();
  //hide dice img
  diceImg.classList.contains('hidden') || diceImg.classList.add('hidden');
};

Game.prototype.rollADice = function () {
  // get a dice number
  this.dice = this.getRandomInt(1, 6);

  //set current scores
  this.playersCurrentScores[this.activePlayer] = this.dice;

  this.updateDiceView();
  if (this.dice === 1) {
    this.changeActivePlayer();
    //reset current scores
    this.playersCurrentScores = [0, 0];
  }
};

Game.prototype.saveCurrentScore = function () {
  // check if dice is equal to 1 or clicked before any result
  if (this.dice === 1 || this.playersCurrentScores[this.activePlayer] === 0)
    return;

  // update user score
  this.playersScores[this.activePlayer] =
    this.playersCurrentScores[this.activePlayer] +
    this.playersScores[this.activePlayer];

  //reset current scores
  this.playersCurrentScores = [0, 0];

  // update UI
  this.updateDiceView();

  this.checkIfWon();
  this.changeActivePlayer();
};

Game.prototype.getRandomInt = function (min, max) {
  return Math.floor(Math.random() * max) + min;
};

Game.prototype.disableEnableHoldButton = function (enable) {
  if (typeof enable !== 'boolean') {
    enable = false;
  }
  //disable/enable [Hold] button
  if (enable && holdBtn.classList.contains('disabled')) {
    holdBtn.classList.remove('disabled');
    holdBtn.disabled = false;
  } else if (!enable && !holdBtn.classList.contains('disabled')) {
    holdBtn.classList.add('disabled');
    holdBtn.disabled = true;
  }
};

Game.prototype.changeActivePlayer = function () {
  this.activePlayer = this.activePlayer === 0 ? 1 : 0;
};

Game.prototype.updateDiceView = function () {
  // set img to this.diceNumber, update fields in UI
  if (this.dice !== 0) diceImg.setAttribute('src', `img/dice-${this.dice}.png`);
  //show dice img (could be refactored into image 'load' event listener, but image size is so small that it doesn't really matter for this particular case)
  diceImg.classList.contains('hidden') && diceImg.classList.remove('hidden');

  //update scores & current scores in view
  player1Score.textContent = this.playersScores[0];
  player2Score.textContent = this.playersScores[1];
  player1CurrentScore.textContent = this.playersCurrentScores[0];
  player2CurrentScore.textContent = this.playersCurrentScores[1];

  // make inactive/active button for saving a value
  if (
    this.playersCurrentScores[this.activePlayer] === 0 ||
    this.playersCurrentScores[this.activePlayer] === 1
  ) {
    this.disableEnableHoldButton();
  } else {
    this.disableEnableHoldButton(true);
  }
};

Game.prototype.checkIfWon = function () {
  // check if any of the players won (100 points?)
  if (Number(this.playersScores[0]) >= this.scoreToWin) {
    // update modal
    modalParagraphText.innerText = 'Congratulations! Player 1 WON !';
  } else if (Number(this.playersScores[1]) >= this.scoreToWin) {
    // update modal
    modalParagraphText.innerText = 'Congratulations! Player 2 WON !';
  } else {
    // none of players won - return from a method
    return;
  }
  // show modal
  modal.classList.toggle('hidden');
  // reset game
  this.reset();
};

Game.prototype.newGameEvent = function (e) {
  if (confirm('Are you sure you want to reset the game?')) this.reset();
};

Game.prototype.rollADiceEvent = function (e) {
  this.rollADice();
};

Game.prototype.holdDiceScoreEvent = function (e) {
  this.saveCurrentScore();
};

Game.prototype.closeModalEvent = function (e) {
  if (
    e.target == modalCloseSpan ||
    (e.target == modal && !modal.classList.contains('hidden'))
  ) {
    modalParagraphText.innerText = '';
    modal.classList.add('hidden');
  }
};

// start the game
new Game();
