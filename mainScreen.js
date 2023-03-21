class MainScreen extends Phaser.Scene {
    constructor() {
        super("mainScreen");
    }

    preload() {
        this.load.image("Button_Test", "assets/launchTest.png");
        this.load.image("Button_Game", "assets/launchGame.png");
    }

    create() {
        this.testButton = this.add.image(400, 200, "Button_Test").setInteractive();
        this.gameButton = this.add.image(400, 400, "Button_Game").setInteractive();
        this.testButton.on("pointerdown", this.lauchTest, this);
        this.gameButton.on("pointerdown", this.launchGame, this);
    }

    update() {
    }

    lauchTest() {
        this.scene.start('MondeTest');
    }

    launchGame(){

    }
}