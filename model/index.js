const board  = require('./board')();
const prompt = require('prompt-sync')(
  {
    history: require('prompt-sync-history')(),

    sigint: true // for Cmd/Ctrl+C exit option
  } 
); // the module for prompt ability in Node.js

let checkmate = !Object.values(board.currentBoard).includes('♚') ||
                !Object.values(board.currentBoard).includes('♔');

turn();

function turn() {
  while (!checkmate) {
    move('White');
    move('Black');
  }

  let winner = Object.values(board.currentBoard).includes('♚') ? 'White' : 'Black';

  console.log(`${winner} win! Congratulations.`);
}

function move(color) {
  console.log(board.boardDisplay() );

  let FROM = prompt(`${color} turn! Enter cell 'FROM': `).toUpperCase();
  let ONTO = prompt(`${color} turn. Enter cell 'ONTO': `).toUpperCase();
  
  prompt.history.save();

  // First White chessman: 9818 in Unicode    Last White chessman: 9823 in Unicode
  // First Black chessman: 9812 in Unicode    Last Black chessman: 9817 in Unicode
  
  if (  !(FROM in board.currentBoard)  ||  !(ONTO in board.currentBoard)  ||

      (color == 'White' && (board.currentBoard[FROM] <  String.fromCodePoint(9818)     ||
                            board.currentBoard[FROM] >  String.fromCodePoint(9823) ) ) ||
      (color == 'White' && (board.currentBoard[ONTO] <= String.fromCodePoint(9823)     &&
                            board.currentBoard[ONTO] >= String.fromCodePoint(9818) ) ) ||
      (color == 'Black' && (board.currentBoard[ONTO] <= String.fromCodePoint(9817)     &&
                            board.currentBoard[ONTO] >= String.fromCodePoint(9812) ) ) ||
      (color == 'Black' && (board.currentBoard[FROM] <  String.fromCodePoint(9812)     ||
                            board.currentBoard[FROM] >  String.fromCodePoint(9817) ) )  )
  {
    console.log('Incorrect input... Please, enter correct cells');
    
    return move(color);
  }

  let chessman = board.currentBoard[FROM];

  board.currentBoard[FROM] = ' ';
  board.currentBoard[ONTO] = chessman;

  if (board.castlingOption[color] && ( (FROM == 'E8' && (ONTO == 'C8' || ONTO == 'G8') ) ||
                                       (FROM == 'E1' && (ONTO == 'C1' || ONTO == 'G1') ) ) )
  {
    let rookBefore = ONTO == 'C8' ? 'A8' : ONTO == 'G8' ? 'H8' :
                     ONTO == 'C1' ? 'A1' :                'H1' ;
                     
    let rookAfter = rookBefore == 'A8' ? 'D8' : rookBefore == 'H8' ? 'F8' :
                    rookBefore == 'A1' ? 'D1' :                      'F1' ;
    
    let rook = board.currentBoard[rookBefore];

    board.currentBoard[rookBefore] = ' ';
    board.currentBoard[rookAfter]  = rook;
  }

  if (FROM == 'A8' || FROM == 'E8' || FROM == 'H8' || 
      FROM == 'A1' || FROM == 'E1' || FROM == 'H1')
  {
    board.castlingOption[color] = false
  }
  
  console.log(board.boardDisplay() );
}
