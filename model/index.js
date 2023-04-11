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
    case '♚': return 'White King';
    case '♔': return 'Black King';

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
    
    case '♟': return 'White Pawn'; 
    case '♙': return 'Black Pawn'
  }
}
function permitMove(chessmanKind, FROM_cell, ONTO_cell) {
  switch (chessmanKind) {
    case 'White King': return King('White').isMoveAvailable(FROM_cell, ONTO_cell);
    case 'Black King': return King('Black').isMoveAvailable(FROM_cell, ONTO_cell);

    case 'Queen':  return  Queen()(FROM_cell, ONTO_cell);
    case 'Knight': return Knight()(FROM_cell, ONTO_cell);
    case 'Rook':   return   Rook()(FROM_cell, ONTO_cell);
    case 'Bishop': return Bishop()(FROM_cell, ONTO_cell);

    case 'White Pawn': return Pawn('White').isMoveAvailable(FROM_cell, ONTO_cell);
    case 'Black Pawn': return Pawn('Black').isMoveAvailable(FROM_cell, ONTO_cell)
  }
}
function Queen() {
  return function isMoveAvailable(FROM_cell, ONTO_cell) {
    return Rook()(FROM_cell, ONTO_cell) || Bishop()(FROM_cell, ONTO_cell)
  }
}  //  other chessmen rules reside at the bottom of this file, btw (by the way)

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

  switch (defineChessmanKind(chessman) ) {
    case 'White Pawn': if (+ONTO[1] === 1) Pawn('White').transformPawn(ONTO); break;
    case 'Black Pawn': if (+ONTO[1] === 8) Pawn('Black').transformPawn(ONTO); break;
    case 'Black King': King('Black').castling(FROM, ONTO);                    break;
    case 'White King': King('White').castling(FROM, ONTO)
  }

  console.log(board.boardDisplay() );
}

function King(color) {
  function isMoveAvailable(FROM_cell, ONTO_cell) {
    if (board.castlingOption[color] &&
        ( (FROM_cell == 'E8' && (ONTO_cell == 'C8' || ONTO_cell == 'G8') ) ||
          (FROM_cell == 'E1' && (ONTO_cell == 'C1' || ONTO_cell == 'G1') ) ) )
    {
      return true
    }

    if (Math.abs(FROM_cell.codePointAt() - ONTO_cell.codePointAt() ) === 1 &&
        Math.abs(+FROM_cell[1]           - +ONTO_cell[1]           ) === 1)
    {
      return true
    }
    
    return false
  }

  function castling(FROM_cell, ONTO_cell) {
    if (board.castlingOption[color] &&
        ( (FROM_cell == 'E8' && (ONTO_cell == 'C8' || ONTO_cell == 'G8') ) ||
          (FROM_cell == 'E1' && (ONTO_cell == 'C1' || ONTO_cell == 'G1') ) ) )
    {
      let rookBefore = ONTO_cell == 'C8' ? 'A8' : ONTO_cell == 'G8' ? 'H8' :
                       ONTO_cell == 'C1' ? 'A1' :                'H1' ;
                      
      let rookAfter = rookBefore == 'A8' ? 'D8' : rookBefore == 'H8' ? 'F8' :
                      rookBefore == 'A1' ? 'D1' :                      'F1' ;
      
      let rook = board.currentBoard[rookBefore];

      board.currentBoard[rookBefore] = ' ';
      board.currentBoard[rookAfter]  = rook;
    }

    if (FROM_cell == 'A8' || FROM_cell == 'E8' || FROM_cell == 'H8' || 
        FROM_cell == 'A1' || FROM_cell == 'E1' || FROM_cell == 'H1')
    {
      board.castlingOption[color] = false
    }
  }
  
  return { isMoveAvailable, castling }
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
    if (Math.abs(FROM_cell.codePointAt() - ONTO_cell.codePointAt() ) === 1  &&
        Math.abs(+FROM_cell[1]           - +ONTO_cell[1]           ) === 2  ||
        Math.abs(FROM_cell.codePointAt() - ONTO_cell.codePointAt() ) === 2  &&
        Math.abs(+FROM_cell[1]           - +ONTO_cell[1]           ) === 1)
    {
      return true
    }
    return false
  }
}

function Pawn(color) {
  function isMoveAvailable(FROM_cell, ONTO_cell) {
    if (color == 'White') {
      if (board.currentBoard[ONTO_cell] !== ' ' && +FROM_cell[1] - +ONTO_cell[1] === 1 &&
          Math.abs(FROM_cell.codePointAt() - ONTO_cell.codePointAt() ) === 1)
      {
        return true
      }
      if (FROM_cell[0] == ONTO_cell[0] && +FROM_cell[1] - +ONTO_cell[1] === 1) return true;

      return false
    }
    // finally, Black case
      if (board.currentBoard[ONTO_cell] !== ' ' && +ONTO_cell[1] - +FROM_cell[1] === 1 &&
          Math.abs(FROM_cell.codePointAt() - ONTO_cell.codePointAt() ) === 1)
      {
        return true
      }
      if (FROM_cell[0] == ONTO_cell[0] && +ONTO_cell[1] - +FROM_cell[1] === 1) return true;

      return false
  }

  function transformPawn(ONTO_cell) {
    if (!Object.values(board.currentBoard).includes(color == 'White' ? '♛' : '♕') ) {
      board.currentBoard[ONTO_cell] =               color == 'White' ? '♛' : '♕';
    }
    else color == 'White' ? nonQueenTransformation('♜', '♝', '♞') :
                            nonQueenTransformation('♖', '♗', '♘');

    function nonQueenTransformation(rook, bishop, knight) {
      soloOrPair(rook) || soloOrPair(bishop) || soloOrPair(knight);
        
      function soloOrPair(chessmanKind) {
        if (!Object.values(board.currentBoard).includes(chessmanKind) ) {
          board.currentBoard[ONTO_cell] = chessmanKind;

          return true
        }

        else if (Object.values(board.currentBoard).indexOf(chessmanKind) ===
                 Object.values(board.currentBoard).lastIndexOf(chessmanKind) )
        {
          board.currentBoard[ONTO_cell] = chessmanKind;

          return true
        }

        return false;  //  alive pair means no slot for transform into that chessmand kind
      }
    }
  }

  return { isMoveAvailable, transformPawn }
}
