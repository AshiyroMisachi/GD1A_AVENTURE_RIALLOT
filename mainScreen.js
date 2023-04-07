class MainScreen extends Phaser.Scene {
    constructor() {
        super("mainScreen");
    }

    preload() {
        //Bouton de lancement
        this.load.image("Button_Game", "assets/start.png");
        this.load.image("Logo", "assets/Logo.png");
        this.load.image("TitleScreen", "assets/TitleScreen.png")

        //Sprite Perso
        this.load.spritesheet('perso', 'assets/perso.png',
            { frameWidth: 31, frameHeight: 61 });

        //Spritesheet Mob
        this.load.spritesheet('mob', 'assets/mob.png',
            { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('mob_forest', 'assets/mob_forest.png',
            { frameWidth: 57, frameHeight: 64 });
        this.load.spritesheet('boss', 'assets/Boss.png',
            { frameWidth: 64, frameHeight: 64});

        //Preload Asset Tiled
        this.load.image("Phaser_tuilesdejeu", "assets/Tiled/tileset.png");
        this.load.image("FTileset", "assets/Tiled/TilesetFinal.png");
        this.load.tilemapTiledJSON("darkForest", "assets/Tiled/DarkForest.json");
        this.load.tilemapTiledJSON("rockPlain", "assets/Tiled/RockPlain.json");
        this.load.tilemapTiledJSON("cave", "assets/Tiled/Cave.json");
        this.load.tilemapTiledJSON("waterTemple", "assets/Tiled/Temple.json");

        //Preload Attaque
        this.load.image("sword_up", "assets/attaque_joueur_up.png");
        this.load.image("sword_down", "assets/attaque_joueur_down.png");
        this.load.image("sword_left", "assets/attaque_joueur_left.png");
        this.load.image("sword_right", "assets/attaque_joueur_right.png");
        this.load.image("projBow_up", "assets/projBow_up.png");
        this.load.image("projBow_down", "assets/projBow_down.png");
        this.load.image("projBow_left", "assets/projBow_left.png");
        this.load.image("projBow_right", "assets/projBow_right.png");
        this.load.image("projBoss", "assets/projBoss.png");

        //Preload Inventaire
        this.load.image("BarreInventaire", "assets/BarreInventaire.png");
        this.load.image("MasqueVie", "assets/BarreMasqueVie.png");
        this.load.image("BarreVie", "assets/BarreVie.png");
        this.load.image("zoneText", "assets/ZoneTexte.png");

        //Preload Loot
        this.load.image("Monnaie", "assets/Monnaie.png");
        this.load.image("Statue", "assets/statue.png");
        this.load.image("Soin", "assets/Soin.png");
        this.load.image("Bow", "assets/Bow.png");
        this.load.image("Tear", "assets/Tear.png");
        this.load.image("Key", "assets/Cle.png");

        //Preload Environnement
        this.load.image("sol_forest", "assets/ground_forest.png");
        this.load.image("river_forest", "assets/river_forest.png");
        this.load.image("ForestToPlain", "assets/ForestToPlain.png");
        this.load.image("ForestToTemple", "assets/ForestToTemple.png");
        this.load.image("RockToForest", "assets/ForestToPlain.png");
        this.load.image("RockToCave", "assets/RockToCave.png");
        this.load.image("CaveToPlain", "assets/CaveToPlain.png");
        this.load.image("ForestToPlain", "assets/ForestToPlain.png");
        this.load.image("ForestToTemple", "assets/ForestToTemple.png");
        this.load.image("Rock", "assets/Rock.png");
        this.load.image("Rock_2", "assets/rock2.png");
        this.load.image("Door", "assets/Porte.png");

        //Preload Barre Vie Boss
        this.load.image("BarreVieBoss", "assets/BarreVieBoss.png");
        this.load.image("CadreVieBoss", "assets/CadreVieBoss.png");
    }

    create() {
        this.add.image(400, 225, "TitleScreen");
        this.add.image(380, 120, "Logo").setScale(0.2);
        this.gameButton = this.add.image(400, 325, "Button_Game").setInteractive().setScale(0.2);
        this.gameButton.on("pointerdown", this.launchGame, this);

        //Animation Boss
        this.anims.create({
            key: 'boss_walk',
            frames: [{ key: 'boss', frame: 0 }],
            frameRate: 20
        });

        //Animation Mob Forest
        this.anims.create({
            key: 'left_mob',
            frames: this.anims.generateFrameNumbers('mob_forest', {start:6,end:7}),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: 'up_mob',
            frames: this.anims.generateFrameNumbers('mob_forest', {start:2,end:3}),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: 'down_mob',
            frames: this.anims.generateFrameNumbers('mob_forest', {start:0,end:1}),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: 'right_mob',
            frames: this.anims.generateFrameNumbers('mob_forest', {start:4,end:5}),
            frameRate: 2,
            repeat: -1
        });
        
        //Animation Mob Base
        this.anims.create({
            key: 'left_mob_base',
            frames: [{ key: 'mob', frame: 3 }],
            frameRate: 20
        });
        this.anims.create({
            key: 'up_mob_base',
            frames: [{ key: 'mob', frame: 0 }],
            frameRate: 20
        });
        this.anims.create({
            key: 'down_mob_base',
            frames: [{ key: 'mob', frame: 2 }],
            frameRate: 20
        });
        this.anims.create({
            key: 'right_mob_base',
            frames: [{ key: 'mob', frame: 1 }],
            frameRate: 20
        });

        //Animation Joueur
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('perso', {start:12,end:15}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('perso', {start:4,end:7}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('perso', {start:0,end:3}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('perso', {start:8,end:11}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'left_stop',
            frames: [ { key: 'perso', frame: 12 } ],
            frameRate: 20
        });
        this.anims.create({
            key: 'right_stop',
            frames: [ { key: 'perso', frame: 8 } ],
            frameRate: 20
        });
        this.anims.create({
            key: 'up_stop',
            frames: [ { key: 'perso', frame: 4 } ],
            frameRate: 20
        });
        this.anims.create({
            key: 'down_stop',
            frames: [ { key: 'perso', frame: 0 } ],
            frameRate: 20
        });
    }

    update() {
    }

    launchGame(){
        console.log("Launch Game");
        this.scene.start('darkForest', {
            porteMonnaie : 0,
            statue : 0,
            unlock_Sword : false,
            unlock_Bow : false,
            unlock_Tear : false,
            unlock_Key : false,
            health : 500,
            spawnX : 1952,
            spawnY : 2316,
        });
    }
}