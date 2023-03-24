class Cave extends Phaser.Scene {
    constructor() {
        super("cave");
    }

    init(data) {
        this.porteMonnaie = data.porteMonnaie;
        this.unlock_Sword = data.unlock_Sword;
        this.unlock_Bow = true;
        this.unlock_Tear = data.unlock_Tear;
        this.unlock_Key = data.unlock_Key;
        this.health = data.health;
        this.spawnX = data.spawnX;
        this.spawnY = data.spawnY;
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
        this.load.tilemapTiledJSON("cave", "assets/Tiled/Cave.json");

        //Preload Attaque
        this.load.image("sword_y", "assets/attaque_joueur_y.png");
        this.load.image("sword_x", "assets/attaque_joueur_x.png");
        this.load.image("projBow", "assets/projBow.png");

        //Preload Barre de vie
        this.load.image("CadreVie", "assets/CadreVie.png");
        this.load.image("BarreVie", "assets/BarreVie.png");

        //Preload Loot
        this.load.image("Monnaie", "assets/Monnaie.png");
        this.load.image("Soin", "assets/Soin.png");
        this.load.image("Bow", "assets/Bow.png");
        this.load.image("Tear", "assets/Tear.png");
        this.load.image("Key", "assets/Cle.png");

        //Preload Environnement
        this.load.image("Rock", "assets/Rock.png");
        this.load.image("CaveToPlain", "assets/CaveToPlain.png");
    }

    create() {
        this.player_block = false;
        this.player_beHit = false;
        this.clignotement = 0;
        this.trigger_cleanSword = false;
        this.trigger_shoot = false;
        this.player_facing = "up";

        //Création Attaque
        this.attaque_sword = this.physics.add.staticGroup();
        this.proj_Bow = this.physics.add.group();

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
        this.carteCave = this.add.tilemap("cave");
        this.tileset = this.carteCave.addTilesetImage(
            "Tileset_PlaceHolder",
            "Phaser_tuilesdejeu"
        );

        //Load Calque
        //Mur
        this.bordure = this.carteCave.createLayer(
            "Bordure",
            this.tileset
        );

        this.river = this.carteCave.createLayer(
            "River",
            this.tileset
        );

        //Placement Ennemi
        this.calque_mob = this.carteCave.getObjectLayer('Ennemi');
        this.calque_mob.objects.forEach(calque_mob => {
            this.mob_create = this.physics.add.sprite(calque_mob.x + 16, calque_mob.y + 16, 'mob');
            this.mob_create.anims.play('down_mob');
            this.mob.add(this.mob_create)
        });
        this.mob.setVelocityY(100);

        //Placement Test Monnaie et Soin
        this.heal = this.physics.add.group();
        this.calque_TestHeal = this.carteCave.getObjectLayer('TestSoin');
        this.calque_TestHeal.objects.forEach(calque_TestHeal => {
            const POHeal = this.heal.create(calque_TestHeal.x + 16, calque_TestHeal.y + 16, "Soin");
        });

        this.money = this.physics.add.group();
        this.calque_TestMoney = this.carteCave.getObjectLayer('TestMoney');
        this.calque_TestMoney.objects.forEach(calque_TestMoney => {
            const POHeal = this.money.create(calque_TestMoney.x + 16, calque_TestMoney.y + 16, "Monnaie");
        });

        //Placement Environnement
        this.rock = this.physics.add.staticGroup();
        this.calque_Rock = this.carteCave.getObjectLayer('Rock');
        this.calque_Rock.objects.forEach(calque_Rock => {
            const PORock = this.rock.create(calque_Rock.x + 16, calque_Rock.y + 16, "Rock");
        });

        //Placement Changement Scene
        this.travelToPlain = this.physics.add.staticGroup();
        this.travelToPlain.create(1920, 2800, "CaveToPlain");

        //Bordure Mob
        this.calque_mob_switch_right = this.carteCave.createLayer(
            "Ennemi_Switch_Right",
            this.tileset
        );

        this.calque_mob_switch_left = this.carteCave.createLayer(
            "Ennemi_Switch_Left",
            this.tileset
        );

        this.calque_mob_switch_up = this.carteCave.createLayer(
            "Ennemi_Switch_Up",
            this.tileset
        );

        this.calque_mob_switch_down = this.carteCave.createLayer(
            "Ennemi_Switch_Down",
            this.tileset
        );

        //Placement PowerUp
        this.tear = this.physics.add.group();
        if (this.unlock_Tear == false){
            this.tear.create(576, 2848, "Tear");
        }
        else {
            this.add.image(900, 50, 'Tear').setScale(2.5).setScrollFactor(0);
        }

        if (this.unlock_Sword == false){
            this.add.image(1000, 50, 'sword_y').setScale(2.5).setScrollFactor(0);
        }

        if (this.unlock_Bow){
            this.add.image(950, 50, 'Bow').setScale(2.5).setScrollFactor(0);
        }

        if (this.unlock_Key) {
            this.add.image(850, 50, 'Key').setScale(2.5).setScrollFactor(0);
        }

        //Création Joueur
        this.player = this.physics.add.sprite(this.spawnX, this.spawnY, 'perso');
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

        //Calque Solide
        this.bordure.setCollisionByProperty({ estSolide: true });
        this.river.setCollisionByProperty({ estSolide: true });
        this.calque_mob_switch_down.setCollisionByProperty({ estSolide: true });
        this.calque_mob_switch_up.setCollisionByProperty({ estSolide: true });
        this.calque_mob_switch_left.setCollisionByProperty({ estSolide: true });
        this.calque_mob_switch_right.setCollisionByProperty({ estSolide: true });

        //Création Caméra
        this.physics.world.setBounds(0, 0, 3200, 3200);
        this.cameras.main.setBounds(0, 0, 3200, 3200);
        this.cameras.main.startFollow(this.player);

        //Création Barre de vie
        this.healthContainer = this.add.sprite(100, 40, "CadreVie").setScrollFactor(0);
        this.healthBar = this.add.sprite(this.healthContainer.x, this.healthContainer.y, "BarreVie").setScrollFactor(0);
        this.healthMask = this.add.sprite(this.healthBar.x - (100 - this.health), this.healthBar.y, "BarreVie").setScrollFactor(0);
        this.healthMask.visible = false;
        this.healthBar.mask = new Phaser.Display.Masks.BitmapMask(this, this.healthMask);

        //Création Inventaire Monnaie
        this.scoreText = this.add.text(1100, 16, "x" + this.porteMonnaie, { fontSize: '32px', fill: '#000' }).setScrollFactor(0);
        this.add.image(1080, 27, "Monnaie").setScale(3).setScrollFactor(0);

        //Récupération Input
        this.cursors = this.input.keyboard.createCursorKeys();

        //Création Collision
        //Joueur
        this.physics.add.collider(this.player, this.bordure);
        this.physics.add.collider(this.player, this.rock);
        this.physics.add.collider(this.player, this.river, null, this.checkTear, this);
        this.physics.add.overlap(this.player, this.mob, this.perteVie, this.getHit, this);

        //Pickup
        this.physics.add.overlap(this.player, this.heal, this.gainVie, null, this);
        this.physics.add.overlap(this.player, this.money, this.gainMoney, null, this);
        this.physics.add.overlap(this.player, this.tear, this.tearUnlock, null, this);

        //Changement de scene
        this.physics.add.overlap(this.player, this.travelToPlain, this.toPlain, null, this);

        //Création Collision Attaque
        this.physics.add.overlap(this.attaque_sword, this.bordure, this.clean_attaque, this.if_clean_sword, this);
        this.physics.add.collider(this.proj_Bow, this.bordure, this.clean_proj, null, this);
        this.physics.add.collider(this.proj_Bow, this.rock, this.destroyRock, null, this);

        //Ennemi
        this.physics.add.collider(this.mob, this.calque_mob_switch_down, this.mob_switch_down, null, this);
        this.physics.add.collider(this.mob, this.calque_mob_switch_up, this.mob_switch_up, null, this);
        this.physics.add.collider(this.mob, this.calque_mob_switch_left, this.mob_switch_left, null, this);
        this.physics.add.collider(this.mob, this.calque_mob_switch_right, this.mob_switch_right, null, this);
        this.physics.add.collider(this.mob, this.attaque_sword, this.kill_mob, null, this);
        this.physics.add.collider(this.mob, this.proj_Bow, this.kill_mob_bow, null, this);
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
            if (this.cursors.space.isDown && this.unlock_Sword == true) {
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
            //Bow
            if (this.cursors.shift.isDown && this.unlock_Bow == true && this.trigger_shoot == false) {
                if (this.player_facing == "up") {
                    this.proj_Bow.create(this.player.x, this.player.y, "projBow").body.setVelocityY(-200);
                }
                else if (this.player_facing == "down") {
                    this.proj_Bow.create(this.player.x, this.player.y, "projBow").body.setVelocityY(200);
                }
                else if (this.player_facing == "right") {
                    this.proj_Bow.create(this.player.x, this.player.y, "projBow").body.setVelocityX(200);
                }
                else if (this.player_facing == "left") {
                    this.proj_Bow.create(this.player.x, this.player.y, "projBow").body.setVelocityX(-200);
                }
                this.player_block = true;
                this.trigger_shoot = true;
                this.player.setVelocityX(0);
                this.player.setVelocityY(0);
                this.time.delayedCall(500, this.delock_shoot, [], this);
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
        this.lootMob(mob);
    }

    kill_mob_bow(mob, projBow) {
        mob.disableBody(true, true)
        projBow.disableBody(true, true)
        this.trigger_shoot = false;
        this.lootMob(mob);
    }

    //Loot Mob
    lootMob(mob) {
        this.loot = Math.floor(Math.random() * (4 - 1)) + 1;
        console.log(this.loot);
        if (this.loot == 1) {
            this.heal.create(mob.x, mob.y, "Soin");
        }
        else if (this.loot == 2) {
            this.money.create(mob.x, mob.y, "Monnaie");
        }
    }

    //Activation / Destruction environnement
    destroyRock(proj, rock) {
        proj.disableBody(true, true);
        rock.disableBody(true, true);
        this.trigger_shoot = false;
    }

    //Clean Attaque
    clean_attaque(attaque) {
        attaque.disableBody(true, true);
    }

    clean_proj(proj) {
        proj.disableBody(true, true);
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

    delock_shoot() {
        this.player_block = false;
        this.trigger_shoot = false;
    }

    //Delock Joueur
    delock_joueur() {
        this.player_block = false;
    }

    //Gestion Frame Imu
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
        this.time.delayedCall(100, this.pvisible, [], this);
    }

    pvisible() {
        if (this.clignotement < 3) {
            this.time.delayedCall(100, this.pinvisible, [], this);
            this.player.visible = true;
            this.clignotement += 1;
        }
        else {
            this.player.visible = true;
            this.clignotement = 0;
            this.player_beHit = false;
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
        }
    }

    gainVie(player, heal) {
        heal.disableBody(true, true);
        if (this.health < 100) {
            this.health += 10
            this.healthMask.x += 10;
        }
    }

    gainMoney(player, money) {
        money.disableBody(true, true);
        this.porteMonnaie += 1;
        this.scoreText.setText('x' + this.porteMonnaie);
    }

    //Unlock Power Up
    tearUnlock(player, tear) {
        tear.disableBody(true, true);
        this.add.image(900, 50, 'Tear').setScale(2.5).setScrollFactor(0);
        this.unlock_Tear = true;
    }

    checkTear() {
        if (this.unlock_Tear == false) {
            return true
        }
        else {
            return false
        }
    }
    //Fonction Changement de scene
    toPlain(){
        console.log("To plain");
        this.scene.start("rockPlain", {
            porteMonnaie : this.porteMonnaie,
            unlock_Sword : this.unlock_Sword,
            unlock_Bow : this.unlock_Bow,
            unlock_Tear : this.unlock_Tear,
            unlock_Key : this.unlock_Key,
            health : this.health,
            spawnX : 3135,
            spawnY : 1215
        });
    }

}