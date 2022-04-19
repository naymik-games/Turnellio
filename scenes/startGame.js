class startGame extends Phaser.Scene {
  constructor() {
    super("startGame");
  }
  preload() {


  }
  create() {

    gameData = JSON.parse(localStorage.getItem('nmSave'));
    if (gameData === null || gameData.length <= 0) {
      localStorage.setItem('nmSave', JSON.stringify(defaultData));
      gameData = defaultData;
    }
    saveData = JSON.parse(localStorage.getItem('nmLoad'));
    if (saveData === null || saveData.length <= 0) {
      localStorage.setItem('nmLoad', JSON.stringify(defaultSave));
      saveData = defaultSave;
    }
    this.cameras.main.setBackgroundColor(0xf7eac6);

    var title = this.add.bitmapText(game.config.width / 2, 100, 'lato', 'NumberMatch', 150).setOrigin(.5).setTint(0xc76210);

    var startTime = this.add.bitmapText(game.config.width / 2 - 50, 275, 'lato', 'Play', 50).setOrigin(0, .5).setTint(0x000000);
    startTime.setInteractive();
    startTime.on('pointerdown', this.clickHandler, this);

    var laodTime = this.add.bitmapText(game.config.width / 2 - 50, 475, 'lato', 'Load', 50).setOrigin(0, .5).setTint(0x000000);
    laodTime.setInteractive();
    laodTime.on('pointerdown', this.clickHandler2, this);

  }
  clickHandler() {
    load = false;
    this.scene.start('PlayGame');
    //this.scene.launch('UI');
  }
  clickHandler2() {
    load = true;
    this.scene.start('PlayGame');
    //this.scene.launch('UI');
  }

}