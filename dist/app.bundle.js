webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _react = __webpack_require__(1);
	
	var React = _interopRequireWildcard(_react);
	
	var _reactDom = __webpack_require__(32);
	
	var ReactDOM = _interopRequireWildcard(_reactDom);
	
	var _containers = __webpack_require__(177);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	ReactDOM.render(React.createElement(_containers.App, null), document.getElementById('container'));

/***/ },

/***/ 177:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _app = __webpack_require__(178);
	
	Object.defineProperty(exports, 'App', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_app).default;
	  }
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },

/***/ 178:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(1);
	
	var React = _interopRequireWildcard(_react);
	
	var _ramda = __webpack_require__(179);
	
	var R = _interopRequireWildcard(_ramda);
	
	var _common = __webpack_require__(180);
	
	var _config = __webpack_require__(181);
	
	var _components = __webpack_require__(182);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var getDefaultBoardData = function getDefaultBoardData(boardSize) {
	  return R.map(function (index) {
	    return {
	      id: index,
	      mark: _config.CELL_MARK_DEFAULT,
	      bgColor: _config.CELL_BG_COLOR_DEFAULT
	    };
	  }, R.range(0, boardSize * boardSize));
	};
	
	var getDefaultState = function getDefaultState() {
	  return {
	    boardData: getDefaultBoardData(_config.BOARD_SIZE),
	    gameFinished: false,
	    usersTurn: true,
	    userWon: false
	  };
	};
	
	var isEmptyCell = R.propEq('mark', _config.CELL_MARK_DEFAULT);
	var isMarkedCell = R.complement(isEmptyCell);
	
	var cellsToMarkStr = R.compose(R.join(''), R.pluck('mark'));
	
	exports.default = React.createClass({
	  displayName: 'app',
	  render: function render() {
	    var _state = this.state;
	    var boardData = _state.boardData;
	    var userWon = _state.userWon;
	    var gameFinished = _state.gameFinished;
	
	    var gameOverMessage = gameFinished ? userWon ? 'Congrats!' : 'Next Time' : '';
	
	    return React.createElement(
	      'div',
	      {
	        className: 'app-container',
	        style: { margin: 0, padding: 0 } },
	      React.createElement(_components.Board, { size: _config.BOARD_SIZE, data: boardData, onPlaceMarkTrigger: this.handlePlaceMarkTrigger }),
	      React.createElement(
	        'div',
	        {
	          style: {
	            display: 'inline-block',
	            verticalAlign: 'top',
	            marginLeft: '2vw'
	          } },
	        React.createElement(
	          'button',
	          {
	            className: 'new-game-btn',
	            style: {
	              margin: 0,
	              padding: 0,
	              fontSize: '4vw'
	            },
	            onClick: this.handleNewGameClick },
	          'New Game'
	        ),
	        React.createElement(
	          'p',
	          {
	            style: {
	              fontSize: '6vw',
	              margin: 0,
	              padding: 0,
	              marginTop: '11.5vw',
	              marginLeft: '15.5vw'
	            } },
	          gameOverMessage
	        )
	      )
	    );
	  },
	  getInitialState: function getInitialState() {
	    var savedState = JSON.parse(localStorage.getItem(_config.LOCAL_STORAGE_KEY));
	
	    return savedState ? savedState : getDefaultState();
	  },
	  componentDidMount: function componentDidMount() {
	    var usersTurn = this.state.usersTurn;
	
	    if (!usersTurn) {
	      this.triggerComputerPlay();
	    }
	  },
	  componentWillUpdate: function componentWillUpdate(nextProps, nextState) {
	    localStorage.setItem(_config.LOCAL_STORAGE_KEY, JSON.stringify(nextState));
	  },
	  placeMark: function placeMark(index, mark) {
	    var boardData = R.adjust(R.assoc('mark', mark), index, this.state.boardData);
	
	    this.setState({ boardData: boardData });
	  },
	  userIsNext: function userIsNext() {
	    this.setState({ usersTurn: true });
	  },
	  computerIsNext: function computerIsNext() {
	    this.setState({ usersTurn: false });
	  },
	  getCellById: function getCellById(cellId) {
	    // INFO cellId is same as the index of the cell in boardData, so no need for extra find
	    return this.state.boardData[cellId];
	  },
	  getEmptyCells: function getEmptyCells() {
	    return R.filter(isEmptyCell, this.state.boardData);
	  },
	  hasNoEmptyCells: function hasNoEmptyCells() {
	    return R.all(isMarkedCell, this.state.boardData);
	  },
	  isUserWon: function isUserWon() {
	    return this.isSomeoneWon(_config.CELL_MARK_USER);
	  },
	  isComputerWon: function isComputerWon() {
	    return this.isSomeoneWon(_config.CELL_MARK_COMP);
	  },
	
	
	  // TODO can be improved eg.: check only the cases around (row, col, main/antidiagonal)
	  //  the last place someone put a mark
	  isSomeoneWon: function isSomeoneWon(mark) {
	    var wonPattern = new RegExp(mark + '{' + _config.WIN_MARKS_COUNT + '}');
	    var isWinningSet = R.compose(function (markStr) {
	      return wonPattern.test(markStr);
	    }, cellsToMarkStr);
	
	    var parts = this.getBoardDataParts();
	    return R.any(isWinningSet, parts);
	  },
	  getBoardDataParts: function getBoardDataParts() {
	    var boardData = this.state.boardData;
	
	    // TODO extract and/or implement a general
	
	    var getMainDiagonal = R.filter(function (cell) {
	      return cell.id % (_config.BOARD_SIZE + 1) == 0;
	    });
	
	    // TODO extract and/or implement a general
	    var getAntidiagonal = R.compose(R.filter(function (cell) {
	      return cell.id % (_config.BOARD_SIZE - 1) == 0;
	    }), R.dropLast(_config.BOARD_SIZE - 1), R.drop(_config.BOARD_SIZE - 1));
	
	    var rows = (0, _common.getFlatMatrixRows)(_config.BOARD_SIZE, boardData);
	    var cols = (0, _common.getFlatMatrixCols)(_config.BOARD_SIZE, boardData);
	    var mainDiagonal = getMainDiagonal(boardData);
	    var antidiagonal = getAntidiagonal(boardData);
	
	    return R.concat(R.concat(rows, cols), R.concat([mainDiagonal], [antidiagonal]));
	  },
	  finishGame: function finishGame() {
	    if (!this.state.gameFinished) {
	      this.setState({
	        gameFinished: true,
	        userWon: this.isUserWon()
	      });
	    }
	  },
	  userMarks: function userMarks(cellId) {
	    this.placeMark(cellId, _config.CELL_MARK_USER);
	  },
	  computerMarks: function computerMarks() {
	    var emptyCells = this.getEmptyCells();
	    if (emptyCells.length == 0) {
	      return;
	    }
	
	    var index = (0, _common.randomIntBetween)(0, emptyCells.length);
	    var targetCell = emptyCells[index];
	    this.placeMark(targetCell.id, _config.CELL_MARK_COMP);
	  },
	  triggerComputerPlay: function triggerComputerPlay() {
	    var _this = this;
	
	    setTimeout(function () {
	      var userWon = _this.isUserWon();
	      var computerWon = _this.isComputerWon();
	      var noEmptyCells = _this.hasNoEmptyCells();
	
	      if (noEmptyCells || userWon || computerWon) {
	        _this.finishGame();
	        return;
	      }
	
	      _this.computerMarks();
	      _this.userIsNext();
	
	      // TODO temporary hack to finish the game when comp wins
	      _this.handlePlaceMarkTrigger();
	    }, _config.COMPUTER_SPEED);
	  },
	  handlePlaceMarkTrigger: function handlePlaceMarkTrigger(cellId) {
	    var userWon = this.isUserWon();
	    var computerWon = this.isComputerWon();
	    var noEmptyCells = this.hasNoEmptyCells();
	
	    if (noEmptyCells || userWon || computerWon) {
	      this.finishGame();
	      return;
	    }
	
	    // TODO temporary hack to support finish the game when comp wins
	    if (cellId == null) {
	      return;
	    }
	
	    var usersTurn = this.state.usersTurn;
	
	    var cell = this.getCellById(cellId);
	
	    if (usersTurn && isEmptyCell(cell)) {
	      this.userMarks(cellId);
	      this.computerIsNext();
	      this.triggerComputerPlay();
	    }
	  },
	  handleNewGameClick: function handleNewGameClick() {
	    this.setState(getDefaultState());
	  }
	});

