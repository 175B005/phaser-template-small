// インスタンス変数、関数の定義
MyGame.Game = function (game) {//最初の場所確保
    // Star
    this.stars = null;//starのグループにした
//dudeのグループ
    this.dude = null;
    //bombのグループ
    this.bombs = null;
    // カーソルオブジェクト
    this.cursors = null;
    // スペースキーの取得
    this.spaceKey = null;
    // 文字の移動速度
    this.speed = 200;

};

// タイトル処理
MyGame.Game.prototype = {
    // ゲームの作成
    create: function() {
        // 物理エンジンを起動
        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.stars = this.add.group();
        this.bombs = this.add.group();
        //残りstar
        this.starCount = 0;
        //数える
        this.stars.starCount = 0;
//物理挙動
        this.stars.enableBody = true;
        this.bombs.enableBody = true;
        // 作成
        for(let i = 0;i<10;i++){
            let star = this.stars.create(this.rnd.integerInRange(80,560), this.rnd.integerInRange(80,280), 'star');
        //挿入↓
        this.starCount++;

                star.inputEnabled =true;//入力を受ける
                star.body.velocity.x = this.rnd.realInRange(-200,200);
                star.body.velocity.y = this.rnd.realInRange(-200,200);
                star.body.collideWorldBounds = true;
                star.body.bounce.x = 1;
                star.body.bounce.y = 1;
        }
        this.dude = this.add.sprite(10, 10, 'dude');
        this.frame = 4;
        this.dude.animations.add('Left',[0,1,2,3],10,true);
        this.dude.animations.add('Right',[5,6,7,8],10,true);

    //キャラのポインタの位置
        this.dude.anchor = new Phaser.Point(0.5,1);

    //arcade（種類がたくさんある）シンプルで早い
        this.physics.arcade.enable(this.dude);

    //物理エンジンを有効にするとbodyというプロパテが使えるようになる
    //velocity=速度（秒速ピクセルで指定）
        this.dude.body.collideWorldBounds = true;
        this.dude.body.bounce.x = 1;
        this.dude.body.bounce.y = 1;


    /*   second1を移植したのでいらない

     this.star = this.add.sprite(this.world.width/2, this.world.height/2, "star");
        this.star.anchor.setTo(0.5);
        // Arcade物理エンジンを設定
        this.physics.enable(this.star);*/

        // カーソルキーの作成
        this.cursors = this.input.keyboard.createCursorKeys();
        // スペースキーの作成
        this.spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        // スコアを初期化
        MyGame.gameParams.score = 0;
    },
    pickStar: function pickStar(dude,star){
        //titleから持ってきた。↓スコアを１００加算
        MyGame.gameParams.AddScore(100);
    star.kill();

this.starCount--;

if(this.starCount<=0){

    this.physics.arcade.isPaused = true;
    this.state.start("Clear",false);
}
},

    // 更新処理
    update: function() {
        // 移動
        this.physics.arcade.overlap(this.dude,this.stars,this.pickStar,null,this);

        let newvel = new Phaser.Point(0,0);
        // 上
        if (this.cursors.up.isDown) {
            newvel.y = -1;
        }
        // 下
        if (this.cursors.down.isDown) {
            newvel.y = 1;
        }
        // 左
        if (this.cursors.left.isDown) {
            newvel.x = -1;
        }
        // 右
        if (this.cursors.right.isDown) {
            newvel.x = 1;
        }
        // 速度設定
        if (!newvel.isZero()) {
            // 速度が設定されていたら、速度をthis.speedに設定する
            newvel.setMagnitude(this.speed);
        }
        this.dude.body.velocity = newvel;

        // スペースキーをチェック
        //this.stars.tint = 0xffffff;
        /*条件を変更↓スペースから変えた。
        if (this.spaceKey.justDown) {
            // スペースが押された瞬間だったら赤くする
        //this.stars.tint = 0xff0000;
        }
        else if (this.spaceKey.isDown) {
            // スペースが押しっぱなしの間、青にする
            //this.stars.tint = 0x0000ff;
        }*/

        // Oキーでゲームオーバー
        if (this.input.keyboard.isDown(Phaser.KeyCode.O)) {
            this.state.start("GameOver", false);
        }

        // Cキーでクリア
        if (this.input.keyboard.isDown(Phaser.KeyCode.C)) {
            this.state.start("Clear", false);//通常の呼び出しはシーンがすべて消える。
            //, falseは前のシーンの描画を残す。→機能はシーンで切り替わっている
        }

        // Aキーで点数加算
        if (this.input.keyboard.isDown(Phaser.KeyCode.A)) {
            MyGame.gameParams.AddScore(100);
        }
    },

    // 描画
    render: function() {

    },

    // 終了処理
    shutdown: function() {

    }

}
