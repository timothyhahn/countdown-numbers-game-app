export const OperationSymbol = {
	ADD: '+',
	SUBTRACT: '-',
	MULTIPLY: '×',
	DIVIDE: '÷',
	OPEN_PAREN: '(',
	CLOSE_PAREN: ')',
} as const;

export type Operation = typeof OperationSymbol[keyof typeof OperationSymbol];

export const getOperationSymbol = (operation: Operation): string => operation;

export const getOperationName = (operation: Operation): string => {
	switch (operation) {
		case OperationSymbol.ADD: {
			return 'Addition';
		}

		case OperationSymbol.SUBTRACT: {
			return 'Subtraction';
		}

		case OperationSymbol.MULTIPLY: {
			return 'Multiplication';
		}

		case OperationSymbol.DIVIDE: {
			return 'Division';
		}

		case OperationSymbol.OPEN_PAREN: {
			return 'Open Parenthesis';
		}

		case OperationSymbol.CLOSE_PAREN: {
			return 'Close Parenthesis';
		}
	}
};

export const parseOperation = (symbol: string): Operation | undefined => {
	switch (symbol) {
		case '+': {
			return OperationSymbol.ADD;
		}

		case '-': {
			return OperationSymbol.SUBTRACT;
		}

		case '×': {
			return OperationSymbol.MULTIPLY;
		}

		case '÷': {
			return OperationSymbol.DIVIDE;
		}

		case '(': {
			return OperationSymbol.OPEN_PAREN;
		}

		case ')': {
			return OperationSymbol.CLOSE_PAREN;
		}

		default: {
			return undefined;
		}
	}
};
