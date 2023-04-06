class WaterTemple extends Phaser.Scene {
    constructor() {
        super("waterTemple");
    }

    init(data) {
        this.porteMonnaie = data.porteMonnaie;
        this.statue = data.statue;
        this.unlock_Sword = data.unlock_Sword;
        this.unlock_Bow = data.unlock_Bow;
        this.unlock_Tear = data.unlock_Tear;
        this.unlock_Key = data.unlock_Key;
        this.health = data.health;
        this.spawnX = data.spawnX;
        this.spawnY = data.spawnY;
    }

    preload() { }

    create() {
        this.gameWin = false;
        this.gameOver = false;
        this.boss_health = 100;
        this.controller = false;
        this.player_block = false;
        this.player_beHit = false;
        this.clignotement = 0;
        this.trigger_cleanSword = false;
        this.trigger_shoot = false;
        this.player_facing = "up";

        this.bossAlive = true;
        this.attackBoss = true;
        this.bossAttackCount = 0;
        this.bossNotAttack = true;
        this.randomAttackBoss = 0;
        this.projBoss = this.physics.add.group();

        //Création Attaque
        this.attaque_sword = this.physics.add.staticGroup();
        this.proj_Bow = this.physics.add.group();

        //Load Tiled
        this.carteTemple = this.add.tilemap("waterTemple");
        this.tileset = this.carteTemple.addTilesetImage(
            "Tileset_PlaceHolder",
            "Phaser_tuilesdejeu"
        );

        //Load Calque
        //Mur
        this.bordure = this.carteTemple.createLayer(
            "Bordure",
            this.tileset
        );

        this.river = this.carteTemple.createLayer(
            "River",
            this.tileset
        );

        //Placement Ennemi
        this.mob = this.physics.add.group();
        this.calque_mob = this.carteTemple.getObjectLayer('Ennemi');
        this.calque_mob.objects.forEach(calque_mob => {
            this.mob_create = this.physics.add.sprite(calque_mob.x + 16, calque_mob.y + 16, 'mob');
            this.mob_create.anims.play('down_mob_base');
            this.mob.add(this.mob_create)
        });
        this.mob.setVelocityY(100);

        //Placement Test Monnaie et Soin
        this.heal = this.physics.add.group();
        this.calque_TestHeal = this.carteTemple.getObjectLayer('TestSoin');
        this.calque_TestHeal.objects.forEach(calque_TestHeal => {
            const POHeal = this.heal.create(calque_TestHeal.x + 16, calque_TestHeal.y + 16, "Soin");
        });

        this.money = this.physics.add.group();
        this.calque_TestMoney = this.carteTemple.getObjectLayer('TestMoney');
        this.calque_TestMoney.objects.forEach(calque_TestMoney => {
            const POHeal = this.money.create(calque_TestMoney.x + 16, calque_TestMoney.y + 16, "Monnaie");
        });

        //Placement Environnement
        this.rock = this.physics.add.group();
        this.calque_Rock = this.carteTemple.getObjectLayer('Rock');
        this.calque_Rock.objects.forEach(calque_Rock => {
            const PORock = this.rock.create(calque_Rock.x + 16, calque_Rock.y + 16, "Rock_2").setPushable(false);
        });
        this.door = this.physics.add.group();
        if (this.statue < 12) {
            this.door.create(1424, 176, "Door").setPushable(false);
        }

        //Placement Statue
        this.statuette = this.physics.add.staticGroup();
        this.calque_Statue = this.carteTemple.getObjectLayer('Statuette');
        this.calque_Statue.objects.forEach(calque_Statue => {
            const POStatue = this.statuette.create(calque_Statue.x + 16, calque_Statue.y + 16, "Statue")
        });

        //Placement Changement Scene
        this.travelToForest = this.physics.add.staticGroup();
        this.travelToForest.create(1424, 16, "ForestToTemple");

        //Bordure Mob
        this.calque_mob_switch_right = this.carteTemple.createLayer(
            "Ennemi_Switch_Right",
            this.tileset
        );

        this.calque_mob_switch_left = this.carteTemple.createLayer(
            "Ennemi_Switch_Left",
            this.tileset
        );

        this.calque_mob_switch_up = this.carteTemple.createLayer(
            "Ennemi_Switch_Up",
            this.tileset
        );

        this.calque_mob_switch_down = this.carteTemple.createLayer(
            "Ennemi_Switch_Down",
            this.tileset
        );

        this.calque_mob_switch_down.setVisible(false);
        this.calque_mob_switch_up.setVisible(false);
        this.calque_mob_switch_right.setVisible(false);
        this.calque_mob_switch_left.setVisible(false);

        //Inventaire
        this.add.image(400, 28, "BarreInventaire").setScrollFactor(0).setScale(0.5);
        if (this.unlock_Sword) {
            this.add.image(328, 28, 'sword_up').setScrollFactor(0);
        }
        if (this.unlock_Bow) {
            this.add.image(385, 28, 'Bow').setScale(1.25).setScrollFactor(0);
        }
        if (this.unlock_Tear) {
            this.add.image(443, 28, 'Tear').setScale(2).setScrollFactor(0);
        }
        if (this.unlock_Key) {
            this.add.image(500, 28, 'Key').setScale(1.75).setScrollFactor(0);
        }

        //Création Inventaire Monnaie
        this.scoreText = this.add.text(605, 20, "x" + this.porteMonnaie, { fontSize: '32px', fill: '#000' }).setScrollFactor(0);
        this.add.image(585, 29, "Monnaie").setScale(2).setScrollFactor(0);
        this.countStatue = this.add.text(715, 20, "x" + this.statue, { fontSize: '32px', fill: '#000' }).setScrollFactor(0);
        this.add.image(700, 29, "Statue").setScale(1.4).setScrollFactor(0);

        //Création Barre de vie
        this.healthContainer = this.add.sprite(140, 28, "CadreVie").setScrollFactor(0).setVisible(false);
        this.healthBar = this.add.sprite(this.healthContainer.x, this.healthContainer.y, "BarreVie").setScrollFactor(0).setScale(0.5);
        this.healthMask = this.add.sprite(this.healthBar.x - (500 - this.health), this.healthBar.y, "MasqueVie").setScrollFactor(0).setScale(0.5);
        this.healthMask.visible = false;
        this.healthBar.mask = new Phaser.Display.Masks.BitmapMask(this, this.healthMask);

        //Création Joueur
        this.player = this.physics.add.sprite(this.spawnX, this.spawnY, 'perso').setScale(0.5);
        this.player.setCollideWorldBounds(true);

        //Création Texte Explicatif
        this.zoneText = this.add.image(400, 420, "zoneText").setScrollFactor(0);
        this.explicationText = this.add.text(80, 404, "", { fontSize: '16px', fill: '#000' }).setScrollFactor(0);
        if (this.statue < 12){
            this.explicationText.setText("The statue you collected react with the door front of you, but there power are not enought");
        }
        else {
            this.explicationText.setText("The door front of you opened by the power of the statue");
        }
        this.time.delayedCall(2000, () => { this.explicationText.setVisible(false); this.zoneText.setVisible(false) }, [], this);

        //Création Boss
        this.boss = this.physics.add.sprite(1360, 1856, 'boss').setVelocityX(100).setPushable(false);

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

        //Récupération Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.gamepad.once('connected', function (pad) {
            this.controller = pad;
        }, this);

        //Création Collision
        //Joueur
        this.physics.add.collider(this.player, this.bordure);
        this.physics.add.collider(this.player, this.rock);
        this.physics.add.collider(this.player, this.river, null, this.checkTear, this);
        this.physics.add.collider(this.player, this.door, this.opendDoor, null, this);
        this.physics.add.overlap(this.player, this.mob, this.perteVie, this.getHit, this);
        this.physics.add.overlap(this.player, this.boss, this.perteVie, this.getHit, this);
        this.physics.add.overlap(this.player, this.projBoss, this.perteVie, this.getHit, this);

        //Pickup
        this.physics.add.overlap(this.player, this.heal, this.gainVie, null, this);
        this.physics.add.overlap(this.player, this.money, this.gainMoney, null, this);
        this.physics.add.overlap(this.player, this.statuette, this.gainStatue, null, this);

        //Rocher
        this.physics.add.collider(this.rock, this.bordure);
        this.physics.add.collider(this.rock, this.rock);

        //Changement de scene
        this.physics.add.overlap(this.player, this.travelToForest, this.toForest, null, this);

        //Création Collision Attaque
        this.physics.add.overlap(this.attaque_sword, this.bordure, this.clean_attaque, this.if_clean_sword, this);
        this.physics.add.collider(this.proj_Bow, this.bordure, this.clean_proj, null, this);
        this.physics.add.collider(this.proj_Bow, this.rock, this.moveRock, null, this);

        this.physics.add.collider(this.projBoss, this.bordure, this.clean_proj, null, this);
        this.physics.add.collider(this.projBoss, this.rock, this.clean_proj, null, this);

        //Ennemi
        this.physics.add.collider(this.mob, this.calque_mob_switch_down, this.mob_switch_down, null, this);
        this.physics.add.collider(this.mob, this.calque_mob_switch_up, this.mob_switch_up, null, this);
        this.physics.add.collider(this.mob, this.calque_mob_switch_left, this.mob_switch_left, null, this);
        this.physics.add.collider(this.mob, this.calque_mob_switch_right, this.mob_switch_right, null, this);
        this.physics.add.collider(this.boss, this.calque_mob_switch_left, this.boss_switch_left, null, this);
        this.physics.add.collider(this.boss, this.calque_mob_switch_right, this.boss_switch_right, null, this);
        this.physics.add.collider(this.mob, this.attaque_sword, this.kill_mob, null, this);
        this.physics.add.collider(this.mob, this.proj_Bow, this.kill_mob_bow, null, this);
        this.physics.add.collider(this.boss, this.proj_Bow, this.perteVie_Boss_proj, null, this);
    }

    update() {
        if (this.gameOver){ return }
        if (this.gameWin){ return }

        if (this.player_block == false) {
            //Mouvement
            if (this.cursors.up.isDown || this.controller.up) {
                this.player.setVelocityY(-200);
                this.player.setVelocityX(0);
                this.player.anims.play('up', true);
                this.player_facing = "up";
            }
            else if (this.cursors.down.isDown || this.controller.down) {
                this.player.setVelocityY(200);
                this.player.setVelocityX(0);
                this.player.anims.play('down', true);
                this.player_facing = "down";
            }
            else if (this.cursors.right.isDown || this.controller.right) {
                this.player.setVelocityX(200);
                this.player.setVelocityY(0);
                this.player.anims.play('right', true);
                this.player_facing = "right";
            }
            else if (this.cursors.left.isDown || this.controller.left) {
                this.player.setVelocityX(-200);
                this.player.setVelocityY(0);
                this.player.anims.play('left', true);
                this.player_facing = "left";
            }
            else {
                if (this.player_facing == "left") {
                    this.player.anims.play('left_stop');
                }
                else if (this.player_facing == "right") {
                    this.player.anims.play('right_stop');
                }
                else if (this.player_facing == "up") {
                    this.player.anims.play('up_stop');
                }
                else if (this.player_facing == "down") {
                    this.player.anims.play('down_stop');
                }
                this.player.setVelocityY(0);
                this.player.setVelocityX(0);
            }
            //Attaque
            if (this.cursors.space.isDown && this.unlock_Sword || this.controller.A && this.unlock_Sword) {
                if (this.player_facing == "up") {
                    this.attaque_sword.create(this.player.x, this.player.y - 32, "sword_up");
                }
                else if (this.player_facing == "down") {
                    this.attaque_sword.create(this.player.x, this.player.y + 32, "sword_down");
                }
                else if (this.player_facing == "right") {
                    this.attaque_sword.create(this.player.x + 32, this.player.y, "sword_right");
                }
                else if (this.player_facing == "left") {
                    this.attaque_sword.create(this.player.x - 32, this.player.y, "sword_left");
                }
                this.player_block = true;
                this.player.setVelocityX(0);
                this.player.setVelocityY(0);
                this.time.delayedCall(500, this.delock_attaque, [], this);
            }
            //Bow
            if (this.cursors.shift.isDown && this.unlock_Bow && this.trigger_shoot == false || this.controller.B && this.unlock_Bow && this.trigger_shoot == false) {
                if (this.player_facing == "up") {
                    this.proj_Bow.create(this.player.x, this.player.y, "projBow_up").body.setVelocityY(-200);
                }
                else if (this.player_facing == "down") {
                    this.proj_Bow.create(this.player.x, this.player.y, "projBow_down").body.setVelocityY(200);
                }
                else if (this.player_facing == "right") {
                    this.proj_Bow.create(this.player.x, this.player.y, "projBow_right").body.setVelocityX(200);
                }
                else if (this.player_facing == "left") {
                    this.proj_Bow.create(this.player.x, this.player.y, "projBow_left").body.setVelocityX(-200);
                }
                this.player_block = true;
                this.trigger_shoot = true;
                this.player.setVelocityX(0);
                this.player.setVelocityY(0);
                this.time.delayedCall(1000, this.delock_shoot, [], this);
            }

            //Attaque Boss
            if (this.bossAlive) {
                if (this.attackBoss) {
                    if (this.bossNotAttack) {
                        this.randomAttackBoss = Math.floor(Math.random() * (4 - 1)) + 1;
                        this.bossAttackCount = 0;
                        this.bossNotAttack = false;
                        console.log(this.randomAttackBoss);
                    }
                    else {
                        if (this.randomAttackBoss == 1) {
                            //3 coup rapide
                            if (this.bossAttackCount < 3) {
                                this.bossAttackCount += 1;
                                this.attackBoss = false;
                                this.projBoss.create(this.boss.x, this.boss.y, "projBoss").body.setVelocityY(-100);
                                if (this.bossAttackCount == 3) {
                                    this.time.delayedCall(1500, () => {this.attackBoss = true; this.bossNotAttack = true}, [], this);
                                }
                                else {
                                    this.time.delayedCall(300, () => {this.attackBoss = true}, [], this);
                                }
                            }
                            else {
                                this.bossNotAttack = true;
                            }
                        }
                        else if (this.randomAttackBoss == 2) {
                            //2 coup tres rapide
                            if (this.bossAttackCount < 2) {
                                this.bossAttackCount += 1;
                                this.attackBoss = false;
                                this.projBoss.create(this.boss.x, this.boss.y, "projBoss").body.setVelocityY(-150);
                                if (this.bossAttackCount == 2) {
                                    this.time.delayedCall(1500, () => {this.attackBoss = true; this.bossNotAttack = true}, [], this);
                                }
                                else {
                                    this.time.delayedCall(300, () => {this.attackBoss = true}, [], this);
                                }
                            }
                            else {
                                this.bossNotAttack = true;
                            }
                        }
                        else if (this.randomAttackBoss == 3) {
                            //4 coup lent
                            if (this.bossAttackCount < 4) {
                                this.bossAttackCount += 1;
                                this.attackBoss = false;
                                this.projBoss.create(this.boss.x, this.boss.y, "projBoss").body.setVelocityY(-30);
                                if (this.bossAttackCount == 4) {
                                    this.time.delayedCall(1500, () => {this.attackBoss = true; this.bossNotAttack = true}, [], this);
                                }
                                else {
                                    this.time.delayedCall(300, () => {this.attackBoss = true}, [], this);
                                }
                            }
                            else {
                                this.bossNotAttack = true;
                            }
                        }
                    }
                }
            }
        }
    }

    //Gestion Pattern Mob
    mob_switch_right(mob) {
        mob.setVelocityX(100);
        mob.setVelocityY(0);
        mob.anims.play('right_mob_base')
    }

    mob_switch_left(mob) {
        mob.setVelocityX(-100);
        mob.setVelocityY(0);
        mob.anims.play('left_mob_base')
    }

    mob_switch_up(mob) {
        mob.setVelocityX(0);
        mob.setVelocityY(-100);
        mob.anims.play('up_mob_base')
    }

    mob_switch_down(mob) {
        mob.setVelocityX(0);
        mob.setVelocityY(100);
        mob.anims.play('down_mob_base')
    }

    boss_switch_right(mob) {
        mob.setVelocityX(100);
    }

    boss_switch_left(mob) {
        mob.setVelocityX(-100);
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

    perteVie_Boss_proj(boss, proj) {
        proj.destroy();
        this.boss_health -= 10;
        if (this.boss_health <= 0) {
            this.zoneText.setVisible(true);
            this.explicationText.setVisible(true);
            this.explicationText.setText("You defeat the monster. With " + this.statue + " statue and you collected " + this.porteMonnaie + " eggs !");
            this.physics.pause();
            boss.destroy();
            this.bossAlive = false;
            this.gameWin = true;
        }
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
    moveRock(proj, rock) {
        if (proj.body.touching.up) {
            rock.setVelocityY(-60);
        }
        else if (proj.body.touching.down) {
            rock.setVelocityY(60);
        }
        else if (proj.body.touching.right) {
            rock.setVelocityX(60);
        }
        else if (proj.body.touching.left) {
            rock.setVelocityX(-60);
        }
        this.time.delayedCall(1000, (rock) => {
            rock.body.setVelocity(0);
        }, [rock], this)
        proj.disableBody(true, true);
    }

    //Clean Attaque
    clean_attaque(attaque) {
        attaque.destroy();
    }

    clean_proj(proj) {
        proj.destroy();
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
        this.healthMask.x -= 25;
        this.health -= 25;
        if (this.health < 0) {
            this.explicationText.setVisible(true);
            this.explicationText.setText("You died.");
            this.gameOver = true;
            player.setTint(0xff0000);
            this.physics.pause();
        }
        else {
            this.time.delayedCall(200, this.delock_joueur, [], this);
        }
    }

    gainVie(player, heal) {
        heal.disableBody(true, true);
        if (this.health < 500) {
            this.health += 25;
            this.healthMask.x += 25;
        }
    }

    gainMoney(player, money) {
        money.disableBody(true, true);
        this.porteMonnaie += 1;
        this.scoreText.setText('x' + this.porteMonnaie);
    }

    gainStatue(player, statuette) {
        statuette.disableBody(true, true);
        this.statue += 1;
        this.countStatue.setText('x' + this.statue);
    }

    //Unlock Power Up
    checkTear() {
        if (this.unlock_Tear == false) {
            return true
        }
        else {
            return false
        }
    }

    //Fonction Changement de scene
    toForest() {
        console.log("To Forest");
        this.scene.start("darkForest", {
            porteMonnaie: this.porteMonnaie,
            statue: this.statue,
            unlock_Sword: this.unlock_Sword,
            unlock_Bow: this.unlock_Bow,
            unlock_Tear: this.unlock_Tear,
            unlock_Key: this.unlock_Key,
            health: this.health,
            spawnX: 1967,
            spawnY: 3116
        });
    }

}