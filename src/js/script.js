import createGame from './game.js';
import renderScreen  from './render-screen.js';
import createKeyboardListener from './keyboard-listener.js'

const game = createGame();
const keyboardListener = createKeyboardListener(document);

const screen = document.querySelector("#space-invaders");

screen.width = 700;
screen.height = 700;

const status = {
    score: 0,
}

document.querySelector('#pause').addEventListener('click', pause);
document.querySelector('#mute').addEventListener('click', mute);

function pause() {
    game.state.playing = !game.state.playing
    play();
}

function mute() {
    game.state.muted = !game.state.mute;
}

function play() {
    renderScreen(screen, game);
    game.update();
    game.sound();
    if(game.state.playing){
        requestAnimationFrame(play);
    }
}

const shot = {
    insert: function() {
        sounds.shotSound.play();
    }
}

const invaders = {
    _invaderBlock: {
        posX: 0,
        posY: 0,
        width: 0,
        height: 0
    },
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

function start() {
    game.addInvader();
    keyboardListener.subscribe(game.movePlayer)
    play()
}

start();