kaboom({
    background: [2, 5, 30], // background é a cor do fundo do jogo
    fullscreen: true, // fullscreen é para deixar o jogo em tela cheia
})

// Crie uma pasta assets e coloque as imagens dentro dela
loadSprite("player", "./assets/player.png")
loadSprite("playerTwo", "./assets/playerTwo.png")
loadSprite("enemyBoss", "./assets/enemy1.png")
// loadSprite("bullet", "./assets/bullet.png")



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
        sprite("player"),
        area(),
        pos(width() / 2, height() - 64),
        anchor("center"),
    ]);


    // const PlayerTwo = add([
    //     sprite("playerTwo"),
    //     area(),
    //     pos(width() / 1.5, height() - 64),
    //     anchor("center"),
    // ]);

    /*
    const Spaceship = add() -> cria um novo objeto no jogo.
    sprite("Spaceship") -> define que o objeto é um sprite com a imagem "Spaceship".
    area() -> define que o objeto tem uma área de colisão.
    pos(width() / 2, height() - 64) -> posiciona o objeto no centro da tela, 64 pixels acima do fundo.
    width é a largura da tela total da tela
    height é a altura total da tela
    anchor("center") -> define o ponto de ancoragem do objeto como o centro.
    */

    // Movimentação do player /---------------------
    let speed = 500; // velocidade do jogador
    let BULLET_SPEED = 1500; // velocidade da bala
    var BULLET_enemySPEED = 1000; // velocidade da bala do inimigo
    

    onKeyDown("left", () => {
        Player.move(-speed, 0);
    });
    onKeyDown("right", () => {
        Player.move(speed, 0); 
    });
    onKeyDown("down", () => {
        Player.move(0, speed); 
    });
    onKeyDown("up", () => {
        Player.move(0, -speed);
    });


    // let speed2 = 300; // velocidade do jogador 2
    // onKeyDown("a", () => {
    //     PlayerTwo.move(-speed2, 0); 
    // });
    // onKeyDown("d", () => {
    //     PlayerTwo.move(speed2, 0);
    // });
    // onKeyDown("s", () => {
    //     PlayerTwo.move(0, speed2); 
    // });
    // onKeyDown("w", () => {
    //     PlayerTwo.move(0, -speed2); 
    // });

    // sistema de game over (por enquanto é só "press esc" p/ testar) --------------------------------------------
    onKeyPress("escape", () => {
        go("stop"); // vai para a cena gameover quando a tecla esc é pressionada
    });

    function spawnBullet(p) {
		add([
			rect(12, 48),
			area(),
			pos(p),
			anchor("center"),
			color(255,255,255),
			outline(4),
			move(UP, BULLET_SPEED),
			offscreen({ destroy: true }),
			// strings here means a tag
			"bullet",
		])
	}

    onKeyDown("space", () => {
		spawnBullet(Player.pos.sub(16, 0))
		spawnBullet(Player.pos.add(5, 50))
        spawnBullet(Player.pos.add(24, 0))
		
	})

    function spawnEnemyBullet(p) {
        add([
            rect(20, 45),
            area(),
            pos(p),
            anchor("center"),
            color(8, 15, 255),
            outline(4),
            move(DOWN, BULLET_enemySPEED),
            offscreen({ destroy: true }),
            "enemy_bullet",
        ])
    }

    // function enemyBulletSpawner() {
    //     spawnEnemyBullet(enemyBoss.pos.add(-16, 50))
    //     spawnEnemyBullet(enemyBoss.pos.add(16, 50))
    //     wait(0.5, enemyBulletSpawner)
    // }
    // enemyBulletSpawner()

    loop(0.5, () => {
        spawnEnemyBullet(enemyBoss.pos.add(-16, 50))
        spawnEnemyBullet(enemyBoss.pos.add(16, 50))
    })

    // onKeyPress("e", () => {
    //     spawnBullet(PlayerTwo.pos.sub(16, 0))
    //     spawnBullet(PlayerTwo.pos.add(16, 0))
    // })

    Player.onCollide("enemy", (bullet) => {
		destroy(bullet)
		destroy(Player)
		shake(120)

        wait(1, () => {
            go('stop');
        })
	})




