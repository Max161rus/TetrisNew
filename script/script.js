
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

const figureName = ['I', 'O', 'T', 'L', 'J', 'Z', 'S'];

const color = ['Red', 'Fuchsia', 'Purple', 'Maroon', 'Yellow', 'Olive', 'Lime']; // color element`s

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

function downElement(speed) {
  let rowDown = 0;
  const interval = setInterval(() => {
    const flag = clearPlayField(figure.L, rowDown, 3, playField, 'green');
    console.log(playField)
    rowDown++;
    if(flag){
      clearInterval(interval);
      rowDown = 0;
      downElement(speed);
    }
  }, speed);
}


downElement(100);