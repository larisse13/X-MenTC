                            /*    +--------------------------------------------------------------------------+
                                    +          UNIVERSIDADE FEDERAL DO RIO GRANDE DO NORTE - UFRN              +
                                    +              COMPONENTE CURRICULAR: Lógica de Programação                +
                                    +              BACHARELADO EM CIÊNCIAS E TECNOLOGIA - BCT                  + 
                                    +--------------------------------------------------------------------------+                                          
                                    +  COMPONENTES: Jéssica Daiana de Lima Campelo - TURMA: 04B                +
                                    +               Larisse Évelyn Bispo de Carvalho - TURMA: 04A              +
                                    +--------------------------------------------------------------------------+ 
                                    + Link para a playlist no YouTube com os vídeos do projeto:                + 
                                    + https://www.youtube.com/playlist?list=PLQEFDvMPr2WY4SN48hv6LC3KRNSUzXE0k +
                                    +--------------------------------------------------------------------------+  */


var jogo = new Phaser.Game(1350, 640, Phaser.AUTO, '', { 
	preload: preload, 
	create: create, 
	update: update 
});

var fundo;
var chao;
var plataforma;
var jogador;
var cursores;
var botaoLaser;
var laser;
var pontos = 0;
var pontuacao;
var pontosTexto;
var tempoLaser = 0;
var indiceSentinela = 0;
var indiceSentinela2 = 0;
var mensagem;
var mensagem2;
var contLaser = 0;
var frameTiro;
var ticket;
var contTicket = 0;
var prisioneiro;
var botaoChave;

function preload() {
	jogo.load.image('fundo', 'img/fundo2.png');
    jogo.load.image('chao', 'img/plat.PNG');
    jogo.load.spritesheet('ciclope', 'img/sciclope.png', 100, 100);
    jogo.load.image('laser', 'img/laser.png');
    jogo.load.spritesheet('sentinela', 'img/sentinela.png', 100, 100);
    jogo.load.image('fera', 'img/prisioneiro.png');
    jogo.load.image('mensagem', 'img/gameOver.png');
	jogo.load.image('mensagem2', 'img/vitoria.png');
	jogo.load.image('gameOver', 'img/cp6.png'); 
	jogo.load.image('fera1', 'img/fera.png');
	jogo.load.image('ticket', 'img/ticket.png');
}

function create() {
	jogo.physics.startSystem(Phaser.Physics.ARCADE);
	criarFundo();
	plataforma = jogo.add.group();
    criarChao(); 
    criarPlataformas();
	criarJogador();
	criarPrisioneiro();
	cursores = jogo.input.keyboard.createCursorKeys();

	laser = jogo.add.group();
	laser.enableBody = true;
	laser.physicsBodyType = Phaser.Physics.ARCADE;
	laser.createMultiple(30, 'laser');
	laser.setAll('anchor.x', 0.5);
	laser.setAll('anchor.y', 1); 
	laser.setAll('outOfBoundsKill', true);
	laser.setAll('checkWorldBounds', true);
	botaoLaser = jogo.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	sentinelas = jogo.add.group();
	sentinelas.enableBody = true;
	sentinelas2 = jogo.add.group();
	sentinelas2.enableBody = true;
	criarSentinela();

	criarTicket();

	pontosTexto = "PONTUAÇÃO: ";
	pontuacao = jogo.add.text(1130, 16, "PONTUAÇÃO: 0", { font:"30px Impact", fill: "#FFFFFF" });

	alert("Chegue a 50 pontos para liberar a plataforma e salvar o Fera. Você só pode efetuar 10 disparos.");

}

function update() {
	jogo.physics.arcade.collide(jogador, plataforma);
	jogo.physics.arcade.collide(sentinelas, plataforma); 
	jogo.physics.arcade.collide(sentinelas2, plataforma); 
	perseguirJogador();

    jogador.body.velocity.x = 0;

    if (cursores.left.isDown){
		jogador.body.velocity.x = -150;
		jogador.animations.play('esquerda');
		frameTiro = 13;
   } else {
    	if (cursores.right.isDown){
       		jogador.body.velocity.x = 150;
       		jogador.animations.play('direita');
       		frameTiro = 12;
    	} else{
    		jogador.frame = 0;
    	}
    } 
	if (cursores.up.isDown && jogador.body.touching.down){
		jogador.body.velocity.y = -750;
	}

	if(botaoLaser.isDown){
		jogador.frame = frameTiro;
		atirarLaser();
	}

	jogo.physics.arcade.overlap(jogador, sentinelas, colidiuSentinela);
	jogo.physics.arcade.overlap(laser, sentinelas, atingiuInimigo);
	jogo.physics.arcade.overlap(jogador, ticket, capturouTicket);
	jogo.physics.arcade.overlap(jogador, prisioneiro, libertarFera);
}

function libertarFera(jogador, prisioneiro){
	prisioneiro.kill();
	prisioneiro = jogo.add.sprite(200, 50, 'fera1');
	mensagem2 = jogo.add.sprite(0, 0, 'mensagem2');
}


function criarFundo(){
	jogo.add.sprite(0, 0, 'fundo');
}
	