/***/ },

/***/ 180:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getFlatMatrixCols = exports.getFlatMatrixRows = exports.randomIntBetween = undefined;
	
	var _ramda = __webpack_require__(179);
	
	var R = _interopRequireWildcard(_ramda);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var randomIntBetween = exports.randomIntBetween = function randomIntBetween(min, max) {
	  return Math.floor(Math.random() * (max - min)) + min;
	};
	
	var getFlatMatrixRows = exports.getFlatMatrixRows = R.splitEvery;
	
	var getFlatMatrixCols = exports.getFlatMatrixCols = function getFlatMatrixCols(size, data) {
	  // TODO simpler solution?
	  var cols = R.compose(R.map(function () {
	    return [];
	  }), R.range)(0, size);
	
	  R.reduce(function (acc, cell) {
	    acc[cell.id % size].push(cell);
	    return acc;
	  })(cols, data);
	
	  return cols;
	};

/***/ },

/***/ 181:
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var BOARD_SIZE = exports.BOARD_SIZE = 3;
	var WIN_MARKS_COUNT = exports.WIN_MARKS_COUNT = BOARD_SIZE; // different value not supported right now
	var CELL_BG_COLOR_DEFAULT = exports.CELL_BG_COLOR_DEFAULT = '#fff';
	var CELL_BG_COLOR_WON = exports.CELL_BG_COLOR_WON = '#0f0';
	var CELL_MARK_DEFAULT = exports.CELL_MARK_DEFAULT = '';
	var CELL_MARK_USER = exports.CELL_MARK_USER = 'X';
	var CELL_MARK_COMP = exports.CELL_MARK_COMP = 'O';
	var COMPUTER_SPEED = exports.COMPUTER_SPEED = 500;
	var LOCAL_STORAGE_KEY = exports.LOCAL_STORAGE_KEY = 'tic-tac-toe-forever';

