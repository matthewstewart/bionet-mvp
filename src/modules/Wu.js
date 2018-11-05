const WuAdjectives = require('./data/WuAdjectives.json'); 
const WuNouns = require('./data/WuNouns.json'); 

module.exports = {
  "generateRandomName": () => {
    let adjectiveIndex = getRandomInt(0, (WuAdjectives.length - 1));
    let nounIndex = getRandomInt(0, (WuNouns.length - 1));
    let wuAdj = WuAdjectives[adjectiveIndex];
    let wuNoun = WuNouns[nounIndex];
    let wuName = `${wuAdj} ${wuNoun}`;
    return wuName;
  } 
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}