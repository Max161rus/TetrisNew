const wrapperGame = document.querySelector('.wrapper__game'); // gameField visual

const preElement = document.querySelector('.wrapper__table-element'); // preliminary element visual

const playField = []; // creating matrix a playing field 

const menuField = []; // creating matrix a menu field 

const figure = { // creating object a matrix element
  'I': [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  'O': [
    [1, 1],
    [1, 1]
  ],
  'T': [
    [1, 1, 1],
    [0, 1, 0],
    [0, 0, 0]
  ],
  'L': [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0]
  ],
  'J': [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  'Z': [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0]
  ],
  'S': [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0]
  ]
};

const figureName = ['I', 'O', 'T', 'L', 'J', 'Z', 'S']; // name element;

const figureColor = ['Red', 'Fuchsia', 'Purple', 'Maroon', 'Yellow', 'Olive', 'Lime']; // color element`s

let columnsPosition = 0; // the position of the element on the X axis 

let rowPosition = 0; // the position of the element on the Y axis

let randomElement = 0; // random element

let barrierLeft = false; // barrier from the left

let barrierRight = false; // barrier from the right

let barrierDown = false; // barrier from the down

let barrierRotate = false; // barrier during rotation

let randomColor = ''; // stores random color

let speedDown = 1000; // element drop rates

let gamePoints = 0; // game points

let gameСycle = false; // the game has just started, if cycle > 0 gameСycle = true;

let randomColorMenuElement = ''; // color of the menu item

let randomElementMenu = 0; // random element menu

function drawField() { // draw a playing field
  for (let i = 0; i < 200; i++) {
    const element = document.createElement('div');
    element.classList.add('wrapper__game-cube');
    wrapperGame.appendChild(element);
  }
}

drawField();

function zerosInPlayField() { // creating a matrix of the playing field 
  for (let i = 0; i < 24; i++) {
    playField[i] = [];
    for (let j = 0; j < 10; j++) {
      if (i > 21) {
        playField[i][j] = 2;
      } else {
        playField[i][j] = 0;
      }
    }
  }
}

zerosInPlayField();

function drawMenuField() { // draw a menu field
  for (let i = 0; i < 100; i++) {
    const element = document.createElement('div');
    element.classList.add('wrapper__menu-cube');
    preElement.appendChild(element);
  }
}

drawMenuField();

function zeroInMenuField() { // creating a matrix of the menu field
  for (i = 0; i < 10; i++) {
    menuField[i] = [];
    for (let j = 0; j < 10; j++) {
      menuField[i][j] = 0;
    }
  }
}

zeroInMenuField();

function writeMenuField(matrix) { // write matrix element in menu field
  let row = 5;
  let col = 5;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      menuField[row][col] = matrix[i][j];
      col++;
    }
    col = 5;
    row++;
  }
}

function drawElementMenuField(color) { // let's paint over the elements of the munu field corresponding to 1
  const arrCellMenuField = document.querySelectorAll('.wrapper__menu-cube');

  let indexCellMenuField = 0;

  menuField.map((item, key) => {
    item.map(item => {
      if (item === 1) {
        arrCellMenuField[indexCellMenuField].style.backgroundColor = color;
      } else if (item === 0) {
        arrCellMenuField[indexCellMenuField].style.backgroundColor = 'white';
      }
      indexCellMenuField++;
    })
  })
}

function clearMenuField(matrix, color) { // remove the element matrix from the menu field
  writeMenuField(matrix);
  drawElementMenuField(color);
  let row = 5;
  let col = 5;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      if(matrix[i][j] === 1) {
        menuField[row][col] = 0;
      }  
      col++;
    }
    col = 5;
    row++;
  }
}


function writePlayField(matrix, rowPlayField, colPlayField) { // write matrix element in play field
  let row = rowPlayField;
  let col = colPlayField;
  let flag = false; // flag of the presence of an obstacle from below

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      if (playField[row][col] === 0) {
        playField[row][col] = matrix[i][j];
      }
      if (matrix[i][j] === 1 && playField[row + 1][col] === 2) {
        flag = true;
      }
      if (matrix[i][j] === 1 && playField[row][col - 1] === undefined || matrix[i][j] === 1 && playField[row][col - 1] === 2) {
        barrierLeft = true;
      }
      if (matrix[i][j] === 1 && playField[row][col + 1] === undefined || matrix[i][j] === 1 && playField[row][col + 1] === 2) {
        barrierRight = true;
      }
      if (matrix[i][j] === 0 && playField[row][col] === undefined || matrix[i][j] === 0 && playField[row][col] === 2) {
        barrierRotate = true;
      }
      col++;
    }
    col = colPlayField;
    row++;
  }
  return flag;
}

function drawElement(playField, color) { // let's paint over the elements of the playing field corresponding to 1
  const arrCellPlayField = document.querySelectorAll('.wrapper__game-cube');

  let indexCellPlayField = 0;

  playField.map((item, key) => {
    item.map(item => {
      if (key > 1 && key < 22) {
        if (item === 1) {
          arrCellPlayField[indexCellPlayField].style.backgroundColor = color;
        } else if (item === 0) {
          arrCellPlayField[indexCellPlayField].style.backgroundColor = 'aquamarine';
        }
        indexCellPlayField++;
      }
    })
  })

}

