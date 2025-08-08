import {type Operation, OperationSymbol} from '../types/Operation';
import {evaluateExpression} from './calculator';

type ExpressionToken = number | Operation;

export type SolutionNode = {
	expression: ExpressionToken[];
	usedNumbers: number[];
	availableNumbers: number[];
	value?: number;
	isComplete: boolean;
};

export type SolverResult = {
	target: number;
	solutions: ExpressionToken[][];
	totalAttempts: number;
	solutionsFound: number;
};

/**
 * Creates a new solution node
 */
function createNode(
	expression: ExpressionToken[] = [],
	usedNumbers: number[] = [],
	availableNumbers: number[] = [],
): SolutionNode {
	const isComplete = expression.length > 0
		&& typeof expression.at(-1) === 'number'
		&& hasValidStructure(expression);

	return {
		expression: [...expression],
		usedNumbers: [...usedNumbers],
		availableNumbers: [...availableNumbers],
		value: isComplete ? evaluateExpression(expression) : undefined,
		isComplete,
	};
}

/**
 * Checks if an expression has valid structure (proper parentheses, alternating numbers/operations)
 */
function hasValidStructure(expression: ExpressionToken[]): boolean {
	if (expression.length === 0) {
		return false;
	}

	let parenCount = 0;
	let expectNumber = true;

	for (const token of expression) {
		if (typeof token === 'number') {
			if (!expectNumber) {
				return false;
			}

			expectNumber = false;
		} else if (token === OperationSymbol.OPEN_PAREN) {
			if (!expectNumber) {
				return false;
			}

			parenCount++;
		} else if (token === OperationSymbol.CLOSE_PAREN) {
			if (expectNumber || parenCount === 0) {
				return false;
			}

			parenCount--;
		} else {
			// Regular operation (+, -, ×, ÷)
			if (expectNumber) {
				return false;
			}

			expectNumber = true;
		}
	}

	// Must end with a number and have balanced parentheses
	return !expectNumber && parenCount === 0;
}

/**
 * Checks if adding a token would create a valid structure
 */
function canAddToken(expression: ExpressionToken[], token: ExpressionToken): boolean {
	if (typeof token === 'number') {
		// Can add number if we expect a number
		return expectsNumber(expression);
	}

	if (token === OperationSymbol.OPEN_PAREN) {
		// Can add open paren if we expect a number
		return expectsNumber(expression);
	}

	if (token === OperationSymbol.CLOSE_PAREN) {
		// Can add close paren if we don't expect a number and have open parens
		return !expectsNumber(expression) && getOpenParenCount(expression) > 0;
	}

	// Regular operation
	return !expectsNumber(expression);
}

/**
 * Determines if the expression expects a number as the next token
 */
function expectsNumber(expression: ExpressionToken[]): boolean {
	if (expression.length === 0) {
		return true;
	}

	const lastToken = expression.at(-1);

	if (typeof lastToken === 'number') {
		return false;
	}

	if (lastToken === OperationSymbol.CLOSE_PAREN) {
		return false;
	}

	return true; // After operation or open paren, expect number
}

/**
 * Counts unmatched open parentheses
 */
function getOpenParenCount(expression: ExpressionToken[]): number {
	let count = 0;
	for (const token of expression) {
		if (token === OperationSymbol.OPEN_PAREN) {
			count++;
		}

		if (token === OperationSymbol.CLOSE_PAREN) {
			count--;
		}
	}

	return count;
}

/**
 * Generates all possible child nodes from a given node
 * Numbers are tried first to find simpler solutions faster
 */
function generateChildNodes(node: SolutionNode): SolutionNode[] {
	const children: SolutionNode[] = [];
	const maxExpressionLength = 11; // Reasonable limit to prevent explosion

	if (node.expression.length >= maxExpressionLength) {
		return children;
	}

	// Try adding each available number FIRST (prioritize simpler solutions)
	for (let i = 0; i < node.availableNumbers.length; i++) {
		const number = node.availableNumbers[i];

		if (canAddToken(node.expression, number)) {
			const newAvailable = [...node.availableNumbers];
			newAvailable.splice(i, 1);

			children.push(createNode(
				[...node.expression, number],
				[...node.usedNumbers, number],
				newAvailable,
			));
		}
	}

	// Only add operations and parentheses if we don't already have too many children
	// This helps prioritize finding simpler solutions first
	if (children.length < 10) {
		// Try adding each operation (only if the expression can accept an operation)
		const operations = [OperationSymbol.ADD, OperationSymbol.SUBTRACT, OperationSymbol.MULTIPLY, OperationSymbol.DIVIDE];

		for (const op of operations) {
			if (canAddToken(node.expression, op)) {
				children.push(createNode(
					[...node.expression, op],
					node.usedNumbers,
					node.availableNumbers,
				));
			}
		}

		// Try adding parentheses (but with even more restriction to prevent explosion)
		if (node.expression.length < 7) {
			if (canAddToken(node.expression, OperationSymbol.OPEN_PAREN)) {
				children.push(createNode(
					[...node.expression, OperationSymbol.OPEN_PAREN],
					node.usedNumbers,
					node.availableNumbers,
				));
			}

			if (canAddToken(node.expression, OperationSymbol.CLOSE_PAREN)) {
				children.push(createNode(
					[...node.expression, OperationSymbol.CLOSE_PAREN],
					node.usedNumbers,
					node.availableNumbers,
				));
			}
		}
	}

	return children;
}

/**
 * Context object for the solver exploration
 */
type SolverContext = {
	target: number;
	solutions: ExpressionToken[][];
	maxSolutions: number;
	attempts: {count: number};
};

/**
 * Recursively explores the solution tree to find all solutions
 */
function exploreSolutionTree(node: SolutionNode, context: SolverContext): void {
	context.attempts.count++;

	// Stop if we've found enough solutions or tried too many combinations
	if (context.solutions.length >= context.maxSolutions || context.attempts.count > 200_000) {
		return;
	}

	// If this node is complete and matches target, add to solutions
	if (node.isComplete && node.value === context.target) {
		context.solutions.push([...node.expression]);
	}

	// Continue exploring children (even if current node is complete, we might find more solutions)
	const children = generateChildNodes(node);
	for (const child of children) {
		exploreSolutionTree(child, context);
		if (context.solutions.length >= context.maxSolutions) {
			break;
		}
	}
}

/**
 * Solves the countdown numbers puzzle by finding all possible solutions
 */
export function solvePuzzle(
	numbers: number[],
	target: number,
	maxSolutions = 10,
): SolverResult {
	const context: SolverContext = {
		target,
		solutions: [],
		maxSolutions,
		attempts: {count: 0},
	};

	// Start with an empty root node
	const rootNode = createNode([], [], [...numbers]);

	// Explore the solution tree
	exploreSolutionTree(rootNode, context);

	return {
		target,
		solutions: context.solutions,
		totalAttempts: context.attempts.count,
		solutionsFound: context.solutions.length,
	};
}

/**
 * Formats an expression array into a human-readable string
 */
export function formatExpression(expression: ExpressionToken[]): string {
	return expression.map(token =>
		typeof token === 'number' ? token.toString() : token.valueOf()).join(' ');
}

/**
 * Gets the first solution for a puzzle (convenience function)
 */
export function getFirstSolution(numbers: number[], target: number): ExpressionToken[] | undefined {
	const result = solvePuzzle(numbers, target, 1);
	return result.solutions.length > 0 ? result.solutions[0] : undefined;
}
