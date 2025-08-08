import {useState, useEffect} from 'react';
import Target from './components/Target';
import Numbers from './components/Numbers';
import Operations from './components/Operations';
import Solutions from './components/Solutions';
import Controls from './components/Controls';
import {type Operation} from './types/Operation';
import {evaluateExpression} from './utils/calculator';
import {getFirstSolution, formatExpression} from './utils/solver';

// Simple logger for debugging
const logger = {
	debug(message: string, ...args: unknown[]) {
		console.debug(`[App] ${message}`, ...args);
	},
};

type GameState = {
	numbers: number[];
	target: number;
	availableNumbers: number[];
	solution: Array<number | Operation>;
};

function App() {
	const [gameState, setGameState] = useState<GameState>({
		numbers: [],
		target: 0,
		availableNumbers: [],
		solution: [],
	});

	const generatePuzzle = () => {
		const largeNumbers = [25, 50, 75, 100];
		const smallNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

		// Generate 2 large numbers and 4 small numbers by default
		const numberLarge = 2;
		const numberSmall = 6 - numberLarge;

		let attempts = 0;
		const maxAttempts = 50; // Prevent infinite loops

		while (attempts < maxAttempts) {
			attempts++;

			const selectedNumbers: number[] = [];

			// Select large numbers
			for (let i = 0; i < numberLarge; i++) {
				const index = Math.floor(Math.random() * largeNumbers.length);
				selectedNumbers.push(largeNumbers[index]);
			}

			// Select small numbers
			for (let i = 0; i < numberSmall; i++) {
				const index = Math.floor(Math.random() * smallNumbers.length);
				selectedNumbers.push(smallNumbers[index]);
			}

			// Generate target (3-digit number 101-999)
			const target = Math.floor(Math.random() * 899) + 101;

			// Check if the puzzle has a solution
			const solution = getFirstSolution(selectedNumbers, target);

			if (solution) {
				// Found a solvable puzzle
				logger.debug(`Generated solvable puzzle on attempt ${attempts}:`, {
					numbers: selectedNumbers,
					target,
					solutionExists: true,
				});

				setGameState({
					numbers: selectedNumbers,
					target,
					availableNumbers: [...selectedNumbers],
					solution: [],
				});
				return;
			}

			// Puzzle is not solvable, try again
			logger.debug(`Rejecting unsolvable puzzle (attempt ${attempts}):`, {
				numbers: selectedNumbers,
				target,
				solutionExists: false,
			});
		}

		// Fallback: if we can't find a solvable puzzle after maxAttempts,
		// generate one anyway to avoid infinite loop
		logger.debug(`Could not find solvable puzzle after ${maxAttempts} attempts, using fallback`);

		const fallbackNumbers = [25, 50, 2, 3, 4, 5]; // Known to have many solutions
		const fallbackTarget = 127; // 25 × 5 + 2 = 127

		setGameState({
			numbers: fallbackNumbers,
			target: fallbackTarget,
			availableNumbers: [...fallbackNumbers],
			solution: [],
		});
	};

	const solvePuzzle = () => {
		// Clear current solution first
		setGameState(previous => ({
			...previous,
			availableNumbers: [...previous.numbers],
			solution: [],
		}));

		// Find a solution using the solver
		const solution = getFirstSolution(gameState.numbers, gameState.target);

		if (solution) {
			logger.debug('Showing solution:', formatExpression(solution));

			// Set the solution in the game state
			const usedNumbers: number[] = [];
			const solutionTokens: Array<number | Operation> = [];

			for (const token of solution) {
				if (typeof token === 'number') {
					usedNumbers.push(token);
				}

				solutionTokens.push(token);
			}

			setGameState(previous => ({
				...previous,
				availableNumbers: previous.numbers.filter(num => {
					const indexToRemove = usedNumbers.indexOf(num);
					if (indexToRemove !== -1) {
						usedNumbers.splice(indexToRemove, 1);
						return false;
					}

					return true;
				}),
				solution: solutionTokens,
			}));
		} else {
			logger.debug('No solution found for current puzzle');
		}
	};

	const addToSolution = (item: number | Operation) => {
		if (typeof item === 'number') {
			// Remove number from available numbers
			setGameState(previous => ({
				...previous,
				availableNumbers: previous.availableNumbers.filter((_number, index) => {
					const firstMatch = previous.availableNumbers.indexOf(item);
					return index !== firstMatch;
				}),
				solution: [...previous.solution, item],
			}));
		} else {
			// Add operation
			setGameState(previous => ({
				...previous,
				solution: [...previous.solution, item],
			}));
		}
	};

	const removeFromSolution = (index: number) => {
		const item = gameState.solution[index];
		if (typeof item === 'number') {
			// Return number to available numbers
			setGameState(previous => ({
				...previous,
				availableNumbers: [...previous.availableNumbers, item],
				solution: previous.solution.filter((_, i) => i !== index),
			}));
		} else {
			// Remove operation
			setGameState(previous => ({
				...previous,
				solution: previous.solution.filter((_, i) => i !== index),
			}));
		}
	};

	const calculateSolutionTotal = () => evaluateExpression(gameState.solution);

	useEffect(() => {
		generatePuzzle();
	}, []);

	return (
		<div className='min-h-screen min-w-screen bg-slate-100 p-8 flex items-center justify-center'>
			<div className='w-full max-w-2xl'>
				<h1 className='text-4xl font-bold text-center mb-8 text-slate-800'>
					Countdown Numbers Game
				</h1>

				<Target target={gameState.target} isComplete={calculateSolutionTotal() === gameState.target} />
				<Numbers numbers={gameState.availableNumbers} />
				<Operations />
				<Solutions
					solution={gameState.solution}
					onRemoveItem={removeFromSolution}
					onDrop={addToSolution}
				/>

				<Controls onNewPuzzle={generatePuzzle} onSolve={solvePuzzle} />
			</div>
		</div>
	);
}

export default App;
