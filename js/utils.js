'use strict'

function buildBoard(idx) {
    gMode = idx;
    var board = [];
    
    for (var i = 0; i < gLevel.size[idx]; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.size[idx]; j++) {
            var cell = {
                i: i,
                j: j,
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            };
            board[i][j] = cell;
        }
    }
    return board;
}

function renderBoard(idx) {
    var elTbody = document.querySelector('tbody');
    var strHtml = '';
    for (var i = 0; i < gLevel.size[idx]; i++) {
        strHtml += '<tr>';
        for (var j = 0; j < gLevel.size[idx]; j++) {
            var cell = gBoard[i][j];
            cell.minesAroundCount = findNeighbors(i, j);
            strHtml += `<td class="border highlight mark" id="${i}-${j}" oncontextmenu="toggleFlag(this, ${i}, ${j});return false;"
            onclick="cellClicked(this, ${i}, ${j})"></td>`;
        }
        strHtml += '</tr>';
    }
    elTbody.innerHTML = strHtml;
};

function stopWatch() {
    var elModalTimer = document.querySelector('.modal .timer');
    gGame.secsPassed += 0.01;
    var displayTime = gGame.secsPassed.toString();
    var lastTime = parseInt(displayTime);
    elModalTimer.innerText = lastTime;
}

function getCellCoord(strCellId) {
    var parts = strCellId.split('-');
    var coord = { i: +parts[0], j: +parts[1] };
    return coord;
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
    console.log('cleared all mines')
}

function findMineCount() {
    var count = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j];
            if (cell.isMine) count++;
        }
    }
    return count;
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
