'use strict';

const FLAG = '🚩';

var gMineCount;
var gBoard;
var gTimerInterval;
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
};
var gLevel = {
    size: [4, 8, 12],
    mines: [2, 12, 30],
};
var gTimerSwitch = 0;
var gPlaySwitch = 0;
var gMode = 0;

function init() {
    gGame.isOn = true;
    gTimerSwitch = 0;
    gPlaySwitch = 0;
    gGame.markedCount = 0;
    gGame.secsPassed = 0;
    clearInterval(gTimerInterval);
    gBoard = buildBoard(gMode);
    createRandomMines(gMode);
    renderBoard(gMode);
    flagScore();
    gMineCount = findMineCount();
    gGame.flagCount = gMineCount;
}

function changeMode(idx) {
    gMode = idx
    resetGame(idx);
}

function resetGame() {
    gGame.isOn = true;
    var elModalTimer = document.querySelector('.modal .timer');
    elModalTimer.innerText = '0';
    var elBtnSpan = document.querySelector('button span');
    elBtnSpan.innerText = '🙂';
    gTimerSwitch = 0;
    gGame.markedCount = 0;
    gGame.secsPassed = 0;
    init()
}


function cellClicked(elCell, i, j) {
    if (!gGame.isOn) return;
    gBoard[i][j].isShown = true;
    gGame.isOn = true;
    gTimerSwitch++;
    gPlaySwitch++
    if(gTimerSwitch === 1) startTimer();
    if (gPlaySwitch === 1 && gBoard[i][j].isMine){
        clearAllMines();
        createRandomMines(gMode);        
    }
    openNeighbors(i,j)
    if (elCell.classList.contains('marked')) return;
    if (gBoard[i][j].isMine) return gameOver(i, j);
    if (gBoard[i][j].isMarked) return;
    if (gBoard[i][j].isShown) {
        elCell.innerText = gBoard[i][j].minesAroundCount;
        elCell.classList.add('marked');
        elCell.classList.remove('flag');
    }
    if (gBoard[i][j].minesAroundCount === 0) elCell.innerText = '';
    gGame.shownCount = findCellCount();
    if (
        gGame.markedCount === 2 &&
        gGame.shownCount === gLevel.size[gMode] ** 2 - gLevel.mines[gMode]
    )
        return gameWon();
}


function toggleFlag(elCell, i, j) {
    if (!gGame.isOn) return;
    if(gBoard[i][j].isShown) return;
    gTimerSwitch++
    if(gTimerSwitch === 1) startTimer()
    var elModalFlags = document.querySelector('.modal .marked-flags');
    elCell.classList.toggle('flag');
    if (elCell.classList.contains('flag')) {
        gBoard[i][j].isMarked = true;
        elCell.innerText = FLAG;
        gGame.markedCount++;
        gGame.flagCount--;
    } else {
        gBoard[i][j].isMarked = false;
        elCell.innerText = '';
        gGame.markedCount--;
        gGame.flagCount++;
    }
    elModalFlags.innerText = gGame.flagCount;
    if (
        gGame.markedCount === 2 &&
        gGame.shownCount === gLevel.size[gMode] ** 2 - gLevel.mines[gMode]
    )
        return gameWon();
}

function flagScore() {
    var elModalFlags = document.querySelector('.modal .marked-flags');
    elModalFlags.innerText = gLevel.mines[gMode];
}

function startTimer() {
    gTimerInterval = setInterval(stopWatch, 10);   
}

function gameOver(currCellI, currCellJ) {
    clearInterval(gTimerInterval);
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            var elCell = document.getElementById(`${i}-${j}`);
            if (cell === gBoard[currCellI][currCellJ]) {
                elCell.innerHTML =
                    '<img src="stylesheets/imgs/touched-mine.ico"></img>';
            } else if (cell.isMine) {
                cell.isShown = true;
                elCell.innerHTML =
                    '<img src="stylesheets/imgs/mines.ico"></img>';
            } else {
                elCell.classList.add('marked');
            }
        }
        gGame.isOn = false;
        var elBtnSpan = document.querySelector('button span');
        elBtnSpan.innerText = '🤯';
    }
}