/***/ },

/***/ 182:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _cell = __webpack_require__(183);
	
	Object.defineProperty(exports, 'Cell', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_cell).default;
	  }
	});
	
	var _row = __webpack_require__(184);
	
	Object.defineProperty(exports, 'Row', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_row).default;
	  }
	});
	
	var _board = __webpack_require__(185);
	
	Object.defineProperty(exports, 'Board', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_board).default;
	  }
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },

/***/ 183:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = Cell;
	
	var _react = __webpack_require__(1);
	
	var React = _interopRequireWildcard(_react);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function Cell(props) {
	  var id = props.id;
	  var length = props.length;
	  var mark = props.mark;
	  var bgColor = props.bgColor;
	
	
	  return React.createElement(
	    'div',
	    {
	      id: 'cell-' + id,
	      className: 'cell-container',
	      style: {
	        boxSizing: 'border-box',
	        margin: 0,
	        padding: 0,
	        display: 'inline-block',
	        width: length,
	        height: length,
	        backgroundColor: bgColor,
	        border: '1px solid #555',
	        verticalAlign: 'middle',
	        lineHeight: length,
	        textAlign: 'center',
	        textTransform: 'uppercase',
	        fontSize: length
	      } },
	    mark
	  );
	}
	
	Cell.propTypes = {
	  id: React.PropTypes.number.isRequired,
	  length: React.PropTypes.string.isRequired,
	  mark: React.PropTypes.string.isRequired,
	  bgColor: React.PropTypes.string.isRequired
	};
	
	Cell.defaultProps = {
	  mark: '',
	  bgColor: '#fff'
	};

/***/ },

