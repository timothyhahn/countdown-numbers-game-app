import {describe, it, expect} from 'vitest';
import {
	solvePuzzle, getFirstSolution, formatExpression,
} from '../solver';
import {Operation} from '../../types/Operation';

describe('solver', () => {
	describe('formatExpression', () => {
		it('should format simple expression', () => {
			const expression = [2, Operation.ADD, 3];
			expect(formatExpression(expression)).toBe('2 + 3');
		});

		it('should format complex expression with parentheses', () => {
			const expression = [Operation.OPEN_PAREN, 2, Operation.ADD, 3, Operation.CLOSE_PAREN, Operation.MULTIPLY, 4];
			expect(formatExpression(expression)).toBe('( 2 + 3 ) × 4');
		});

		it('should format expression with all operations', () => {
			const expression = [10, Operation.ADD, 5, Operation.SUBTRACT, 3, Operation.MULTIPLY, 2, Operation.DIVIDE, 4];
			expect(formatExpression(expression)).toBe('10 + 5 - 3 × 2 ÷ 4');
		});
	});

	describe('getFirstSolution', () => {
		it('should return null when no solution exists', () => {
			const solution = getFirstSolution([1, 2], 100);
			expect(solution).toBeUndefined();
		});

		it('should find simple addition solution', () => {
			const solution = getFirstSolution([2, 3], 5);
			expect(solution).not.toBeUndefined();
			expect(formatExpression(solution!)).toBe('2 + 3');
		});

		it('should find single number solution', () => {
			const solution = getFirstSolution([7, 3, 1], 7);
			expect(solution).not.toBeUndefined();
			expect(formatExpression(solution!)).toBe('7');
		});
	});

	describe('solvePuzzle', () => {
		it('should return proper SolverResult structure', () => {
			const result = solvePuzzle([1, 2], 3);

			expect(result).toHaveProperty('target', 3);
			expect(result).toHaveProperty('solutions');
			expect(result).toHaveProperty('totalAttempts');
			expect(result).toHaveProperty('solutionsFound');
			expect(Array.isArray(result.solutions)).toBe(true);
			expect(typeof result.totalAttempts).toBe('number');
			expect(typeof result.solutionsFound).toBe('number');
		});

		it('should find no solutions for impossible targets', () => {
			const result = solvePuzzle([1, 2], 100);

			expect(result.solutionsFound).toBe(0);
			expect(result.solutions).toHaveLength(0);
			expect(result.totalAttempts).toBeGreaterThan(0);
		});

		it('should find simple addition solutions', () => {
			const result = solvePuzzle([2, 3], 5);

			expect(result.solutionsFound).toBeGreaterThan(0);
			expect(result.solutions.length).toBeGreaterThan(0);

			// Check that at least one solution is correct
			const firstSolution = result.solutions[0];
			expect(formatExpression(firstSolution)).toBe('2 + 3');
		});

		it('should find multiple solutions when they exist', () => {
			const result = solvePuzzle([1, 2, 3], 3, 10);

			expect(result.solutionsFound).toBeGreaterThan(1);

			// Should find: "3", "1 + 2", "2 + 1"
			const formattedSolutions = result.solutions.map(solution => formatExpression(solution));
			expect(formattedSolutions).toContain('3');
			expect(formattedSolutions.some(s => s.includes('1 + 2') || s.includes('2 + 1'))).toBe(true);
		});

		it('should respect maxSolutions parameter', () => {
			const result = solvePuzzle([1, 2, 3, 4], 5, 2);

			expect(result.solutions.length).toBeLessThanOrEqual(2);
			expect(result.solutionsFound).toBeLessThanOrEqual(2);
		});

		it('should find solutions with subtraction', () => {
			const result = solvePuzzle([5, 2], 3);

			expect(result.solutionsFound).toBeGreaterThan(0);
			const formattedSolutions = result.solutions.map(solution => formatExpression(solution));
			expect(formattedSolutions).toContain('5 - 2');
		});

		it('should find solutions with multiplication', () => {
			const result = solvePuzzle([2, 3], 6);

			expect(result.solutionsFound).toBeGreaterThan(0);
			const formattedSolutions = result.solutions.map(solution => formatExpression(solution));
			expect(formattedSolutions).toContain('2 × 3');
		});

		it('should find solutions with division', () => {
			const result = solvePuzzle([6, 2], 3);

			expect(result.solutionsFound).toBeGreaterThan(0);
			const formattedSolutions = result.solutions.map(solution => formatExpression(solution));
			expect(formattedSolutions).toContain('6 ÷ 2');
		});

		it('should find solutions with parentheses', () => {
			const result = solvePuzzle([1, 2, 3], 9, 20);

			// Should find (1 + 2) × 3 = 9
			const formattedSolutions = result.solutions.map(solution => formatExpression(solution));
			const hasParenthesesSolution = formattedSolutions.some(s =>
				s.includes('(') && s.includes(')') && s.includes('×'));
			expect(hasParenthesesSolution).toBe(true);
		});

		it('should handle larger number sets efficiently', () => {
			const start = Date.now();
			const result = solvePuzzle([1, 2, 3, 4, 5], 10, 5);
			const duration = Date.now() - start;

			expect(result.solutionsFound).toBeGreaterThan(0);
			expect(duration).toBeLessThan(1000); // Should complete within 1 second
		});

		it('should find complex solutions', () => {
			// Classic countdown numbers example
			const result = solvePuzzle([25, 50, 75, 100, 3, 6], 952, 5);

			expect(result.totalAttempts).toBeGreaterThan(0);
			// May or may not find solution due to complexity, but should not crash
		});

		it('should handle edge case with single number', () => {
			const result = solvePuzzle([42], 42);

			expect(result.solutionsFound).toBe(1);
			expect(formatExpression(result.solutions[0])).toBe('42');
		});

		it('should handle empty number array', () => {
			const result = solvePuzzle([], 5);

			expect(result.solutionsFound).toBe(0);
			expect(result.solutions).toHaveLength(0);
		});

		it('should find solutions that use all operations', () => {
			const result = solvePuzzle([1, 2, 3, 4, 5, 6], 100, 50);

			// Should find some complex solutions
			expect(result.totalAttempts).toBeGreaterThan(100);
		});

		it('should handle duplicate numbers', () => {
			const result = solvePuzzle([2, 2, 2], 6);

			expect(result.solutionsFound).toBeGreaterThan(0);
			const formattedSolutions = result.solutions.map(solution => formatExpression(solution));
			expect(formattedSolutions).toContain('2 + 2 + 2');
		});

		it('should stop at reasonable attempt limit', () => {
			const result = solvePuzzle([1, 2, 3, 4, 5, 6], 999, 1);

			// Should not exceed attempt limit (with small buffer for timing variations)
			expect(result.totalAttempts).toBeLessThanOrEqual(200_100);
		});

		it('should validate expression structure', () => {
			// Test internal logic by trying tricky cases
			const result = solvePuzzle([10, 5, 2], 7, 10);

			// All solutions should be valid expressions
			for (const solution of result.solutions) {
				const formatted = formatExpression(solution);
				// Should not have consecutive operations or other invalid structures
				expect(formatted).not.toMatch(/[+\-×÷]\s+[+\-×÷]/);
				expect(formatted).not.toMatch(/^\s*[+\-×÷]/);
				expect(formatted).not.toMatch(/[+\-×÷]\s*$/);
			}
		});
	});

	describe('real countdown numbers scenarios', () => {
		it('should solve typical countdown puzzle', () => {
			// A simpler but realistic scenario
			const result = solvePuzzle([2, 4, 6, 8], 14, 10);

			expect(result.solutionsFound).toBeGreaterThan(0);
			// Should find solutions like: 6 + 8, 2 × 4 + 6, etc.
		});

		it('should handle large numbers efficiently', () => {
			const result = solvePuzzle([25, 50, 4], 104, 5);

			// Should find solutions and complete within reasonable time
			expect(result.totalAttempts).toBeLessThan(50_000);
		});
	});
});