function clearPlayField(matrix, rowPlayField, colPlayField, playField, color) { // remove the element matrix from the playing field
  let row = rowPlayField;
  let col = colPlayField;
  const flag = writePlayField(matrix, rowPlayField, colPlayField); // flag of the presence of an obstacle from below
  drawElement(playField, color);
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      if (matrix[i][j] === 1 && !flag) {
        playField[row][col] = 0;
      } else if (matrix[i][j] === 1 && flag) {
        playField[row][col] = 2;
      }
      col++;
    }
    col = colPlayField;
    row++;
  }
  return flag;
}

function randomValue(min, max) { // get random value
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function choosingShape(objFigure, arrFigure, randomValue) { // get a random element
  const oldFigure = objFigure[arrFigure[randomValue]];
  const newFigure = [];
  for (let i = 0; i < oldFigure.length; i++) {
    newFigure[i] = [];
    for (let j = 0; j < oldFigure.length; j++) {
      newFigure[i][j] = oldFigure[i][j];
    }
  }
  return newFigure;
}

function choosingColor(arrColor, randomValue) { // get a random color`s element
  return arrColor[randomValue];
}

function rotateFigure(figure) { // rotate figure
  const newFigure = [];
  for (let i = 0; i < figure.length; i++) {
    newFigure[i] = [];
  }

  let row = 0;
  let col = 0;

  for (let i = 0; i < figure.length; i++) {
    for (let j = figure.length - 1; j >= 0; j--) {
      newFigure[row][col] = figure[j][i];
      col++;
    }
    col = 0;
    row++;
  }
  return newFigure;
}

function indexLineElement(playField) { // array of indexes of filled columns
  let indexLine = [];
  let index = 0;
  for (let i = 2; i < 22; i++) {
    if (playField[i].every(item => item === 2)) {
      indexLine[index] = i;
      index++;
    }
  }
  return indexLine;
}

function deletePlayFieldVisual(index) { // remove the filled lines from the visual part
  if (index.length !== 0) {
    const arrCellPlayField = document.querySelectorAll('.wrapper__game-cube');
    index.map((item, key) => {
      for (let i = 0; i < arrCellPlayField.length; i++) {
        if (i >= (index[key] - 2) * 10 && i < ((index[key] - 2) * 10) + 10) {
          arrCellPlayField[i].remove();
          const element = document.createElement('div');
          element.classList.add('wrapper__game-cube');
          wrapperGame.prepend(element);
        }
      }
    });
  }
}

function deletePlayFieldMatrix(index) { // delete the filled rows from the matrix
  if (index.length !== 0) {
    index.map(item => {
      playField.splice(item, 1);
      playField.splice(2, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    });
  }
}

function speedIncrease(flag) { // increase in the rate of falling of the element
  if (flag.length !== 0) {
    if (speedDown > 100) {
      speedDown = speedDown - 50;
    }
  }
}

function scoringPoints(flag) { // score points
  if (flag.length !== 0) {
    gamePoints = gamePoints + 100;
  } else {
    gamePoints = gamePoints + 10;
  }
  console.log(gamePoints);
}

function gameOwer() { // game ower
  if (playField[2].some(item => item === 2)) {
    console.log('game ower');
  }
}

function downElement(speed) { // element drop

  rowPosition = 0;

  if(!gameСycle){ 
    randomColor = choosingColor(figureColor, randomValue(0, figureColor.length - 1));
    randomElement = choosingShape(figure, figureName, randomValue(0, figureName.length - 1));
  } else {
    randomColor = randomColorMenuElement;
    randomElement = randomElementMenu;
  }

  gameСycle = true;

  randomColorMenuElement = choosingColor(figureColor, randomValue(0, figureColor.length - 1));

  randomElementMenu = choosingShape(figure, figureName, randomValue(0, figureName.length - 1));

  clearMenuField(randomElementMenu, randomColorMenuElement); 

  randomElement.length === 4 ? columnsPosition = 3 : columnsPosition = 4 // the initial position of the element

  randomElement.length === 4 ? rowPosition = 1 : rowPosition = 2 // the initial position of the element

  const interval = setInterval(() => {
    gameOwer();
    rowPosition++;
    if (barrierDown) {
      clearInterval(interval);
      const index = indexLineElement(playField);
      deletePlayFieldVisual(index);
      deletePlayFieldMatrix(index);
      speedIncrease(index);
      scoringPoints(index);
      downElement(speedDown);
    }
    barrierDown = clearPlayField(randomElement, rowPosition, columnsPosition, playField, randomColor);
  }, speed);
}

downElement(speedDown);

document.addEventListener('keydown', (e) => {

  clearPlayField(randomElement, rowPosition, columnsPosition, playField, randomColor);

  if (e.key === 'ArrowLeft' && !barrierLeft) { // element left
    columnsPosition--;
    barrierDown = clearPlayField(randomElement, rowPosition, columnsPosition, playField, randomColor);
  }
  if (e.key === 'ArrowRight' && !barrierRight) { // element right
    columnsPosition++;
    barrierDown = clearPlayField(randomElement, rowPosition, columnsPosition, playField, randomColor);
  }
  if (e.key === 'ArrowDown' && !barrierDown) { // element down
    rowPosition++;
    barrierDown = clearPlayField(randomElement, rowPosition, columnsPosition, playField, randomColor);
  }
  if (e.key === 'ArrowUp' && !barrierRotate) {
    randomElement = rotateFigure(randomElement); // element rotate
    clearPlayField(randomElement, rowPosition, columnsPosition, playField, randomColor);
  }
  if (e.key === ' ') { // element down
    while (!barrierDown) {
      rowPosition++;
      barrierDown = clearPlayField(randomElement, rowPosition, columnsPosition, playField, randomColor);
    }
  }
  barrierLeft = barrierRight = barrierRotate = false;
});

