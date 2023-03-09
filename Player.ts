import { Hand } from "./Hand";
import { Deck, Carta } from "./Deck";
/**
 *  Implement a casino player in TypeScript
 *
 *   @constructor
 *   @param {string} nome
 *   @param {number} valorInicial
 */
export class Jogador {
  readonly hands: Array<Hand>;
  private _deck: Deck;

  constructor(
    readonly name: string,
    deck: Deck
  ){
    this.hands = [new Hand(deck)];
    this._deck = deck;
  }

  public resetarMaos = () =>
    this.hands.forEach((hand: Hand) => hand.inicializarAtributos());

}
