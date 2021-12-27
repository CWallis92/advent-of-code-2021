const fs = require("fs");

const data = fs
  .readFileSync(
    `${__dirname}/../` +
      // "testData" +
      "data" +
      `/day-${__filename.split("/day-")[1].split(".")[0]}.txt`,
    "utf8"
  )
  .split("\n");

const player1Pos = parseInt(data[0].split(": ")[1]);
const player2Pos = parseInt(data[1].split(": ")[1]);

const playGame = (player1Start, player2Start) => {
  let turn = 0,
    roll = -2,
    player1Score = 0,
    player2Score = 0,
    player1Pos = player1Start,
    player2Pos = player2Start;

  while (player1Score < 1000 && player2Score < 1000) {
    roll += 3;

    let rollsTotal;
    switch (roll) {
      case 99:
        roll = -1;
        rollsTotal = 200;
        break;
      case 100:
        roll = 0;
        rollsTotal = 103;
        break;
      case 101:
        roll = 1;
        rollsTotal = 6;
        break;
      default:
        rollsTotal = 3 * roll + 3;
        break;
    }

    switch (turn % 2) {
      case 0:
        player1Pos = (player1Pos + rollsTotal) % 10;
        player1Pos = player1Pos === 0 ? 10 : player1Pos;
        player1Score += player1Pos;
        break;
      case 1:
        player2Pos = (player2Pos + rollsTotal) % 10;
        player2Pos = player2Pos === 0 ? 10 : player2Pos;
        player2Score += player2Pos;
        break;
    }

    turn++;
  }

  return { player1Score, player2Score, turn };
};

const { player1Score, player2Score, turn } = playGame(player1Pos, player2Pos);

console.log("Part 1:", Math.min(player1Score, player2Score) * turn * 3);

/* Part 2 */
// Use some form of pascal's triangle: On each turn the player rolls somewhere between 3 and 9
// 3 and 9 can be rolled once each
// 4 and 8 can be rolled 3 times each
// 5 and 7 can be rolled 6 times each
// 6 can be rolled 7 times

// So when a player wins with a total roll of x, multiply the wins by the frequency
const playDirac = (
  player1Start,
  player2Start,
  player1Score = 0,
  player2Score = 0,
  turn = 0,
  player1Wins = 0,
  player2Wins = 0
) => {
  let player1Pos = player1Start,
    player2Pos = player2Start;

  if (player1Score >= 21 || player2Score >= 21) {
    if (player1Score > player2Score) {
      player1Wins++;
    } else {
      player2Wins++;
    }
  } else {
    for (let totalRoll = 3; totalRoll <= 9; totalRoll++) {
      let currPlayer1Score = player1Score,
        currPlayer2Score = player2Score,
        currPlayer1Pos = player1Pos,
        currPlayer2Pos = player2Pos,
        currTurn = turn,
        currPlayer1Wins = 0,
        currPlayer2Wins = 0;

      switch (turn % 2) {
        case 0:
          currPlayer1Pos = (currPlayer1Pos + totalRoll) % 10;
          currPlayer1Pos = currPlayer1Pos === 0 ? 10 : currPlayer1Pos;
          currPlayer1Score += currPlayer1Pos;
          break;
        case 1:
          currPlayer2Pos = (currPlayer2Pos + totalRoll) % 10;
          currPlayer2Pos = currPlayer2Pos === 0 ? 10 : currPlayer2Pos;
          currPlayer2Score += currPlayer2Pos;
          break;
      }

      currTurn++;

      [new1Wins, new2Wins] = playDirac(
        currPlayer1Pos,
        currPlayer2Pos,
        currPlayer1Score,
        currPlayer2Score,
        currTurn,
        currPlayer1Wins,
        currPlayer2Wins
      );

      switch (totalRoll) {
        case 3:
        case 9:
          player1Wins += new1Wins;
          player2Wins += new2Wins;
          break;
        case 4:
        case 8:
          player1Wins += new1Wins * 3;
          player2Wins += new2Wins * 3;
          break;
        case 5:
        case 7:
          player1Wins += new1Wins * 6;
          player2Wins += new2Wins * 6;
          break;
        default:
          player1Wins += new1Wins * 7;
          player2Wins += new2Wins * 7;
          break;
      }
    }
  }
  return [player1Wins, player2Wins];
};

const [player1Wins, player2Wins] = playDirac(player1Pos, player2Pos);

console.log("Part 2:", Math.max(player1Wins, player2Wins));
