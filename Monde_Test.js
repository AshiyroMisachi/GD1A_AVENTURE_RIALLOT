class monde_test extends Phaser.Scene {
    constructor() {
        super("MondeTest");
    }

    init(data) {

    }

    preload() {
        //Sprite Perso
        this.load.spritesheet('perso', 'assets/perso.png',
            { frameWidth: 32, frameHeight: 32 });

        //Preload Asset Tiled
        this.load.image("Phaser_tuilesdejeu", "assets/Tiled/tileset.png");
        this.load.tilemapTiledJSON("carte", "assets/Tiled/mondeTest.json");
    }

    create() {
        //Load Tiled
        this.carteDuNiveau = this.add.tilemap("carte");
        this.tileset = this.carteDuNiveau.addTilesetImage(
            "Tileset_PlaceHolder",
            "Phaser_tuilesdejeu"
        );

        //Load Calque
        this.bordure = this.carteDuNiveau.createLayer(
            "Bordure",
            this.tileset
        );

        //Calque Solide
        this.bordure.setCollisionByProperty({ estSolide: true });

        //Création Joueur
        this.player = this.physics.add.sprite(150, 150, 'perso');
        this.player.setCollideWorldBounds(true);
        this.anims.create({
            key: 'left',
            frames: [{ key: 'perso', frame: 3 }],
            frameRate: 20
        });
        this.anims.create({
            key: 'up',
            frames: [{ key: 'perso', frame: 0 }],
            frameRate: 20
        });
        this.anims.create({
            key: 'down',
            frames: [{ key: 'perso', frame: 2 }],
            frameRate: 20
        });
        this.anims.create({
            key: 'right',
            frames: [{ key: 'perso', frame: 1 }],
            frameRate: 20
        });

        //Création Caméra
        this.physics.world.setBounds(0, 0, 3200, 3200);
        this.cameras.main.setBounds(0, 0, 3200, 3200);
        this.cameras.main.startFollow(this.player);

        //Récupération Input
        this.cursors = this.input.keyboard.createCursorKeys();

        //Création Collision
        //Joueur
        this.physics.add.collider(this.bordure, this.player);
    }

    update() {
        //Mouvement
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-300);
            this.player.setVelocityX(0);
            this.player.anims.play('up');
            this.player_facing = "up";
        }
        else if (this.cursors.down.isDown) {
            this.player.setVelocityY(300);
            this.player.setVelocityX(0);
            this.player.anims.play('down');
            this.player_facing = "down";
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(300);
            this.player.setVelocityY(0);
            this.player.anims.play('right');
            this.player_facing = "right";
        }
        else if (this.cursors.left.isDown) {
            this.player.setVelocityX(-300);
            this.player.setVelocityY(0);
            this.player.anims.play('left');
            this.player_facing = "left";
        }
        else {
            this.player.setVelocityY(0);
            this.player.setVelocityX(0);
        }
    }

}