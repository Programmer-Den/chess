const initialBoard = {
  A8: '♜', B8: '♞', C8: '♝', D8: '♛', E8: '♚', F8: '♝', G8: '♞', H8: '♜',
  A7: '♟', B7: '♟', C7: '♟', D7: '♟', E7: '♟', F7: '♟', G7: '♟', H7: '♟',
  A6: ' ', B6: ' ', C6: ' ', D6: ' ', E6: ' ', F6: ' ', G6: ' ', H6: ' ',
  A5: ' ', B5: ' ', C5: ' ', D5: ' ', E5: ' ', F5: ' ', G5: ' ', H5: ' ',
  A4: ' ', B4: ' ', C4: ' ', D4: ' ', E4: ' ', F4: ' ', G4: ' ', H4: ' ',
  A3: ' ', B3: ' ', C3: ' ', D3: ' ', E3: ' ', F3: ' ', G3: ' ', H3: ' ',
  A2: '♙', B2: '♙', C2: '♙', D2: '♙', E2: '♙', F2: '♙', G2: '♙', H2: '♙',
  A1: '♖', B1: '♘', C1: '♗', D1: '♕', E1: '♔', F1: '♗', G1: '♘', H1: '♖'
};

const Board = () => {
  const currentBoard = {...initialBoard};
  
  const _ = currentBoard; // the shortest var that refers to the same obj as currentBoard

  const boardDisplay = () => `

        A   B   C   D   E   F   G   H
      ╔═══╤═══╤═══╤═══╤═══╤═══╤═══╤═══╗
    8 ║ ${_.A8} │ ${_.B8} │ ${_.C8} │ ${_.D8} │ ${_.E8} │ ${_.F8} │ ${_.G8} │ ${_.H8} ║ 8
      ╟───┼───┼───┼───┼───┼───┼───┼───╢
    7 ║ ${_.A7} │ ${_.B7} │ ${_.C7} │ ${_.D7} │ ${_.E7} │ ${_.F7} │ ${_.G7} │ ${_.H7} ║ 7
      ╟───┼───┼───┼───┼───┼───┼───┼───╢
    6 ║ ${_.A6} │ ${_.B6} │ ${_.C6} │ ${_.D6} │ ${_.E6} │ ${_.F6} │ ${_.G6} │ ${_.H6} ║ 6
      ╟───┼───┼───┼───┼───┼───┼───┼───╢
    5 ║ ${_.A5} │ ${_.B5} │ ${_.C5} │ ${_.D5} │ ${_.E5} │ ${_.F5} │ ${_.G5} │ ${_.H5} ║ 5
      ╟───┼───┼───┼───┼───┼───┼───┼───╢
    4 ║ ${_.A4} │ ${_.B4} │ ${_.C4} │ ${_.D4} │ ${_.E4} │ ${_.F4} │ ${_.G4} │ ${_.H4} ║ 4
      ╟───┼───┼───┼───┼───┼───┼───┼───╢
    3 ║ ${_.A3} │ ${_.B3} │ ${_.C3} │ ${_.D3} │ ${_.E3} │ ${_.F3} │ ${_.G3} │ ${_.H3} ║ 3
      ╟───┼───┼───┼───┼───┼───┼───┼───╢
    2 ║ ${_.A2} │ ${_.B2} │ ${_.C2} │ ${_.D2} │ ${_.E2} │ ${_.F2} │ ${_.G2} │ ${_.H2} ║ 2
      ╟───┼───┼───┼───┼───┼───┼───┼───╢
    1 ║ ${_.A1} │ ${_.B1} │ ${_.C1} │ ${_.D1} │ ${_.E1} │ ${_.F1} │ ${_.G1} │ ${_.H1} ║ 1
      ╚═══╧═══╧═══╧═══╧═══╧═══╧═══╧═══╝
        A   B   C   D   E   F   G   H

  `;

  const castlingOption = {
    White: true,
                  // castling is allowed only 1 time per game for each player...
    Black: true
  };              // ...and if neither king nor rook of certain player was moved

  return { currentBoard, boardDisplay, castlingOption }
}

module.exports = Board;
