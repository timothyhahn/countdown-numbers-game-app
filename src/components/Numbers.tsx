type NumbersProps = {
	numbers: number[];
};

export default function Numbers({numbers}: NumbersProps) {
	const handleDragStart = (e: React.DragEvent, number: number) => {
		e.dataTransfer.setData('text/plain', number.toString());
	};

	return (
		<div className='bg-white rounded-lg shadow-lg p-6 mb-6'>
			<h2 className='text-2xl font-semibold mb-4 text-slate-700'>Numbers</h2>
			<div className='grid grid-cols-3 gap-4 md:grid-cols-6'>
				{numbers.map((number, index) => (
					<div
						key={index}
						draggable
						onDragStart={e => {
							handleDragStart(e, number);
						}}
						className='bg-blue-500 text-white text-2xl font-bold p-4 rounded-lg text-center cursor-move hover:bg-blue-600 transition-colors'
					>
						{number}
					</div>
				))}
			</div>
		</div>
	);
}
