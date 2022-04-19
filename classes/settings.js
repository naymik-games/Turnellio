let game;
let gameOptions = {
  gemSize: 50,
  rotateSpeed: 100,
  fallSpeed: 100,
  destroySpeed: 200,
  items: 4,
  cols: 8,
  rows: 12,
  boardOffset: {
    x: 100,
    y: 150
  },
  allowBlanks: true
}

let gameData;
let defaultData = {
  coins: 0,
  level: 0,
  score: 0,
  highScores: [0, 0, 0, 0, 0]

}
let saveData;
let defaultSave = {
  gameArray: [],
  extraArray: [],
  score: 0,
  level: 0

}
let load = false;