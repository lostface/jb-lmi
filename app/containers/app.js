import * as React from 'react';
import * as R from 'ramda';
import { randomIntBetween } from '../common';
import {
    BOARD_SIZE,
    CELL_BG_COLOR_DEFAULT,
    CELL_MARK_DEFAULT,
    CELL_MARK_USER,
    CELL_MARK_COMP,
    COMPUTER_SPEED,
    WIN_MARKS_COUNT
  } from '../config';
import { Board } from '../components';

const getDefaultBoardData = boardSize =>
  R.map(
    index => ({
      id: index,
      mark: CELL_MARK_DEFAULT,
      bgColor: CELL_BG_COLOR_DEFAULT,
    }),
    R.range(0, boardSize * boardSize)
  );

const isEmptyCell = R.propEq('mark', CELL_MARK_DEFAULT);
const isMarkedCell = R.complement(isEmptyCell);

const cellsToMarkStr = R.compose(
  R.join(''),
  R.pluck('mark')
);

const getFlatMatrixRows = R.splitEvery;

const getFlatMatrixCols = (size, data) => {
  // TODO simpler way?
  const cols = R.compose(
    R.map(() => []),
    R.range
  )(0, size);

  R.reduce((acc, cell) => {
    acc[cell.id % size].push(cell);
    return acc;
  })(cols, data);

  return cols;
};

export default React.createClass({
  render() {
    const { boardData } = this.state;

    return (
      <div
          className="app-container"
          style={{
            boxSizing: 'border-box',
            margin: 0,
            padding: 0,
            border: 'none',
          }}>
        <Board size={BOARD_SIZE} data={boardData} onPlaceMarkTrigger={this.handlePlaceMarkTrigger} />
      </div>
    );
  },

  getInitialState() {
    return {
      boardData: getDefaultBoardData(BOARD_SIZE),
      gameFinished: false,
      usersTurn: true,
    };
  },

  placeMark(index, mark) {
    const boardData = R.adjust(
      R.assoc('mark', mark),
      index,
      this.state.boardData
    );

    this.setState({ boardData });
  },

  userIsNext() {
    this.setState({ usersTurn: true });
  },

  computerIsNext() {
    this.setState({ usersTurn: false });
  },

  getCellById(cellId) {
    // INFO cellId is same as the index of the cell in boardData, so no need for extra find
    return this.state.boardData[cellId];
  },

  getEmptyCells() {
    return R.filter(isEmptyCell, this.state.boardData);
  },

  hasNoEmptyCells() {
    return R.all(isMarkedCell, this.state.boardData);
  },

  isUserWon() {
    return this.isSomeoneWon(CELL_MARK_USER);
  },

  isComputerWon() {
    return this.isSomeoneWon(CELL_MARK_COMP);
  },

  // TODO can be improved eg.: check only the cases around (row, col, main/antidiagonal)
  //  the last place someone put a mark
  isSomeoneWon(mark) {
    const wonPattern = new RegExp(`${mark}{${WIN_MARKS_COUNT}}`);
    const isWinningSet = R.compose(
      markStr => wonPattern.test(markStr),
      cellsToMarkStr,
    );

    const parts = this.getBoardDataParts();
    return R.any(isWinningSet, parts);
  },

  getBoardDataParts() {
    const { boardData } = this.state;

    // TODO extract and/or implement a general
    const getMainDiagonal = R.filter(
      cell => cell.id % (BOARD_SIZE + 1) == 0
    );

    // TODO extract and/or implement a general
    const getAntidiagonal = R.compose(
      R.filter(cell => cell.id % (BOARD_SIZE - 1) == 0),
      R.dropLast(BOARD_SIZE - 1),
      R.drop(BOARD_SIZE - 1)
    );

    const rows = getFlatMatrixRows(BOARD_SIZE, boardData);
    const cols = getFlatMatrixCols(BOARD_SIZE, boardData);
    const mainDiagonal = getMainDiagonal(boardData);
    const antidiagonal = getAntidiagonal(boardData);

    return R.concat(
      R.concat(rows, cols),
      R.concat([mainDiagonal], [antidiagonal])
    );
  },

  finishGame() {
    if (!this.state.gameFinished) {
      this.setState({ gameFinished: true });
    }
  },

  userMarks(cellId) {
    this.placeMark(cellId, CELL_MARK_USER);
  },

  computerMarks() {
    const emptyCells = this.getEmptyCells();
    if (emptyCells.length == 0) {
      return;
    }

    const index = randomIntBetween(0, emptyCells.length);
    const targetCell = emptyCells[index];
    this.placeMark(targetCell.id, CELL_MARK_COMP);
  },

  triggerComputerPlay() {
    setTimeout(() => {
      // TODO ramdaify
      const userWon = this.isUserWon();
      const computerWon = this.isComputerWon();
      const noEmptyCells = this.hasNoEmptyCells();

      if (noEmptyCells || userWon || computerWon) {
        this.finishGame();
      } else {
        this.computerMarks();
        this.userIsNext();
      }
    }, COMPUTER_SPEED);
  },

  handlePlaceMarkTrigger(cellId) {
    // TODO ramdaify
    const { usersTurn } = this.state;
    const cell = this.getCellById(cellId);

    const userWon = this.isUserWon();
    const computerWon = this.isComputerWon();
    const noEmptyCells = this.hasNoEmptyCells();

    if (noEmptyCells || userWon || computerWon) {
      this.finishGame();
    } else if (usersTurn && isEmptyCell(cell)) {
      this.userMarks(cellId);
      this.computerIsNext();
      this.triggerComputerPlay();
    }
  },
});
