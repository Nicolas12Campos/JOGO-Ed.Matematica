kaboom({
  background: [1, 1, 1],
  fullscreen: true,
});
/*
    kaboom() é uma função que inicializa o jogo.
    background é a cor do fundo do jogo.
    fullscreen é para deixar o jogo em tela cheia.
*/

/* Crie uma pasta assets e coloque as imagens dentro dela */
loadSprite("playerImg", "./assets/playerImg.png");

/*
loadSprite() é uma função que carrega uma imagem para ser usada como sprite.
O primeiro parâmetro é o nome do sprite e o segundo é o caminho para a imagem.
*/

/*
scene() é uma função que define uma cena do jogo.
Ela recebe dois parâmetros: o nome da cena e uma função "() =>" que define o que acontece nessa cena.
*/
scene("main", () => {
  const Player = add([
    sprite("playerImg"), // sprite é uma função que cria um sprite com a imagem carregada."),
    area(),
    pos(width() / 2, height() - 64),
    anchor("center"),
  ]);
  /*
    const Spaceship = add() -> cria um novo objeto no jogo.
    sprite("Spaceship") -> define que o objeto é um sprite com a imagem "Spaceship".
    area() -> define que o objeto tem uma área de colisão.
    pos(width() / 2, height() - 64) -> posiciona o objeto no centro da tela, 64 pixels acima do fundo.
    width é a largura da tela total da tela
    height é a altura total da tela
    anchor("center") -> define o ponto de ancoragem do objeto como o centro.
    */
});

go("main"); // go é para ir para a cena main
