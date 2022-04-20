
window.onload = function () {
    let gameConfig = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: "thegame",
            width: 900,
            height: 1640
        },
        scene: [preloadGame, startGame, playGame]
    }
    game = new Phaser.Game(gameConfig);
    window.focus();
}
class playGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }
    preload() {

    }
    create() {
        this.breakLockFlag = false
        this.destroyTileFlag = false
        this.blanksExist = true
        this.crosses = []

        this.cameras.main.setBackgroundColor(0x000000);
        if (load) {
            this.score = saveData.score
            this.tempScore = this.score
            this.matches = saveData.matches
            this.level = saveData.level
        } else {
            this.score = 0
            this.tempScore = 0
            this.matches = 0
            this.level = 1
        }
        this.scoreText = this.add.bitmapText(450, 75, 'lato', this.tempScore, 105).setOrigin(.5).setTint(0xf5f5f5).setAlpha(1);

        this.scoreBuffer = 0

        this.coins = gameData.coins

        this.matchesText = this.add.bitmapText(875, 75, 'lato', this.matches, 75).setOrigin(1, .5).setTint(0xf5f5f5).setAlpha(1);
        this.levelText = this.add.bitmapText(25, 75, 'lato', this.level, 120).setOrigin(0, .5).setTint(0xff0000).setAlpha(1);

        this.match3 = new Match3({
            rows: gameOptions.rows,
            columns: gameOptions.cols,
            items: gameOptions.items,

        });
        //gameOptions.gemSize = (game.config.width - (gameOptions.offsetX * 2)) / gameOptions.cols;
        gameOptions.gemSize = (game.config.width - (gameOptions.boardOffset.x * 2)) / gameOptions.cols
        this.bgBorder = this.add.image(gameOptions.boardOffset.x - 10, gameOptions.boardOffset.y - 10, 'square').setOrigin(0)
        this.bgBorder.displayWidth = (gameOptions.cols * gameOptions.gemSize) + 20
        this.bgBorder.displayHeight = (gameOptions.rows * gameOptions.gemSize) + 20
        this.bgColor = this.add.image(gameOptions.boardOffset.x, gameOptions.boardOffset.y, 'square').setOrigin(0).setTint(0x000000)
        this.bgColor.displayWidth = (gameOptions.cols * gameOptions.gemSize)
        this.bgColor.displayHeight = (gameOptions.rows * gameOptions.gemSize)

        this.levelProgressbg = this.add.image(this.bgBorder.x, this.bgBorder.y + 315, 'square').setOrigin(1).setTint(0xffffff)
        this.levelProgressbg.displayWidth = 70
        this.levelProgressbg.displayHeight = 315
        this.levelProgress = this.add.image(this.bgBorder.x - 10, this.bgBorder.y + 305, 'square').setOrigin(1).setTint(0xff0000)
        this.levelProgress.displayWidth = 50
        this.levelProgress.displayHeight = 0

        if (load) {
            this.match3.loadGame();
        } else {
            this.match3.generateField();
        }



        this.canPick = true;
        this.drawField();

        this.breakLockIcon = this.add.image(gameOptions.boardOffset.x, (gameOptions.boardOffset.y + gameOptions.gemSize * gameOptions.rows + gameOptions.gemSize / 2) + 50, 'unlocked').setOrigin(0).setInteractive()
        this.breakLockIcon.on('pointerdown', this.breakLockStart, this)
        this.destroyTileIcon = this.add.image(gameOptions.boardOffset.x + 125, (gameOptions.boardOffset.y + gameOptions.gemSize * gameOptions.rows + gameOptions.gemSize / 2) + 50, 'remove').setOrigin(0).setInteractive()
        this.destroyTileIcon.on('pointerup', this.destroyTileStart, this)

        this.coinIcon = this.add.image(75, 1550, 'gems', 14)
        this.coinText = this.add.bitmapText(75, 1550, 'lato', this.coins, 45).setOrigin(.5).setTint(0xf5f5f5).setAlpha(1);


        this.showToast('Begin')
        this.input.on("pointerdown", this.gemSelect, this);
        this.makeMenu()
    }
    update() {

        if (this.scoreBuffer > 0) {
            this.incrementScore();
            this.scoreBuffer--;
        }
        if (this.scoreBuffer < 0) {
            this.decrementScore();
            this.scoreBuffer++;
        }
        this.normalizedScore = this.score / this.level
        this.levelProgress.displayHeight = (this.normalizedScore / (2000 * this.level)) * 300
    }
    incrementScore() {
        this.tempScore += 1;
        this.scoreText.setText(this.tempScore);
    }
    decrementScore() {
        this.tempScore -= 1;
        this.scoreText.setText(this.tempScore);
    }
    levelCheck() {
        var crossChance = 10
        var crossMin = 0

        //console.log(this.normalizedScore)

        if (this.normalizedScore > (2000 * this.level)) {
            //this.levelProgress.displayHeight = 0
            var tween = this.tweens.add({
                targets: this.levelProgress,
                displayHeight: 0,
                duration: 500
            })
            this.level++
            this.levelText.setText(this.level)
            this.showToast('Level Up!')
            if (this.level == 3) {
                var blanks = this.match3.addBlanks(this.getRandomNumberBetween(2, 5))
                this.drawBlanks(blanks)
            }
            if (this.level == 4) {
                this.addClosed(5)
                var crossChance = 12
            }
            if (this.level == 5) {
                var blanks = this.match3.addBlanks(8)
                this.drawBlanks(blanks)
                var crossChance = 16
            }
            if (this.level == 6) {
                this.addClosed(5)
                var blanks = this.match3.addBlanks(8)
                this.drawBlanks(blanks)
                var crossChance = 18
            }

            if (this.level == 7) {
                var blanks = this.match3.addBlanks(this.getRandomNumberBetween(5, 12))
                this.drawBlanks(blanks)
                var crossChance = 20
                var crossMin = 1
            }
            if (this.level == 8) {
                gameOptions.items = 5;
                var crossChance = 30
                var crossMin = 2
                this.addClosed(5)
            }
            if (this.level == 9) {
                var blanks = this.match3.addBlanks(this.getRandomNumberBetween(5, 12))
                this.drawBlanks(blanks)
                var crossChance = 32
                var crossMin = 2
            }
            if (this.level == 12) {
                gameOptions.items = 6;
            }
        }
        if (this.getRandomNumberBetween(1, 100) < 12) {
            this.addCoins(this.getRandomNumberBetween(0, 4))
        }
        if (this.getRandomNumberBetween(1, 100) < crossChance) {
            this.addCross(this.getRandomNumberBetween(crossMin, 3))
        }
    }
    breakLockStart() {

        this.breakLockIcon.setTint(0x00ff00)
        this.bgBorder.setTint(0x00ff00)
        this.breakLockFlag = true
        //console.log('break start')

    }
    breakLock(pointer) {
        let row = Math.floor((pointer.y - gameOptions.boardOffset.y) / gameOptions.gemSize);
        let col = Math.floor((pointer.x - gameOptions.boardOffset.x) / gameOptions.gemSize);
        if (this.match3.validPick(row, col) && this.match3.isLocked(row, col)) {
            // console.log('break continue')
            this.match3.unlockAt(row, col)
            var tween = this.tweens.add({
                targets: this.match3.customDataOf(row, col),
                displayWidth: this.match3.customDataOf(row, col).displayWidth + 35,
                displayHeight: this.match3.customDataOf(row, col).displayHeight + 35,
                yoyo: true,
                duration: 200,
                onYoyoScope: this,
                onYoyo: function () {
                    this.match3.customDataOf(row, col).setFrame(this.match3.valueAt(row, col));
                }
            })


        }
        this.breakLockFlag = false;
        this.breakLockIcon.clearTint()
        this.bgBorder.clearTint()
    }
    destroyTileStart() {

        this.destroyTileIcon.setTint(0x00ff00)
        this.bgBorder.setTint(0x00ff00)
        this.destroyTileFlag = true
        //console.log('destroy start')

    }
    destroyTile(pointer) {
        let row = Math.floor((pointer.y - gameOptions.boardOffset.y) / gameOptions.gemSize);
        let col = Math.floor((pointer.x - gameOptions.boardOffset.x) / gameOptions.gemSize);
        if (this.match3.validPick(row, col) && !this.match3.isBlank(row, col)) {

            let gemsToRemove = [{ row: row, column: col }]
            this.scoreBuffer += gemsToRemove.length * 10
            this.score += gemsToRemove.length * 10
            let destroyed = 0;
            gemsToRemove.forEach(function (gem) {
                this.poolArray.push(this.match3.customDataOf(gem.row, gem.column))
                if (this.match3.isCoin(gem.row, gem.column)) {
                    // console.log('got coin')
                    this.coins++
                    this.coinText.setText(this.coins)
                    this.collectCoin(gem.row, gem.column)
                }
                destroyed++;
                this.tweens.add({
                    targets: this.match3.customDataOf(gem.row, gem.column),
                    alpha: 0,
                    duration: gameOptions.destroySpeed,
                    callbackScope: this,
                    onComplete: function (event, sprite) {
                        destroyed--;
                        if (destroyed == 0) {
                            this.match3.setEmpty(row, col)
                            this.makeGemsFall();
                        }
                    }
                });
            }.bind(this));


        }
        this.destroyTileFlag = false;
        this.destroyTileIcon.clearTint()
        this.bgBorder.clearTint()
    }
    drawField() {
        this.poolArray = [];
        for (let i = 0; i < this.match3.getRows(); i++) {
            for (let j = 0; j < this.match3.getColumns(); j++) {
                let gemX = gameOptions.boardOffset.x + gameOptions.gemSize * j + gameOptions.gemSize / 2
                let gemY = gameOptions.boardOffset.y + gameOptions.gemSize * i + gameOptions.gemSize / 2
                let gem = this.add.sprite(gemX, gemY, "gems", this.match3.valueAt(i, j));
                gem.displayWidth = gameOptions.gemSize;
                gem.displayHeight = gameOptions.gemSize;
                this.match3.setCustomData(i, j, gem);
            }
        }
        if (load) {
            this.loadExtra()
        } else {
            this.addCoins(2)
            this.addCross(2)
        }


        //console.log(this.match3.gameArray)
    }
    loadExtra() {
        for (let i = 0; i < this.match3.getRows(); i++) {
            for (let j = 0; j < this.match3.getColumns(); j++) {
                if (saveData.gameArrayExtra[i][j] == 'coin') {
                    this.addCoins(1, true, i, j)
                } else if (saveData.gameArrayExtra[i][j] == 'cross') {
                    this.addCross(1, true, i, j)
                } else if (saveData.gameArrayExtra[i][j] == 'closed') {
                    this.addClosed(1, true, i, j)
                }
            }
        }
    }
    drawBlanks(blanks) {
        for (var i = 0; i < blanks.length; i++) {
            this.match3.setCustomDataFrame(blanks[i].row, blanks[i].col, 12)
        }
        this.blanksExist = true
    }
    addCoins(count, doLoad, row, col) {
        var i = 0
        while (i < count) {
            if (doLoad) {

            } else {
                var row = Phaser.Math.Between(0, gameOptions.rows - 1)
                var col = Phaser.Math.Between(0, gameOptions.cols - 1)
            }

            if (this.match3.extraEmpty(row, col)) {
                //this.gameArrayExtra[row][col].coin = true;
                let gemX = -75
                let gemY = gameOptions.boardOffset.y + gameOptions.gemSize * row + gameOptions.gemSize / 2
                var block = this.add.image(gemX, gemY, 'gems', 14).setAlpha(1);
                block.displayWidth = gameOptions.gemSize;
                block.displayHeight = gameOptions.gemSize;
                block.extraType = 'coin'
                this.match3.setExtra(row, col, block)
                var tween = this.tweens.add({
                    targets: block,
                    x: gameOptions.boardOffset.x + gameOptions.gemSize * col + gameOptions.gemSize / 2,
                    angle: 360,
                    duration: 200
                })
                i++
            }
        }
    }
    addCross(count, doLoad, row, col) {
        var i = 0
        while (i < count) {
            if (doLoad) {

            } else {
                var row = Phaser.Math.Between(0, gameOptions.rows - 1)
                var col = Phaser.Math.Between(0, gameOptions.cols - 1)
            }
            if (this.match3.extraEmpty(row, col)) {
                //this.gameArrayExtra[row][col].coin = true;
                let gemX = -75
                let gemY = gameOptions.boardOffset.y + gameOptions.gemSize * row + gameOptions.gemSize / 2
                var block = this.add.image(gemX, gemY, 'gems', 16).setAlpha(1);
                block.displayWidth = gameOptions.gemSize;
                block.displayHeight = gameOptions.gemSize;
                block.extraType = 'cross'
                this.match3.setExtra(row, col, block)
                var tween = this.tweens.add({
                    targets: block,
                    x: gameOptions.boardOffset.x + gameOptions.gemSize * col + gameOptions.gemSize / 2,
                    angle: 360,
                    duration: 200
                })
                i++
                i++
            }
        }
    }
    addClosed(count, doLoad, row, col) {
        var i = 0
        while (i < count) {
            if (doLoad) {

            } else {
                var row = Phaser.Math.Between(0, gameOptions.rows - 1)
                var col = Phaser.Math.Between(0, gameOptions.cols - 1)
            }
            if (this.match3.extraEmpty(row, col)) {
                //this.gameArrayExtra[row][col].coin = true;
                let gemX = -75
                let gemY = gameOptions.boardOffset.y + gameOptions.gemSize * row + gameOptions.gemSize / 2
                var block = this.add.image(gemX, gemY, 'gems', 17).setAlpha(1);
                block.displayWidth = gameOptions.gemSize;
                block.displayHeight = gameOptions.gemSize;
                block.extraType = 'closed'
                this.match3.setExtra(row, col, block)
                var tween = this.tweens.add({
                    targets: block,
                    x: gameOptions.boardOffset.x + gameOptions.gemSize * col + gameOptions.gemSize / 2,
                    angle: 360,
                    duration: 200
                })
                i++
                i++
            }
        }
    }
    gemSelect(pointer) {
        if (pointer.y < gameOptions.boardOffset.y || pointer.y > gameOptions.boardOffset.y + gameOptions.gemSize * gameOptions.rows + gameOptions.gemSize / 2) { return }
        if (this.breakLockFlag) {
            // console.log('break number selection')
            this.breakLock(pointer)
            return
        }
        if (this.destroyTileFlag) {
            //console.log('destroy selection')
            this.destroyTile(pointer)
            return
        }
        if (this.canPick) {

            let row = Math.floor((pointer.y - gameOptions.boardOffset.y) / gameOptions.gemSize);
            let col = Math.floor((pointer.x - gameOptions.boardOffset.x) / gameOptions.gemSize);
            //console.log(this.match3.valueAt(row, col))
            if (this.match3.valueAt(row, col) == 12) {
                return
            }
            this.canPick = false;
            if (this.match3.validPick(row, col) && !this.match3.isLocked(row, col) && this.match3.isOpen(row, col)) {

                this.tweens.add({
                    targets: this.match3.customDataOf(row, col),
                    angle: 90,
                    duration: gameOptions.rotateSpeed,
                    callbackScope: this,
                    onComplete: function () {
                        this.match3.customDataOf(row, col).angle = 0;
                        this.match3.incValueAt(row, col);
                        this.match3.customDataOf(row, col).setFrame(this.match3.valueAt(row, col))
                        this.handleMatches();
                    }
                })
            }
            else {
                this.canPick = true;
            }
        }
    }
    handleMatches() {
        if (this.match3.matchInBoard()) {
            this.matches++
            this.matchesText.setText(this.matches)
            let gemsToRemove = this.match3.getMatchList();
            this.scoreBuffer += gemsToRemove.length * 10
            this.score += gemsToRemove.length * 10
            let destroyed = 0;
            gemsToRemove.forEach(function (gem) {
                this.poolArray.push(this.match3.customDataOf(gem.row, gem.column))
                if (this.match3.isCoin(gem.row, gem.column)) {
                    //console.log('got coin')
                    this.collectCoin(gem.row, gem.column)
                    this.coins++
                    this.coinText.setText(this.coins)
                }
                if (this.match3.isCross(gem.row, gem.column)) {
                    //console.log('got cross')
                    this.collectCross(gem.row, gem.column, this.match3.valueAt(gem.row, gem.column))
                }
                destroyed++;
                this.tweens.add({
                    targets: this.match3.customDataOf(gem.row, gem.column),
                    alpha: 0,
                    duration: gameOptions.destroySpeed,
                    callbackScope: this,
                    onComplete: function (event, sprite) {
                        destroyed--;
                        if (destroyed == 0) {
                            this.makeGemsFall();
                        }
                    }
                });
            }.bind(this));
        }
        else {
            for (let i = 0; i < 5; i++) {
                let locked = this.match3.lockRandomItem();
                this.scoreBuffer -= 100
                this.score -= 100
                if (locked) {
                    this.match3.customDataOf(locked.row, locked.column).setFrame(6 + this.match3.valueAt(locked.row, locked.column));
                }
            }
            this.canPick = true;
        }
    }
    makeGemsFall() {
        let moved = 0;
        this.match3.removeMatches();
        let fallingMovements = this.match3.arrangeBoardAfterMatch();
        fallingMovements.forEach(function (movement) {
            moved++;
            this.tweens.add({
                targets: this.match3.customDataOf(movement.row, movement.column),
                y: this.match3.customDataOf(movement.row, movement.column).y + movement.deltaRow * gameOptions.gemSize,
                duration: gameOptions.fallSpeed * Math.abs(movement.deltaRow),
                callbackScope: this,
                onComplete: function () {
                    moved--;
                    if (moved == 0) {
                        this.endOfMove()
                    }
                }
            })
        }.bind(this));
        let replenishMovements = this.match3.replenishBoard();
        replenishMovements.forEach(function (movement) {
            moved++;
            let sprite = this.poolArray.pop();
            sprite.alpha = 1;
            sprite.y = gameOptions.boardOffset.y + gameOptions.gemSize * (movement.row - movement.deltaRow + 1) - gameOptions.gemSize / 2;
            sprite.x = gameOptions.boardOffset.x + gameOptions.gemSize * movement.column + gameOptions.gemSize / 2,
                sprite.angle = 0;
            sprite.setFrame(this.match3.valueAt(movement.row, movement.column));
            this.match3.setCustomData(movement.row, movement.column, sprite);
            this.tweens.add({
                targets: sprite,
                y: gameOptions.boardOffset.y + gameOptions.gemSize * movement.row + gameOptions.gemSize / 2,
                duration: gameOptions.fallSpeed * movement.deltaRow,
                callbackScope: this,
                onComplete: function () {
                    moved--;
                    if (moved == 0) {
                        this.endOfMove()
                    }
                }
            });
        }.bind(this))
    }


    handleBlanks() {
        if (this.match3.blankOnBottom()) {
            let gemsToRemove = this.match3.getBlankList();
            this.scoreBuffer += gemsToRemove.length * 10
            this.score += gemsToRemove.length * 10
            let destroyed = 0;
            gemsToRemove.forEach(function (gem) {
                this.poolArray.push(this.match3.customDataOf(gem.row, gem.column))
                destroyed++;
                this.tweens.add({
                    targets: this.match3.customDataOf(gem.row, gem.column),
                    alpha: 0,
                    duration: gameOptions.destroySpeed,
                    callbackScope: this,
                    onComplete: function (event, sprite) {
                        destroyed--;
                        if (destroyed == 0) {
                            this.makeGemsFallBlank();
                        }
                    }
                });
            }.bind(this));
        }
        else {
            for (let i = 0; i < 5; i++) {
                let locked = this.match3.lockRandomItem();
                if (locked) {
                    this.match3.customDataOf(locked.row, locked.column).setFrame(6 + this.match3.valueAt(locked.row, locked.column));
                }
            }
            this.canPick = true;
        }
    }
    makeGemsFallBlank() {
        let moved = 0;
        this.match3.removeBlanks();
        let fallingMovements = this.match3.arrangeBoardAfterMatch();
        fallingMovements.forEach(function (movement) {
            moved++;
            this.tweens.add({
                targets: this.match3.customDataOf(movement.row, movement.column),
                y: this.match3.customDataOf(movement.row, movement.column).y + movement.deltaRow * gameOptions.gemSize,
                duration: gameOptions.fallSpeed * Math.abs(movement.deltaRow),
                callbackScope: this,
                onComplete: function () {
                    moved--;
                    if (moved == 0) {
                        this.endOfMove()
                    }
                }
            })
        }.bind(this));
        let replenishMovements = this.match3.replenishBoard();
        replenishMovements.forEach(function (movement) {
            moved++;
            let sprite = this.poolArray.pop();
            sprite.alpha = 1;
            sprite.y = gameOptions.boardOffset.y + gameOptions.gemSize * (movement.row - movement.deltaRow + 1) - gameOptions.gemSize / 2;
            sprite.x = gameOptions.boardOffset.x + gameOptions.gemSize * movement.column + gameOptions.gemSize / 2,
                sprite.angle = 0;
            sprite.setFrame(this.match3.valueAt(movement.row, movement.column));
            this.match3.setCustomData(movement.row, movement.column, sprite);
            this.tweens.add({
                targets: sprite,
                y: gameOptions.boardOffset.y + gameOptions.gemSize * movement.row + gameOptions.gemSize / 2,
                duration: gameOptions.fallSpeed * movement.deltaRow,
                callbackScope: this,
                onComplete: function () {
                    moved--;
                    if (moved == 0) {
                        this.endOfMove()
                    }
                }
            });
        }.bind(this))
    }
    endOfMove() {
        if (this.match3.matchInBoard()) {
            this.time.addEvent({
                delay: 250,
                callback: this.handleMatches()
            });
        }
        else {
            if (this.match3.blankOnBottom()) {
                this.time.addEvent({
                    delay: 250,
                    callback: this.handleBlanks()
                });
            } else if (this.crosses.length > 0) {
                this.doCross()
            } else {
                //console.log(this.crosses)
                this.canPick = true;
                this.selectedGem = null;
                this.crosses = [];
                this.levelCheck()
                this.saveGame()
                if (this.blanksExist) {
                    if (!this.match3.doBlanksExist()) {
                        this.scoreBuffer += 1000
                        this.score += 1000
                        this.showToast('Blanks Cleared!')
                        this.addCross(3)
                        this.blanksExist = false
                    }

                }
            }

        }
    }
    collectCoin(row, col) {
        if (this.match3.isCoin(row, col)) {
            //this.addCoinCount(1)
            var tween = this.tweens.add({
                targets: this.match3.getExtra(row, col),
                scale: 0,
                angle: 360,
                x: this.coinIcon.x,
                y: this.coinIcon.y,
                duration: 650,
                onCompleteScope: this,
                onComplete: function () {
                    this.match3.removeExtra(row, col)
                }
            })
        }
    }
    collectCross(row, col, value) {
        this.crosses.push({ row: row, col: col, value: value })
        var tween = this.tweens.add({
            targets: this.match3.getExtra(row, col),
            scale: 0,
            angle: 360,
            x: this.matchesText.x,
            y: this.matchesText.y,
            duration: 650,
            onCompleteScope: this,
            onComplete: function () {
                this.match3.removeExtra(row, col)
            }
        })

    }
    doCross() {
        for (let i = 0; i < this.crosses.length; i++) {
            const element = this.crosses[i];
            this.match3.setRowColValue(element.row, element.col, element.value)

        }
        this.crosses = []
        this.handleMatches()
    }
    saveGame() {
        var board = this.match3.getBoard()
        var boardExtra = this.match3.getBoardExtra()
        //console.log(boardExtra)
        saveData.gameArray = board
        saveData.gameArrayExtra = boardExtra
        saveData.score = this.score
        saveData.matches = this.matches
        saveData.level = this.level
        localStorage.setItem('nmLoad', JSON.stringify(saveData));
        gameData.coins = this.coins
        localStorage.setItem('nmSave', JSON.stringify(gameData));
    }
    showToast(text) {
        if (this.toastBox) {
            this.toastBox.destroy(true);
        }
        var toastBox = this.add.container().setDepth(2);
        var backToast = this.add.image(0, 0, 'square').setDepth(2).setTint(0x333333);
        backToast.setAlpha(1);
        backToast.displayWidth = 700;
        backToast.displayHeight = 90;
        toastBox.add(backToast);
        toastBox.setPosition(game.config.width + 800, 820);
        var toastText = this.add.bitmapText(20, 0, 'lato', text, 70,).setTint(0xfafafa).setOrigin(.5, .5).setDepth(2);
        //toastText.setMaxWidth(game.config.width - 10);
        toastBox.add(toastText);
        this.toastBox = toastBox;
        this.tweens.add({
            targets: this.toastBox,
            //alpha: .5,
            x: 450,
            duration: 500,
            //  yoyo: true,
            callbackScope: this,
            onComplete: function () {
                this.time.addEvent({
                    delay: 2500,
                    callback: this.hideToast,
                    callbackScope: this
                });
            }
        });
        //this.time.addEvent({delay: 2000, callback: this.hideToast, callbackScope: this});
    }
    hideToast() {
        this.tweens.add({
            targets: this.toastBox,
            //alpha: .5,
            x: -800,
            duration: 500,
            //  yoyo: true,
            callbackScope: this,
            onComplete: function () {
                this.toastBox.destroy(true);
            }
        });

    }
    toggleMenu() {

        if (this.menuGroup.y == 0) {
            var menuTween = this.tweens.add({
                targets: this.menuGroup,
                y: -270,
                duration: 500,
                ease: 'Bounce'
            })

        }
        if (this.menuGroup.y == -270) {
            var menuTween = this.tweens.add({
                targets: this.menuGroup,
                y: 0,
                duration: 500,
                ease: 'Bounce'
            })
        }
    }
    makeMenu() {
        ////////menu
        this.menuGroup = this.add.container().setDepth(3);
        var menuBG = this.add.image(game.config.width / 2, game.config.height - 85, 'square').setOrigin(.5, 0).setTint(0x333333).setAlpha(.8)
        menuBG.displayWidth = 300;
        menuBG.displayHeight = 600
        this.menuGroup.add(menuBG)
        var menuButton = this.add.image(game.config.width / 2, game.config.height - 40, "menu").setInteractive().setDepth(3);
        menuButton.on('pointerdown', this.toggleMenu, this)
        menuButton.setOrigin(0.5);
        this.menuGroup.add(menuButton);
        var homeButton = this.add.bitmapText(game.config.width / 2, game.config.height + 50, 'lato', 'HOME', 50).setOrigin(.5).setTint(0xffffff).setAlpha(1).setInteractive();
        homeButton.on('pointerdown', function () {
            this.scene.stop()
            this.scene.start('startGame')
        }, this)
        this.menuGroup.add(homeButton);
        var wordButton = this.add.bitmapText(game.config.width / 2, game.config.height + 140, 'lato', 'WORDS', 50).setOrigin(.5).setTint(0xffffff).setAlpha(1).setInteractive();
        wordButton.on('pointerdown', function () {
            var data = {
                yesWords: this.foundWords,
                noWords: this.notWords
            }
            this.scene.pause()
            this.scene.launch('wordsPlayed', data)
        }, this)
        this.menuGroup.add(wordButton);
        var helpButton = this.add.bitmapText(game.config.width / 2, game.config.height + 230, 'lato', 'RESTART', 50).setOrigin(.5).setTint(0xffffff).setAlpha(1).setInteractive();
        helpButton.on('pointerdown', function () {


            this.scene.start('PlayGame')
        }, this)
        this.menuGroup.add(helpButton);
        //var thankYou = game.add.button(game.config.width / 2, game.config.height + 130, "thankyou", function(){});
        // thankYou.setOrigin(0.5);
        // menuGroup.add(thankYou);    
        ////////end menu
    }
    getRandomNumberBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
