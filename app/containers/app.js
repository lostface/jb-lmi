import * as React from 'react';
import * as R from 'ramda';
import { randomIntBetween, getFlatMatrixRows, getFlatMatrixCols } from '../common';
import {
    BOARD_SIZE,
    CELL_BG_COLOR_DEFAULT,
    CELL_MARK_DEFAULT,
    CELL_MARK_USER,
    CELL_MARK_COMP,
    COMPUTER_SPEED,
    LOCAL_STORAGE_KEY,
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

const getDefaultState = () => ({
  boardData: getDefaultBoardData(BOARD_SIZE),
  gameFinished: false,
  usersTurn: true,
  userWon: false,
});

const isEmptyCell = R.propEq('mark', CELL_MARK_DEFAULT);
const isMarkedCell = R.complement(isEmptyCell);

const cellsToMarkStr = R.compose(
  R.join(''),
  R.pluck('mark')
);

export default React.createClass({
  render() {
    const { boardData, userWon, gameFinished } = this.state;
    const gameOverMessage = gameFinished ? (userWon ? 'Congrats!' : 'Next Time') : '';

    return (
      <div
          className="app-container"
          style={{ margin: 0, padding: 0 }}>

        <Board size={BOARD_SIZE} data={boardData} onPlaceMarkTrigger={this.handlePlaceMarkTrigger} />

        <div
            style={{
              display: 'inline-block',
              verticalAlign: 'top',
              marginLeft: '2vw',
            }}>
          <button
              className="new-game-btn"
              style={{
                margin: 0,
                padding: 0,
                fontSize: '4vw',
              }}
              onClick={this.handleNewGameClick}>
            New Game
          </button>
          <p
              style={{
                fontSize: '6vw',
                margin: 0,
                padding: 0,
                marginTop: '11.5vw',
                marginLeft: '15.5vw',
              }}>
            {gameOverMessage}
          </p>
        </div>

      </div>
    );
  },

  getInitialState() {
    const savedState = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEY)
    );

    return savedState ? savedState : getDefaultState();
  },

  componentDidMount() {
    const { usersTurn } = this.state;
    if (!usersTurn) {
      this.triggerComputerPlay();
    }
  },

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify(nextState)
    );
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
      this.setState({
        gameFinished: true,
        userWon: this.isUserWon(),
      });
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
      const userWon = this.isUserWon();
      const computerWon = this.isComputerWon();
      const noEmptyCells = this.hasNoEmptyCells();

      if (noEmptyCells || userWon || computerWon) {
        this.finishGame();
        return;
      }

      this.computerMarks();
      this.userIsNext();

      // TODO temporary hack to finish the game when comp wins
      this.handlePlaceMarkTrigger();
    }, COMPUTER_SPEED);
  },

  handlePlaceMarkTrigger(cellId) {
    const userWon = this.isUserWon();
    const computerWon = this.isComputerWon();
    const noEmptyCells = this.hasNoEmptyCells();

    if (noEmptyCells || userWon || computerWon) {
      this.finishGame();
      return;
    }

    // TODO temporary hack to support finish the game when comp wins
    if (cellId == null) {
      return;
    }

    const { usersTurn } = this.state;
    const cell = this.getCellById(cellId);

    if (usersTurn && isEmptyCell(cell)) {
      this.userMarks(cellId);
      this.computerIsNext();
      this.triggerComputerPlay();
    }
  },

  handleNewGameClick() {
    this.setState(getDefaultState());
  },
});
