import {
	describe, it, expect, vi,
} from 'vitest';
import {render, screen} from '@testing-library/react';
import Operations from '../Operations';

describe('Operations component', () => {
	it('should render all six operations', () => {
		render(<Operations />);

		expect(screen.getByText('+')).toBeInTheDocument();
		expect(screen.getByText('-')).toBeInTheDocument();
		expect(screen.getByText('×')).toBeInTheDocument();
		expect(screen.getByText('÷')).toBeInTheDocument();
		expect(screen.getByText('(')).toBeInTheDocument();
		expect(screen.getByText(')')).toBeInTheDocument();
	});

	it('should display "Operations" header', () => {
		render(<Operations />);
		expect(screen.getByText('Operations')).toBeInTheDocument();
	});

	it('should make all operations draggable', () => {
		render(<Operations />);

		const operationElements = ['+', '-', '×', '÷', '(', ')'].map(op =>
			screen.getByText(op));

		for (const element of operationElements) {
			expect(element).toHaveAttribute('draggable', 'true');
		}
	});

	it('should have proper styling for operation tiles', () => {
		render(<Operations />);
		const addElement = screen.getByText('+');

		expect(addElement).toHaveClass('bg-purple-500');
		expect(addElement).toHaveClass('text-white');
		expect(addElement).toHaveClass('text-3xl');
		expect(addElement).toHaveClass('font-bold');
		expect(addElement).toHaveClass('cursor-move');
	});

	it('should have correct tooltips for operations', () => {
		render(<Operations />);

		expect(screen.getByText('+')).toHaveAttribute('title', 'Addition');
		expect(screen.getByText('-')).toHaveAttribute('title', 'Subtraction');
		expect(screen.getByText('×')).toHaveAttribute('title', 'Multiplication');
		expect(screen.getByText('÷')).toHaveAttribute('title', 'Division');
		expect(screen.getByText('(')).toHaveAttribute('title', 'Open Parenthesis');
		expect(screen.getByText(')')).toHaveAttribute('title', 'Close Parenthesis');
	});

	it('should handle drag start event with correct data', () => {
		render(<Operations />);

		const addElement = screen.getByText('+');

		// Create a mock DataTransfer object
		const mockDataTransfer = {
			setData: vi.fn(),
		};

		// Create a drag event with mock dataTransfer
		const dragEvent = new Event('dragstart', {bubbles: true}) as any;
		dragEvent.dataTransfer = mockDataTransfer;

		// Dispatch the event
		addElement.dispatchEvent(dragEvent);

		expect(mockDataTransfer.setData).toHaveBeenCalledWith('text/plain', '+');
	});

	it('should render correct grid layout for six operations', () => {
		render(<Operations />);
		const gridContainer = screen.getByText('Operations').nextElementSibling;

		expect(gridContainer).toHaveClass('grid');
		expect(gridContainer).toHaveClass('grid-cols-3');
		expect(gridContainer).toHaveClass('md:grid-cols-6');
	});
});
