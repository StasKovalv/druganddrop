const field = document.getElementById('field');

const generateInputId = () => {
  const inputs = Array.from(document.getElementsByClassName('inputField'));

  if (inputs.length <= 0) return 100;

  const inputIds = inputs.map(({ id }) => parseInt(id));
  return Math.max(...inputIds) + 1;
};

window.onload = () => {
  const fieldSaved = JSON.parse(sessionStorage.getItem('field'));
  if (fieldSaved) {
    field.innerHTML = fieldSaved;

    const cells = Array.from(field.getElementsByClassName('cell'));
    cells.forEach(cell => {
      addCellClickHandler(cell);
      addCellDragendHandler(cell);
    });

    const delButtons = Array.from(field.getElementsByClassName('dellButton'));
    delButtons.forEach(delButton => addDelButtonClickHandler(delButton));
  }

  const inputValues = JSON.parse(sessionStorage.getItem('inputValues'));
  inputValues.forEach(({ id, value }) => {
    const input = document.getElementById(id);
    input.value = value;
  });
};

const createCell = (parentElement, x, y) => {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.style.left = `${x}px`;
  cell.style.top = `${y}px`;
  cell.setAttribute('draggable', 'true');

  const input = document.createElement('input');
  input.classList.add('inputField');
  input.id = generateInputId();
  input.setAttribute('type', 'text');

  const delButton = document.createElement('div');
  delButton.innerHTML = '&#x274C;';
  delButton.classList.add('dellButton');

  addDelButtonClickHandler(delButton);

  addCellClickHandler(cell);
  addCellDragendHandler(cell);

  cell.appendChild(input);
  cell.appendChild(delButton);
  parentElement.appendChild(cell);
};

const moveCell = (cell, x, y) => {
  const currentX = parseInt(cell.style.left);
  const currentY = parseInt(cell.style.top);

  cell.style.left = `${currentX + x}px`;
  cell.style.top = `${currentY + y}px`;
};

const addFieldClickHandler = field => {
  field.addEventListener(
    'click',
    e => {
      const { layerX: x, layerY: y } = e;
      createCell(field, x, y);
    },
    false
  );
};

const addFieldDragoverHandler = field => {
  field.addEventListener(
    'dragover',
    e => {
      e.preventDefault();
    },
    false
  );
};

const addCellDragendHandler = cell => {
  cell.addEventListener(
    'dragend',
    e => {
      e.preventDefault();
      const { offsetX: x, offsetY: y } = e;
      moveCell(cell, x, y);
    },
    false
  );
};

const addCellClickHandler = cell => {
  cell.addEventListener('click', e => e.stopPropagation(), false);
};

const addDelButtonClickHandler = delButton => {
  delButton.addEventListener(
    'click',
    e => {
      e.stopPropagation();
      e.target.parentElement.remove();
    },
    false
  );
};

addFieldClickHandler(field);
addFieldDragoverHandler(field);

window.onbeforeunload = () => {
  const inputs = Array.from(document.getElementsByClassName('inputField'));
  const inputValues = inputs.map(({ id, value }) => ({ id, value }));

  sessionStorage.setItem('inputValues', JSON.stringify(inputValues));
  sessionStorage.setItem('field', JSON.stringify(field.innerHTML));
};
