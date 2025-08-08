export const Operation = {
	ADD: '+',
	SUBTRACT: '-',
	MULTIPLY: '×',
	DIVIDE: '÷',
	OPEN_PAREN: '(',
	CLOSE_PAREN: ')',
} as const;

export type Operation = typeof Operation[keyof typeof Operation];

export const getOperationSymbol = (operation: Operation): string => operation;

export const getOperationName = (operation: Operation): string => {
	switch (operation) {
		case Operation.ADD: {
			return 'Addition';
		}

		case Operation.SUBTRACT: {
			return 'Subtraction';
		}

		case Operation.MULTIPLY: {
			return 'Multiplication';
		}

		case Operation.DIVIDE: {
			return 'Division';
		}

		case Operation.OPEN_PAREN: {
			return 'Open Parenthesis';
		}

		case Operation.CLOSE_PAREN: {
			return 'Close Parenthesis';
		}
	}
};

export const parseOperation = (symbol: string): Operation | undefined => {
	switch (symbol) {
		case '+': {
			return Operation.ADD;
		}

		case '-': {
			return Operation.SUBTRACT;
		}

		case '×': {
			return Operation.MULTIPLY;
		}

		case '÷': {
			return Operation.DIVIDE;
		}

		case '(': {
			return Operation.OPEN_PAREN;
		}

		case ')': {
			return Operation.CLOSE_PAREN;
		}

		default: {
			return undefined;
		}
	}
};