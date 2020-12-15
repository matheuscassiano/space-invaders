const screen = document.querySelector("#space-invaders");
const context = screen.getContext("2d");

const status = {
    play: true,
    score: 0,
    mute: false,
    screen: 'start',
    frames: 0,
}

const sounds = {
    backgroundSound: new Audio('./src/assets/audio/background.mp3'),
    shotSound: new Audio('./src/assets/audio/shot.mp3'),
    explosionSound: new Audio('./src/assets/audio/explosion.mp3'),
}
document.addEventListener('keydown', e => actions(e.key));

function buttons() {
    const pauseButton = document.querySelector('#pause');
    const reloadButton = document.querySelector('#reload');
    const muteButton = document.querySelector('#mute');

    function play() {
        status.screen = 'play';
        pauseButton.removeEventListener('click', play);
    }

    switch (status.screen) {
        case 'start':
            pauseButton.addEventListener('click', play);
            reloadButton.addEventListener('click', () => document.location.reload());
            break;
    
        case 'play':
            pauseButton.addEventListener('click', pause);
            muteButton.addEventListener('click', mute);
            reloadButton.addEventListener('click', () => document.location.reload());
            break;
    
        case 'game-over':
            pauseButton.addEventListener('click', () => document.location.reload());
            reloadButton.addEventListener('click', () => document.location.reload());
            break;
    }
}


function pause() {
    status.play = !status.play
    play();
}

function mute() {
    status.mute = !status.mute;
}

function blink() {
    if (status.frames <= 20) {
        text.color = 'white';
    } else if (status.frames > 20 && status.frames < 40) {
        text.color = 'transparent';
    } else if (status.frames >= 40) {
        status.frames = 0
    }
}

function draw(screen, context) {
    screen.width = 700;
    screen.height = 700;
    context.drawImage(background, 0, 0, screen.width, screen.height);
    let messageText = 'Start';
    let characters = messageText.length;

    context.fillStyle = text.color;
    switch (status.screen) {
        case 'start':
            context.font = `${text.size}px "${text.font}"`;
            context.fillText(messageText, (screen.width / 2) - (characters * text.size / 2), (screen.height / 2) - (text.size / 2));
            break;

        case 'play':
            player.draw();
            shot.draw();
            invaders.draw();
            break;

        case 'game-over':
            messageText = 'Game Over';
            characters = messageText.length;

            context.font = `${text.size}px "${text.font}"`;
            context.fillText(messageText, (screen.width / 2) - (characters * text.size / 2), (screen.height / 2) - (text.size / 2));
            break;
    }
}

function play() {
    update();
    sound();
    if(status.play){
        requestAnimationFrame(play);
    }
}

function update(){
    buttons();
    draw(screen, context);
    document.querySelector('#score').innerHTML = status.score;
    status.frames++;
    blink()
}

function sound() {
    if(status.play && status.screen === 'play'){
        sounds.backgroundSound.play();
        sounds.backgroundSound.addEventListener('ended', () => {
            sounds.backgroundSound.play();
        });
    } else {
        sounds.backgroundSound.pause();
    }

    if (status.mute) {
        sounds.shotSound.muted = true;
        sounds.explosionSound.muted = true;
        sounds.backgroundSound.muted = true;
    } else {
        sounds.shotSound.muted = false;
        sounds.explosionSound.muted = false;
        sounds.backgroundSound.muted = false;
    }
}

function actions(key) {
    console.log(key)
    switch(key) {
        case 'ArrowLeft':
            if (player.posX > 20) {
                player.posX -= player.velocity;
            }
            break;
        case 'ArrowRight':
            if (player.posX < screen.width - 20 - player.width) {
                player.posX += player.velocity;
            }
            break;
        case ' ':
            player.shot();
            break;
    }
}

const text = {
    size: 30,
    font: "Arcade",
    color: 'white',
}

const player = {
    width: 50,
    height: 40,
    posX: screen.width + 25,
    posY: 0,
    velocity: 10,

    shot: function() {
        if(status.play){
            shot.insert();
        }
    },

    draw: function() {
        this.posY = screen.height - 30 - this.height;
        const playerSprite = document.createElement('img');
        playerSprite.src = './src/assets/images/player.png';
        context.drawImage(playerSprite, this.posX, this.posY, this.width, this.height);
    }
}

