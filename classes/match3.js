class Match3 {

  // constructor, simply turns obj information into class properties
  constructor(obj) {
    if (obj == undefined) {
      obj = {}
    }
    this.rows = (obj.rows != undefined) ? obj.rows : 8;
    this.columns = (obj.columns != undefined) ? obj.columns : 7;
    this.items = (obj.items != undefined) ? obj.items : 6;
    //this.blanksOn = (obj.blanksOn != undefined) ? obj.blanksOn : false;
  }
  loadGame() {
    this.gameArray = saveData.gameArray
    gameOptions.allowBlanks = false;
    this.generateFieldExtra()
  }
  // generates the game field
  generateField() {
    this.gameArray = [];
    this.selectedItem = false;
    for (let i = 0; i < this.rows; i++) {
      this.gameArray[i] = [];
      for (let j = 0; j < this.columns; j++) {
        do {
          let randomValue = Math.floor(Math.random() * gameOptions.items);


          this.gameArray[i][j] = {
            value: randomValue,
            isLocked: false,
            isEmpty: false,
            row: i,
            column: j
          }
        } while (this.isPartOfMatch(i, j));
      }
    }
    gameOptions.allowBlanks = false;
    this.addBlanks(5)
    this.generateFieldExtra()
  }
  addBlanks(num) {
    var i = 0
    var blanks = []
    while (i < num) {
      var row = Phaser.Math.Between(0, this.rows - 2)
      var col = Phaser.Math.Between(0, this.columns - 1)
      if (this.valueAt(row, col) < 12) {
        this.setValueAt(row, col, 12)
        blanks.push({ row: row, col: col })
        i++
      }
    }
    return blanks
  }
  getBoard() {
    var gameSave = [];

    for (let i = 0; i < this.rows; i++) {
      gameSave[i] = [];
      for (let j = 0; j < this.columns; j++) {


        gameSave[i][j] = {
          value: this.gameArray[i][j].value,
          isLocked: this.gameArray[i][j].isLocked,
          isEmpty: this.gameArray[i][j].isEmpty,
          row: i,
          column: j
        }

      }
    }
    return gameSave
  }
  // locks a random Item and returns item coordinates, or false
  lockRandomItem() {
    let unlockedItems = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        if (!this.isLocked(i, j) && this.valueAt(i, j) != 12) {
          unlockedItems.push({
            row: i,
            column: j
          })
        }
      }
    }
    if (unlockedItems.length > 0) {
      let item = unlockedItems[Math.floor(Math.random() * unlockedItems.length)];
      this.lockAt(item.row, item.column)
      return item;
    }
    return false;
  }

  // returns a random row number
  randomRow() {
    return Math.floor(Math.random() * this.rows);
  }

  // returns a random column number
  randomColumn() {
    return Math.floor(Math.random() * this.columns);
  }

  // locks the item at row, column
  lockAt(row, column) {
    this.gameArray[row][column].isLocked = true;
  }
  unlockAt(row, column) {
    this.gameArray[row][column].isLocked = false;
  }
  // returns true if item at row, column is locked
  isLocked(row, column) {
    return this.gameArray[row][column].isLocked;
  }

  // returns true if there is a match in the board
  matchInBoard() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        if (this.isPartOfMatch(i, j)) {
          return true;
        }
      }
    }
    return false;
  }
  blankOnBottom() {

    for (let j = 0; j < this.columns; j++) {
      if (this.valueAt(this.rows - 1, j) == 12) {
        return true
      }
    }
    return false;
  }
  // returns true if the item at (row, column) is part of a match
  isPartOfMatch(row, column) {
    return this.isPartOfHorizontalMatch(row, column) || this.isPartOfVerticalMatch(row, column);
  }

  // returns true if the item at (row, column) is part of an horizontal match
  isPartOfHorizontalMatch(row, column) {
    return this.valueAt(row, column) === this.valueAt(row, column - 1) && this.valueAt(row, column) === this.valueAt(row, column - 2) ||
      this.valueAt(row, column) === this.valueAt(row, column + 1) && this.valueAt(row, column) === this.valueAt(row, column + 2) ||
      this.valueAt(row, column) === this.valueAt(row, column - 1) && this.valueAt(row, column) === this.valueAt(row, column + 1);
  }

  // returns true if the item at (row, column) is part of an horizontal match
  isPartOfVerticalMatch(row, column) {
    return this.valueAt(row, column) === this.valueAt(row - 1, column) && this.valueAt(row, column) === this.valueAt(row - 2, column) ||
      this.valueAt(row, column) === this.valueAt(row + 1, column) && this.valueAt(row, column) === this.valueAt(row + 2, column) ||
      this.valueAt(row, column) === this.valueAt(row - 1, column) && this.valueAt(row, column) === this.valueAt(row + 1, column)
  }

  // increments the value of the item
  incValueAt(row, column) {
    this.gameArray[row][column].value = (this.gameArray[row][column].value + 1) % gameOptions.items
  }
  setValueAt(row, column, value) {
    this.gameArray[row][column].value = value
  }
  // returns the value of the item at (row, column), or false if it's not a valid pick
  valueAt(row, column) {
    if (!this.validPick(row, column)) {
      return false;
    }
    return this.gameArray[row][column].value;
  }

  // returns true if the item at (row, column) is a valid pick
  validPick(row, column) {
    return row >= 0 && row < this.rows && column >= 0 && column < this.columns && this.gameArray[row] != undefined && this.gameArray[row][column] != undefined;
  }

  // returns the number of board rows
  getRows() {
    return this.rows;
  }

  // returns the number of board columns
  getColumns() {
    return this.columns;
  }

  // sets a custom data on the item at (row, column)
  setCustomData(row, column, customData) {
    this.gameArray[row][column].customData = customData;
  }
  setCustomDataFrame(row, col, num) {
    this.gameArray[row][col].customData.setFrame(num)
  }
  // returns the custom data of the item at (row, column)
  customDataOf(row, column) {
    return this.gameArray[row][column].customData;
  }

  // returns the selected item
  getSelectedItem() {
    return this.selectedItem;
  }

  // set the selected item as a {row, column} object
  setSelectedItem(row, column) {
    this.selectedItem = {
      row: row,
      column: column
    }
  }

  // deleselects any item
  deleselectItem() {
    this.selectedItem = false;
  }

  // checks if the item at (row, column) is the same as the item at (row2, column2)
  areTheSame(row, column, row2, column2) {
    return row == row2 && column == column2;
  }

  // returns true if two items at (row, column) and (row2, column2) are next to each other horizontally or vertically
  areNext(row, column, row2, column2) {
    return Math.abs(row - row2) + Math.abs(column - column2) == 1;
  }

  // swap the items at (row, column) and (row2, column2) and returns an object with movement information
  swapItems(row, column, row2, column2) {
    let tempObject = Object.assign(this.gameArray[row][column]);
    this.gameArray[row][column] = Object.assign(this.gameArray[row2][column2]);
    this.gameArray[row2][column2] = Object.assign(tempObject);
    return [{
      row: row,
      column: column,
      deltaRow: row - row2,
      deltaColumn: column - column2
    },
    {
      row: row2,
      column: column2,
      deltaRow: row2 - row,
      deltaColumn: column2 - column
    }]
  }

  // return the items part of a match in the board as an array of {row, column} object
  getMatchList() {
    let matches = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        if (this.isPartOfMatch(i, j)) {
          matches.push({
            row: i,
            column: j
          });
        }
      }
    }
    return matches;
  }
  isBlank(row, col) {
    return this.valueAt(row, col) == 12
  }
  getBlankList() {
    let matches = []
    for (let j = 0; j < this.columns; j++) {
      if (this.valueAt(this.rows - 1, j) == 12) {
        matches.push({
          row: this.rows - 1,
          column: j
        });
      }
    }
    return matches
  }
  doBlanksExist() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        if (this.valueAt(i, j) == 12) {
          return true
        }
      }
    }

    return false
  }
  // removes all items forming a match
  removeMatches() {
    let matches = this.getMatchList();
    matches.forEach(function (item) {
      this.setEmpty(item.row, item.column)
    }.bind(this))
  }
  removeBlanks() {
    let matches = this.getBlankList();
    matches.forEach(function (item) {
      this.setEmpty(item.row, item.column)
    }.bind(this))
  }
  // set the item at (row, column) as empty
  setEmpty(row, column) {
    this.gameArray[row][column].isEmpty = true;
  }

  // returns true if the item at (row, column) is empty
  isEmpty(row, column) {
    return this.gameArray[row][column].isEmpty;
  }

  // returns the amount of empty spaces below the item at (row, column)
  emptySpacesBelow(row, column) {
    let result = 0;
    if (row != this.getRows()) {
      for (let i = row + 1; i < this.getRows(); i++) {
        if (this.isEmpty(i, column)) {
          result++;
        }
      }
    }
    return result;
  }

  // arranges the board after a match, making items fall down. Returns an object with movement information
  arrangeBoardAfterMatch() {
    let result = []
    for (let i = this.getRows() - 2; i >= 0; i--) {
      for (let j = 0; j < this.getColumns(); j++) {
        let emptySpaces = this.emptySpacesBelow(i, j);
        if (!this.isEmpty(i, j) && emptySpaces > 0) {
          this.swapItems(i, j, i + emptySpaces, j)
          result.push({
            row: i + emptySpaces,
            column: j,
            deltaRow: emptySpaces,
            deltaColumn: 0
          });
        }
      }
    }
    return result;
  }

  // replenished the board and returns an object with movement information
  replenishBoard() {
    let result = [];
    for (let i = 0; i < this.getColumns(); i++) {
      if (this.isEmpty(0, i)) {
        let emptySpaces = this.emptySpacesBelow(0, i) + 1;
        for (let j = 0; j < emptySpaces; j++) {
          let randomValue = Math.floor(Math.random() * gameOptions.items);
          if (gameOptions.allowBlanks) {
            if (Math.random() < .15) {
              randomValue = 12
            }
          }
          result.push({
            row: j,
            column: i,
            deltaRow: emptySpaces,
            deltaColumn: 0
          });
          this.gameArray[j][i].value = randomValue;
          this.gameArray[j][i].isEmpty = false;
          this.gameArray[j][i].isLocked = false;
        }
      }
    }
    return result;
  }
  ////extra stuff
  //make array
  generateFieldExtra() {
    this.gameArrayExtra = [];

    for (let i = 0; i < this.rows; i++) {
      var gae = [];
      for (let j = 0; j < this.columns; j++) {
        gae.push(null)
      }
      this.gameArrayExtra.push(gae)
    }
    //console.log(this.gameArrayExtra)
  }
  extraEmpty(row, col) {
    if (this.gameArrayExtra[row][col] == null && this.valueAt(row, col) < 12) {
      return true
    }
    return false
  }
  setExtra(row, col, block) {
    this.gameArrayExtra[row][col] = block
  }
  getExtra(row, col) {
    return this.gameArrayExtra[row][col]
  }
  removeExtra(row, col) {
    if (this.gameArrayExtra[row][col] != null) {
      this.gameArrayExtra[row][col].destroy()
      this.gameArrayExtra[row][col] = null;
    }

  }
  isOpen(row, col) {

    if (this.gameArrayExtra[row][col] != null) {
      if (this.gameArrayExtra[row][col].extraType == 'closed') {
        return false;
      }
    }
    return true
  }
  isCoin(row, col) {
    if (this.gameArrayExtra[row][col] != null) {
      if (this.gameArrayExtra[row][col].extraType == 'coin') {
        return true;
      }
    }
  }
  isCross(row, col) {
    if (this.gameArrayExtra[row][col] != null) {
      if (this.gameArrayExtra[row][col].extraType == 'cross') {
        return true;
      }
    }
  }
  setRowColValue(row, col, value) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        if ((i == row || j == col) && !this.isBlank(row, col)) {
          this.setValueAt(i, j, value)
          this.setCustomDataFrame(i, j, value)
        }
      }
    }
  }
}
