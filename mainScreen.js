class MainScreen extends Phaser.Scene {
    constructor() {
        super("mainScreen");
    }

    preload() {
        //Bouton de lancement
        this.load.image("Button_Game", "assets/launchGame.png");

        //Sprite Perso
        this.load.spritesheet('perso', 'assets/perso.png',
            { frameWidth: 31, frameHeight: 61 });

        //Spritesheet Mob
        this.load.spritesheet('mob', 'assets/mob.png',
            { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('mob_forest', 'assets/mob_forest.png',
            { frameWidth: 57, frameHeight: 64 });

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

        //Preload Inventaire
        this.load.image("BarreInventaire", "assets/BarreInventaire.png");
        this.load.image("CadreVie", "assets/CadreVie.png");
        this.load.image("BarreVie", "assets/BarreVie.png");

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
    }

    create() {
        this.gameButton = this.add.image(0, 0, "Button_Game").setInteractive();
        this.gameButton.on("pointerdown", this.launchGame, this);
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
            health : 100,
            spawnX : 1952,
            spawnY : 2316,
        });
    }
}