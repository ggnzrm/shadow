document.getElementById('truthTableForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const expression = document.getElementById('expression').value.trim();
    const table = generateTruthTable(expression);
    displayTruthTable(table);
});

function generateTruthTable(expression) {
    const variables = Array.from(new Set(expression.match(/[a-z]/g) || []));
    const numRows = Math.pow(2, variables.length);
    const rows = [];
    
    for (let i = 0; i < numRows; i++) {
        const row = {};
        variables.forEach((variable, index) => {
            row[variable] = !!(i & (1 << index));
        });
        row.result = evaluateExpression(expression, row);
        rows.push(row);
    }

    return { variables, rows };
}

function evaluateExpression(expression, values) {
    let evalExpression = expression
        .replace(/([a-z])/g, (match) => values[match])
        .replace(/¬/g, '!')
        .replace(/∧/g, '&&')
        .replace(/∨/g, '||')
        .replace(/→/g, '<=');
    
    try {
        return eval(evalExpression);
    } catch (error) {
        console.error('Invalid expression:', expression);
        return false;
    }
}

function displayTruthTable(table) {
    const container = document.getElementById('truthTable');
    let html = '<table><thead><tr>';

    table.variables.forEach(variable => {
        html += `<th>${variable}</th>`;
    });
    html += '<th>Result</th></tr></thead><tbody>';

    table.rows.forEach(row => {
        html += '<tr>';
        table.variables.forEach(variable => {
            html += `<td>${row[variable]}</td>`;
        });
        html += `<td>${row.result}</td></tr>`;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}
