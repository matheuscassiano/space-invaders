
export default function createGame(){
    const state = {
        screen: {
            width: 700,
            height: 700,
        },
        player: {
            width: 50,
            height: 40,
            posX: 325,
            posY: 700 - 70,
            velocity: 10,
        },
        invaders: {
            direction: 'left',
            options: {
                size: 50,
                rows: 3,
                cols: 5,
                gapV: 20,
                gapH: 50,
                value: 0,
                velocity: 0,
            },
            list: []
        },
        sounds: {
            backgroundSound: new Audio('./src/assets/audio/background.mp3'),
            shotSound: new Audio('./src/assets/audio/shot.mp3'),
            explosionSound: new Audio('./src/assets/audio/explosion.mp3'),
        }
    }

    function addInvader() {
        for(let row = 0; row < state.invaders.options.rows; row++) {
            let invaderNumberPerRow = 0;
            for(let col = 0; col < state.invaders.options.cols; col++) {
                const random =  getRandomInt(1, 2);
                state.invaders.list.push({
                    col,
                    row,
                    sprite: random,
                    value: random * 10,
                    size: state.invaders.options.size,
                    posX: col == 0 ? state.invaders.options.gapH + (state.invaders.options.size / 2) : state.invaders.list[invaderNumberPerRow - 1].posX + state.invaders.options.size + state.invaders.options.gapH,
                    posY: (row == 0 ? state.invaders.options.gapV + state.invaders.options.size: (row + 1) * (state.invaders.options.gapV + state.invaders.options.size)) + 120,
                });
                invaderNumberPerRow++;
            }
        }
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function update(){
        // player.draw();
        // shot.draw();
        // invaders.draw();
        // document.querySelector('#score').innerHTML = status.score;
    }
    
    function sound() {
        // if(status.play){
        //     sounds.backgroundSound.play();
        //     sounds.backgroundSound.addEventListener('ended', () => {
        //         sounds.backgroundSound.play();
        //     });
        // } else {
        //     sounds.backgroundSound.pause();
        // }
    
        // if (status.mute) {
        //     sounds.shotSound.muted = true;
        //     sounds.explosionSound.muted = true;
        //     sounds.backgroundSound.muted = true;
        // } else {
        //     sounds.shotSound.muted = false;
        //     sounds.explosionSound.muted = false;
        //     sounds.backgroundSound.muted = false;
        // }
    }

    return {
        state,
        update,
        sound,
        addInvader
    }
}