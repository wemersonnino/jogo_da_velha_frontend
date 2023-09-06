class Jogador {

    constructor(symbol) {
        this.symbol = symbol;
        this.humano = true;
    }

}

class JogadorAleatorio extends Jogador {
    constructor(symbol) {
        super(symbol);
        // this.symbol = symbol;
        this.humano = false;
    }

    jogar(tabuleiro) {
        if (!this.humano) {
            let linha, coluna;
            do {
                linha = this.#aleatoria(1, tabuleiro.length)
                coluna = this.#aleatoria(1, tabuleiro.length)
            } while (tabuleiro[linha - 1][coluna - 1] !== null);
            return new Jogada(linha, coluna);
        } else {
            return null;
        }
    }

    #aleatoria(min, max) {
        let valorAleatorio = Math.random() * (min - max) + min;
        return Math.trunc(valorAleatorio);
    }
}

class Jogada {
    constructor(linha, coluna) {
        this.linha = linha;
        this.coluna = coluna;
    }

    #valida() {
        return this.linha > 0 && this.coluna > 0
    }

    get inValida() {
        return !this.#valida
    }
}

class JogoDaVelha {

    constructor(jogador1 = new Jogador('X'), jogador2 = new Jogador('O'), tamanho = 3) {
        this.jogador1 = new Jogador('X');
        this.jogador2 = new Jogador('O');
        this.tamanho = tamanho;
        this.reiniciarTabuleiro()
    }

