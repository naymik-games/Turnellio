class preloadGame extends Phaser.Scene {
  constructor() {
    super("PreloadGame");
  }
  preload() {


    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });

    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', function (value) {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on('fileprogress', function (file) {
      assetText.setText('Loading asset: ' + file.key);
    });

    this.load.on('complete', function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });

    this.load.image("square", "assets/sprites/square.png");
    for (var i = 0; i < 125; i++) {
      this.load.image("square", "assets/sprites/square.png");
    }



    this.load.image("menu", "assets/sprites/menu.png");
    this.load.image("unlocked", "assets/sprites/unlocked.png");
    this.load.image("remove", "assets/sprites/remove.png");
    this.load.image("shuffle", "assets/sprites/shuffle.png");
    this.load.spritesheet("particles", "assets/sprites/particles.png", {
      frameWidth: 6,
      frameHeight: 6
    });

    this.load.spritesheet("gems", "assets/sprites/gems_numbers.png", {
      frameWidth: 100,
      frameHeight: 100
    });
    // this.load.image('square', 'assets/sprites/square.png')
    this.load.bitmapFont('lato', 'assets/fonts/lato_0.png', 'assets/fonts/lato.xml');
    /* this.load.spritesheet("menu_icons", "assets/sprites/icons.png", {
      frameWidth: 96,
      frameHeight: 96
    });
    this.load.spritesheet("gems", "assets/sprites/gems.png", {
      frameWidth: 100,
      frameHeight: 100
    });

    this.load.spritesheet("particle_color", "assets/particles.png", {
      frameWidth: 6,
      frameHeight: 6
    });
    this.load.spritesheet("rover", "assets/sprites/rover.png", {
      frameWidth: 100,
      frameHeight: 100
    });

    this.load.image('blank', 'assets/sprites/blank.png');
 */
  }
  create() {
    this.scene.start("startGame");
    //this.scene.start("PlayGame");

  }
}








