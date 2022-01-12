const container = document.getElementById('container');
let isUpper = initializeCheckbox('upper', true);
let isLower = initializeCheckbox('lower', true);
let isNumeric = initializeCheckbox('numeric', true);
let isSymbols = initializeCheckbox('symbols', true);
let isAvoidAmbiguous = initializeCheckbox('ambiguous', false);
refreshPasswords();

const thumbprint = document.getElementById('thumbprint');
if (!!thumbprint) {
  const canvas = createStaticCanvas(128);
  thumbprint.appendChild(canvas);
}
