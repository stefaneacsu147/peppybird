// Create our 'main' state that will contain the game
var mainState = {
    preload: function () {
        game.load.image('bird', 'assets/bird_three.png');
        game.load.image('pipe', 'assets/pipe.png');
        game.load.audio('jump', 'assets/jump.wav');
    },

    create: function () {
        game.stage.backgroundColor = '#A6E3E9';
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.bird = game.add.sprite(100, 245, 'bird');
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000;

        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        this.pipes = game.add.group();
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

        // Add scoring
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", {
            font: "30px Arial",
            fill: "#ffffff"
        });

        // Move the anchor
        this.bird.anchor.setTo(-0.2, 0.5);

        //Add sound
        this.jumpSound = game.add.audio('jump');

    },

    addOnePipe: function (x, y) {
        var pipe = game.add.sprite(x, y, 'pipe');
        this.pipes.add(pipe);
        game.physics.arcade.enable(pipe);
        pipe.body.velocity.x = -200;

        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: function () {
        var hole = Math.floor(Math.random() * 5) + 1;

        for (var i = 0; i < 12; i++)
            if (i != hole && i != hole + 1)
                this.addOnePipe(400, i * 60 + 10);

        this.score += 1;
        this.labelScore.text = this.score;

        //Flight animations
        if (this.bird.angle < 20)
            this.bird.angle += 1;
    },

    update: function () {
        if (this.bird.y < 0 || this.bird.y > 590)
            this.restartGame();

        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);
    },

    hitPipe: function () {
        if (this.bird.alive == false)
            return;

        this.bird.alive = false;
        game.time.events.remove(this.timer);

        this.pipes.forEach(function (p) {
            p.body.velocity.x = 0;
        }, this);
    },

    jump: function () {
        if (this.bird.alive == false)
            return;
        this.bird.body.velocity.y = -350;
        this.jumpSound.play();

        var animation = game.add.tween(this.bird);
        animation.to({
            angle: -20
        }, 50);
        animation.start();

    },

    restartGame: function () {
        game.state.start('main');
    }
};


// Initialize Phaser
var game = new Phaser.Game(800, 600);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState);

// Start the state to actually start the game
game.state.start('main');