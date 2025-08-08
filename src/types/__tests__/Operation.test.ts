import {describe, it, expect} from 'vitest';
import {
	OperationSymbol, getOperationSymbol, getOperationName, parseOperation,
} from '../Operation';

describe('OperationSymbol constants', () => {
	it('should have correct symbol values', () => {
		expect(OperationSymbol.ADD).toBe('+');
		expect(OperationSymbol.SUBTRACT).toBe('-');
		expect(OperationSymbol.MULTIPLY).toBe('×');
		expect(OperationSymbol.DIVIDE).toBe('÷');
		expect(OperationSymbol.OPEN_PAREN).toBe('(');
		expect(OperationSymbol.CLOSE_PAREN).toBe(')');
	});
});

describe('getOperationSymbol', () => {
	it('should return correct symbols for all operations', () => {
		expect(getOperationSymbol(OperationSymbol.ADD)).toBe('+');
		expect(getOperationSymbol(OperationSymbol.SUBTRACT)).toBe('-');
		expect(getOperationSymbol(OperationSymbol.MULTIPLY)).toBe('×');
		expect(getOperationSymbol(OperationSymbol.DIVIDE)).toBe('÷');
		expect(getOperationSymbol(OperationSymbol.OPEN_PAREN)).toBe('(');
		expect(getOperationSymbol(OperationSymbol.CLOSE_PAREN)).toBe(')');
	});
});

describe('getOperationName', () => {
	it('should return correct names for all operations', () => {
		expect(getOperationName(OperationSymbol.ADD)).toBe('Addition');
		expect(getOperationName(OperationSymbol.SUBTRACT)).toBe('Subtraction');
		expect(getOperationName(OperationSymbol.MULTIPLY)).toBe('Multiplication');
		expect(getOperationName(OperationSymbol.DIVIDE)).toBe('Division');
		expect(getOperationName(OperationSymbol.OPEN_PAREN)).toBe('Open Parenthesis');
		expect(getOperationName(OperationSymbol.CLOSE_PAREN)).toBe('Close Parenthesis');
	});
});

describe('parseOperation', () => {
	it('should correctly parse operation symbols', () => {
		expect(parseOperation('+')).toBe(OperationSymbol.ADD);
		expect(parseOperation('-')).toBe(OperationSymbol.SUBTRACT);
		expect(parseOperation('×')).toBe(OperationSymbol.MULTIPLY);
		expect(parseOperation('÷')).toBe(OperationSymbol.DIVIDE);
		expect(parseOperation('(')).toBe(OperationSymbol.OPEN_PAREN);
		expect(parseOperation(')')).toBe(OperationSymbol.CLOSE_PAREN);
	});

	it('should return undefined for invalid symbols', () => {
		expect(parseOperation('*')).toBeUndefined();
		expect(parseOperation('/')).toBeUndefined();
		expect(parseOperation('=')).toBeUndefined();
		expect(parseOperation('')).toBeUndefined();
		expect(parseOperation('abc')).toBeUndefined();
	});
});