const shot = {
    width: 1,
    height: 15,
    velocity: 20,
    _shots: [],

    insert: function() {
        this._shots.push({
            posX: player.posX + (player.width / 2),
            posY: player.posY,
        });
        sounds.shotSound.play();
    },

    draw: function() {
        this._shots.forEach(shot => {
            context.fillStyle = "white";
            context.fillRect(shot.posX, shot.posY, this.width, this.height);
            shot.posY -= this.velocity;

            if (shot.posY <= 10) {
                this._shots.splice(shot, 1);
            }

            invaders._invaders.forEach(invader => {
                let invaderBottom = invader.posY + invader.size;
                let invaderRight = invader.posX + invader.size;
                if (invaderBottom > shot.posY && invader.posY < shot.posY &&
                    invaderRight > shot.posX && invader.posX < shot.posX) {
                    status.score += invader.value;
                    sounds.explosionSound.play();
                    this._shots.splice(shot, 1);

                    let key = invaders._invaders.indexOf(invader);
                    invaders._invaders.splice(key, 1);
                }
            });
        });
    }
}

const invaders = {
    size: 40,
    invadersRows: 5,
    invadersCols: 8,
    gapV: 20,
    gapH: screen.width / 8,
    direction: 'left',
    _invaderBlock: {
        posX: 0,
        posY: 0,
        width: 0,
        height: 0
    },
    value: 0,
    velocity: 0,
    velocitys: [
        5.5,
        5,
        4.5,
        4.2,
        4,
        3.5,
        3,
        2.5,
        2,
        1.5,
        1,
    ],
    _invaders: [],

    insert: function() {
        for(let row = 0; row < this.invadersRows; row++) {
            let invaderNumberPerRow = 0;
            for(let col = 0; col < this.invadersCols; col++) {
                const random =  getRandomInt(1, 2);
                this._invaders.push({
                    col,
                    row,
                    sprite: random,
                    value: random * 10,
                    size: this.size,
                    posX: col == 0 ? this.gapH + (this.size / 2) : this._invaders[invaderNumberPerRow - 1].posX + this.size + this.gapH,
                    posY: (row == 0 ? this.gapV + this.size: (row + 1) * (this.gapV + this.size)) + 120,
                });
                invaderNumberPerRow++;
            }
        }
    },
    
    draw: function() {
        let invaderNumber = 0;
        this._invaders.forEach(invader => {
            const invaderSprite = document.createElement('img');
            invaderSprite.src = `./src/assets/images/sprite0${invader.sprite}.png`;
            context.drawImage(invaderSprite, invader.posX, invader.posY, this.size, this.size);
            invaderNumber++;
        });
        if (this._invaders.length <= 0) {
            invaders.insert();
        }
        this._invaderBlock.posX = Math.min(...this._invaders.map(({posX}) => posX));
        this._invaderBlock.posY = Math.min(...this._invaders.map(({posY}) => posY));
        this._invaderBlock.width = Math.max(...this._invaders.map(({posX}) => posX)) - Math.min(...this._invaders.map(({posX}) => posX)) + this.size;
        this._invaderBlock.height = Math.max(...this._invaders.map(({posY}) => posY)) - Math.min(...this._invaders.map(({posY}) => posY)) + this.size;

        if(invaderNumber % this.invadersRows == 0) {
            this.velocity = this.velocitys[invaderNumber / this.invadersRows];
        }

        if (this._invaderBlock.posX <= 10) {
            this.direction = 'right';
            this._invaderBlock.posY += 10;
            this._invaders.forEach(invader => invader.posY += 10);
        } else if ((this._invaderBlock.posX + this._invaderBlock.width) >= screen.width - 10){
            this.direction = 'left';
            this._invaderBlock.posY += 10;
            this._invaders.forEach(invader => invader.posY += 10);
        } else if ((this._invaderBlock.posY + this._invaderBlock.height) == player.posY) {
            status.screen = 'game-over';
        }

        if (this.direction === 'left') {
            this._invaderBlock.posX -= this.velocity;
            this._invaders.forEach(invader => invader.posX -= this.velocity);

        } else if (this.direction === 'right') {
            this._invaderBlock.posX += this.velocity;
            this._invaders.forEach(invader => invader.posX += this.velocity);
        }
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

(function start() {
    invaders.insert();
    play()
})();