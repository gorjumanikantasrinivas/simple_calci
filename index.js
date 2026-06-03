let current = '0', prev = '', operator = '', justCalc = false;

function updateDisplay() {
  const d = document.getElementById('display');
  const len = current.length;
  d.className = 'main-display' + (len > 10 ? ' xsmall' : len > 7 ? ' small' : '');
  d.textContent = current;
  document.getElementById('btn-ac').textContent = (current !== '0' || prev) ? 'C' : 'AC';
}

function setExpr(txt) {
  document.getElementById('expr').textContent = txt;
}

function highlightOp(op) {
  ['op-div', 'op-mul', 'op-sub', 'op-add'].forEach(id =>
    document.getElementById(id).classList.remove('active')
  );
  const map = { '÷': 'op-div', '×': 'op-mul', '−': 'op-sub', '+': 'op-add' };
  if (op && map[op]) document.getElementById(map[op]).classList.add('active');
}

function pressNum(n) {
  if (justCalc) { current = n; justCalc = false; }
  else if (current === '0') current = n;
  else if (current.length < 12) current += n;
  updateDisplay();
}

function pressDot() {
  if (justCalc) { current = '0.'; justCalc = false; updateDisplay(); return; }
  if (!current.includes('.')) current += '.';
  updateDisplay();
}

function pressOp(op) {
  if (prev && operator && !justCalc) compute(false);
  prev = current;
  operator = op;
  justCalc = true;
  setExpr(prev + ' ' + op);
  highlightOp(op);
  updateDisplay();
}

function compute(final) {
  if (!prev || !operator) return;
  const a = parseFloat(prev), b = parseFloat(current);
  let result;
  if (operator === '÷') result = b !== 0 ? a / b : 'Error';
  else if (operator === '×') result = a * b;
  else if (operator === '−') result = a - b;
  else result = a + b;

  if (result !== 'Error') {
    result = parseFloat(result.toPrecision(12));
    if (Math.abs(result) > 1e12) result = result.toExponential(4);
  }

  if (final) {
    setExpr(prev + ' ' + operator + ' ' + current + ' =');
    highlightOp(null);
  }

  current = String(result);
  if (final) { prev = ''; operator = ''; }
  justCalc = true;
  updateDisplay();
}

function pressEquals() {
  if (operator) compute(true);
}

function pressAC() {
  current = '0'; prev = ''; operator = ''; justCalc = false;
  setExpr('');
  highlightOp(null);
  updateDisplay();
}

function pressSign() {
  if (current !== '0') current = String(-parseFloat(current));
  updateDisplay();
}

function pressPercent() {
  current = String(parseFloat(current) / 100);
  updateDisplay();
}

document.addEventListener('keydown', e => {
  if ('0123456789'.includes(e.key)) pressNum(e.key);
  else if (e.key === '.') pressDot();
  else if (e.key === '+') pressOp('+');
  else if (e.key === '-') pressOp('−');
  else if (e.key === '*') pressOp('×');
  else if (e.key === '/') { e.preventDefault(); pressOp('÷'); }
  else if (e.key === 'Enter' || e.key === '=') pressEquals();
  else if (e.key === 'Backspace') {
    current = current.length > 1 ? current.slice(0, -1) : '0';
    updateDisplay();
  }
  else if (e.key === 'Escape') pressAC();
});