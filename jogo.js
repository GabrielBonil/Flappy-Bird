let frames = 0;
const sprites = new Image();
sprites.src = './sprites.png';

const somHit = new Audio();
somHit.src = './efeitos/hit.wav';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

const planoDeFundo = {
    sx: 390, sy: 0,
    sWidth: 275, sHeight: 204,
    dx: 0, dy: canvas.height - 204,
    desenha(){
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0,0, canvas.width, canvas.height);

        contexto.drawImage(
            sprites,
            this.sx, this.sy, 
            this.sWidth, this.sHeight, 
            this.dx, this.dy,
            this.sWidth, this.sHeight,
        );
        contexto.drawImage(
            sprites,
            this.sx, this.sy, 
            this.sWidth, this.sHeight, 
            (this.dx + this.sWidth), this.dy,
            this.sWidth, this.sHeight,
        );
    }
}

function criaChao(){
    const chao = {
        sx: 0, sy: 610,
        sWidth: 224, sHeight: 112,
        dx: 0, dy: canvas.height - 112,
        atualiza(){
            const movimentoChao =  1;
            const repeteEm = chao.sWidth / 2;
            const movimentacao = chao.dx - movimentoChao;

            chao.dx = movimentacao % repeteEm;
        },
        desenha(){
            contexto.drawImage(
                sprites,
                this.sx, this.sy, 
                this.sWidth, this.sHeight, 
                this.dx, this.dy,
                this.sWidth, this.sHeight,
            );
            contexto.drawImage(
                sprites,
                this.sx, this.sy, 
                this.sWidth, this.sHeight, 
                (this.dx + this.sWidth), this.dy,
                this.sWidth, this.sHeight,
            );
        }
    }
    return chao;
}

function fazColisao(flappyBird, chao){
    const flappyBirdY = flappyBird.dy + flappyBird.sHeight;
    const chaoY = chao.dy;

    if (flappyBirdY >= chaoY){
        return true;
    } 

    return false;
}

function criaFlappyBird(){
    const flappyBird = {
        sx: 0, sy: 0,
        sWidth: 33, sHeight: 24,
        dx: 10, dy: 50,
        gravidade: 0.25,
        velocidade: 0,
        pulo: 4.6,
        frameAtual: 0,
        atualizaFrameAtual(){
            const intervaloFrames = 10;
            const passouIntervalo = (frames % intervaloFrames == 0);
            if(passouIntervalo){
                const baseIncremento = 1;
                const incremento = baseIncremento + this.frameAtual;
                const baseRepeticao = this.movimentos.length;
                this.frameAtual = incremento % baseRepeticao;
            }
        },
        pula(){
            this.velocidade = - this.pulo;
        },
        atualiza(){
            if (fazColisao(flappyBird, globais.chao)){
                somHit.play();
                
                mudaParaTela(Telas.final);
                return;
            }
            this.velocidade += this.gravidade;
            flappyBird.dy += this.velocidade;
        },
        movimentos:[
            { sx: 0, sy: 0, },  //Asa para cima
            { sx: 0, sy: 26, }, //Asa pro meio
            { sx: 0, sy: 52, }, //Asa para baixo
            { sx: 0, sy: 26, }, //Asa pro meio
        ],
        desenha(){
            this.atualizaFrameAtual();
            const { sx, sy } = this.movimentos[this.frameAtual];
            
            contexto.drawImage(
                sprites,
                sx, sy, 
                this.sWidth, this.sHeight, 
                this.dx, this.dy,
                this.sWidth, this.sHeight,
            );
        }  
    }

    return flappyBird;
}

const mensagemGetReady = {
    sx: 134, sy: 0,
    sWidth: 174, sHeight: 152,
    dx: (canvas.width / 2) - 174/2, dy: 50,
    desenha(){
        contexto.drawImage(
            sprites,
            this.sx, this.sy, 
            this.sWidth, this.sHeight, 
            this.dx, this.dy,
            this.sWidth, this.sHeight,
        );
    }   
}

const mensagemGameOver = {
    sx: 134, sy: 153,
    sWidth: 226, sHeight: 200,
    dx: (canvas.width / 2) - 226/2, dy: 50,
    desenha(){
        contexto.drawImage(
            sprites,
            this.sx, this.sy, 
            this.sWidth, this.sHeight, 
            this.dx, this.dy,
            this.sWidth, this.sHeight,
        );
    }   
}

