export default function renderScreen(screen, game){
    const context = screen.getContext("2d");
    context.drawImage(background, 0, 0, screen.width, screen.height);

    const player = game.state.player;
    context.drawImage(playerSprite, player.posX, player.posY, player.width, player.height);

    for(const invaderId in game.state.invaders.list){
        const invader = game.state.invaders.list[invaderId];
        context.drawImage(invaderSprite, invader.posX, invader.posY, invader.size, invader.size);
    }

    function moveInvaders(invaders) {
        const invaderBlock = game.state.invaders.invaderBlock;
        game.setInvadersBlock()
        if (invaderBlock.posX <= 10) {
            game.state.invaders.direction = 'right';
            invaderBlock.posY += 10;
            invaders.list.forEach(invader => invader.posY += 10);
        } else if ((invaderBlock.posX + invaderBlock.width) >= game.state.screen.width - 10){
            game.state.invaders.direction = 'left';
            invaderBlock.posY += 10;
            invaders.list.forEach(invader => invader.posY += 10);
        } else if ((invaderBlock.posY + invaderBlock.height) == player.posY) {
            state.playing = false;
        }

        if (game.state.invaders.direction === 'left') {
            invaderBlock.posX -= invaders.options.velocity;
            invaders.list.forEach(invader => invader.posX -= invaders.options.velocity);

        } else if (game.state.invaders.direction === 'right') {
            invaderBlock.posX += invaders.options.velocity;
            invaders.list.forEach(invader => invader.posX += invaders.options.velocity);
        }
    }


    for(const shotId in game.state.shots.list){
        const shot = game.state.shots.list[shotId];
        shot.posY -= shot.velocity; 
        context.fillStyle = 'white';
        context.fillRect(shot.posX, shot.posY, shot.width, shot.height);
        
        // move to notfication all
        if (shot.posY <= 0){
            game.removeShot(shotId); 
        }else {
            game.checkForInvaderCollision(shotId);
            game.setState(shot);
        }
    }
    moveInvaders(game.state.invaders)
}