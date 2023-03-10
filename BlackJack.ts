import { Jogador } from "./Player";
import { Hand } from "./Hand";

import readLineSync = require("readline-sync");
import { Deck } from "./Deck";

let deck: Deck;
let players: Array<Jogador> = [];
let maoDealer: Hand;

function blackJack() {
  console.log("BlackJack");
  let nOfDecks: number;
  while (true) {
    nOfDecks = readLineSync.questionInt(
      "Quantos baralhos você quer usar (4-8)\n> ",
      { limitMessage: "Por favor, use apenas valores inteiros" }
    );
    if (nOfDecks <= 3 || nOfDecks > 8)
      console.log("O numero de baralhos deve estar entre 4 e 8\n");
    else break;
  }

  deck = new Deck(nOfDecks);
  maoDealer = new Hand(deck);

  jogoInicia();
  while (true) {
    // TODO console.log("Jogo inicia")
    console.log(`A primeira carta do dealer é ${maoDealer.cartas[0]}`);

    players.forEach(turnoJogador);

    turnoDealer();
    fimJogo();
    if (!proximaPartida()) break;
  }
  // rl.close();
}

function jogoInicia() {
  const numeroJogadores: number = perguntarQtdJogadores();
  atributosJogador(numeroJogadores);
}

function perguntarQtdJogadores(): number {
  let numeroJogadores: number;
  while (true) {
    numeroJogadores = readLineSync.questionInt(
      "Quantas pessoas vão jogar? (2)\n> ",
      { limitMessage: "Porfavor, use apenas numeros inteiros" }
    );

    if (!(0 < numeroJogadores && numeroJogadores <= 5))
      console.log("O nuero de pessoas deve estar entre 1 e 5\n");
    else break;
  }

  return numeroJogadores;
}

function atributosJogador(numeroJogadores: number) {
  for (let i = 1; i < numeroJogadores + 1; i++) {
    const name: string = readLineSync.question(
      `Jogador digite seu nome ${i}\n> `
    );
  }
}

/*
function aposta(player: Jogador) {
  while (true) {
    const bet = readLineSync.questionInt("Que aposta você quer fazer?\n> ", {
      limitMessage: "Por favor, use apenas valores inteiros"
    });
    if (bet > player.valorAtual)
      console.log("Sua aposta não pode ser maior que seu dinheiro real.\n");
    else if (bet <= 0) console.log("Sua aposta deve ser maior que 0.\n");
    else {
      player.bet = bet;
      break;
    }
  }
}
*/

function playerWinOrLose(hand: Hand): boolean {
  let result: boolean = false;
  const playerPoints = hand.pontos;
  if (playerPoints === 21) {
    if (hand.hasBlackJack()) console.log("BLACKJACK!");
    else console.log("VOCE CONSEGUIU 21 PONTOS!");

    result = true;
  } else if (playerPoints === 0) {
    console.log("BUST.\nReceio que voce perca esse jogo :(\n");
    result = true;
  }
  return result;
}

const checkIfYes = (userDecision: string): boolean =>
  ["y", "yes", "1", "true"].includes(userDecision.trim().toLowerCase());

function turnoJogador(player: Jogador) {
  console.log(`###### ${player}'s turno ######\n`);

 // aposta(player);

  console.log("\nSuas cartas sao: ");
  console.log(
    `${player.hands[0].cartas[0]} and ${player.hands[0].cartas[1]} (${player.hands[0].pontos} pontos)\n`
  );

  let hasSplitted = false;
  let hasDoubled = false;
  for (const [i, hand] of player.hands.entries()) {
    // Se o jogador dobrou, ele só pode acertar mais uma vez
    while (!playerWinOrLose(hand) && (!hasDoubled || hand.cartas.length < 3)) {
      if (hasSplitted) {
        console.log(`(Mao #${i})`);
        console.log(`Suas cartas sao: ${hand}`);
      }
      const userDecision = readLineSync
        .question(
          "\nO que voce quer fazer?\nComandos Disponiveis: (b)ater, (f)icar\n> "
        )
        .trim()
        .toLowerCase();

      let breaking = false;
      switch (userDecision) {
        case "b":
        case "bater":
          console.log(`Agora suas cartas sao: ${hand}`);
          break;

        case "f":
        case "ficar":
          console.log(`Player ${player} stood`);
          breaking = true;
          break;

        default:
          console.log(
            "Comando Invalido!\nComandos Disponiveis: (b)ater, (f)icar"
          );
          break;
      }
      if (breaking) break;
    }
  }
}

function dealerPerdeu(): boolean {
  if (maoDealer.pontos === 0) {
    console.log("O dealer perdeu. Fim de jogo :)\n");
    return true;
  }
  return false;
}

function turnoDealer() {
  console.log("###### Turno Dealer's ######\n");
  console.log(
    `As cartas do dealer sao ${maoDealer.cartas[0]} e ${maoDealer.cartas[1]}\n`
  );

  while (!dealerPerdeu() && maoDealer.pontos < 17) {
    console.log("O dealer vai acerta uma carta\n");
    maoDealer.dealCard();
    console.log(`Agora, as cartas do dealer sao: ${maoDealer}`);
  }
}

function fimJogo() {
  // TODO console.log(results)
  const pontosDealer = maoDealer.pontos;

  for (const player of players) {
    for (const [i, hand] of player.hands.entries()) {
      const handPoints: number = hand.pontos;
      if (
        handPoints > maoDealer.pontos ||
        (hand.hasBlackJack() && maoDealer.hasBlackJack())
      ) {
        let handSpecification: string =
          player.hands.length === 1 ? "" : ` (#${i + 1} hand)`;

      } else if (handPoints === 0 || handPoints < maoDealer.pontos) {
        console.log(`${player} perdeu contra o dealer :(\n`);
      } else console.log(`${player}, e um empate :|\n`);
    }
  }
}

function resetar(player: Jogador): boolean {
  let playerResets: boolean = false;

   
    const decision: string = readLineSync.question(
      `${player}, voce quer jogar de novo? (y/n)\n> `
    );

    if (checkIfYes(decision)) {
      player.resetarMaos();
      playerResets = true;
    } else {
      console.log(
        `Obrigado por jogar, ${player}.\n`
      );
    }
  
  return playerResets;
}

function proximaPartida(): boolean {
  // TODO console.log(game finished)
  players = players.filter(resetar);

  console.log("\n\n\n\n\n");

  if (players.length) {
    maoDealer.inicializarAtributos();
    return true;
  }
  return false;
}

blackJack();
