'use strict'
//  add game modes- if easy marked count is 2 etc..
const FLAG = '🚩';

var gBoard;
var gTimerInterval;
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 2,
    secsPassed: 0,
};
var timerSwitch = 0

function init(){
    if(!gGame.isOn) return;
    timerSwitch = 0
    gGame.markedCount = 0;
    gGame.secsPassed = 0;
    clearInterval(gTimerInterval);
    gBoard = buildBoard();
    renderBoard()
}

function cellClicked(elCell, i, j){
    if(!gGame.isOn) return;
    gGame.isOn = true;
    timerSwitch++
    if(timerSwitch === 1) startTimer()
    if(elCell.classList.contains('marked')) return;
    if (gBoard[i][j].isMine) return gameOver(i, j);
    if(!gBoard[i][j].isMine) gBoard[i][j].isShown = true;
    if(gBoard[i][j].isShown){
        elCell.innerText = gBoard[i][j].minesAroundCount;
        elCell.classList.add('marked');
    } 
    if (gBoard[i][j].minesAroundCount === 0) elCell.innerText = '';
    var neighs = openNeighbors(elCell, i, j);
    for(var i=0; i<neighs.length; i++){
        var neighCell = gBoard[neighs[i].i][neighs[i].j];
        var elNeigh = document.getElementById(`${neighs[i].i}-${neighs[i].j}`)
        if(neighCell.isMine) return;
        neighCell.isShown = true;
        if(neighCell.isShown){
            elNeigh.classList.add('marked')
            elNeigh.innerText = neighCell.minesAroundCount;
        } 
        if(neighCell.minesAroundCount === 0) elNeigh.innerText = ''
    }
}

function startTimer(){
    if(timerSwitch === 1){
        gTimerInterval = setInterval(stopWatch, 10);  
    }
}

function gameOver(currCellI, currCellJ){
    clearInterval(gTimerInterval)
    for(var i=0; i<gBoard.length; i++){
        for(var j=0; j<gBoard[0].length; j++){
            var cell = gBoard[i][j];
            var elCell = document.getElementById(`${i}-${j}`);
            if (cell === gBoard[currCellI][currCellJ]){
                elCell.innerHTML =
                    '<img src="stylesheets/imgs/touched-mine.ico"></img>';
            } else if(cell.isMine){
                cell.isShown = true;
                elCell.innerHTML = '<img src="stylesheets/imgs/mines.ico"></img>'
            }  else {
                elCell.classList.add('marked');
            }   
        }
        gGame.isOn = false;
        var elBtnSpan = document.querySelector('button span');
        elBtnSpan.innerText = '🤯'
    } 
}

// function winCondition(){
    
// }

function resetGame(){
    gGame.isOn = true;
    var elModalTimer = document.querySelector('.modal .timer');
    elModalTimer.innerText = '0';
    var elBtnSpan = document.querySelector('button span');
    elBtnSpan.innerText = '🙂';
    init()
}

function toggleFlag(elCell, i, j){
    if(!gGame.isOn) return;
    elCell.innerText = gFlag
    gBoard[i][j].isMarked = true;
}

function findNeighbors(cellI, cellJ){
    var count = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i > gBoard.length - 1 || i < 0) continue;
        for (var j = cellJ - 1 ; j <= cellJ + 1; j++) {
            if (j > gBoard[0].length - 1 || j < 0) continue;
            var cell = gBoard[i][j];
            if (cell === gBoard[cellI][cellJ]) continue;
            if (cell.isMine) count++;
        }
    }
    return count;
}

function openNeighbors(elCell, cellI, cellJ){
    var cellsToOpen = [];
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i > gBoard.length - 1 || i < 0) continue;
        for (var j = cellJ - 1 ; j <= cellJ + 1; j++) {
            if (j > gBoard[0].length - 1 || j < 0) continue;
            var cell = gBoard[i][j];
            if(cell.isMine) continue;
            if (cell === gBoard[cellI][cellJ]) continue;
            var elCellNeigh = document.getElementById(`${i}-${j}`)
            cellsToOpen.push(getCellCoord(elCellNeigh.id));
        }
    }
    return cellsToOpen
}


function getRandomMineIdx(numOfMines){
    var randomIdxs = []
    for(var i = 0 ; i<numOfMines; i++){
        var idxI = getRandomInt(0,4)
        var idxJ = getRandomInt(0,4)
        var randomIdx = {i: idxI,j: idxJ}
        randomIdxs.push(randomIdx)
    }
    if(randomIdxs[0].i === randomIdxs[1].i &&
        randomIdxs[0].j === randomIdxs[1].j) getRandomMineIdx(numOfMines)
    return randomIdxs
}