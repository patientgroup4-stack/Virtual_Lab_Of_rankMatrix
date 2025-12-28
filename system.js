/* ===============================
   SYSTEM SOLVER JS
=============================== */

document.addEventListener('DOMContentLoaded', () => {
  const solveBtn = document.getElementById('solveBtn');
  const solutionOutput = document.getElementById('solutionOutput');
  const systemMatrixInput = document.getElementById('systemMatrixInput');

  if (solveBtn) {
    solveBtn.addEventListener('click', solveSystem);
  }

  function solveSystem() {
    try {
      const rawInput = systemMatrixInput.value;
      const matrix = parseMatrix(rawInput);
      
      const result = gaussianElimination(matrix);
      
      displaySolution(result);
    } catch (err) {
      solutionOutput.innerHTML = `<p style="color:red">❌ ${err.message}</p>`;
    }
  }

  function parseMatrix(input) {
    const rows = input.trim().split('\n').filter(r => r.trim() !== '');
    if (rows.length === 0) throw new Error("Matrix cannot be empty.");
    
    return rows.map(r => {
      const nums = r.trim().split(/\s+/).map(Number);
      if (nums.some(isNaN)) throw new Error("Matrix must contain only numbers.");
      return nums;
    });
  }

  function gaussianElimination(M) {
    const rowCount = M.length;
    const colCount = M[0].length;
    const varCount = colCount - 1; // Last column is constants B

    // Forward Elimination
    let pivotRow = 0;
    for (let col = 0; col < varCount && pivotRow < rowCount; col++) {
      // Find pivot
      let maxRow = pivotRow;
      for (let i = pivotRow + 1; i < rowCount; i++) {
        if (Math.abs(M[i][col]) > Math.abs(M[maxRow][col])) {
          maxRow = i;
        }
      }

      if (Math.abs(M[maxRow][col]) < 1e-10) continue; // Column is zero, skip

      // Swap rows
      [M[pivotRow], M[maxRow]] = [M[maxRow], M[pivotRow]];

      // Normalize pivot row
      const pivotVal = M[pivotRow][col];
      for (let j = col; j < colCount; j++) {
        M[pivotRow][j] /= pivotVal;
      }

      // Eliminate other rows
      for (let i = 0; i < rowCount; i++) {
        if (i !== pivotRow) {
          const factor = M[i][col];
          for (let j = col; j < colCount; j++) {
            M[i][j] -= factor * M[pivotRow][j];
          }
        }
      }
      pivotRow++;
    }

    // Analyze Result
    // Check for inconsistency (0 = non-zero) in any row
    for (let i = 0; i < rowCount; i++) {
        let allZero = true;
        for (let j = 0; j < varCount; j++) {
            if (Math.abs(M[i][j]) > 1e-10) {
                allZero = false;
                break;
            }
        }
        if (allZero && Math.abs(M[i][varCount]) > 1e-10) {
            return { type: 'NOSOLUTION' };
        }
    }

    // Count rank vs variables
    let rank = 0;
    for(let i=0; i<rowCount; i++) {
        for(let j=0; j<varCount; j++) {
             if (Math.abs(M[i][j]) > 1e-10) {
                 rank++;
                 break; 
             }
        }
    }

    if (rank < varCount) {
        return { type: 'INFINITE', rank, vars: varCount };
    }

    // Unique Solution
    const solution = [];
    for (let i = 0; i < varCount; i++) {
        // Find the pivot for this column (it should be 1 on the diagonal-ish)
        // Since it's RREF, variable x_i corresponds to the row where the first non-zero is in column i.
        // Actually simple case: x_i = M[i][last_col] if arranged nicely. 
        // But with swaps, we assume standard form.
        solution.push(M[i][colCount - 1]);
    }
    return { type: 'UNIQUE', solution };
  }

  function displaySolution(result) {
    let html = '';
    if (result.type === 'NOSOLUTION') {
        html = '<h4>Result: No Solution (Inconsistent System)</h4>';
    } else if (result.type === 'INFINITE') {
        html = `<h4>Result: Infinitely Many Solutions</h4><p>Rank (${result.rank}) < Number of Variables (${result.vars})</p>`;
    } else {
        html = '<h4>Result: Unique Solution</h4><ul>';
        result.solution.forEach((val, idx) => {
            html += `<li>x<sub>${idx+1}</sub> = ${val.toFixed(2).replace(/\.00$/, '')}</li>`;
        });
        html += '</ul>';
    }
    solutionOutput.innerHTML = html;
    solutionOutput.style.padding = '1rem';
    solutionOutput.style.background = '#f0f9ff';
    solutionOutput.style.borderRadius = '8px';
    solutionOutput.style.marginTop = '1rem';
  }
});
