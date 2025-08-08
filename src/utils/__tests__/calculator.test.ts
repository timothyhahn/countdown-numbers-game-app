import {describe, it, expect} from 'vitest';
import {evaluateExpression} from '../calculator';
import {Operation} from '../../types/Operation';

describe('evaluateExpression', () => {
	it('should return 0 for empty expression', () => {
		expect(evaluateExpression([])).toBe(0);
	});

	it('should return the number for single number expression', () => {
		expect(evaluateExpression([5])).toBe(5);
		expect(evaluateExpression([42])).toBe(42);
	});

	describe('basic arithmetic operations', () => {
		it('should handle addition', () => {
			expect(evaluateExpression([3, Operation.ADD, 4])).toBe(7);
			expect(evaluateExpression([10, Operation.ADD, 5])).toBe(15);
		});

		it('should handle subtraction', () => {
			expect(evaluateExpression([7, Operation.SUBTRACT, 3])).toBe(4);
			expect(evaluateExpression([10, Operation.SUBTRACT, 8])).toBe(2);
		});

		it('should handle multiplication', () => {
			expect(evaluateExpression([3, Operation.MULTIPLY, 4])).toBe(12);
			expect(evaluateExpression([7, Operation.MULTIPLY, 6])).toBe(42);
		});

		it('should handle division with floor result', () => {
			expect(evaluateExpression([12, Operation.DIVIDE, 3])).toBe(4);
			expect(evaluateExpression([7, Operation.DIVIDE, 2])).toBe(3); // 3.5 floored to 3
			expect(evaluateExpression([10, Operation.DIVIDE, 4])).toBe(2); // 2.5 floored to 2
		});
	});

	describe('order of operations', () => {
		it('should handle multiplication before addition', () => {
			// 3 + 4 × 2 = 3 + 8 = 11
			expect(evaluateExpression([3, Operation.ADD, 4, Operation.MULTIPLY, 2])).toBe(11);
		});

		it('should handle division before subtraction', () => {
			// 10 - 6 ÷ 2 = 10 - 3 = 7
			expect(evaluateExpression([10, Operation.SUBTRACT, 6, Operation.DIVIDE, 2])).toBe(7);
		});

		it('should handle multiple operations with precedence', () => {
			// 2 + 3 × 4 - 6 ÷ 2 = 2 + 12 - 3 = 11
			expect(evaluateExpression([
				2, Operation.ADD, 3, Operation.MULTIPLY, 4, Operation.SUBTRACT, 6, Operation.DIVIDE, 2,
			])).toBe(11);
		});

		it('should handle left-to-right for same precedence', () => {
			// 8 ÷ 4 × 2 = 2 × 2 = 4
			expect(evaluateExpression([8, Operation.DIVIDE, 4, Operation.MULTIPLY, 2])).toBe(4);
			// 10 - 3 + 2 = 7 + 2 = 9
			expect(evaluateExpression([10, Operation.SUBTRACT, 3, Operation.ADD, 2])).toBe(9);
		});
	});

	describe('parentheses', () => {
		it('should handle simple parentheses', () => {
			// (3 + 4) × 2 = 7 × 2 = 14
			expect(evaluateExpression([
				Operation.OPEN_PAREN, 3, Operation.ADD, 4, Operation.CLOSE_PAREN, Operation.MULTIPLY, 2,
			])).toBe(14);
		});

		it('should handle nested parentheses', () => {
			// ((2 + 3) × 4) - 5 = (5 × 4) - 5 = 20 - 5 = 15
			expect(evaluateExpression([
				Operation.OPEN_PAREN,
				Operation.OPEN_PAREN,
				2,
				Operation.ADD,
				3,
				Operation.CLOSE_PAREN,
				Operation.MULTIPLY,
				4,
				Operation.CLOSE_PAREN,
				Operation.SUBTRACT,
				5,
			])).toBe(15);
		});

		it('should handle multiple separate parentheses', () => {
			// (3 + 2) × (4 - 1) = 5 × 3 = 15
			expect(evaluateExpression([
				Operation.OPEN_PAREN,
				3,
				Operation.ADD,
				2,
				Operation.CLOSE_PAREN,
				Operation.MULTIPLY,
				Operation.OPEN_PAREN,
				4,
				Operation.SUBTRACT,
				1,
				Operation.CLOSE_PAREN,
			])).toBe(15);
		});

		it('should handle unmatched parentheses gracefully', () => {
			// (3 + 4 × 2 = 3 + 8 = 11 (ignores unmatched opening paren)
			expect(evaluateExpression([
				Operation.OPEN_PAREN, 3, Operation.ADD, 4, Operation.MULTIPLY, 2,
			])).toBe(11);
		});
	});

	describe('complex expressions', () => {
		it('should handle countdown numbers style calculations', () => {
			// 25 × (10 + 2) ÷ 3 - 4 = 25 × 12 ÷ 3 - 4 = 300 ÷ 3 - 4 = 100 - 4 = 96
			expect(evaluateExpression([
				25,
				Operation.MULTIPLY,
				Operation.OPEN_PAREN,
				10,
				Operation.ADD,
				2,
				Operation.CLOSE_PAREN,
				Operation.DIVIDE,
				3,
				Operation.SUBTRACT,
				4,
			])).toBe(96);
		});

		it('should handle another complex example', () => {
			// (100 - 75) × 2 + 50 ÷ 10 = 25 × 2 + 5 = 50 + 5 = 55
			expect(evaluateExpression([
				Operation.OPEN_PAREN,
				100,
				Operation.SUBTRACT,
				75,
				Operation.CLOSE_PAREN,
				Operation.MULTIPLY,
				2,
				Operation.ADD,
				50,
				Operation.DIVIDE,
				10,
			])).toBe(55);
		});
	});

	describe('edge cases', () => {
		it('should handle division by zero as floor(Infinity)', () => {
			// This will result in Infinity, which Math.floor converts to Infinity
			// In a real game, we might want to handle this differently
			expect(evaluateExpression([5, Operation.DIVIDE, 0])).toBe(Infinity);
		});

		it('should handle single operation without numbers', () => {
			expect(evaluateExpression([Operation.ADD])).toBe(0);
		});

		it('should handle numbers without operations', () => {
			expect(evaluateExpression([5, 3, 2])).toBe(5); // Should just return first number
		});
	});
});
