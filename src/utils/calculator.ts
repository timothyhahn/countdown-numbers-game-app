import {type Operation} from '../types/Operation';

export function evaluateExpression(tokens: Array<number | Operation>): number {
	if (tokens.length === 0) {
		return 0;
	}

	// Handle edge case: only numbers without operations
	const hasOperations = tokens.some(token => typeof token !== 'number');
	if (!hasOperations) {
		return typeof tokens[0] === 'number' ? tokens[0] : 0;
	}

	// Convert tokens to a string expression for easier parsing
	const expression = tokens.map(token =>
		typeof token === 'number' ? token.toString() : token.valueOf()).join('');

	return evaluateStringExpression(expression);
}

function evaluateStringExpression(expr: string): number {
	// Remove spaces
	expr = expr.replaceAll(/\s/g, '');

	// Handle parentheses first
	while (expr.includes('(')) {
		const lastOpen = expr.lastIndexOf('(');
		const firstClose = expr.indexOf(')', lastOpen);

		if (firstClose === -1) {
			// Unmatched parenthesis, remove all unmatched opening parens and continue
			expr = expr.replaceAll('(', '');
			break;
		}

		const subExpr = expr.substring(lastOpen + 1, firstClose);
		const result = evaluateSimpleExpression(subExpr);
		expr = expr.slice(0, Math.max(0, lastOpen)) + result + expr.slice(Math.max(0, firstClose + 1));
	}

	// Remove any remaining unmatched closing parentheses
	expr = expr.replaceAll(')', '');

	return evaluateSimpleExpression(expr);
}

function evaluateSimpleExpression(expr: string): number {
	if (!expr) {
		return 0;
	}

	// Split into tokens
	const tokens: Array<number | string> = [];
	let currentNumber = '';

	for (const char of expr) {
		if ('+-×÷'.includes(char)) {
			if (currentNumber) {
				tokens.push(Number.parseFloat(currentNumber));
				currentNumber = '';
			}

			tokens.push(char);
		} else {
			currentNumber += char;
		}
	}

	if (currentNumber) {
		tokens.push(Number.parseFloat(currentNumber));
	}

	if (tokens.length === 0) {
		return 0;
	}

	if (tokens.length === 1) {
		return typeof tokens[0] === 'number' ? tokens[0] : 0;
	}

	// Handle multiplication and division first (left to right)
	for (let i = 1; i < tokens.length - 1; i += 2) {
		const operator = tokens[i];
		if (operator === '×' || operator === '÷') {
			const left = tokens[i - 1] as number;
			const right = tokens[i + 1] as number;
			let result: number;

			result = operator === '×' ? left * right : Math.floor(left / right);

			// Replace the three tokens with the result
			tokens.splice(i - 1, 3, result);
			i -= 2; // Adjust index since we removed elements
		}
	}

	// Handle addition and subtraction (left to right)
	for (let i = 1; i < tokens.length - 1; i += 2) {
		const operator = tokens[i];
		if (operator === '+' || operator === '-') {
			const left = tokens[i - 1] as number;
			const right = tokens[i + 1] as number;
			let result: number;

			result = operator === '+' ? left + right : left - right;

			// Replace the three tokens with the result
			tokens.splice(i - 1, 3, result);
			i -= 2; // Adjust index since we removed elements
		}
	}

	return typeof tokens[0] === 'number' ? tokens[0] : 0;
}