/***/ 184:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = Row;
	
	var _react = __webpack_require__(1);
	
	var React = _interopRequireWildcard(_react);
	
	var _ramda = __webpack_require__(179);
	
	var R = _interopRequireWildcard(_ramda);
	
	var _cell = __webpack_require__(183);
	
	var _cell2 = _interopRequireDefault(_cell);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var createCellNode = function createCellNode(cellData) {
	  var rowSize = cellData.rowSize;
	  var cell = cellData.cell;
	
	
	  return React.createElement(_cell2.default, {
	    key: cell.id,
	    id: cell.id,
	    length: 'calc(40vw / ' + rowSize + ')',
	    mark: cell.mark,
	    bgColor: cell.bgColor
	  });
	};
	
	var createCellNodes = function createCellNodes(rowSize, cells) {
	  return R.compose(R.map(createCellNode), R.map(function (cell) {
	    return { rowSize: rowSize, cell: cell };
	  }))(cells);
	};
	
	function Row(props) {
	  var size = props.size;
	  var cells = props.cells;
	
	
	  return React.createElement(
	    'div',
	    {
	      className: 'row-container',
	      style: {
	        boxSizing: 'border-box',
	        margin: 0,
	        padding: 0,
	        border: 'none'
	      } },
	    createCellNodes(size, cells)
	  );
	}
	
	Row.propTypes = {
	  size: React.PropTypes.number.isRequired,
	  cells: React.PropTypes.arrayOf(React.PropTypes.shape({
	    id: React.PropTypes.number.isRequired,
	    mark: React.PropTypes.string.isRequired,
	    bgColor: React.PropTypes.string.isRequired
	  }))
	};

/***/ },

/***/ 185:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(1);
	
	var React = _interopRequireWildcard(_react);
	
	var _ramda = __webpack_require__(179);
	
	var R = _interopRequireWildcard(_ramda);
	
	var _row = __webpack_require__(184);
	
	var _row2 = _interopRequireDefault(_row);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var createRowNodes = function createRowNodes(boardSize, data) {
	  return R.compose(R.map(function (rowData) {
	    return React.createElement(_row2.default, { key: rowData.id, size: rowData.boardSize, cells: rowData.cells });
	  }), R.zipWith(function (index, cells) {
	    return { id: index, boardSize: boardSize, cells: cells };
	  }, R.range(0, boardSize * boardSize)), R.splitEvery)(boardSize, data);
	};
	
	exports.default = React.createClass({
	  displayName: 'board',
	
	  propTypes: {
	    size: React.PropTypes.number.isRequired,
	    data: React.PropTypes.arrayOf(React.PropTypes.shape({
	      id: React.PropTypes.number.isRequired,
	      mark: React.PropTypes.string.isRequired,
	      bgColor: React.PropTypes.string.isRequired
	    })),
	    onPlaceMarkTrigger: React.PropTypes.func
	  },
	
	  getDefaultProps: function getDefaultProps() {
	    return {
	      onPlaceMarkTrigger: function onPlaceMarkTrigger() {}
	    };
	  },
	  render: function render() {
	    var _props = this.props;
	    var size = _props.size;
	    var data = _props.data;
	
	
	    return React.createElement(
	      'div',
	      {
	        onClick: this.handleClick,
	        className: 'board-container',
	        style: {
	          boxSizing: 'border-box',
	          margin: 0,
	          padding: 0,
	          border: '1px solid #555',
	          display: 'inline-block',
	          backgroundColor: '#f00'
	        } },
	      createRowNodes(size, data)
	    );
	  },
	  handleClick: function handleClick(event) {
	    var onPlaceMarkTrigger = this.props.onPlaceMarkTrigger;
	
	    // INFO event target could be only our cell container so no need for filtering for now
	
	    var targetId = event.target.id;
	
	    // 'cell-7' > '7'
	    var cellId = Number(targetId.match(/\d+$/)[0]);
	
	    onPlaceMarkTrigger(cellId);
	  }
	});

/***/ }

});
//# sourceMappingURL=app.bundle.js.map