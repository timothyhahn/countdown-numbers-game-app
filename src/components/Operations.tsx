import {Operation, getOperationSymbol, getOperationName} from '../types/Operation';

export default function Operations() {
	const operations = [
		Operation.ADD,
		Operation.SUBTRACT,
		Operation.MULTIPLY,
		Operation.DIVIDE,
		Operation.OPEN_PAREN,
		Operation.CLOSE_PAREN,
	];

	const handleDragStart = (e: React.DragEvent, operation: Operation) => {
		e.dataTransfer.setData('text/plain', getOperationSymbol(operation));
	};

	return (
		<div className='bg-white rounded-lg shadow-lg p-6 mb-6'>
			<h2 className='text-2xl font-semibold mb-4 text-slate-700'>Operations</h2>
			<div className='grid grid-cols-3 gap-4 md:grid-cols-6'>
				{operations.map((operation, index) => (
					<div
						key={index}
						draggable
						onDragStart={e => {
							handleDragStart(e, operation);
						}}
						className='bg-purple-500 text-white text-3xl font-bold p-4 rounded-lg text-center cursor-move hover:bg-purple-600 transition-colors'
						title={getOperationName(operation)}
					>
						{getOperationSymbol(operation)}
					</div>
				))}
			</div>
		</div>
	);
}
