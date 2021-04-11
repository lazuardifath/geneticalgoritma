### Genetic Sudoku

This code instents to create sudoku solutions using Artificial Intelligence.

### Requeriments

	nodejs
	mocha (npm,global)
	chai (npm)

### Approach

A genetic algorithm is a general way to solve optimization problems. 

    1. Create a population f random solutions
    2. Pick some some solutions and sort it by the fitness function
    3. Replace the worst solution with a new solution, which is either a copy of the best solution, a mutation (perturbation) of the best solution, an entirely new randomized solution or a cross between the two best solutions. These are the most common evolutionary operators, but you could dream up others that use information from existing solutions to create new potentially good solutions.
    4. Check if you have a new global best fitness, if so, store the solution.
    5. If too many iterations go by without improvement, the entire population might be stuck in a local minimum (at the bottom of a local valley, with a possible chasm somewhere else, so to speak). If so, kill everyone and start over at 1.
    Go to 2.
