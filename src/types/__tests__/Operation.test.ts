import {describe, it, expect} from 'vitest';
import {
	Operation, getOperationSymbol, getOperationName, parseOperation,
} from '../Operation';

describe('Operation enum', () => {
	it('should have correct enum values', () => {
		expect(Operation.ADD).toBe('+');
		expect(Operation.SUBTRACT).toBe('-');
		expect(Operation.MULTIPLY).toBe('×');
		expect(Operation.DIVIDE).toBe('÷');
		expect(Operation.OPEN_PAREN).toBe('(');
		expect(Operation.CLOSE_PAREN).toBe(')');
	});
});

describe('getOperationSymbol', () => {
	it('should return correct symbols for all operations', () => {
		expect(getOperationSymbol(Operation.ADD)).toBe('+');
		expect(getOperationSymbol(Operation.SUBTRACT)).toBe('-');
		expect(getOperationSymbol(Operation.MULTIPLY)).toBe('×');
		expect(getOperationSymbol(Operation.DIVIDE)).toBe('÷');
		expect(getOperationSymbol(Operation.OPEN_PAREN)).toBe('(');
		expect(getOperationSymbol(Operation.CLOSE_PAREN)).toBe(')');
	});
});

describe('getOperationName', () => {
	it('should return correct names for all operations', () => {
		expect(getOperationName(Operation.ADD)).toBe('Addition');
		expect(getOperationName(Operation.SUBTRACT)).toBe('Subtraction');
		expect(getOperationName(Operation.MULTIPLY)).toBe('Multiplication');
		expect(getOperationName(Operation.DIVIDE)).toBe('Division');
		expect(getOperationName(Operation.OPEN_PAREN)).toBe('Open Parenthesis');
		expect(getOperationName(Operation.CLOSE_PAREN)).toBe('Close Parenthesis');
	});
});

describe('parseOperation', () => {
	it('should correctly parse operation symbols', () => {
		expect(parseOperation('+')).toBe(Operation.ADD);
		expect(parseOperation('-')).toBe(Operation.SUBTRACT);
		expect(parseOperation('×')).toBe(Operation.MULTIPLY);
		expect(parseOperation('÷')).toBe(Operation.DIVIDE);
		expect(parseOperation('(')).toBe(Operation.OPEN_PAREN);
		expect(parseOperation(')')).toBe(Operation.CLOSE_PAREN);
	});

	it('should return null for invalid symbols', () => {
		expect(parseOperation('*')).toBeNull();
		expect(parseOperation('/')).toBeNull();
		expect(parseOperation('=')).toBeNull();
		expect(parseOperation('')).toBeNull();
		expect(parseOperation('abc')).toBeNull();
	});
});
