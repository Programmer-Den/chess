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
    move('White');          if (checkmate) break;
    move('Black')
  }
  let winner = Object.values(board.currentBoard).includes('♚') ? 'White' : 'Black';

  console.log(`${winner} win! Congratulations.`);
}

function defineChessmanKind(chessman) {
  switch (chessman) {
    case '♚':
    case '♔':
      return 'King';

    case '♛':
    case '♕':
      return 'Queen';

    case '♜':
    case '♖':
      return 'Rook';

    case '♝':
    case '♗':
      return 'Bishop';

    case '♞':
    case '♘':
      return 'Knight';
    
    case '♟':  return 'whitePawn'; 
    case '♙':  return 'blackPawn'
  }
}
function permitMove(chessmanKind, FROM_cell, ONTO_cell) {
  switch (chessmanKind) {
    case 'King':     King()(FROM_cell, ONTO_cell); break;
    case 'Queen':   Queen()(FROM_cell, ONTO_cell); break;
    case 'Rook':     Rook()(FROM_cell, ONTO_cell); break;
    case 'Bishop': Bishop()(FROM_cell, ONTO_cell); break;
    case 'Knight': Knight()(FROM_cell, ONTO_cell); break;

    case 'whitePawn': Pawn('white')(FROM_cell, ONTO_cell); break;
    case 'blackPawn': Pawn('black')(FROM_cell, ONTO_cell)
  }
}
function Queen() {
  return function isMoveAvailable(FROM_cell, ONTO_cell) {
    return Rook()(FROM_cell, ONTO_cell) || Bishop()(FROM_cell, ONTO_cell)
  }
}  //  other chessmen rules reside at the bottom of this file

function move(color) {
  console.log(board.boardDisplay() );

  let FROM = prompt(`${color} turn! Enter cell 'FROM': `).toUpperCase();
  let ONTO = prompt(`${color} turn. Enter cell 'ONTO': `).toUpperCase();
  
  prompt.history.save();  //  the prompt history being saved in the .prompt_hist.txt file

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
                            board.currentBoard[FROM] >  String.fromCodePoint(9817) ) ) ||
      
      !permitMove(defineChessmanKind(board.currentBoard[FROM]), FROM, ONTO)  )
  {
    console.log('Incorrect input... Please, enter correct cells');
    
    return move(color)
  }

  let chessman = board.currentBoard[FROM];

  board.currentBoard[FROM] = ' ';
  board.currentBoard[ONTO] = chessman;

  // castling (20 lines: from 104 to 123)
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

function King() {
  return function isMoveAvailable(FROM_cell, ONTO_cell) {
    
  }
}

function Rook() {
  return function isMoveAvailable(FROM_cell, ONTO_cell) {
    if (FROM_cell[0] === ONTO_cell[0]) {    //   vertical
      if (+FROM_cell[1] < +ONTO_cell[1]) {   //   upward
        for (let i = +FROM_cell[1] + 1;
                 i < +ONTO_cell[1];
                 i++)
        {
          if (board.currentBoard[`${FROM_cell[0]}${i}`] !== ' ') return false;
        }
        return true
      }
      //                                 vertical downward
        for (let i = +FROM_cell[1] - 1;  
                 i > +ONTO_cell[1];
                 i--)
        {
          if (board.currentBoard[`${FROM_cell[0]}${i}`] !== ' ') return false;
        }
        return true
    }
    //                                            horizontal
      if (FROM_cell[0] < ONTO_cell[0]) {    //     rightward
        for (let i = FROM_cell.codePointAt() + 1;
                 i < ONTO_cell.codePointAt();
                 i++)
        {
          if (board.currentBoard[`${String.fromCodePoint(i)}${FROM_cell[1]}`] !== ' ')
                                                                               return false;
        }
        return true
      }
      //                                           horizontal leftward
        for (let i = FROM_cell.codePointAt() - 1;
                 i > ONTO_cell.codePointAt();
                 i--)
        {
          if (board.currentBoard[`${String.fromCodePoint(i)}${FROM_cell[1]}`] !== ' ')
                                                                               return false;
        }
        return true
  }
}

function Bishop() {
  return function isMoveAvailable(FROM_cell, ONTO_cell) {
    if (FROM_cell[0] < ONTO_cell[0]) {      //                           rightward
      if (FROM_cell[1] < ONTO_cell[1]) {   //                               upward
        for (let l = FROM_cell.codePointAt() + 1, d = +FROM_cell[1] + 1;
                 l < ONTO_cell.codePointAt(),     d < +ONTO_cell[1];
                 l++,  /* letter       digit */   d++)
        {
          if (board.currentBoard[`${String.fromCodePoint(l)}${d}`] !== ' ') return false;
        }
        return true
      }
      //                                                                  rightward downward
        for (let l = FROM_cell.codePointAt() + 1, d = +FROM_cell[1] - 1;
                 l < ONTO_cell.codePointAt(),     d > +ONTO_cell[1];
                 l++,  /* letter       digit */   d--)
        {
          if (board.currentBoard[`${String.fromCodePoint(l)}${d}`] !== ' ') return false;
        }
        return true
    }
    //                                                                    leftward
      if (FROM_cell[1] < ONTO_cell[1]) {   //                             downward
        for (let l = FROM_cell.codePointAt() - 1, d = +FROM_cell[1] - 1;
                 l > ONTO_cell.codePointAt(),     d > +ONTO_cell[1];
                 l--,  /* letter       digit */   d--)
        {
          if (board.currentBoard[`${String.fromCodePoint(l)}${d}`] !== ' ') return false;
        }
        return true
      }
      //                                                                  leftward upward
        for (let l = FROM_cell.codePointAt() - 1, d = +FROM_cell[1] + 1;
                 l > ONTO_cell.codePointAt(),     d < +ONTO_cell[1];
                 l--,  /* letter       digit */   d++)
        {
          if (board.currentBoard[`${String.fromCodePoint(l)}${d}`] !== ' ') return false;
        }
        return true
  }
}

function Knight() {
  return function isMoveAvailable(FROM_cell, ONTO_cell) {
    
  }
}

function Pawn(color) {
  return function isMoveAvailable(FROM_cell, ONTO_cell) {
    
  }
}
