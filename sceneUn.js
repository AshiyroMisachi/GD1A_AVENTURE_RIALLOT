class sceneUn extends Phaser.Scene {
    constructor() {
        super("sceneUn");
        this.posSpawnJoueurX = 176;
        this.posSpawnJoueurY = 1520;
        this.start = true;
        this.player_facing = "up";
    }

    init(data) {
        this.posSpawnJoueurX = data.posSpawnJoueurX;
        this.posSpawnJoueurY = data.posSpawnJoueurY;
    }

    preload() {

        //Spritesheet Perso
        this.load.spritesheet('perso', 'assets/perso.png',
            { frameWidth: 32, frameHeight: 32 });
        this.load.image("sword_y", "assets/attaque_joueur_y.png");
        this.load.image("sword_x", "assets/attaque_joueur_x.png");

        //Spritesheet Mob
        this.load.spritesheet('mob', 'assets/mob.png',
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

        this.passage_1to2 = this.physics.add.group();
        this.calque_passage_1 = this.carteDuNiveau.getObjectLayer('passage_1to2');
        this.calque_passage_1.objects.forEach(calque_passage_1 => {
            const POpassage_1 = this.passage_1to2.create(calque_passage_1.x + 16, calque_passage_1.y + 16, "Texture_vide").body.setAllowGravity(false);
        });

        //Définition calque solide
        this.wall.setCollisionByProperty({ estSolide: true });

        //Création Joueur
        if (this.start) {
            this.player = this.physics.add.sprite(176, 1520, 'perso');
            this.start = false;
        }
        else {
            this.player = this.physics.add.sprite(this.posSpawnJoueurX, this.posSpawnJoueurY, 'perso');
        }
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
        this.attaque_sword = this.physics.add.staticGroup();

        //Création Mob
        this.mob = this.physics.add.group();
        this.anims.create({
            key: 'left_mob',
            frames: [{ key: 'mob', frame: 3 }],
            frameRate: 20
        });
        this.anims.create({
            key: 'up_mob',
            frames: [{ key: 'mob', frame: 0 }],
            frameRate: 20
        });
        this.anims.create({
            key: 'down_mob',
            frames: [{ key: 'mob', frame: 2 }],
            frameRate: 20
        });
        this.anims.create({
            key: 'right_mob',
            frames: [{ key: 'mob', frame: 1 }],
            frameRate: 20
        });

        this.calque_mob_up = this.carteDuNiveau.getObjectLayer('mob_up');
        this.calque_mob_up.objects.forEach(calque_mob_up => {
            this.mobs_up = this.physics.add.sprite(calque_mob_up.x + 16, calque_mob_up.y + 16, 'mob');
            this.mob.add(this.mobs_up);
            this.mobs_up.setVelocityY(-100);
            this.mobs_up.anims.play('up_mob');
        });

        this.calque_mob_right = this.carteDuNiveau.getObjectLayer('mob_right');
        this.calque_mob_right.objects.forEach(calque_mob_right => {
            this.mobs_right = this.physics.add.sprite(calque_mob_right.x + 16, calque_mob_right.y + 16, 'mob');
            this.mob.add(this.mobs_right);
            this.mobs_right.setVelocityX(100);
            this.mobs_right.anims.play('right_mob');
        });


        //Création Barrière Mob
        this.calque_mob_direction_right = this.carteDuNiveau.createLayer(
            "mob_direction_right",
            this.tileset
        );

        this.calque_mob_direction_left = this.carteDuNiveau.createLayer(
            "mob_direction_left",
            this.tileset
        );

        this.calque_mob_direction_up = this.carteDuNiveau.createLayer(
            "mob_direction_up",
            this.tileset
        );

        this.calque_mob_direction_down = this.carteDuNiveau.createLayer(
            "mob_direction_down",
            this.tileset
        );

        this.calque_mob_direction_right.setCollisionByProperty({ estSolide: true });
        this.calque_mob_direction_left.setCollisionByProperty({ estSolide: true });
        this.calque_mob_direction_up.setCollisionByProperty({ estSolide: true });
        this.calque_mob_direction_down.setCollisionByProperty({ estSolide: true });

        //Gestion Taille monde et caméra
        this.physics.world.setBounds(0, 832, 1120, 768);
        this.cameras.main.setBounds(0, 832, 1120, 768);
        this.cameras.main.startFollow(this.player);

        //Récupération Input
        this.cursors = this.input.keyboard.createCursorKeys();

        //Création Collision Joueur
        this.physics.add.collider(this.player, this.wall);
        this.physics.add.overlap(this.player, this.passage_1to2, this.switch_passage_1to2, null, this);

        //Création Collision Attaque
        this.physics.add.overlap(this.attaque_sword, this.wall, clean_sword, if_clean_sword, this);

        this.physics.add.overlap(this.attaque_sword, this.mobs_up, kill_mob_up, null, this);

        //Création Collision Mob
        //Mob Up
        this.physics.add.collider(this.mobs_up, this.calque_mob_direction_left, mob_up_go_left, null, this);
        this.physics.add.collider(this.mobs_up, this.calque_mob_direction_right, mob_up_go_right, null, this);
        this.physics.add.collider(this.mobs_up, this.calque_mob_direction_up, mob_up_go_up, null, this);
        this.physics.add.collider(this.mobs_up, this.calque_mob_direction_down, mob_up_go_down, null, this);
        //Mob Right
        this.physics.add.collider(this.mobs_right, this.calque_mob_direction_left, mob_right_go_left, null, this);
        this.physics.add.collider(this.mobs_right, this.calque_mob_direction_right, mob_right_go_right, null, this);
        this.physics.add.collider(this.mobs_right, this.calque_mob_direction_up, mob_right_go_up, null, this);
        this.physics.add.collider(this.mobs_right, this.calque_mob_direction_down, mob_right_go_down, null, this);

    }

    update() {
        if (player_block == false) {
            //Mouvement Joueur
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

            //Attaque Joueur
            if (this.cursors.space.isDown) {
                if (this.player_facing == "up") {
                    this.attaque_sword.create(this.player.x, this.player.y - 32, "sword_y");
                }
                else if (this.player_facing == "down") {
                    this.attaque_sword.create(this.player.x, this.player.y + 32, "sword_y");
                }
                else if (this.player_facing == "right") {
                    this.attaque_sword.create(this.player.x + 32, this.player.y, "sword_x");
                }
                else if (this.player_facing == "left") {
                    this.attaque_sword.create(this.player.x - 32, this.player.y, "sword_x");
                }
                player_block = true;
                this.player.setVelocityX(0);
                this.player.setVelocityY(0);
                setTimeout(delock_attaque, 500);
            }
        }
    }

    switch_passage_1to2() {
        this.scene.start('sceneDeux', {
            posSpawnJoueurX : 912,
            posSpawnJoueurY : 752 
        });
    }
}