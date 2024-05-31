// Connect four Game

// Gameboard function
const gameBoard = (() => {
    const rows = 6;
    const columns = 7;
    const board = [];

    for(let i = 0; i < rows; i++) {
        board[i] = [];
        for(let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }
});

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
    }
}
                   

   