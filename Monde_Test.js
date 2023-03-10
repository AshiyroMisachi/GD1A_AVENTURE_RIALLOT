player_block = false;
trigger_cleanSword = false;

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
    }

    create() {
        this.player_facing = "up";

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

        //Récupération Input
        this.cursors = this.input.keyboard.createCursorKeys();

        //Création Collision
        //Joueur
        this.physics.add.collider(this.player, this.bordure);
        this.physics.add.collider(this.player, this.calque_mob_switch_down);

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
        if (player_block == false) {


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
                player_block = true;
                this.player.setVelocityX(0);
                this.player.setVelocityY(0);
                setTimeout(this.delock_attaque, 500);
            }
        }
    }

    //Switch Boolean
    beFalse() {
        return false
    }

    beTrue() {
        return true
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
    kill_mob(mob){
        mob.disableBody(true, true)
    }

    //Clean Attaque
    clean_sword(attaque_sword) {
        attaque_sword.disableBody(true, true);
    }

    if_clean_sword() {
        if (trigger_cleanSword == true) {
            trigger_cleanSword = false;
            return true
        }
        else {
            return false
        }
    }

    //Delock Joueur
    delock_attaque() {
        player_block = false;
        trigger_cleanSword = true;
    }

}