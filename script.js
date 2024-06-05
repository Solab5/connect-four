// Connect four Game

// Gameboard function
function gameBoard(){
    const rows = 6;
    const columns = 7;
    const board = [];

    for(let i = 0; i < rows; i++) {
        board[i] = [];
        for(let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    // method for getting the board
    const getBoard = () => board;

    // method for adding a token to the board
    // we need to find the lowest cell in the column then change the cell value to the player's number
    const dropToken = (column, player) => {
        const availableCells = board.filter(row => row[column].getValue() === 0).map(row => row[column]);
        
        // if no cells the move is invalid
        if(!availableCells.length) return false;

        // otherwise pick the last one in the array
        const lowestRow = availableCells.length - 1; // Corrected variable name from 'availableCell' to 'availableCells'
        board[lowestRow][column].addToken(player);
    };
    
    // method to print the board to the console
    const printBoard = () => {
        const boardWithCellValues = board.map(row => row.map(cell => cell.getValue())); // Added 'const' keyword
        console.log(boardWithCellValues);
    }

    // here we provide an interface for the rest of the application to interact with the gameboard
    return {
        getBoard,
        dropToken,
        printBoard
    };
} // Added closing brace

// Cell factory function
function Cell() {
    let value = 0;
    
    // Accept player's token to change the value of the cell
    const addToken = (player) => {
        value = player;
    };
    
    // How we will retrieve the value of the cell
    const getValue = () => value;

    return { 
        addToken, 
        getValue 
    };
}

// Game controller
function gameController(
    playerOneName = 'Player 1',
    playerTwoName = 'Player 2'
    ){
    const board = gameBoard();
    const players = [
        {
            name: playerOneName,
            token: 1
        },
        {
            name: playerTwoName,
            token: 2
        }
    ];
    let currentPlayer = players[0];
    let gameResult = {status: 'ongoing'};

    const getResult = () => gameResult;

    const switchPlayerTurn = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    }
    
    const getActivePlayer = () => currentPlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`It's ${getActivePlayer().name}'s turn`);
    }; // Added missing closing brace

    const playRound = (column) => {
        // drop token for current player
        console.log(`Dropping ${getActivePlayer().name}' column into column ${column}`);
        board.dropToken(column, getActivePlayer().token);

        // logic for checking  a win
        // check for horizontal win
        function checkHorizontal() {
            for(let i = 0; i < 6; i++) {
                for(let j = 0; j < 4; j++) {
                    if(board.getBoard()[i][j].getValue() === getActivePlayer().token &&
                        board.getBoard()[i][j+1].getValue() === getActivePlayer().token &&
                        board.getBoard()[i][j+2].getValue() === getActivePlayer().token &&
                        board.getBoard()[i][j+3].getValue() === getActivePlayer().token) {
                            return true;
                        }
                }
            }
            return false;
        }

        // check for vertical win
        function checkVertical() {
            for(let i = 0; i < 3; i++) {
                for(let j = 0; j < 7; j++) {
                    if(board.getBoard()[i][j].getValue() === getActivePlayer().token &&
                        board.getBoard()[i+1][j].getValue() === getActivePlayer().token &&
                        board.getBoard()[i+2][j].getValue() === getActivePlayer().token &&
                        board.getBoard()[i+3][j].getValue() === getActivePlayer().token) {
                            return true;
                        }
                }
            }
            return false;
        }
        // check for diagonal win
        function checkDiagonal() {
            for(let i = 0; i < 3; i++) {
                for(let j = 0; j < 4; j++) {
                    if(board.getBoard()[i][j].getValue() === getActivePlayer().token &&
                        board.getBoard()[i+1][j+1].getValue() === getActivePlayer().token &&
                        board.getBoard()[i+2][j+2].getValue() === getActivePlayer().token &&
                        board.getBoard()[i+3][j+3].getValue() === getActivePlayer().token) {
                            return true;
                        }
                }
            }
            for(let i = 0; i < 3; i++) {
                for(let j = 3; j < 7; j++) {
                    if(board.getBoard()[i][j].getValue() === getActivePlayer().token &&
                        board.getBoard()[i+1][j-1].getValue() === getActivePlayer().token &&
                        board.getBoard()[i+2][j-2].getValue() === getActivePlayer().token &&
                        board.getBoard()[i+3][j-3].getValue() === getActivePlayer().token) {
                            return true;
                        }
                }
            }
            return false;
        }

        // check for draw
        function checkDraw() {
            return board.getBoard().every(row => row.every(cell => cell.getValue() !== 0));
        }

        // Check for end  of game
        if (checkHorizontal() || checkVertical() || checkDiagonal()) {
            console.log(`${getActivePlayer().name} wins!`);
            gameResult = {
                status: 'won',
                winner: getActivePlayer()
            };
            return;
        } else if (checkDraw()) {
            console.log('The game is a draw');
            gameResult = {
                status: 'draw'
            };
            return;
        }

        // switch player turn
        switchPlayerTurn();
        printNewRound();
        return {
            status: 'ongoing'
        };
    };

    // intial play game message
    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
        getResult
    };
} // Removed extra closing brace

function screenController() {
    const game = gameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const winDiv = document.querySelector('.win');

    const updateScreen = () => {
        // clear the board
        boardDiv.textContent = '';

        // get the newest version of the board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        const result = game.getResult();

        // display player's turn
        playerTurnDiv.textContent = `It's ${activePlayer.name}'s turn....`;

        // render board squares
        board.forEach(row => {
            row.forEach((cell, index) => {
                const cellButton = document.createElement('button');
                cellButton.classList.add('cell');

                cellButton.dataset.column = index;
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })

        // display win message
        if(result.status === 'won') {
            winDiv.textContent = `${result.winner.name} wins!`;
        } else if(result.status === 'draw') {
            winDiv.textContent = 'The game is a draw!';
        } else {
            winDiv.textContent = '';
        }
    }

    // add event listener for the board
    function clickHandlerEvent(e) {
        const selectedColumn = e.target.dataset.column;
        if(! selectedColumn) return;    
        
        game.playRound(selectedColumn);
        updateScreen();
    }
    boardDiv.addEventListener('click', clickHandlerEvent);

    // initial screen render
    updateScreen();
}
screenController();
