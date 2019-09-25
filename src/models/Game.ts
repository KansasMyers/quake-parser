import Player from "./Player";
import Weapon from "./Weapon";

class Game {

  // Atribuitos do Jogo
  id: number;
  game: string;
  totalKills: number;
  players: Array<Player>;
  killsByMean: Array<Weapon>;

  constructor(id: number) {
    this.id = id;
    this.game = `game_${id}`;
    this.totalKills = 0;
    this.players = [];
    this.killsByMean = [];
  }

  /**
   * @description Retorna a posição na lista 'players' pelo nome de uma jogador. Caso não seja encontrado o retorno será -1.
   */
  hasPlayer(name: string): number {
    for (let i = 0; i < this.players.length; i++) {
      let player: Player = this.players[i];

      if (player.name == name) {
        return i;
      }
    }

    return -1;
  }

  /**
   * @description Incrementa ou Decrementa uma kill do player pela sua posição na lista 'players' de acordo com o parâmetro world.
   * 'world', significa se o player morreu para o mapa. 
   */
  changePlayerKills(index: number, world = false) {
    if (world) {
      this.players[index].kills--;
    } else {
      this.players[index].kills++;
    }
  }

  /**
   * @description Retorna a posição na lista 'killsByMean' pelo nome da weapon. Caso não seja encontrado o retorno será -1.
   */
  hasWeapon(name: string): number {
    for (let i = 0; i < this.killsByMean.length; i++) {
      let weapon: Weapon = this.killsByMean[i];

      if (weapon.name == name) {
        return i;
      }
    }

    return -1;
  }

  /**
   * @description Incrementa uma kill a weapon pela sua posição na lista 'killsByMean'.
   */
  changeWeaponKills(index: number) {
    this.killsByMean[index].kills++;
  }
  
}

export default Game;