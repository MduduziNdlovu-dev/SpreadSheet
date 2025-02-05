const infixToFunction = {
  "+": (x, y) => x + y,
  "-": (x, y) => x - y,
  "*": (x, y) => x * y,
  "/": (x, y) => x / y,
};

const infixEval = (str, regex) => 
  str.replace(regex, (_match, arg1, operator, arg2) => 
      infixToFunction[operator](parseFloat(arg1), parseFloat(arg2))
  );

const highPrecedence = str => {
  const regex = /([\d.]+)([*\/])([\d.]+)/;
  const str2 = infixEval(str, regex);
  return str === str2 ? str : highPrecedence(str2);
};

const isEven = num => num % 2 === 0;
const sum = nums => nums.reduce((acc, el) => acc + el, 0);
const average = nums => sum(nums) / nums.length;
const min = nums => Math.min(...nums);
const max = nums => Math.max(...nums);
const stdDev = nums => {
  const avg = average(nums);
  return Math.sqrt(average(nums.map(num => (num - avg) ** 2)));
};

const median = nums => {
  const sorted = nums.slice().sort((a, b) => a - b);
  const length = sorted.length;
  const middle = length / 2 - 1;
  return isEven(length)
      ? average([sorted[middle], sorted[middle + 1]])
      : sorted[Math.ceil(middle)];
};

const spreadsheetFunctions = {
  "": x => x,
  sum,
  average,
  median,
  min,
  max,
  stddev: stdDev,
  even: nums => nums.filter(isEven),
  someeven: nums => nums.some(isEven),
  everyeven: nums => nums.every(isEven),
  firsttwo: nums => nums.slice(0, 2),
  lasttwo: nums => nums.slice(-2),
  has2: nums => nums.includes(2),
  increment: nums => nums.map(num => num + 1),
  random: ([x, y]) => Math.floor(Math.random() * y + x),
  range: nums => range(...nums),
  nodupes: nums => [...new Set(nums).values()]
};

const applyFunction = str => {
  const noHigh = highPrecedence(str);
  const infix = /([\d.]+)([+-])([\d.]+)/;
  const str2 = infixEval(noHigh, infix);
  const functionCall = /([a-z0-9]*)\(([0-9., ]*)\)(?!.*\()/i;
  const toNumberList = args => args.split(",").map(parseFloat);
  const apply = (fn, args) => spreadsheetFunctions[fn.toLowerCase()](toNumberList(args));
  return str2.replace(functionCall, (match, fn, args) => 
      spreadsheetFunctions.hasOwnProperty(fn.toLowerCase()) ? apply(fn, args) : match
  );
};

const range = (start, end) => 
  Array(end - start + 1).fill(start).map((element, index) => element + index);

const charRange = (start, end) => 
  range(start.charCodeAt(0), end.charCodeAt(0)).map(code => String.fromCharCode(code));

const evalFormula = (x, cells) => {
  const idToText = id => cells.find(cell => cell.id === id).value;
  const rangeRegex = /([A-J])([1-9][0-9]?):([A-J])([1-9][0-9]?)/gi;
  const rangeFromString = (num1, num2) => range(parseInt(num1), parseInt(num2));
  const elemValue = num => character => idToText(character + num);
  const addCharacters = character1 => character2 => num => 
      charRange(character1, character2).map(elemValue(num));

  const rangeExpanded = x.replace(rangeRegex, (_match, char1, num1, char2, num2) => 
      rangeFromString(num1, num2).map(addCharacters(char1)(char2))
  );

  const cellRegex = /[A-J][1-9][0-9]?/gi;
  const cellExpanded = rangeExpanded.replace(cellRegex, match => idToText(match.toUpperCase()));
  const functionExpanded = applyFunction(cellExpanded);
  return functionExpanded === x ? functionExpanded : evalFormula(functionExpanded, cells);
};

// Initialize the spreadsheet
window.onload = () => {
  const container = document.getElementById("container");
  const createLabel = name => {
      const label = document.createElement("div");
      label.className = "label";
      label.textContent = name;
      container.appendChild(label);
  };

  // Create headers
  const letters = charRange("A", "J");
  letters.forEach(createLabel);
  
  range(1, 99).forEach(number => {
      createLabel(number);
      letters.forEach(letter => {
          const input = document.createElement("input");
          input.type = "text";
          input.id = letter + number;
          input.ariaLabel = letter + number;
          input.onchange = update;
          container.appendChild(input);
      });
  });

  // Dark Mode Toggle
  document.getElementById("toggle-dark-mode").addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
  });

  // CSV Import/Export Event Listeners
  document.getElementById("import-csv").addEventListener("change", importCSV);
  document.getElementById("export-csv").addEventListener("click", exportCSV);
};

// Update Cell Values
const update = event => {
  const element = event.target;
  const value = element.value.replace(/\s/g, "");
  if (!value.includes(element.id) && value.startsWith('=')) {
      element.value = evalFormula(value.slice(1), Array.from(document.getElementById("container").children));
  }
};

// CSV Export
const exportCSV = () => {
  let csvContent = "";
  const cells = Array.from(document.getElementById("container").children);
  const headers = charRange("A", "J").join(",") + "\n";
  csvContent += headers;

  for (let i = 1; i <= 99; i++) {
      let row = [];
      for (let char of charRange("A", "J")) {
          const cell = document.getElementById(char + i);
          row.push(cell ? cell.value : "");
      }
      csvContent += row.join(",") + "\n";
  }

  const blob = new Blob([csvContent], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "spreadsheet.csv";
  a.click();
};

// CSV Import
const importCSV = event => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
      const rows = e.target.result.split("\n");
      rows.slice(1).forEach((row, i) => {
          const values = row.split(",");
          charRange("A", "J").forEach((char, j) => {
              const cell = document.getElementById(char + (i + 1));
              if (cell) cell.value = values[j] || "";
          });
      });
  };
  reader.readAsText(file);
};
