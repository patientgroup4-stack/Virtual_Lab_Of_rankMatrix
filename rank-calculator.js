/* ===============================
   STATE
=============================== */
let originalMatrix = [];
let currentMatrix = [];
let history = [];
let stepCount = 0;

/* ===============================
   ELEMENTS
=============================== */
const matrixInput = document.getElementById("matrixInput");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const showRankBtn = document.getElementById("showRankBtn");

const matrixSection = document.getElementById("matrixSection");
const matrixTable = document.getElementById("matrixTable");

const operationSection = document.getElementById("operationSection");
const rowI = document.getElementById("rowI");
const rowJ = document.getElementById("rowJ");
const rowJLabel = document.getElementById("rowJLabel");
const multiplier = document.getElementById("multiplier");
const opType = document.getElementById("opType");

const applyOpBtn = document.getElementById("applyOpBtn");
const undoBtn = document.getElementById("undoBtn");
const finishBtn = document.getElementById("finishBtn");

const rankCheckSection = document.getElementById("rankCheckSection");
const rankInput = document.getElementById("rankInput");
const checkRankBtn = document.getElementById("checkRankBtn");
const resultText = document.getElementById("resultText");

const stepLog = document.getElementById("stepLog");

/* ===============================
   EVENTS
=============================== */
startBtn.onclick = start;
applyOpBtn.onclick = applyOperation;
undoBtn.onclick = undo;
finishBtn.onclick = finish;
checkRankBtn.onclick = checkRank;
showRankBtn.onclick = showDirectRank;
resetBtn.onclick = () => location.reload();
opType.onchange = updateOperationUI;

/* ===============================
   START
=============================== */
function start() {
  try {
    originalMatrix = parseMatrix(matrixInput.value);
    validateMatrix(originalMatrix);

    currentMatrix = clone(originalMatrix);
    history = [];
    stepCount = 0;
    stepLog.innerHTML = "";

    matrixSection.style.display = "block";
    operationSection.style.display = "block";
    rankCheckSection.style.display = "none";

    enableOperations();
    updateOperationUI();
    showMatrix();
  } catch (err) {
    alert(err.message);
  }
}

/* ===============================
   MATRIX DISPLAY
=============================== */
function formatNumber(n) {
  return Number.isInteger(n) ? n : n.toFixed(2);
}

function showMatrix() {
  let html = "<table>";
  currentMatrix.forEach(row => {
    html += "<tr>";
    row.forEach(v => html += `<td>${formatNumber(v)}</td>`);
    html += "</tr>";
  });
  html += "</table>";
  matrixTable.innerHTML = html;
}

/* ===============================
   OPERATIONS
=============================== */
function applyOperation() {
  try {
    const i = Number(rowI.value) - 1;
    const j = Number(rowJ.value) - 1;
    const k = Number(multiplier.value || 1);

    validateOperation(i, j, k);

    history.push(clone(currentMatrix));

    if (opType.value === "add") {
      for (let c = 0; c < currentMatrix[0].length; c++)
        currentMatrix[i][c] += k * currentMatrix[j][c];
    }

    if (opType.value === "scale") {
      for (let c = 0; c < currentMatrix[0].length; c++)
        currentMatrix[i][c] *= k;
    }

    if (opType.value === "swap") {
      [currentMatrix[i], currentMatrix[j]] =
        [currentMatrix[j], currentMatrix[i]];
    }

    logStep(i, j, k);
    showMatrix();
  } catch (err) {
    alert(err.message);
  }
}

function undo() {
  if (history.length) {
    currentMatrix = history.pop();
    stepLog.lastChild?.remove();
    stepCount--;
    showMatrix();
  }
}

/* ===============================
   FINISH & RANK
=============================== */
function finish() {
  disableOperations();
  rankCheckSection.style.display = "block";
}