function gameWon() {
    gGame.isOn = false;
    var elBtnSpan = document.querySelector('button span');
    elBtnSpan.innerText = '😎';
    clearInterval(gTimerInterval);
}



function findNeighbors(cellI, cellJ) {
    var count = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i > gBoard.length - 1 || i < 0) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j > gBoard[0].length - 1 || j < 0) continue;
            var cell = gBoard[i][j];
            if (cell === gBoard[cellI][cellJ]) continue;
            if (cell.isMine) count++;
            
        }
    }
    return count;
}

function openNeighbors(cellI, cellJ) {
    var cellsToOpen = [];
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i > gBoard.length - 1 || i < 0) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j > gBoard[0].length - 1 || j < 0) continue;
            var cell = gBoard[i][j];
            if (cell.isMarked) continue;
            if (cell === gBoard[cellI][cellJ]) continue;
            var elCellNeigh = document.getElementById(`${i}-${j}`);
            cellsToOpen.push(getCellCoord(elCellNeigh.id));
            if (cell.isMine) return cellsToOpen = [];
        }
    }
    var nextCells = []
    if (cellsToOpen.length) {
        for (var i = 0; i < cellsToOpen.length; i++) {
            var neighCell = gBoard[cellsToOpen[i].i][cellsToOpen[i].j];
            var elNeigh = document.getElementById(
                `${cellsToOpen[i].i}-${cellsToOpen[i].j}`
            );
            neighCell.isShown = true;
            if (neighCell.isShown) {
                elNeigh.classList.add('marked');
                elNeigh.innerText = neighCell.minesAroundCount;
            }
            if (neighCell.minesAroundCount === 0) {
                elNeigh.innerText = '';
                nextCells.push(neighCell)
            }
        }
    }
        for(var i = 0; i<nextCells.length; i++){
            console.log('hello');
            openNeighbors(nextCells[i].i, nextCells[i].j)
        }
    
}

function findCellCount() {
    var count = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j];
            if (cell.isShown) count++;
        }
    }
    return count;
}

function findAllCellsNeighs() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j];
            cell.minesAroundCount = findNeighbors(i, j);
        }
    }
}

function findEmptyCellCount() {
    var emptyCells = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j];
            if (!cell.isShown) emptyCells.push(cell);
        }
    }
    return emptyCells;
}

function clearAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j];
            if (cell.isMine) cell.isMine = false;
        }
    }
}

function  findMineCount() {
    var count = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j];
            if (cell.isMine) count++;
        }
    }
    return count;
}


function createRandomMines(idx) {
    var emptyCells = findEmptyCellCount();
    for (var i = 0; i < gLevel.mines[idx]; i++) {
        var randomNum = getRandomInt(0, emptyCells.length - 1);
        var mineCell = emptyCells.splice(randomNum - i, 1);
        gBoard[mineCell[0].i][mineCell[0].j].isMine = true;
        gBoard[mineCell[0].i][mineCell[0].j].minesAroundCount = null;
    }
}


// ===DID NOT DELETE BECAUSE I AM PROUD OF THIS ALOGIRITHM :)

// function getRandomMineIdx(minesIdx, sizeIdx){
//     var randomIdxs = []
//     for(var i = 0 ; i<gLevel.mines[minesIdx]; i++){
//         var idxI = getRandomInt(0, gLevel.size[sizeIdx])
//         var idxJ = getRandomInt(0, gLevel.size[sizeIdx]);
//         var randomIdx = {i: idxI,j: idxJ}
//         randomIdxs.push(randomIdx)
//     }
//     var right = randomIdxs.length-1;
//     var left = 0;
//     while(right>left){
//         if(randomIdxs[right].i === randomIdxs[left].i &&
//             randomIdxs[right].j === randomIdxs[left].j) return getRandomMineIdx(minesIdx, sizeIdx);
//         else{
//             left++
//             if(left === right-1){
//                 left = 0
//                 right--
//             }
//         }
//     }
//     return randomIdxs
// }
