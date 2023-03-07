class sceneDeux extends Phaser.Scene {
    constructor() {
        super("sceneDeux");
        this.posSpawnJoueurX = 912;
        this.posSpawnJoueurY = 785;
    }

    init(data) {
        this.posSpawnJoueurX = data.posSpawnJoueurX;
        this.posSpawnJoueurY = data.posSpawnJoueurY;
    }

    preload() {
        //Preload Spritesheet
        this.load.spritesheet('perso', 'assets/perso.png',
            { frameWidth: 32, frameHeight: 32 });

        //Preload Map Tiled
        this.load.image("Phaser_tuilesdejeu", "assets/tileset.png");
        this.load.tilemapTiledJSON("carte", "assets/niveau_test.json");

        //Preload Image
        this.load.image("Texture_vide", "assets/Texture_vide.png");

    }

    create() {

        //Load map
        this.carteDuNiveau = this.add.tilemap("carte");

        //Load Tileset
        this.tileset = this.carteDuNiveau.addTilesetImage(
            "Tileset_base",
            "Phaser_tuilesdejeu"
        );

        //Load calque
        this.wall = this.carteDuNiveau.createLayer(
            "wall",
            this.tileset
        );

        this.passage_2to1 = this.physics.add.group();
        this.calque_passage_2to1 = this.carteDuNiveau.getObjectLayer('passage_2to1');
        this.calque_passage_2to1.objects.forEach(calque_passage_2to1 => {
            const POpassage_2 = this.passage_2to1.create(calque_passage_2to1.x + 16, calque_passage_2to1.y + 16, "Texture_vide").body.setAllowGravity(false);
        });

        this.passage_2to3 = this.physics.add.group();
        this.calque_passage_2to3 = this.carteDuNiveau.getObjectLayer('passage_2to3');
        this.calque_passage_2to3.objects.forEach(calque_passage_2to3 => {
            const POpassage_3 = this.passage_2to3.create(calque_passage_2to3.x + 16, calque_passage_2to3.y + 16, "Texture_vide").body.setAllowGravity(false);
        });


        //Définition calque solide
        this.wall.setCollisionByProperty({ estSolide: true });

        //Création Joueur
        this.player = this.physics.add.sprite(this.posSpawnJoueurX, this.posSpawnJoueurY, 'perso');
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

        //Gestion Taille monde et caméra
        this.physics.world.setBounds(0, 0, 1120, 832);
        this.cameras.main.setBounds(0, 0, 1120, 832);
        this.cameras.main.startFollow(this.player);

        //Récupération Input
        this.cursors = this.input.keyboard.createCursorKeys();

        //Création Collision
        this.physics.add.collider(this.player, this.wall);
        this.physics.add.overlap(this.player, this.passage_2to1, this.switch_passage_2to1, null, this);
        this.physics.add.overlap(this.player, this.passage_2to3, this.switch_passage_2to3, null, this);

    }

    update() {
        //Mouvement Joueur
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-300);
            this.player.setVelocityX(0);
            this.player.anims.play('up');
        }
        else if (this.cursors.down.isDown) {
            this.player.setVelocityY(300);
            this.player.setVelocityX(0);
            this.player.anims.play('down');
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(300);
            this.player.setVelocityY(0);
            this.player.anims.play('right');
        }
        else if (this.cursors.left.isDown) {
            this.player.setVelocityX(-300);
            this.player.setVelocityY(0);
            this.player.anims.play('left');
        }
        else {
            this.player.setVelocityY(0);
            this.player.setVelocityX(0);
        }
    }

    switch_passage_2to1(){
        this.scene.start('sceneUn', {
            posSpawnJoueurX : 912,
            posSpawnJoueurY : 912
        })
    }

    switch_passage_2to3() {
        this.scene.start('sceneTrois', {
            posSpawnJoueurX : 1168,
            posSpawnJoueurY : 528
        })
    }
}