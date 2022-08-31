
const wrapperGame = document.querySelector('.wrapper__game'); // получаем элемент - обертку игрового поля

const playField = []; // creating matrix a playing field 

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

let randomColor = ''; // stores random color

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

function downElement(speed) { // element drop

  rowPosition = 0;

  randomColor = choosingColor(figureColor, randomValue(0, figureColor.length - 1));

  randomElement = choosingShape(figure, figureName, randomValue(0, figureName.length - 1));

  randomElement.length === 4 ? columnsPosition = 3 : columnsPosition = 4 // the initial position of the element

  randomElement.length === 4 ? rowPosition = 0 : rowPosition = 1 // the initial position of the element

  const interval = setInterval(() => {
    rowPosition++;
    const flag = clearPlayField(randomElement, rowPosition, columnsPosition, playField, randomColor);
    if (flag) {
      clearInterval(interval);
      downElement(speed);
    }
  }, speed);
}

downElement(1000);

document.addEventListener('keydown', (e) => {

  clearPlayField(randomElement, rowPosition, columnsPosition, playField, randomColor);

  if (e.key === 'ArrowLeft' && !barrierLeft) { // element left
    columnsPosition--;
    clearPlayField(randomElement, rowPosition, columnsPosition, playField, randomColor);
  }
  if (e.key === 'ArrowRight' && !barrierRight) { // element right
    columnsPosition++;
    clearPlayField(randomElement, rowPosition, columnsPosition, playField, randomColor);
  }
  if (e.key === 'ArrowDown') { // element down
    rowPosition++;
    clearPlayField(randomElement, rowPosition, columnsPosition, playField, randomColor);
  }
  if (e.key === 'ArrowUp') {
    randomElement = rotateFigure(randomElement); // element rotate
    clearPlayField(randomElement, rowPosition, columnsPosition, playField, randomColor);
  }
  barrierLeft = barrierRight = false;
});