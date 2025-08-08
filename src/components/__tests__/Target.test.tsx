import {describe, it, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import Target from '../Target';

describe('Target component', () => {
	it('should render target number', () => {
		render(<Target target={123} isComplete={false} />);
		expect(screen.getByText('123')).toBeInTheDocument();
	});

	it('should display "Target" header', () => {
		render(<Target target={456} isComplete={false} />);
		expect(screen.getByText('Target')).toBeInTheDocument();
	});

	it('should have red background when not complete', () => {
		render(<Target target={789} isComplete={false} />);
		const targetElement = screen.getByText('789');
		expect(targetElement).toHaveClass('bg-red-500');
		expect(targetElement).not.toHaveClass('bg-green-500');
	});

	it('should have green background when complete', () => {
		render(<Target target={321} isComplete={true} />);
		const targetElement = screen.getByText('321');
		expect(targetElement).toHaveClass('bg-green-500');
		expect(targetElement).not.toHaveClass('bg-red-500');
	});

	it('should always have white text and proper styling', () => {
		render(<Target target={555} isComplete={false} />);
		const targetElement = screen.getByText('555');
		expect(targetElement).toHaveClass('text-white');
		expect(targetElement).toHaveClass('text-6xl');
		expect(targetElement).toHaveClass('font-bold');
		expect(targetElement).toHaveClass('rounded-lg');
	});
});
