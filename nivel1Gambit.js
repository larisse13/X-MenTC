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

var plataforma;
var jogador;
var plataformas;
var chao;
var cursores;
var sentinelas;
var carta;
var tempoCarta = 0;
var botaoCarta;
var indiceSentinela = 0;
var pontos = 0;
var pontuacao;
var pontosTexto;
var chave;
var mensagem;
var mensagem2;
var vitoria = false;

function preload() {
	jogo.load.image('fundo', 'img/fundo.png'); 
	jogo.load.image('chao', 'img/chao.png');
	jogo.load.spritesheet('gambit', 'img/gambit.png', 100, 100); 
	jogo.load.spritesheet('sentinela', 'img/sentinela.png', 100, 100);
	jogo.load.image('gameOver', 'img/gb6.png'); 
	jogo.load.image('carta', 'img/carta.png');
	jogo.load.image('chave', 'img/chave.png');
	jogo.load.image('mensagem', 'img/gameOver.png');
}


function create() {
	jogo.physics.startSystem(Phaser.Physics.ARCADE);
	criarFundo();
	plataforma = jogo.add.group();
	criarChao();
	criarJogador();
	cursores = jogo.input.keyboard.createCursorKeys();
	sentinelas = jogo.add.group();
	sentinelas.enableBody = true;
	criarSentinela();

	criarPlataformas();
	carta = jogo.add.group();
	carta.enableBody = true;
	carta.physicsBodyType = Phaser.Physics.ARCADE;
	carta.createMultiple(30, 'carta');
	carta.setAll('anchor.x', 0.5);
	carta.setAll('anchor.y', 1);
	carta.setAll('outOfBoundsKill', true);
	carta.setAll('checkWorldBounds', true);
	botaoCarta = jogo.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    pontosTexto = "PONTUAÇÃO: ";
	pontuacao = jogo.add.text(16, 16, "PONTUAÇÃO: 0", { font:"30px Impact", fill: "#FFFFFF" });
    chave = jogo.add.sprite(1220, 340, 'chave');
	jogo.physics.arcade.enable(chave);

	alert("O Fera está preso. Capture a chave para tentar ajudá-lo.");

}

function update() {
	jogo.physics.arcade.collide(jogador, plataforma); 
	jogo.physics.arcade.collide(sentinelas, plataforma); 
	perseguirJogador(); 

	jogador.body.velocity.x = 0; 

	if (cursores.left.isDown){
		jogador.body.velocity.x = -150;
		jogador.animations.play('esquerda');
   } else {
    	if (cursores.right.isDown){
    		if(vitoria == false){
				jogador.body.velocity.x = 150;
				jogador.animations.play('direita');
			}else{
				window.location = "nivel2Gambit.html";
			}
    	} else{
    		jogador.animations.stop();
    		jogador.frame = 0;
		}
    }
    if (cursores.up.isDown && jogador.body.touching.down){
        jogador.body.velocity.y = -750;
    }
    
	jogo.physics.arcade.overlap(jogador, sentinelas, colidiuSentinela);


	if(botaoCarta.isDown){
		animacaoTiro();
		atirarCarta();
	}

	jogo.physics.arcade.overlap(carta, sentinelas, atingiuInimigo);
	jogo.physics.arcade.overlap(jogador, chave, capturouChave);

}


function criarFundo(){

	jogo.add.sprite(0, 0, 'fundo');
}

function criarChao(){
	plataforma.enableBody = true;
	chao = plataforma.create(-5, 560, 'chao');
	chao.body.immovable = true;
	chao.scale.setTo(8,1);
}

function criarJogador(){
	jogador = jogo.add.sprite(80, chao.height, 'gambit');
	jogo.physics.arcade.enable(jogador);
	jogador.body.bounce.y = 0.3;
    jogador.body.gravity.y = 1500;
	jogador.body.collideWorldBounds = true;
	jogador.animations.add('direita', [0, 1, 2, 3], 10, true);
    jogador.animations.add('esquerda', [4, 5, 6, 7], 10, true);
	jogador.animations.add('atirarDireita', [10], 10, true);
	jogador.animations.add('atirarEsquerda', [13], 10, true);     
}

function criarSentinela(){
	var sentinela = sentinelas.create(600, 300, 'sentinela');
	sentinela.body.gravity.y = 1500;
	sentinela.body.collideWorldBounds = true;
	sentinela.animations.add('direita', [4, 5, 6, 7, 12, 13, 14, 15], 10, true);
    sentinela.animations.add('esquerda', [0, 1, 2, 3, 8, 9, 10, 11], 10, true);
}

function perseguirJogador(){
    var sentinela = sentinelas.children[indiceSentinela];
    sentinela.body.velocity.x = 0;
    if (sentinela.position.x < jogador.body.position.x + 50){
        sentinela.body.velocity.x += 80;
		sentinela.animations.play('direita');
	}else{
		if (sentinela.position.x > jogador.body.position.x + 50) {
			sentinela.body.velocity.x -= 80;
			sentinela.animations.play('esquerda');
		}else{

			if(sentinela.position.x == jogador.body.position.x + 50){
				sentinela.animations.stop();
				sentinela.frame = 0;
			}
		}    
    }
}

function colidiuSentinela(jogador, sentinelas) {
	jogador.kill();
	sentinelas.kill();
	jogador = jogo.add.sprite(jogador.x, jogador.y + 6, 'gameOver');
	mensagem = jogo.add.sprite(0, 0, 'mensagem');
	alert("Tecle F5 para jogar novamente.");	
}

function criarPlataformas(){
	var plat1 = plataforma.create(350, 400, 'chao');
	plat1.body.immovable = true;
	var plat2 = plataforma.create(680, 360, 'chao');
	plat2.body.immovable = true;
	var plat3 = plataforma.create(980, 300, 'chao');
	//plat3.body.immovable = true;
	var plat4 = plataforma.create(1150, 400, 'chao');
	plat4.body.immovable = true;
	var plat5 = plataforma.create(50, 150, 'chao');
	plat5.body.immovable = true;
}

function atirarCarta(){
	if(jogo.time.now > tempoCarta){
		var raios = carta.getFirstExists(false);
		if(raios){
			raios.reset(jogador.x + 120, jogador.y + 55);
			raios.body.velocity.x = 400;
			tempoCarta = jogo.time.now + 200;
		}
	}
}

function animacaoTiro(){
	var sentinela = sentinelas.children[indiceSentinela];
	if (jogador.position.x > sentinela.body.position.x){
		jogador.animations.play('atirarEsquerda');
    }else{
		if (sentinela.position.x > jogador.body.position.x) {
			jogador.animations.play('atirarDireita');
		}
	}

}

function atingiuInimigo(carta, sentinelas){
    sentinelas.kill();
	carta.kill();
	pontos = pontos + 10;
	indiceSentinela ++;	
	criarSentinela();
	pontuacao.text = pontosTexto + pontos;
}

function capturouChave(jogador, chave){
	chave.kill();
	vitoria = true;
}


























