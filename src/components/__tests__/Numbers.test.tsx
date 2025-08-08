import {
	describe, it, expect, vi,
} from 'vitest';
import {render, screen} from '@testing-library/react';
import Numbers from '../Numbers';

describe('Numbers component', () => {
	it('should render all provided numbers', () => {
		const numbers = [25, 50, 3, 7, 10, 4];
		render(<Numbers numbers={numbers} />);

		for (const number of numbers) {
			expect(screen.getByText(number.toString())).toBeInTheDocument();
		}
	});

	it('should display "Numbers" header', () => {
		render(<Numbers numbers={[1, 2, 3]} />);
		expect(screen.getByText('Numbers')).toBeInTheDocument();
	});

	it('should render empty when no numbers provided', () => {
		render(<Numbers numbers={[]} />);
		expect(screen.getByText('Numbers')).toBeInTheDocument();
		// Should only have the header, no number tiles
		expect(screen.queryByText(/\d+/)).not.toBeInTheDocument();
	});

	it('should make numbers draggable', () => {
		const numbers = [5, 10];
		render(<Numbers numbers={numbers} />);

		const numberElements = screen.getAllByText(/\d+/);
		for (const element of numberElements) {
			expect(element).toHaveAttribute('draggable', 'true');
		}
	});

	it('should have proper styling for number tiles', () => {
		render(<Numbers numbers={[42]} />);
		const numberElement = screen.getByText('42');

		expect(numberElement).toHaveClass('bg-blue-500');
		expect(numberElement).toHaveClass('text-white');
		expect(numberElement).toHaveClass('text-2xl');
		expect(numberElement).toHaveClass('font-bold');
		expect(numberElement).toHaveClass('cursor-move');
	});

	it('should handle drag start event', () => {
		const numbers = [7];
		render(<Numbers numbers={numbers} />);

		const numberElement = screen.getByText('7');

		// Create a mock DataTransfer object
		const mockDataTransfer = {
			setData: vi.fn(),
		};

		// Create a drag event with mock dataTransfer
		const dragEvent = new Event('dragstart', {bubbles: true}) as any;
		dragEvent.dataTransfer = mockDataTransfer;

		// Dispatch the event
		numberElement.dispatchEvent(dragEvent);

		expect(mockDataTransfer.setData).toHaveBeenCalledWith('text/plain', '7');
	});

	it('should render correct grid layout classes', () => {
		render(<Numbers numbers={[1, 2, 3, 4, 5, 6]} />);
		const gridContainer = screen.getByText('Numbers').nextElementSibling;

		expect(gridContainer).toHaveClass('grid');
		expect(gridContainer).toHaveClass('grid-cols-3');
		expect(gridContainer).toHaveClass('md:grid-cols-6');
	});
});
