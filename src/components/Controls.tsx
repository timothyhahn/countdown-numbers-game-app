type ControlsProps = {
	onNewPuzzle: () => void;
	onSolve: () => void;
};

function Controls({onNewPuzzle, onSolve}: ControlsProps) {
	return (
		<div className='text-center space-x-4'>
			<button
				onClick={onNewPuzzle}
				className='bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors'
			>
				New Puzzle
			</button>
			<button
				onClick={onSolve}
				className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors'
			>
				Solve
			</button>
		</div>
	);
}

export default Controls;