function criarPrisioneiro(){
	prisioneiro = jogo.add.sprite(180, 0, 'fera');
	jogo.physics.arcade.enable(prisioneiro);
}

function criarChao(){
	plataforma.enableBody = true;
	chao = plataforma.create(-60, 555, 'chao');
    chao.body.immovable = true;
	chao.scale.setTo(8,1);
}

function criarPlataformas(){
	var plat1 = plataforma.create(350, 400, 'chao');
	plat1.body.immovable = true;
	var plat2 = plataforma.create(680, 360, 'chao');
	plat2.body.immovable = true;
	var plat4 = plataforma.create(1150, 400, 'chao');
	plat4.body.immovable = true;
	var plat5 = plataforma.create(180, 150, 'chao');
	plat5.body.immovable = true;
	var plat6 = plataforma.create(280, 150, 'chao');
	plat6.body.immovable = true;
	var plat7 = plataforma.create(780, 230, 'chao');
	plat7.body.immovable = true;


}

function criarPlataformaComplementar(){
	var complementar2 = plataforma.create(500, 230, 'chao');
	complementar2.body.immovable = true;

}

function criarJogador(){
	jogador = jogo.add.sprite(80, chao.height , 'ciclope');
	jogo.physics.arcade.enable(jogador);
	jogador.body.bounce.y = 0.3;
    jogador.body.gravity.y = 1500;
	jogador.body.collideWorldBounds = true;
	jogador.animations.add('direita', [0, 1, 2, 3, 4, 5], 10, true);
    jogador.animations.add('esquerda', [6, 7, 8, 9, 10], 10, true);
	jogador.animations.add('atirarDireita', [12], 10, true);
	jogador.animations.add('atirarEsquerda', [13], 10, true);
}

function atirarLaser(){
	if(contLaser < 10){
		if(jogo.time.now > tempoLaser){
		var raios = laser.getFirstExists(false);
			if(raios){
				if(frameTiro == 12){
					raios.reset(jogador.x + 86, jogador.y + 28);
					raios.body.velocity.x = 400;
				}else{
					if(frameTiro == 13){
						raios.reset(jogador.x + 26, jogador.y + 28);
						raios.body.velocity.x = -400;
					}
				}
				
				tempoLaser = jogo.time.now + 200;
				contLaser++;
			}
		}
	}
}

function criarSentinela(){
	if(indiceSentinela  < 5){
		var sentinela = sentinelas.create(1100, chao.height, 'sentinela');
		sentinela.body.gravity.y = 1500;
		sentinela.body.collideWorldBounds = true;
		sentinela.animations.add('direita', [4, 5, 6, 7, 12, 13, 14, 15], 10, true);
        sentinela.animations.add('esquerda', [0, 1, 2, 3, 8, 9, 10, 11], 10, true);	
	}
	if(jogador.body.position.x >= 100){	
		var sentinela2 = sentinelas.create(10, chao.height, 'sentinela');
		sentinela2.body.gravity.y = 1500;
		sentinela2.body.collideWorldBounds = true;
		sentinela2.animations.add('direita', [4, 5, 6, 7, 12, 13, 14, 15], 10, true);
        sentinela2.animations.add('esquerda', [0, 1, 2, 3, 8, 9, 10, 11], 10, true);	

	}

}

function perseguirJogador(){
    var sentinela = sentinelas.children[indiceSentinela];
    sentinela.body.velocity.x = 0;
    if (sentinela.position.x < jogador.body.position.x){
        sentinela.body.velocity.x += 200;
		sentinela.animations.play('direita');
    }else{
		if (sentinela.position.x > jogador.body.position.x) {
			sentinela.body.velocity.x -= 200;
			sentinela.animations.play('esquerda');
		}else{

			if(sentinela.position.x == jogador.body.position.x){
				sentinela.animations.stop();
				sentinela.frame = 0;
			}
		}    
    }
}

function colidiuSentinela(jogador, sentinelas) {
	jogador.kill();
	sentinelas.kill();
	jogador = jogo.add.sprite(jogador.x, jogador.y + 34, 'gameOver');

	mensagem = jogo.add.sprite(0, 0, 'mensagem');	

}

function atingiuInimigo(laser, sentinelas){
	sentinelas.kill();
	laser.kill();
	pontos = pontos + 10;
	indiceSentinela ++;	
	criarSentinela();
	pontuacao.text = pontosTexto + pontos;
}

function criarTicket () {
	if(contTicket==0){
		ticket= jogo.add.sprite(1210, 345, 'ticket');
		jogo.physics.arcade.enable(ticket);
	
	}else{
		if(contTicket==1){
			ticket= jogo.add.sprite(850, 180, 'ticket');
			jogo.physics.arcade.enable(ticket);
		}else{
			if(contTicket==2){
					criarPlataformaComplementar();
			}
		}
	}	
}


function capturouTicket(jogador, ticket){
	if(contTicket < 1){
		ticket.kill();
		contTicket++;
		criarTicket();
	}else{
		if(contTicket == 1){
			if(pontos >= 50){
				ticket.kill();
				contTicket++;
				criarTicket();
			}
		}
		
	}
	
}
