type TargetProps = {
	target: number;
	isComplete: boolean;
};

export default function Target({target, isComplete}: TargetProps) {
	return (
		<div className='bg-white rounded-lg shadow-lg p-6 mb-6'>
			<h2 className='text-2xl font-semibold mb-4 text-slate-700'>Target</h2>
			<div className='text-center'>
				<div className={`inline-block text-white text-6xl font-bold px-8 py-4 rounded-lg transition-colors ${
					isComplete ? 'bg-green-500' : 'bg-red-500'
				}`}>
					{target}
				</div>
			</div>
		</div>
	);
}
