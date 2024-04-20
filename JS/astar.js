
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let cellSize = 20; // Adjust cell size as needed
let rows = canvas.height / cellSize;
let cols = canvas.width / cellSize;

let startCell = {row: 0, col: 0};
let endCell = {row: rows - 1, col: cols - 1};
let grid = new Array(rows).fill(0).map(() => new Array(cols).fill(0));

let startSet = false;
let endSet = false;
let wallSet = false;

document.getElementById('setStart').addEventListener('click', function() {
    startSet = true;
    endSet = false;
    wallSet = false;
});

document.getElementById('setEnd').addEventListener('click', function() {
    startSet = false;
    endSet = true;
    wallSet = false;
});

document.getElementById('setWall').addEventListener('click', function() {
    startSet = false;
    endSet = false;
    wallSet = true;
});

document.getElementById('canvas').addEventListener('click', function(e) {
    let x = Math.floor(e.offsetX / cellSize);
    let y = Math.floor(e.offsetY / cellSize);
    
    if (startSet) {
        startCell = {row: y, col: x};
        draw();
    } else if (endSet) {
        endCell = {row: y, col: x};
        draw();
    } else if (wallSet) {
        grid[y][x] = 1;
        draw();
    }
});

async function aStar(grid, start, end) {
    disableUI();
    let openSet = [start];
    let cameFrom = {};
    let gScore = {};
    let fScore = {};

    gScore[start.row + ',' + start.col] = 0;
    fScore[start.row + ',' + start.col] = heuristic(start, end);

    while (openSet.length > 0) {
        let current = openSet.reduce(function (acc, node) {
            return fScore[acc.row + ',' + acc.col] < fScore[node.row + ',' + node.col] ? acc : node;
        });

        if (current.row === end.row && current.col === end.col) {
            let totalPath = [end];
            let currentNode = end;

            while (currentNode.row !== start.row || currentNode.col !== start.col) {
                currentNode = cameFrom[currentNode.row + ',' + currentNode.col];
                totalPath.unshift(currentNode);
            }
            enableUI();
            return totalPath;
        }

        openSet = openSet.filter(function (node) {
            return node.row !== current.row || node.col !== current.col;
        });

        let neighbors = getNeighbors(grid, current);

        for (let i = 0; i < neighbors.length; i++) {

            let neighbor = neighbors[i];

            if ((neighbor.row !== start.row || neighbor.col !== start.col) && (neighbor.row !== end.row || neighbor.col !== end.col)) {
                ctx.fillStyle = '#562b19';
                ctx.fillRect(neighbor.col * cellSize, neighbor.row * cellSize, cellSize, cellSize);
                ctx.strokeStyle = '#7c7b7b'; // Цвет обводки
                ctx.strokeRect(neighbor.col * cellSize, neighbor.row * cellSize, cellSize, cellSize); // Добавляем обводку
                await sleep(10 / parseInt(speedValue.value) * 100);
            }

            let tentativeGScore = gScore[current.row + ',' + current.col] + 1;

            if (!gScore[neighbor.row + ',' + neighbor.col] || tentativeGScore < gScore[neighbor.row + ',' + neighbor.col]) {
                cameFrom[neighbor.row + ',' + neighbor.col] = current;
                gScore[neighbor.row + ',' + neighbor.col] = tentativeGScore;
                fScore[neighbor.row + ',' + neighbor.col] = gScore[neighbor.row + ',' + neighbor.col] + heuristic(neighbor, end);

                if (!openSet.some(function (node) {
                    return node.row === neighbor.row && node.col === neighbor.col;
                }))
                    openSet.push(neighbor);
            }
        }
    }
    enableUI();
    return [];
}

function heuristic(a, b) {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

function getNeighbors(grid, node) {
    let neighbors = [];
    if (node.row > 0 && grid[node.row - 1][node.col] !== 1) {
        neighbors.push({row: node.row - 1, col: node.col});
    }
    if (node.row < grid.length - 1 && grid[node.row + 1][node.col] !== 1) {
        neighbors.push({row: node.row + 1, col: node.col});
    }
    if (node.col > 0 && grid[node.row][node.col - 1] !== 1) {
        neighbors.push({row: node.row, col: node.col - 1});
    }
    if (node.col < grid[node.row].length - 1 && grid[node.row][node.col + 1] !== 1) {
        neighbors.push({row: node.row, col: node.col + 1});
    }
    return neighbors;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            ctx.fillStyle = grid[i][j] === 1 ? '#000' : '#fff';
            ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
            ctx.strokeStyle = '#7c7b7b'; // Цвет обводки
            ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize); // Добавляем обводку
        }
    }

    // Draw start cell
    ctx.fillStyle = '#4CAF50'; // зеленая
    ctx.fillRect(startCell.col * cellSize, startCell.row * cellSize, cellSize, cellSize);

    // Draw end cell
    ctx.fillStyle = '#FF5733'; // красная
    ctx.fillRect(endCell.col * cellSize, endCell.row * cellSize, cellSize, cellSize);
}

document.getElementById('runAlgorithm').addEventListener('click', function() {
    aStar(grid, startCell, endCell)
        .then(path => {
            for (let i = 0; i < path.length; i++) {
                let step = path[i];
                ctx.fillStyle = '#964B00'; // коричневый
                ctx.fillRect(step.col * cellSize, step.row * cellSize, cellSize, cellSize);
            }
        });
});
draw();