Player.onCollide("enemy_bullet", (bullet) => {
    destroy(bullet)
    destroy(Player)
    shake(120)
    wait(1, () => {
        go('stop');
    })
})
    

    var ENEMY_SPEED = 500; // velocidade do inimigo
    const BOSS_HEALTH = 1000; // vida do boss

    const enemyBoss = add([
        sprite("enemyBoss"),
        area(),
        scale(2),
        pos(width() / 2, height() - 870),
        health(BOSS_HEALTH),
        anchor("center"),
        "enemy",
        {
            dir: 1, // direção do inimigo
        }
    ]);

    if (enemyBoss.hp() <= 700) {
        BULLET_enemySPEED = 2500; // aumenta a velocidade da bala do inimigo quando o boss está com menos de 500 de vida  
        ENEMY_SPEED = 700; // aumenta a velocidade do inimigo quando o boss está com menos de 500 de vida      
    }

    

    enemyBoss.onUpdate((p) => {
		enemyBoss.move(ENEMY_SPEED * enemyBoss.dir, 0)
		if (enemyBoss.dir === 1 && enemyBoss.pos.x >= width() - 20) {
			enemyBoss.dir = -1
		}
		if (enemyBoss.dir === -1 && enemyBoss.pos.x <= 20) {
			enemyBoss.dir = 1
		}
	})

    enemyBoss.onHurt(() => {
		Healthbar.set(enemyBoss.hp())
	})

    onCollide("bullet", "enemy", (b, e) => {
		destroy(b)
        e.hurt(5)
        shake(10)
		// addExplode(b.pos, 1, 24, 1)
	})

	enemyBoss.onDeath(() => {
		go("fase2");
	})

	const Healthbar = add([
		rect(width(), 24),
		pos(0, 0),
		color(107, 201, 108),
		fixed(),
		{
			max: BOSS_HEALTH,
			set(hp) {
				this.width = width() * hp / this.max
				this.flash = true
			},
		},
	])

	Healthbar.onUpdate(() => {
		if (Healthbar.flash) {
			Healthbar.color = rgb(255, 255, 255)
			Healthbar.flash = false
		} else {
			Healthbar.color = rgb(127, 255, 127)
		}
	})

    // scene("gameOver", () => {
    //     add([
    //         text("Game Over", 32),
    //         pos(width() / 2, height() / 2),
    //         anchor("center"),
    //     ]);
    //     add([
    //         text("Pressione 'Enter' para reiniciar", 16),
    //         pos(width() / 2, height() - 32),
    //         anchor("center"),
    //     ]);
    //     onKeyPress("enter", () => {
    //         go("main"); // Reinicia o jogo quando a tecla enter é pressionada
    //     });



    onKeyPress("l", () =>{
        go("fase2")
    })
    

})



scene("stop", () => {
    add([
        text("Jogar", 32),
        pos(width() / 2, height() / 2),
        anchor("center"),
    ]);
    add([
        text("Pressione Enter para Iniciar", 16),
        pos(width() / 2, height() / 2 + 40),
        anchor("center"),
    ]);
    onKeyPress("escape", () => {
        go("main"); // reinicia a cena main
    });
    onKeyPress("enter", () => {
        go("main"); // reinicia a cena main
    });
});



scene("win", () => {
    add([
        text("Você venceu!", 32),
        pos(width() / 2, height() / 2 - 40),
        anchor("center"),
    ]);
    onKeyPress("enter", () => {
        go("main"); // Reinicia o jogo quando a tecla enter é pressionada
    });
});

scene("lose", () => {
    add([
        text("Você perdeu!", 32),
        pos(width() / 2, height() / 2 - 40),
        anchor("center"),
    ]);
    onKeyPress("enter", () => {
        go("main"); // Reinicia o jogo quando a tecla enter é pressionada
    });
});



scene("fase2", ()=>{

// Use state() component to handle basic AI

kaboom({
    background: [2, 5, 30], // background é a cor do fundo do jogo
    fullscreen: true, // fullscreen é para deixar o jogo em tela cheia
})

// Load assets
loadSprite("bean", "./assets/player.png")
loadSprite("ghosty", "./assets/alien.png")

const SPEED = 320
const ENEMY_SPEED = 160
const BULLET_SPEED = 800

// Add player game object
const player = add([
	sprite("bean"),
	pos(80, 80),
	area(),
	anchor("center"),
])

const enemy = add([
	sprite("ghosty"),
	pos(width() - 80, height() - 80),
	anchor("center"),
	// This enemy cycle between 3 states, and start from "idle" state
	state("move", [ "idle", "attack", "move" ]),
])

// Run the callback once every time we enter "idle" state.
// Here we stay "idle" for 0.5 second, then enter "attack" state.
enemy.onStateEnter("idle", async () => {
	await wait(0.5)
	enemy.enterState("attack")
})

// When we enter "attack" state, we fire a bullet, and enter "move" state after 1 sec
enemy.onStateEnter("attack", async () => {

	// Don't do anything if player doesn't exist anymore
	if (player.exists()) {

		const dir = player.pos.sub(enemy.pos).unit()

		add([
			pos(enemy.pos),
			move(dir, BULLET_SPEED),
			rect(12, 12),
			area(),
			offscreen({ destroy: true }),
			anchor("center"),
			color(BLUE),
			"bullet",
		])

	}

	await wait(1)
	enemy.enterState("move")

})

enemy.onStateEnter("move", async () => {
	await wait(2)
	enemy.enterState("idle")
})

// Like .onUpdate() which runs every frame, but only runs when the current state is "move"
// Here we move towards the player every frame if the current state is "move"
enemy.onStateUpdate("move", () => {
	if (!player.exists()) return
	const dir = player.pos.sub(enemy.pos).unit()
	enemy.move(dir.scale(ENEMY_SPEED))
})

// Taking a bullet makes us disappear
player.onCollide("bullet", (bullet) => {
	destroy(bullet)
	destroy(player)
	addKaboom(bullet.pos)
    go('stop');
})

// Register input handlers & movement
onKeyDown("left", () => {
	player.move(-SPEED, 0)
})

onKeyDown("right", () => {
	player.move(SPEED, 0)
})

onKeyDown("up", () => {
	player.move(0, -SPEED)
})

onKeyDown("down", () => {
	player.move(0, SPEED)
})


});



// });
    // sistema de AI


     /*
    onKeyDown() é uma função que define o que acontece quando uma tecla é pressionada.
    O primeiro parâmetro é o nome da tecla e o segundo é uma função que define o que acontece quando a tecla é pressionada.
    up -> tecla para cima
    down -> tecla para baixo
    left -> tecla para esquerda 
    right -> tecla para direita
    enter -> tecla enter
    space -> tecla espaço
    */


go('main'); // go é para ir para a cena main

