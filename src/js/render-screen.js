export default function renderScreen(screen, game, requestAnimationFrame, currentPlayerId){
    const context = screen.getContext("2d");
    context.drawImage(background, 0, 0, screen.width, screen.height);

    const player = game.state.player;
    context.drawImage(playerSprite, player.posX, player.posY, player.width, player.height);

    for(const invaderId in game.state.invaders.list){
        const invader = game.state.invaders.list[invaderId];
        context.drawImage(invaderSprite, invader.posX, invader.posY, invader.size, invader.size);
    }

    for(const shotId in game.state.shots.list){
        const shot = game.state.shots.list[shotId];
        context.fillStyle = 'white';
        context.fillRect(shot.posX, shot.posY, shot.width, shot.height);
        shot.posY -= shot.velocity;
        game.setState(shot)
    }
}