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

        //Spritesheet Mob
        this.load.spritesheet('mob', 'assets/mob.png',
            { frameWidth: 32, frameHeight: 32 });

        //Preload Asset Tiled
        this.load.image("Phaser_tuilesdejeu", "assets/Tiled/tileset.png");
        this.load.tilemapTiledJSON("carte", "assets/Tiled/mondeTest.json");

        //Preload Attaque
        this.load.image("sword_y", "assets/attaque_joueur_y.png");
        this.load.image("sword_x", "assets/attaque_joueur_x.png");

        //Preload Barre de vie
        this.load.image("CadreVie", "assets/CadreVie.png");
        this.load.image("BarreVie", "assets/BarreVie.png");
    }

    create() {
        this.player_block = false;
        this.player_beHit = false;
        this.trigger_cleanSword = false;
        this.clignotement = 0;

        this.player_facing = "up";
        this.health = 99;

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
        //Création Attaque
        this.attaque_sword = this.physics.add.staticGroup();

        //Création Mbob
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

        //Load Tiled
        this.carteDuNiveau = this.add.tilemap("carte");
        this.tileset = this.carteDuNiveau.addTilesetImage(
            "Tileset_PlaceHolder",
            "Phaser_tuilesdejeu"
        );

        //Load Calque
        //Mur
        this.bordure = this.carteDuNiveau.createLayer(
            "Bordure",
            this.tileset
        );

        //Placement Ennemi
        this.calque_mob = this.carteDuNiveau.getObjectLayer('Ennemi');
        this.calque_mob.objects.forEach(calque_mob => {
            this.mob_create = this.physics.add.sprite(calque_mob.x + 16, calque_mob.y + 16, 'mob');
            this.mob_create.anims.play('down_mob');
            this.mob.add(this.mob_create)
        });
        this.mob.setVelocityY(100);

        //Bordure Mob
        this.calque_mob_switch_right = this.carteDuNiveau.createLayer(
            "Ennemi_Switch_Right",
            this.tileset
        );

        this.calque_mob_switch_left = this.carteDuNiveau.createLayer(
            "Ennemi_Switch_Left",
            this.tileset
        );

        this.calque_mob_switch_up = this.carteDuNiveau.createLayer(
            "Ennemi_Switch_Up",
            this.tileset
        );

        this.calque_mob_switch_down = this.carteDuNiveau.createLayer(
            "Ennemi_Switch_Down",
            this.tileset
        );

        //Calque Solide
        this.bordure.setCollisionByProperty({ estSolide: true });
        this.calque_mob_switch_down.setCollisionByProperty({ estSolide: true });
        this.calque_mob_switch_up.setCollisionByProperty({ estSolide: true });
        this.calque_mob_switch_left.setCollisionByProperty({ estSolide: true });
        this.calque_mob_switch_right.setCollisionByProperty({ estSolide: true });


        //Création Caméra
        this.physics.world.setBounds(0, 0, 3200, 3200);
        this.cameras.main.setBounds(0, 0, 3200, 3200);
        this.cameras.main.startFollow(this.player);

        //Création Barre de vie
        let healthContainer = this.add.sprite(100, 40, "CadreVie").setScrollFactor(0);
        let healthBar = this.add.sprite(healthContainer.x, healthContainer.y, "BarreVie").setScrollFactor(0);
        this.healthMask = this.add.sprite(healthBar.x, healthBar.y, "BarreVie").setScrollFactor(0);
        this.healthMask.visible = false;
        healthBar.mask = new Phaser.Display.Masks.BitmapMask(this, this.healthMask);

        //Récupération Input
        this.cursors = this.input.keyboard.createCursorKeys();

        //Création Collision
        //Joueur
        this.physics.add.collider(this.player, this.bordure);
        this.physics.add.overlap(this.player, this.mob, this.perteVie, this.getHit, this);

        //Création Collision Attaque
        this.physics.add.overlap(this.attaque_sword, this.bordure, this.clean_sword, this.if_clean_sword, this);

        //Ennemi
        this.physics.add.collider(this.mob, this.calque_mob_switch_down, this.mob_switch_down, null, this);
        this.physics.add.collider(this.mob, this.calque_mob_switch_up, this.mob_switch_up, null, this);
        this.physics.add.collider(this.mob, this.calque_mob_switch_left, this.mob_switch_left, null, this);
        this.physics.add.collider(this.mob, this.calque_mob_switch_right, this.mob_switch_right, null, this);
        this.physics.add.collider(this.mob, this.attaque_sword, this.kill_mob, null, this);
    }

    update() {
        if (this.player_block == false) {
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
            //Attaque
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
                this.player_block = true;
                this.player.setVelocityX(0);
                this.player.setVelocityY(0);
                this.time.delayedCall(500, this.delock_attaque, [], this);
            }
        }
    }

    //Gestion Pattern Mob
    mob_switch_right(mob) {
        mob.setVelocityX(100);
        mob.setVelocityY(0);
        mob.anims.play('right_mob')
    }

    mob_switch_left(mob) {
        mob.setVelocityX(-100);
        mob.setVelocityY(0);
        mob.anims.play('left_mob')
    }

    mob_switch_up(mob) {
        mob.setVelocityX(0);
        mob.setVelocityY(-100);
        mob.anims.play('up_mob')
    }

    mob_switch_down(mob) {
        mob.setVelocityX(0);
        mob.setVelocityY(100);
        mob.anims.play('down_mob')
    }

    //Kill Mob
    kill_mob(mob) {
        mob.disableBody(true, true)
    }

    //Clean Attaque
    clean_sword(attaque_sword) {
        attaque_sword.disableBody(true, true);
    }

    if_clean_sword() {
        if (this.trigger_cleanSword == true) {
            this.trigger_cleanSword = false;
            return true
        }
        else {
            return false
        }
    }

    //Delock pour l'attaque
    delock_attaque() {
        this.player_block = false;
        this.trigger_cleanSword = true;
    }

    //Delock Joueur
    delock_joueur() {
        this.player_block = false;
    }

    //Gestion Frame Imu
    able_hit() {
        this.player_beHit = false;
    }

    getHit() {
        if (this.player_beHit == false) {
            return true
        }
        else {
            return false
        }
    }

    pinvisible() {
        this.player.setVisible(false);
        this.time.delayedCall(50, this.pvisible, [], this);
    }

    pvisible() {
        if (this.clignotement < 3) {
            this.time.delayedCall(50, this.pinvisible, [], this);
            this.player.visible = true;
            this.clignotement += 1;
        }
        else {
            this.player.visible = true;
            this.clignotement = 0;
            this.able_hit();
        }
    }

    //Gestion Vie
    perteVie(player, mob) {
        this.player_block = true;
        this.player_beHit = true;
        if (mob.body.touching.left) {
            player.setVelocityX(-400);
        }
        else if (mob.body.touching.right) {
            player.setVelocityX(400);
        }
        else if (mob.body.touching.up) {
            player.setVelocityY(-400);
        }
        else if (mob.body.touching.down) {
            player.setVelocityY(400);
        }
        this.pinvisible();
        this.healthMask.x -= 10;
        this.health -= 10;
        if (this.health < 0) {
            this.player_block = true;
            player.setTint(0xff0000);
            this.physics.pause();
        }
        else {
            this.time.delayedCall(200, this.delock_joueur, [], this);
            this.time.delayedCall(200, this.able_hit, [], this);
        }
    }
}
