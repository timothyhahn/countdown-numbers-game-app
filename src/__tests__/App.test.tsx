import {describe, it, expect} from 'vitest';
import {render, screen, fireEvent} from '@testing-library/react';
import App from '../App';

describe('App component', () => {
	it('should render the game title', () => {
		render(<App />);
		expect(screen.getByText('Countdown Numbers Game')).toBeInTheDocument();
	});

	it('should render all main components', () => {
		render(<App />);

		expect(screen.getByText('Target')).toBeInTheDocument();
		expect(screen.getByText('Numbers')).toBeInTheDocument();
		expect(screen.getByText('Operations')).toBeInTheDocument();
		expect(screen.getByText('Solution')).toBeInTheDocument();
	});

	it('should generate a puzzle on initial load', () => {
		render(<App />);

		// Should show 6 number tiles (don't test specific values since they're random)
		const numberTiles = screen.getAllByRole('generic').filter(element =>
			element.classList.contains('bg-blue-500') && /^\d+$/.test(element.textContent || ''));
		expect(numberTiles).toHaveLength(6);

		// Should show target number (3-digit number)
		const targetElement = screen.getByRole('generic', {
			name: (content, element) => element?.classList.contains('bg-red-500')
				&& /^\d{3}$/.test(element.textContent || ''),
		});
		expect(targetElement).toBeInTheDocument();
	});

	it('should have a New Puzzle button', () => {
		render(<App />);
		expect(screen.getByRole('button', {name: 'New Puzzle'})).toBeInTheDocument();
	});

	it('should have a Solve button', () => {
		render(<App />);
		expect(screen.getByRole('button', {name: 'Solve'})).toBeInTheDocument();
	});

	it('should show a solution when Solve button is clicked', () => {
		render(<App />);

		// Initially, solution should be empty
		expect(screen.getByText('Drag numbers and operations here')).toBeInTheDocument();
		expect(screen.getByText('Running Total: 0')).toBeInTheDocument();

		// Click solve button
		const solveButton = screen.getByRole('button', {name: 'Solve'});
		fireEvent.click(solveButton);

		// After clicking solve, there should be some solution shown
		// The exact solution will vary, but we should no longer see the empty state
		expect(screen.queryByText('Drag numbers and operations here')).not.toBeInTheDocument();
		expect(screen.queryByText('Running Total: 0')).not.toBeInTheDocument();
	});

	it('should generate new puzzle when New Puzzle button is clicked', () => {
		render(<App />);

		const newPuzzleButton = screen.getByRole('button', {name: 'New Puzzle'});
		fireEvent.click(newPuzzleButton);

		// Should still have 6 number tiles after clicking New Puzzle
		const numberTiles = screen.getAllByRole('generic').filter(element =>
			element.classList.contains('bg-blue-500') && /^\d+$/.test(element.textContent || ''));
		expect(numberTiles).toHaveLength(6);

		// Should still have a target number (3-digit)
		const targetElement = screen.getByRole('generic', {
			name: (content, element) => element?.classList.contains('bg-red-500')
				&& /^\d{3}$/.test(element.textContent || ''),
		});
		expect(targetElement).toBeInTheDocument();
	});

	it('should show all six operations', () => {
		render(<App />);

		expect(screen.getByText('+')).toBeInTheDocument();
		expect(screen.getByText('-')).toBeInTheDocument();
		expect(screen.getByText('×')).toBeInTheDocument();
		expect(screen.getByText('÷')).toBeInTheDocument();
		expect(screen.getByText('(')).toBeInTheDocument();
		expect(screen.getByText(')')).toBeInTheDocument();
	});

	it('should start with empty solution', () => {
		render(<App />);
		expect(screen.getByText('Drag numbers and operations here')).toBeInTheDocument();
		expect(screen.getByText('Running Total: 0')).toBeInTheDocument();
	});

	it('should have red target initially (not complete)', () => {
		render(<App />);
		const targetElement = screen.getByRole('generic', {
			name: (content, element) => element?.classList.contains('bg-red-500')
				&& /^\d{3}$/.test(element.textContent || ''),
		});
		expect(targetElement).toHaveClass('bg-red-500');
		expect(targetElement).not.toHaveClass('bg-green-500');
	});

	it('should have proper container styling', () => {
		render(<App />);
		const mainContainer = screen.getByText('Countdown Numbers Game').parentElement?.parentElement;

		expect(mainContainer).toHaveClass('min-h-screen');
		expect(mainContainer).toHaveClass('bg-slate-100');
		expect(mainContainer).toHaveClass('flex');
		expect(mainContainer).toHaveClass('items-center');
		expect(mainContainer).toHaveClass('justify-center');
	});
});