function checkRank() {
  const userRank = Number(rankInput.value);
  if (isNaN(userRank)) {
    resultText.textContent = "❌ Please enter a valid rank.";
    return;
  }

  const originalRank = getRank(clone(originalMatrix));
  const reducedRank = getRank(clone(currentMatrix));

  resultText.textContent =
    userRank === originalRank && userRank === reducedRank
      ? `✅ Correct! Rank = ${originalRank}`
      : `❌ Incorrect. Original Rank = ${originalRank}, Reduced Rank = ${reducedRank}`;
}

const directRankResult = document.getElementById("directRankResult");

function showDirectRank() {
  try {
    const matrix = parseMatrix(matrixInput.value);
    validateMatrix(matrix);

    const rank = getRank(clone(matrix));
    directRankResult.textContent = `✅ Rank of the entered matrix is ${rank}`;
    directRankResult.style.color = "#1e3a8a"; // Matches page theme
  } catch (err) {
    directRankResult.textContent = `❌ ${err.message}`;
    directRankResult.style.color = "#dc2626"; // Red for errors
  }
}


/* ===============================
   UI LOGIC
=============================== */
function updateOperationUI() {
  multiplier.style.display = "inline-block";
  rowJ.style.display = "inline-block";
  rowJLabel.style.display = "inline-block";

  if (opType.value === "scale") {
    rowJ.style.display = "none";
    rowJLabel.style.display = "none";
  }

  if (opType.value === "swap") {
    multiplier.style.display = "none";
  }
}

function disableOperations() {
  operationSection.querySelectorAll("input, select, button")
    .forEach(el => el.disabled = true);
}

function enableOperations() {
  operationSection.querySelectorAll("input, select, button")
    .forEach(el => el.disabled = false);
}

/* ===============================
   STEP LOG
=============================== */
function logStep(i, j, k) {
  stepCount++;

  let text = "";
  if (opType.value === "add")
    text = `Step ${stepCount}: R${i + 1} → R${i + 1} + ${k}R${j + 1}`;
  if (opType.value === "scale")
    text = `Step ${stepCount}: R${i + 1} → ${k}R${i + 1}`;
  if (opType.value === "swap")
    text = `Step ${stepCount}: R${i + 1} ↔ R${j + 1}`;

  const p = document.createElement("p");
  p.textContent = text;
  stepLog.appendChild(p);
}

/* ===============================
   VALIDATION
=============================== */
function validateMatrix(matrix) {
  if (!matrix.length) throw new Error("Matrix cannot be empty.");

  const cols = matrix[0].length;
  matrix.forEach(row => {
    if (row.length !== cols || row.some(isNaN))
      throw new Error("Invalid matrix format.");
  });
}

function validateOperation(i, j, k) {
  const rows = currentMatrix.length;

  if (i < 0 || i >= rows)
    throw new Error("Invalid row i.");

  if (opType.value !== "scale" && (j < 0 || j >= rows))
    throw new Error("Invalid row j.");

  if (opType.value !== "swap" && isNaN(k))
    throw new Error("Invalid multiplier.");
}

/* ===============================
   HELPERS
=============================== */
function parseMatrix(input) {
  return input.trim()
    .split("\n")
    .map(r => r.trim())
    .filter(r => r !== "")
    .map(r => r.split(/\s+/).map(Number));
}

function clone(m) {
  return m.map(r => [...r]);
}

/* ===============================
   RANK (Gaussian Elimination)
=============================== */
function getRank(mat) {
  let rank = 0, row = 0;

  for (let col = 0; col < mat[0].length && row < mat.length; col++) {
    let pivot = row;

    for (let i = row; i < mat.length; i++) {
      if (Math.abs(mat[i][col]) > 1e-8) {
        pivot = i;
        break;
      }
    }

    if (Math.abs(mat[pivot][col]) < 1e-8) continue;

    [mat[row], mat[pivot]] = [mat[pivot], mat[row]];

    for (let i = row + 1; i < mat.length; i++) {
      const f = mat[i][col] / mat[row][col];
      for (let j = col; j < mat[0].length; j++) {
        mat[i][j] -= f * mat[row][j];
      }
    }

    rank++;
    row++;
  }

  return rank;
}
