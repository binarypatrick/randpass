function getRandomArray(length) {
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return [...array];
}

function fillCanvas(canvas, size, array) {
  const ctx = canvas.getContext('2d');
  const max = array.reduce((a, b) => (a > b ? a : b), 0);
  const min = array.reduce((a, b) => (a < b ? a : b), max);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const value = array[size * i + j];
      const color = ((value - min) / (max - min)) * 255;
      ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
      ctx.fillRect(i, j, 1, 1);
    }
  }
}

function getRandomCounts(size) {
  const array = Array(size).fill(0);
  const rounds = Math.trunc(size / 400) || 1;
  const randArray = new Uint32Array(10000);
  for (let x = 0; x < rounds; x++) {
    crypto.getRandomValues(randArray);
    randArray.forEach(x => {
      const index = x % size;
      array[index]++;
    });
  }
  return array;
}

function createStaticCanvas(size) {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('height', size * 1);
  canvas.setAttribute('width', size * 1);
  const cnArray = getRandomCounts(Math.pow(size, 2));
  fillCanvas(canvas, size, cnArray);
  return canvas;
}

function getCharSet() {
  const symbolsMap = [33, 35, 36, 37, 38, 43, 45, 63, 64];
  const ambiguous = [48, 49, 73, 74, 79, 81, 85, 86, 105, 106, 108, 111, 112, 113, 117, 118];
  const upperMap = Array(26)
    .fill(65)
    .map((x, i) => x + i);
  const lowerMap = Array(26)
    .fill(97)
    .map((x, i) => x + i);
  const numericMap = Array(10)
    .fill(48)
    .map((x, i) => x + i);
  let charSet = [];
  if (isLower) {
    charSet.push(...lowerMap);
  }
  if (isUpper) {
    charSet.push(...upperMap);
  }
  if (isNumeric) {
    charSet.push(...numericMap);
  }
  if (isSymbols) {
    charSet.push(...symbolsMap);
  }
  if (isAvoidAmbiguous) {
    charSet = charSet.filter(x => !ambiguous.includes(x));
  }
  return charSet.sort((a, b) => (a < b ? -1 : 1)).map(x => String.fromCharCode(x));
}

function getPassword(length, charSet) {
  let array = getRandomArray(length).map(x => charSet[x % charSet.length]);
  return array.join('');
}

function initializeCheckbox(key, defaultValue) {
  let value = defaultValue;
  const cache = localStorage.getItem(`randpass:${key}`);
  if (cache !== null && cache !== undefined) {
    value = cache === 'true';
  }
  if (value) {
    element = document.getElementById(key);
    element.setAttribute('checked', true);
  }
  return value;
}

function toggle(value, key) {
  localStorage.setItem(`randpass:${key}`, value);
  refreshPasswords();
}

function addPasswordGroup(length, charSet) {
  const passwordContainer = document.createElement('div');
  passwordContainer.classList.add('password-container');
  const label = document.createElement('h2');
  label.innerText = `Length ${length}`;
  passwordContainer.appendChild(label);

  for (let i = 0; i < 15; i++) {
    const password = getPassword(length, charSet);
    const passwordElement = document.createElement('div');
    passwordElement.classList.add('password');
    passwordElement.innerText = password;
    passwordContainer.appendChild(passwordElement);
  }
  container.appendChild(passwordContainer);
}

function refreshPasswords() {
  container.innerHTML = null;
  const charSet = getCharSet();
  addPasswordGroup(16, charSet);
  addPasswordGroup(32, charSet);
  addPasswordGroup(64, charSet);
  addPasswordGroup(128, charSet);
  addPasswordGroup(256, charSet);
}
