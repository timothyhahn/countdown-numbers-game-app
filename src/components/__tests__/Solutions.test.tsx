import {
	describe, it, expect, vi, beforeEach,
} from 'vitest';
import {render, screen, fireEvent} from '@testing-library/react';
import Solutions from '../Solutions';
import {OperationSymbol} from '../../types/Operation';

describe('Solutions component', () => {
	const mockOnRemoveItem = vi.fn();
	const mockOnDrop = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should display "Solution" header', () => {
		render(<Solutions solution={[]} onRemoveItem={mockOnRemoveItem} onDrop={mockOnDrop} />);
		expect(screen.getByText('Solution')).toBeInTheDocument();
	});

	it('should show placeholder when solution is empty', () => {
		render(<Solutions solution={[]} onRemoveItem={mockOnRemoveItem} onDrop={mockOnDrop} />);
		expect(screen.getByText('Drag numbers and operations here')).toBeInTheDocument();
		expect(screen.getByText('Running Total: 0')).toBeInTheDocument();
	});

	it('should render solution items', () => {
		const solution = [3, OperationSymbol.ADD, 4, OperationSymbol.MULTIPLY, 2];
		render(<Solutions solution={solution} onRemoveItem={mockOnRemoveItem} onDrop={mockOnDrop} />);

		expect(screen.getByText('3')).toBeInTheDocument();
		expect(screen.getByText('+')).toBeInTheDocument();
		expect(screen.getByText('4')).toBeInTheDocument();
		expect(screen.getByText('×')).toBeInTheDocument();
		expect(screen.getByText('2')).toBeInTheDocument();
	});

	it('should calculate and display running total correctly', () => {
		// 3 + 4 × 2 = 3 + 8 = 11 (order of operations)
		const solution = [3, OperationSymbol.ADD, 4, OperationSymbol.MULTIPLY, 2];
		render(<Solutions solution={solution} onRemoveItem={mockOnRemoveItem} onDrop={mockOnDrop} />);

		expect(screen.getByText('Running Total: 11')).toBeInTheDocument();
	});

	it('should handle parentheses in calculation', () => {
		// (3 + 4) × 2 = 7 × 2 = 14
		const solution = [OperationSymbol.OPEN_PAREN, 3, OperationSymbol.ADD, 4, OperationSymbol.CLOSE_PAREN, OperationSymbol.MULTIPLY, 2];
		render(<Solutions solution={solution} onRemoveItem={mockOnRemoveItem} onDrop={mockOnDrop} />);

		expect(screen.getByText('Running Total: 14')).toBeInTheDocument();
	});

	it('should apply different colors to numbers and operations', () => {
		const solution = [5, OperationSymbol.ADD, 10];
		render(<Solutions solution={solution} onRemoveItem={mockOnRemoveItem} onDrop={mockOnDrop} />);

		const numberElement = screen.getByText('5');
		const operationElement = screen.getByText('+');

		expect(numberElement).toHaveClass('bg-blue-500');
		expect(operationElement).toHaveClass('bg-purple-500');
	});

	it('should call onRemoveItem when clicking on solution items', () => {
		const solution = [7, OperationSymbol.SUBTRACT, 3];
		render(<Solutions solution={solution} onRemoveItem={mockOnRemoveItem} onDrop={mockOnDrop} />);

		const firstItem = screen.getByText('7');
		fireEvent.click(firstItem);

		expect(mockOnRemoveItem).toHaveBeenCalledWith(0);
	});

	it('should handle drop event with numbers', () => {
		render(<Solutions solution={[]} onRemoveItem={mockOnRemoveItem} onDrop={mockOnDrop} />);

		const dropZone = screen.getByText('Drag numbers and operations here').parentElement!;

		const mockDataTransfer = {
			getData: vi.fn().mockReturnValue('42'),
		};

		const dropEvent = new Event('drop', {bubbles: true}) as any;
		dropEvent.dataTransfer = mockDataTransfer;

		fireEvent(dropZone, dropEvent);

		expect(mockOnDrop).toHaveBeenCalledWith(42);
	});

	it('should handle drop event with operations', () => {
		render(<Solutions solution={[]} onRemoveItem={mockOnRemoveItem} onDrop={mockOnDrop} />);

		const dropZone = screen.getByText('Drag numbers and operations here').parentElement!;

		const mockDataTransfer = {
			getData: vi.fn().mockReturnValue('+'),
		};

		const dropEvent = new Event('drop', {bubbles: true}) as any;
		dropEvent.dataTransfer = mockDataTransfer;

		fireEvent(dropZone, dropEvent);

		expect(mockOnDrop).toHaveBeenCalledWith(OperationSymbol.ADD);
	});

	it('should prevent default on dragover', () => {
		render(<Solutions solution={[]} onRemoveItem={mockOnRemoveItem} onDrop={mockOnDrop} />);

		const dropZone = screen.getByText('Drag numbers and operations here').parentElement!;

		const dragOverEvent = new Event('dragover', {bubbles: true}) as any;
		dragOverEvent.preventDefault = vi.fn();

		fireEvent(dropZone, dragOverEvent);

		expect(dragOverEvent.preventDefault).toHaveBeenCalled();
	});

	it('should have proper styling for drop zone', () => {
		render(<Solutions solution={[]} onRemoveItem={mockOnRemoveItem} onDrop={mockOnDrop} />);

		const dropZone = screen.getByText('Drag numbers and operations here').parentElement!;

		expect(dropZone).toHaveClass('min-h-24');
		expect(dropZone).toHaveClass('border-2');
		expect(dropZone).toHaveClass('border-dashed');
		expect(dropZone).toHaveClass('rounded-lg');
	});
});
