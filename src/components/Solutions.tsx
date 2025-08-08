import {type Operation, parseOperation} from '../types/Operation';
import {evaluateExpression} from '../utils/calculator';

type SolutionsProps = {
	solution: Array<number | Operation>;
	onRemoveItem: (index: number) => void;
	onDrop: (item: number | Operation) => void;
};

export default function Solutions({solution, onRemoveItem, onDrop}: SolutionsProps) {
	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		const data = e.dataTransfer.getData('text/plain');

		// Try to parse as number, otherwise parse as operation
		const parsedNumber = Number.parseInt(data);
		if (isNaN(parsedNumber)) {
			const operation = parseOperation(data);
			if (operation) {
				onDrop(operation);
			}
		} else {
			onDrop(parsedNumber);
		}
	};

	const handleRemoveItem = (index: number) => {
		onRemoveItem(index);
	};

	const calculateRunningTotal = () => evaluateExpression(solution);

	return (
		<div className='bg-white rounded-lg shadow-lg p-6 mb-6'>
			<div className='flex justify-between items-center mb-4'>
				<h2 className='text-2xl font-semibold text-slate-700'>Solution</h2>
				<div className='text-xl font-bold text-slate-600'>
					Running Total: {solution.length > 0 ? calculateRunningTotal() : 0}
				</div>
			</div>

			<div
				className='min-h-24 border-2 border-dashed border-slate-300 rounded-lg p-4 bg-slate-50'
				onDragOver={handleDragOver}
				onDrop={handleDrop}
			>
				{solution.length === 0
					? (
						<div className='text-center text-slate-500 py-4'>
							Drag numbers and operations here
						</div>
					)
					: (
						<div className='flex flex-wrap gap-2'>
							{solution.map((item, index) => (
								<div
									key={index}
									className={`px-4 py-2 rounded-lg font-bold text-white cursor-pointer transition-colors ${
										typeof item === 'number'
											? 'bg-blue-500 hover:bg-blue-600'
											: 'bg-purple-500 hover:bg-purple-600'
									}`}
									onClick={() => {
										handleRemoveItem(index);
									}}
									title='Click to remove'
								>
									{item}
								</div>
							))}
						</div>
					)}
			</div>
		</div>
	);
}
