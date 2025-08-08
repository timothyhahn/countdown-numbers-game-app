import {
	describe, it, expect, vi,
} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Controls from '../Controls';

describe('Controls', () => {
	it('should render both buttons', () => {
		const mockOnNewPuzzle = vi.fn();
		const mockOnSolve = vi.fn();

		render(<Controls onNewPuzzle={mockOnNewPuzzle} onSolve={mockOnSolve} />);

		expect(screen.getByRole('button', {name: 'New Puzzle'})).toBeInTheDocument();
		expect(screen.getByRole('button', {name: 'Solve'})).toBeInTheDocument();
	});

	it('should call onNewPuzzle when New Puzzle button is clicked', async () => {
		const mockOnNewPuzzle = vi.fn();
		const mockOnSolve = vi.fn();
		const user = userEvent.setup();

		render(<Controls onNewPuzzle={mockOnNewPuzzle} onSolve={mockOnSolve} />);

		const newPuzzleButton = screen.getByRole('button', {name: 'New Puzzle'});
		await user.click(newPuzzleButton);

		expect(mockOnNewPuzzle).toHaveBeenCalledTimes(1);
		expect(mockOnSolve).not.toHaveBeenCalled();
	});

	it('should call onSolve when Solve button is clicked', async () => {
		const mockOnNewPuzzle = vi.fn();
		const mockOnSolve = vi.fn();
		const user = userEvent.setup();

		render(<Controls onNewPuzzle={mockOnNewPuzzle} onSolve={mockOnSolve} />);

		const solveButton = screen.getByRole('button', {name: 'Solve'});
		await user.click(solveButton);

		expect(mockOnSolve).toHaveBeenCalledTimes(1);
		expect(mockOnNewPuzzle).not.toHaveBeenCalled();
	});

	it('should have proper button styling', () => {
		const mockOnNewPuzzle = vi.fn();
		const mockOnSolve = vi.fn();

		render(<Controls onNewPuzzle={mockOnNewPuzzle} onSolve={mockOnSolve} />);

		const newPuzzleButton = screen.getByRole('button', {name: 'New Puzzle'});
		const solveButton = screen.getByRole('button', {name: 'Solve'});

		// Check that buttons have appropriate styling classes
		expect(newPuzzleButton).toHaveClass('bg-green-500', 'hover:bg-green-600', 'text-white', 'font-bold');
		expect(solveButton).toHaveClass('bg-blue-500', 'hover:bg-blue-600', 'text-white', 'font-bold');
	});

	it('should have proper container styling', () => {
		const mockOnNewPuzzle = vi.fn();
		const mockOnSolve = vi.fn();

		render(<Controls onNewPuzzle={mockOnNewPuzzle} onSolve={mockOnSolve} />);

		const container = screen.getByRole('button', {name: 'New Puzzle'}).parentElement;
		expect(container).toHaveClass('text-center', 'space-x-4');
	});

	it('should be accessible', () => {
		const mockOnNewPuzzle = vi.fn();
		const mockOnSolve = vi.fn();

		render(<Controls onNewPuzzle={mockOnNewPuzzle} onSolve={mockOnSolve} />);

		const newPuzzleButton = screen.getByRole('button', {name: 'New Puzzle'});
		const solveButton = screen.getByRole('button', {name: 'Solve'});

		expect(newPuzzleButton).toBeEnabled();
		expect(solveButton).toBeEnabled();
		expect(newPuzzleButton.tagName).toBe('BUTTON');
		expect(solveButton.tagName).toBe('BUTTON');
	});

	it('should handle multiple rapid clicks', async () => {
		const mockOnNewPuzzle = vi.fn();
		const mockOnSolve = vi.fn();
		const user = userEvent.setup();

		render(<Controls onNewPuzzle={mockOnNewPuzzle} onSolve={mockOnSolve} />);

		const newPuzzleButton = screen.getByRole('button', {name: 'New Puzzle'});
		const solveButton = screen.getByRole('button', {name: 'Solve'});

		// Click multiple times rapidly
		await user.click(newPuzzleButton);
		await user.click(solveButton);
		await user.click(newPuzzleButton);

		expect(mockOnNewPuzzle).toHaveBeenCalledTimes(2);
		expect(mockOnSolve).toHaveBeenCalledTimes(1);
	});
});
