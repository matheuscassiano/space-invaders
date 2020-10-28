const screen = document.querySelector("#space-invaders");
const context = screen.getContext("2d");

document.addEventListener('keydown', e => actions(e.key));

function draw(screen, context) {
    screen.width = 700;
    screen.height = 700;

    context.fillStyle = "#1641c4";
    context.fillRect(0, 0, screen.width, screen.height);

    // Player
    player.draw();
    shot.draw();

    
}

function play() {
    update();
    draw(screen, context);
    sound();
    requestAnimationFrame(play)
}

function update(){
}

function sound() {

}

function actions(key) {
    switch(key) {
        case 'ArrowLeft':
            player.posX -= player.velocity;
            break;
        case 'ArrowRight':
            player.posX += player.velocity;
            break;
        case ' ':
            player.shot();
            break;
    }
}

const player = {
    width: 50,
    height: 30,
    posX: 20,
    velocity: 10,

    shot: function() {
        shot.insert();
    },

    draw: function() {
        context.fillStyle = "white";
        context.fillRect(this.posX, (screen.height - 30 - this.height), this.width, this.height);
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
        })
    }
}

play();