function criaCanos(){
    const canos = {
        sWidth: 52, sHeight: 400,
        chao: {
            sx: 0,
            sy: 169,
        },
        ceu: {
            sx: 52,
            sy: 169,
        },
        espaco: 80,
        desenha(){
            canos.pares.forEach(function(par) {
                const yRandom = par.y;
                const espacoCanos = 90;
    
                const canoCeuX = par.x;
                const canoCeuY = yRandom;
                
                contexto.drawImage(
                    sprites,
                    canos.ceu.sx, canos.ceu.sy, 
                    canos.sWidth, canos.sHeight, 
                    canoCeuX, canoCeuY,
                    canos.sWidth, canos.sHeight,
                );
    
                const canoChaoX = par.x;
                const canoChaoY = canos.sHeight + espacoCanos + yRandom;
                contexto.drawImage(
                    sprites,
                    canos.chao.sx, canos.chao.sy, 
                    canos.sWidth, canos.sHeight, 
                    canoChaoX, canoChaoY,
                    canos.sWidth, canos.sHeight,
                );

                par.canoCeu = {
                    x: canoCeuX,
                    y: canos.sHeight + canoCeuY
                }
                par.canoChao = {
                    x: canoChaoX,
                    y: canoChaoY
                }
            })
        },
        colidePassaro(par){
            const cabecaFlappy = globais.flappyBird.dy;
            const peFlappy = globais.flappyBird.dy + globais.flappyBird.sHeight;
            
            if (globais.flappyBird.dx + globais.flappyBird.sWidth -5 >= par.x){
                if(cabecaFlappy <= par.canoCeu.y){
                    return true;
                }

                if(peFlappy >= par.canoChao.y){
                    return true;
                }
            }
            return false;
        },
        pares: [],
        atualiza(){
            const passou100 = (frames % 100 === 0);
            if(passou100){
                this.pares.push({
                    x: canvas.width, 
                    y: -150 * (Math.random() + 1),
                });
            };

            canos.pares.forEach(function(par){
                par.x -= 2;

                if (canos.colidePassaro(par)){
                    somHit.play();
                    mudaParaTela(Telas.final);
                }

                if(par.x + canos.sWidth <= 0) {
                    canos.pares.shift();
                }
            })
        },
    }
    return canos;
}

function criaPlacar(){
    const placar = {
        pontuacao: 0,
        desenha(){
            contexto.font = '35px VT323'
            contexto.textAlign = 'right'
            contexto.fillStyle = 'white';
            contexto.fillText(`${this.pontuacao}`, canvas.width -10, 35)
        },
        atualiza(){
            const intervaloFrames = 20;
            const passouIntervalo = (frames % intervaloFrames == 0);

            if (passouIntervalo){
                this.pontuacao += 1;
            }
        },
    }
    return placar;
 }

const globais = {};
let telaAtiva = {};

function mudaParaTela(novaTela){
    telaAtiva = novaTela;

    if (telaAtiva.inicializa){
        telaAtiva.inicializa();
    }
}

const Telas = {
    inicio: {
        inicializa(){
            globais.flappyBird = criaFlappyBird();
            globais.chao = criaChao();
            globais.canos = criaCanos();
        },
        desenha(){
            planoDeFundo.desenha();
            globais.flappyBird.desenha();
            globais.chao.desenha();
            mensagemGetReady.desenha();
        },
        click(){
            mudaParaTela(Telas.jogo);
        },
        atualiza(){
            globais.chao.atualiza();
        }
    }
};

Telas.jogo = {
    inicializa(){
        globais.placar = criaPlacar();
    },
    desenha(){
        planoDeFundo.desenha();
        globais.canos.desenha();
        globais.chao.desenha();
        globais.flappyBird.desenha();
        globais.placar.desenha();
    }, 
    click(){
        globais.flappyBird.pula();
    },
    atualiza(){
        globais.canos.atualiza();
        globais.chao.atualiza();
        globais.flappyBird.atualiza();
        globais.placar.atualiza();
    },
};

function loop(){   
    
    telaAtiva.desenha();
    telaAtiva.atualiza();
    
    frames += 1;
    requestAnimationFrame(loop);
};

Telas.final = {
    desenha(){
        mensagemGameOver.desenha();
    },
    atualiza(){},
    click(){
        mudaParaTela(Telas.inicio);
    },
}

window.addEventListener('click', function(){
    if (telaAtiva.click){
        telaAtiva.click();
    }
});

mudaParaTela(Telas.inicio);
loop();