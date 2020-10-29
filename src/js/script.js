const screen = document.querySelector("#space-invaders");
const context = screen.getContext("2d");

document.addEventListener('keydown', e => actions(e.key));

function draw(screen, context) {
    screen.width = 700;
    screen.height = 700;

    const background = document.createElement('img');
    background.src = `./src/assets/images/background.png`;
    context.drawImage(background, 0, 0, screen.width, screen.height);
}

function play() {
    draw(screen, context);
    update();
    sound();
    requestAnimationFrame(play);
}

function update(){
    player.draw();
    shot.draw();
    invaders.draw();
}

function sound() {

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
    velocity: 10,

    shot: function() {
        shot.insert();
    },

    draw: function() {
        const playerSprite = document.createElement('img');
        playerSprite.src = './src/assets/images/player.png';
        context.drawImage(playerSprite, this.posX, screen.height - 30 - this.height, this.width, this.height);
    }
}

const shot = {
    width: 5,
    height: 15,
    velocity: 20,
    _shots: [],

    insert: function() {
        this._shots.push({
            posX: player.posX + (player.width / 2),
            posY: screen.height - 30 - player.height,
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
    invadersRows: 4,
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
                this._invaders.push({
                    col,
                    row,
                    sprite: getRandomInt(1, 2),
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
        this._invaderBlock.posX = Math.min(...this._invaders.map(({posX}) => posX));
        this._invaderBlock.posY = Math.min(...this._invaders.map(({posY}) => posY));
        this._invaderBlock.width = Math.max(...this._invaders.map(({posX}) => posX)) - Math.min(...this._invaders.map(({posX}) => posX)) + this.size;
        this._invaderBlock.height = Math.min(...this._invaders.map(({posY}) => posY)) - Math.min(...this._invaders.map(({posY}) => posY));

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

invaders.insert();
play();
