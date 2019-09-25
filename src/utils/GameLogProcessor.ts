import Game from "../models/Game";
import Player from "../models/Player";
import Weapon from "../models/Weapon";
import Constants from "./Constants";

import * as fs from "fs";
import * as lineReader from "line-reader";

class GameLogProcessor {

  /**
   * @description Responsável por processar o arquivo de .log puro e transformá-lo em objetos TypeScript / JavaScript
   */
  static async processFile(filePath: string) {
    // Variáveis
    let countGame: number = 0;
    let games: Array<Game> = [];
    let atualGame: Game;

    // Começa a leitura do arquivo
    lineReader.eachLine(`${filePath}\\${Constants.fileNameDefault}`, async function(line: string, last: boolean) {
        // Se a um novo jogo
        if (line.includes("InitGame:")) {
          if (countGame != 0) {
            games.push(atualGame); // Adiciona a lista
            atualGame = new Game(countGame); // Atribui um novo jogo a variável atualGame
            countGame++;
          } else {
            atualGame = new Game(countGame); // Atribui um novo jogo a variável atualGame
            countGame++;
          }
        } // Se a uma morte
        else if (line.includes("Kill:")) {
          // Incrementa o contador de mortes do jogo atual
          atualGame.totalKills++;

          // Essa variaveís são usadas para conseguir os nomes dos respectivos jogadores envolvidos na kill
          let lastTwoPointsIndex: number = line.lastIndexOf(":");
          let killedIndex: number = line.lastIndexOf("killed");
          let byIndex: number = line.lastIndexOf("by");

          // Nome do jogador que matou
          let hunterPlayer: string = line.substring(lastTwoPointsIndex + 1, killedIndex).trim();
          // Nome do jogador que morreu
          let deadPlayer: string = line.substring(killedIndex + 6, byIndex).trim();
          // Nome da arma usada
          let weaponName: string = line.substring(byIndex + 2, line.length).trim();
          
          // Lógica para o Player que matou
          if (hunterPlayer != "<world>") {
            let hunterPlayerIndex: number = atualGame.hasPlayer(hunterPlayer);
            if (hunterPlayerIndex == -1) {
              // Caso o player não exista, deve se criar ele pela primeira vez
              let player: Player = new Player(hunterPlayer);
              hunterPlayerIndex = atualGame.players.push(player);
              hunterPlayerIndex--;
            }
            atualGame.changePlayerKills(hunterPlayerIndex);
          }

          // Lógica para o Player morto
          let deadPlayerIndex: number = atualGame.hasPlayer(deadPlayer);
          if (deadPlayerIndex == -1) {
            // Caso o player não exista, deve se criar ele pela primeira vez
            let player: Player = new Player(deadPlayer);
            deadPlayerIndex = atualGame.players.push(player);
            deadPlayerIndex--;
          }
          if (hunterPlayer == "<world>") {
            atualGame.changePlayerKills(deadPlayerIndex, true);
          }

          // Lógica para a arma
          let weaponIndex: number = atualGame.hasWeapon(weaponName);
          if (weaponIndex == -1) {
            // Caso a arma não exista, deve se criar ela pela primeira vez
            let weapon: Weapon = new Weapon(weaponName);
            weaponIndex = atualGame.killsByMean.push(weapon);
            weaponIndex--;
          }
          atualGame.changeWeaponKills(weaponIndex);

        } // Se for a última linha
        else if (last) {
          games.push(atualGame);
          this.createGamesFile(games);
        }
      }
    );
  }

  /**
   * @description Recebe o Array de Games completo e fica responsável por criar o seu arquivo .json no disco
   */
  createGamesFile(filePath: string, arrGames: Array<Game>) {
    let gamesPath: string = `${filePath}\\output\\games.json`;
    let content: string = JSON.stringify(arrGames, ["game", "totalKills", "players", "killsByMean", "name", "kills"], 2);

    fs.writeFile(gamesPath, content, err => {
      if (err) throw err;

      console.log(`O arquivo processado foi salvo em: ${gamesPath}`);
    });
  }

}

export default GameLogProcessor;