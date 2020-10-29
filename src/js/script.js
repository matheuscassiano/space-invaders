const screen = document.querySelector("#space-invaders");
const context = screen.getContext("2d");

const status = {
    play: false,
    score: 0,
    mute: false,
}

const sounds = {
    backgoundSound: new Audio('./src/assets/audio/background.mp3')
}

document.addEventListener('keydown', e => actions(e.key));
document.querySelector('#pause').addEventListener('click', pause);
document.querySelector('#mute').addEventListener('click', mute);

function pause() {
    status.play = !status.play
    play();
}

function mute() {
    status.mute = !status.mute;
}

function draw(screen, context) {
    screen.width = 700;
    screen.height = 700;
    context.drawImage(background, 0, 0, screen.width, screen.height);
}

function play() {
    draw(screen, context);
    update();
    sound();
    if(status.play){
        requestAnimationFrame(play);
    }
}

function update(){
    player.draw();
    shot.draw();
    invaders.draw();
    document.querySelector('#score').innerHTML = status.score;
}

function sound() {
    if(status.play){
        sounds.backgoundSound.play();
        sounds.backgoundSound.addEventListener('ended', () => {
            sounds.backgoundSound.play();
        });
    } else {
        sounds.backgoundSound.pause();
    }

    if (status.mute) {
        sounds.backgoundSound.muted = true;
    } else {
        sounds.backgoundSound.muted = false;
    }
}

function actions(key) {
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
            status.play = false;
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
function start() {
    invaders.insert();
    play()
}

start();