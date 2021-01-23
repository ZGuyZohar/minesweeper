'use strict';

const FLAG = '🚩';

localStorage.setItem('score0', '0');
localStorage.setItem('score1', '0');
localStorage.setItem('score2', '0');
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
var gElScore = document.querySelector(`.score`)
var gTimerSwitch;
var gPlaySwitch;
var gHintSwitch;
var gHintIsOn;
var gMode = 0;
var gLives;
var gHints;
var gSafeClicks;
var gMinesHit;

function init() {
    gHintIsOn = false;
    gMinesHit = 0;
    gLives = 3;
    gHints = 3;
    gSafeClicks = 3;
    gGame.isOn = true;
    gHintSwitch = 0;
    gTimerSwitch = 0;
    gPlaySwitch = 0;
    gGame.markedCount = 0;
    gGame.secsPassed = 0;
    clearInterval(gTimerInterval);
    gBoard = buildBoard(gMode);
    createRandomMines(gMode);
    renderBoard(gMode);
    getLives();
    getHints();
    flagScore();
    gMineCount = findMineCount();
    gGame.flagCount = gMineCount;
    gElScore.innerHTML = localStorage.getItem(`score${gMode}`);
}

function changeMode(idx) {
    gMode = idx;
    resetGame(idx);
}

function resetGame() {
    var elModalTimer = document.querySelector('.modal .timer');
    elModalTimer.innerText = '0';
    var elBtnSpan = document.querySelector('button span');
    elBtnSpan.innerText = '🙂';
    var elSafeClick = document.querySelector('.safe-click');
    console.log(elSafeClick)
    elSafeClick.innerText = 'Safe Click(3)'
    init();
}

function cellClicked(elCell, i, j) {
    // gBoardBefore = cloneMatrix(gBoard)
    if (!gGame.isOn) return;
    elCell.classList.remove('highlight');
    if (elCell.classList.contains('marked')) return;
    if (gHintIsOn) {
        elCell.classList.add('marked-hint');
        return showHintNeighbors(elCell, i, j);
    }

    gGame.isOn = true;
    gTimerSwitch++;
    gPlaySwitch++;
    gHintSwitch++;
    if (gTimerSwitch === 1) startTimer();
    if (gPlaySwitch === 1 && gBoard[i][j].isMine) {
        clearAllMines();
        createRandomMines(gMode);
        createNewCellMinesCounts();
        openNeighbors(i, j);
    } else openNeighbors(i, j);

    if (gBoard[i][j].isMine) {
        var elModalFlags = document.querySelector('.modal .marked-flags');
        if (gBoard[i][j].isShown) return;
        gGame.markedCount++;
        gGame.flagCount--;
        gLives--;
        gMinesHit++;
        getLives();
        elModalFlags.innerText = gGame.flagCount;
        gBoard[i][j].isShown = true;
        gGame.shownCount = findCellCount();
        if (!gLives) return gameOver(i, j);
        if (
            gGame.markedCount === gLevel.mines[gMode] && //fixxx
            gGame.shownCount ===
                gLevel.size[gMode] ** 2 - gLevel.mines[gMode] + gMinesHit
        )
            return gameWon();
        return;
    }

    gBoard[i][j].isShown = true;

    if (gBoard[i][j].isMarked) return;
    if (gBoard[i][j].isShown) {
        elCell.innerText = gBoard[i][j].minesAroundCount;
        elCell.classList.add('marked');
        elCell.classList.remove('flag');
    }
    if (gBoard[i][j].minesAroundCount === 0) elCell.innerText = '';
    gGame.shownCount = findCellCount();
    if (
        gGame.markedCount === gLevel.mines[gMode] && //fixxx
        gGame.shownCount ===
            gLevel.size[gMode] ** 2 - gLevel.mines[gMode] + gMinesHit
    )
        return gameWon();
}
// fix game over

function toggleFlag(elCell, i, j) {
    if (!gGame.isOn) return;
    if (gBoard[i][j].isShown) return;
    gTimerSwitch++;
    gHintSwitch++;
    if (gTimerSwitch === 1) startTimer();
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
        gGame.shownCount === gLevel.size[gMode] ** 2 - gLevel.mines[gMode] + gMinesHit
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
                cell.minesAroundCount === 0
                    ? (elCell.innerText = '')
                    : (elCell.innerText = cell.minesAroundCount);
            }
            elCell.classList.remove('highlight');
        }

        gGame.isOn = false;
        var elBtnSpan = document.querySelector('button span');
        elBtnSpan.innerText = '🤯';
    }
}

function gameWon() {
    clearInterval(gTimerInterval);
    gGame.isOn = false;
    var elBtnSpan = document.querySelector('button span');
    elBtnSpan.innerText = '😎';
    var secondsInt = parseInt(gGame.secsPassed)
    switch (gMode) {
        case 0:
            if (localStorage.score0 == '0')
                localStorage.score0 = secondsInt
            if (gGame.secsPassed < parseInt(localStorage.score0))
                localStorage.score0 = secondsInt.toString();
            break;
        case 1:
            if (localStorage.score1 == '0')
                localStorage.score1 = secondsInt
            if (gGame.secsPassed < parseInt(localStorage.score1))
                localStorage.score1 = secondsInt.toString();
            break;
        case 2:
            if (localStorage.score2 == '0')
                localStorage.score2 = secondsInt;
            if (gGame.secsPassed < parseInt(localStorage.score2))
                localStorage.score2 = secondsInt.toString();
            break;
    }
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
    var elCell = document.getElementById(`${cellI}-${cellJ}`);
    if (gBoard[cellI][cellJ].isMine) {
        elCell.innerHTML =
            '<img src="stylesheets/imgs/touched-mine.ico"></img>';
        return;
    }
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
            if (cell.isMine) return (cellsToOpen = []);
        }
    }
    var nextCells = [];
    if (cellsToOpen.length) {
        for (var i = 0; i < cellsToOpen.length; i++) {
            var neighCell = gBoard[cellsToOpen[i].i][cellsToOpen[i].j];
            var elNeigh = document.getElementById(
                `${cellsToOpen[i].i}-${cellsToOpen[i].j}`
            );
            if (neighCell.minesAroundCount === 0 && !neighCell.isShown) {
                elNeigh.innerText = '';
                nextCells.push(neighCell);
            }
            neighCell.isShown = true;
            elNeigh.classList.add('marked');
            elNeigh.classList.remove('highlight');
            elNeigh.innerText = neighCell.minesAroundCount;
            if (neighCell.minesAroundCount === 0) elNeigh.innerText = '';
        }
    }
    if (nextCells.length) {
        for (var i = 0; i < nextCells.length; i++) {
            openNeighbors(nextCells[i].i, nextCells[i].j);
        }
    }
    return;
}

function createRandomMines(idx) {
    var emptyCells = findEmptyCellCount();
    for (var i = 0; i < gLevel.mines[idx]; i++) {
        var randomNum = getRandomInt(0, emptyCells.length - 1);
        var mineCell = emptyCells.splice(randomNum - i, 1);
        gBoard[mineCell[0].i][mineCell[0].j].isMine = true;
        gBoard[mineCell[0].i][mineCell[0].j].minesAroundCount = null;
    }
    // console.log('created random mines');
}

function createNewCellMinesCounts() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            gBoard[i][j].minesAroundCount = findNeighbors(i, j);
        }
    }
    console.log('got new minesaroundcount');
}


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