    #iniciarTabuleiro() {
        return Array(this.tamanho)
            .fill(0)
            .map(() => Array(this.tamanho)
                .fill(null));
    }

    jogar(jogada) {
        if (this.jogadorAtual.humano) {
            this.#processarJogada(jogada)
        }
        while (!this.#verificarVitoria(jogada) && !this.jogadorAtual.humano) {
            let jogadaMaquina = this.jogadorAtual.jogar(this.tabuleiro);
            this.#processarJogada(jogadaMaquina);
        }
    }

    #trocarJogador() {
        return this.jogadorAtual =
            this.jogadorAtual.symbol === this.jogador1.symbol ? this.jogador2 : this.jogador1;
    }

    #jogadaValida(jogada) {
        if (jogada.inValida) {
            return false
        }
        let {linha, coluna} = jogada;
        if (linha > this.tamanho || coluna > this.tamanho) {
            return false
        }
        if (this.#ocupado(jogada)) {
            return false;
        }
        return !this.vencedor;

    }

    #ocupado(jogada) {
        let {linha, coluna} = jogada;
        if (this.tabuleiro[linha - 1][coluna - 1] !== null) {
            const jogadorAnterior = this.tabuleiro[linha - 1][coluna - 1];
            console.log(`Jogada já feita pelo jogador ${jogadorAnterior}`);
            return true;
        }
        return false;
    }


    #adicionar(jogada) {
        let {linha, coluna} = jogada;
        this.tabuleiro[linha - 1][coluna - 1] = this.jogadorAtual.symbol;
        // this.#jogadaValida(jogada);
    }

    toString() {
        let matriz = this.tabuleiro
            .map(rows => rows.map(position => position ?? "-")
                .join(' ')).join('\n');
        let quemGanhou = this.vencedor ? `Vencedor: ${this.vencedor.symbol}` : '';
        console.log(quemGanhou)
        return matriz;
    }

    #campo(linha, coluna) {
        return this.tabuleiro[linha - 1][coluna - 1];
    }

    #finalizouEmpate() {
        let espacosVazions = this.tabuleiro
            .flat()
            .filter(campo => campo === null);
        if (espacosVazions.length === 0) {
            console.log('Rolou um empate')
            return true;
        }

    }

    #vitoria(jogada) {
        let {linha, coluna} = jogada;
        let {tabuleiro, jogadorAtual} = this;
        let tamanho = tabuleiro.length;
        let index = Array(tamanho)
            .fill(0)
            .map((_, i) => i + 1);
        let ganhouOfRow = index.every(i => this.#campo(linha, i) === jogadorAtual.symbol);
        let ganhouOfColum = index.every(i => this.#campo(i, coluna) === jogadorAtual.symbol);
        let ganhouOfDiag1 = index.every(i => this.#campo(i, i) === jogadorAtual.symbol);
        let ganhouOfDiag2 = index.every(i => this.#campo(i, tamanho - i + 1) === jogadorAtual.symbol);

        return ganhouOfRow || ganhouOfColum || ganhouOfDiag1 || ganhouOfDiag2;
    }

    #verificarVitoria(jogador) {
        const tamanho = this.tamanho;
        const simbolo = jogador.symbol;

        // Verificar linhas e colunas
        for (let i = 0; i < tamanho; i++) {
            let venceuLinha = true;
            let venceuColuna = true;

            for (let j = 0; j < tamanho; j++) {
                if (this.tabuleiro[i][j] !== simbolo) {
                    venceuLinha = false;
                }
                if (this.tabuleiro[j][i] !== simbolo) {
                    venceuColuna = false;
                }
            }

            if (venceuLinha || venceuColuna) {
                return true;
            }
        }

        // Verificar diagonais
        let venceuDiagonalPrincipal = true;
        let venceuDiagonalSecundaria = true;

        for (let i = 0; i < tamanho; i++) {
            if (this.tabuleiro[i][i] !== simbolo) {
                venceuDiagonalPrincipal = false;
            }
            if (this.tabuleiro[i][tamanho - i - 1] !== simbolo) {
                venceuDiagonalSecundaria = false;
            }
        }

        return venceuDiagonalPrincipal || venceuDiagonalSecundaria;


    }


    #processarJogada(jogada) {
        if (!this.#jogadaValida(jogada)) return;

        this.#adicionar(jogada);

        if (this.#verificarVitoria(this.jogadorAtual)) {
            this.vencedor = this.jogadorAtual;
            console.log(`Jogador ${this.vencedor.symbol} venceu o jogo!`);
            document.getElementById('vencedor').innerHTML = `Jogador ${this.vencedor.symbol} venceu o jogo!`;
            setTimeout(() => {
                this.reiniciarTabuleiro()
            }, 5000);// Reiniciar após 3 segundos
        } else if (this.#finalizouEmpate()) {
            this.vencedor = '-';
            console.log('O jogo terminou em empate.');
            document.getElementById('vencedor').innerHTML = `O jogo terminou em empate.`
            setTimeout(() => {
                this.reiniciarTabuleiro()
            }, 5000);// Reiniciar após 3 segundos

            return;
        }

        this.#trocarJogador();
    }

    reiniciarTabuleiro() {
        this.tabuleiro = this.#iniciarTabuleiro();
        this.vencedor = null;
        this.jogadorAtual = this.jogador1;
        console.log('Tabuleiro reiniciado.');
        console.log(this.toString()); // Exibe o tabuleiro zerado
        const posicao =document.querySelectorAll('.posicao');
        posicao.forEach(posicao =>{
            posicao.innerText = '';
        });
        document.getElementById('vencedor').innerHTML = '';
    }


}

// const jogo = new JogoDaVelha(new Jogador('X'), new JogadorAleatorio('O'))
// jogo.jogar(new Jogada(1, 1))//X
// jogo.jogar(new Jogada(1, 2))//O
// jogo.jogar(new Jogada(2, 1))//X
// jogo.jogar(new Jogada(3, 1))//O
// jogo.jogar(new Jogada(2, 2))//X
// jogo.jogar(new Jogada(3, 2))//O
// jogo.jogar(new Jogada(2, 3))//X
// jogo.jogar(new Jogada(1, 3))//O nao considera porque o X ganhou
//
// console.log(jogo.toString())

class JogoDaVelhaDOM {

    constructor(tabuleiro,infor) {
        this.tabuleiro = tabuleiro;
        this.infor = infor;
    }
    inicializar(jogo){
        this.jogo = jogo;
        this.#criarTabuleiro();
        this.#deixarTabuleiroJogavel();
    }

    #deixarTabuleiroJogavel() {
        this.posicoes = this.tabuleiro.getElementsByClassName('posicao');
        for (let i = 0; i < this.posicoes.length; i++) {
            this.posicoes[i].addEventListener('click',(ev)=>{
                const linha = Math.floor(i / 3) + 1;// Cálculo para a linha, o 3 pode ser dinamico depois
                const coluna = Math.floor(i % 3) + 1 // Cálculo para a coluna, o 3 pode ser dinamico depois

                console.log(`Linha: ${linha}, coluna: ${coluna}`);

                this.jogo.jogar(new Jogada(linha, coluna));
                console.log(this.jogo.toString())
                this.#imprimirSymbol();
            })
        }
    }

    #imprimirSymbol() {
        let {tabuleiro} = this.jogo;
        let qtdLinhas = tabuleiro.length;
        let qtdColunas = tabuleiro[0].length;
        // let posicoes = this.tabuleiro.getElementsByClassName('posicao');
        for (let i = 0; i < qtdLinhas; i++) {
            let indexInicio = i * qtdLinhas;
            for (let j = 0; j < qtdColunas; j++) {
                let indexInterface = indexInicio + j
                this.posicoes[indexInterface].innerText = tabuleiro[i][j];
            }
        }
    }

    #criarTabuleiro(){
        const tamanho = this.jogo.tamanho;
        let posicoes = [];
        for (let linha = 0; linha < tamanho; linha++) {
            const coluna = this.#criarLinhaTabuleiro(linha, tamanho);
            posicoes.push(...coluna)
        }
        this.tabuleiro.innerHTML = [...posicoes].join('');
        this.tabuleiro.style.gridTemplateColumns = `repeat(${tamanho},1fr)`;
        this.tabuleiro.style.gridTemplateRows = `repeat(${tamanho},1fr)`;
    }

    #criarLinhaTabuleiro(linha, tamanho) {
        let colunas = [];
        for (let coluna = 1; coluna <= tamanho; coluna++) {
            let classes = 'posicao';
            if (linha === 1){
                classes += " posicao-cima"
            } else if (linha === tamanho) {
                classes += " posicao-baixo "
            }
            if (coluna === 1){
                classes += " posicao-esquerda"
            } else if (coluna === tamanho){
                classes += " posicao-direita "
            }
            const elemento = `<div class="${classes}" linha=${linha} coluna=${coluna}>
                                    </div>`;
            colunas.push(elemento);
        }
        return colunas;
    }

}

(function () {
    const botaoIniciar = document.getElementById('botaoIniciar');
    const informcoes = document.getElementById('informacoes');
    const tabuleiro = document.getElementById('tabuleiro');
    const inputTamanho = document.getElementById('tamanhoTabuleiro');

    const jogo = new JogoDaVelha(new Jogador('X'), new JogadorAleatorio('O'));

    inputTamanho.addEventListener('change', () => {
        // Atualiza o atributo tamanho da class JogoDaVelha
        jogo.tamanho = Number.parseInt(inputTamanho.value);

        // Atualiza o HTML do tabuleiro
        const tabuleiro = document.getElementById('tabuleiro');
        jogoDOM.inicializar(jogo);
    });

    botaoIniciar.addEventListener('click', () => {
        jogo.reiniciarTabuleiro();
    });

    const jogoDOM = new JogoDaVelhaDOM(tabuleiro,informcoes);
    jogoDOM.inicializar(jogo)
})();