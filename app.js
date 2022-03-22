// Append 200 squares, 10 base, 20 first line
let grid = document.getElementsByClassName("grid")[0]

for (let i=0; i<200; i++){
    grid.appendChild(document.createElement("div"));
}

for (let i = 0; i < 10; i++){
    let baseSquare = document.createElement("div");
    baseSquare.classList.add('base');
    grid.appendChild(baseSquare);
}

for (let i = 0; i < 20; i++){
    let firstLine = document.createElement("div");
    firstLine.classList.add('hide');
    grid.insertBefore(firstLine, grid.children[0]);
}


let squares = Array.from(document.querySelectorAll(".grid div"));


//declare variables needed
let timerId


//activate start button
const startBtn = document.querySelector('#start-button')
startBtn.addEventListener('click', startOrPause)

function startOrPause(){
    if (timerId) {
    clearInterval(timerId)
    timerId = false
    } else {
    draw()
    timerId = setInterval(moveDown, 1000)
    //nextRandom = Math.floor(Math.random()*theTetrominoes.length)
    //displayShape()
    }
}


// Create the seven tetrominoes (I, O, T, S, Z, J, and L)

let iTet = [
    [0, 1, 2, 3],
    [-18, -8, 2, 12],
    [0, 1, 2, 3],
    [-18, -8, 2, 12]
]

let oTet = [
    [0, 1, 10, 11],
    [0, 1, 10, 11],
    [0, 1, 10, 11],
    [0, 1, 10, 11]
]

let tTet = [
    [0, 1, 2, 11],
    [-9, 0, 1, 11],
    [-9, 0, 1, 2],
    [-9, 1, 2, 11]
]

let sTet = [
    [1, 2, 10, 11],
    [-10, 0, 1, 11],
    [1, 2, 10, 11],
    [-10, 0, 1, 11]
]

let zTet = [
    [0, 1, 11, 12],
    [-8, 1, 2, 11],
    [0, 1, 11, 12],
    [-8, 1, 2, 11]
]

let jTet = [
    [0, 1, 2, 12],
    [-9, 1, 10, 11],
    [0, 10, 11, 12],
    [-9, -8, 1, 11]
]

let lTet = [
    [0, 1, 2, 10],
    [-10, -9, 1, 11],
    [2, 10, 11, 12],
    [-9, 1, 11, 12]
]






let theTetrominoes = [iTet, oTet, tTet, sTet, zTet, jTet, lTet];

let currentPosition = 24;
let currentRotation = 0;
let randomTet = Math.floor(Math.random() * 7);
let current = theTetrominoes[randomTet][currentRotation];



function draw(){
    current.forEach(index => squares[currentPosition + index].classList.add('tet'))
}

function undraw(){
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tet')
        
    })
}

function moveDown() {
    freeze()
    undraw()
    currentPosition += 10
    draw()
    
}

//Make tet stops when touch base/fixed
function freeze(){
    let touchBase = current.some(index => squares[currentPosition + index + 10].classList.contains('base'))
    if (touchBase) {
        current.forEach(index => squares[currentPosition + index].classList.remove('tet'))
        current.forEach(index => squares[currentPosition + index].classList.add('fixed'))
        deductLine()
        callNextRandom()
        currentRotation = 0
        draw()      //draw the nextRandom tet
    }
    let touchFixed = current.some(index => squares[currentPosition + index + 10].classList.contains('fixed'))
    if (touchFixed) {
        current.forEach(index => squares[currentPosition + index].classList.add('fixed'))
        current.forEach(index => squares[currentPosition + index].classList.remove('tet'))
        deductLine()
        callNextRandom()
        currentRotation = 0
        draw()
    }
}


//keep changing falling tet
function callNextRandom(){
    randomTet = Math.floor(Math.random() * 7);
    current = theTetrominoes[randomTet][0];
    currentPosition = 24
}


//assign functions to keyCodes
function control(e) {
if(e.keyCode === 37) {
    moveLeft()
} else if (e.keyCode === 38) {
    rotate()
} else if (e.keyCode === 39) {
    moveRight()
} else if (e.keyCode === 40) {
    moveDown()
} else if (e.keyCode === 13) {
    startOrPause()
}
}
document.addEventListener('keydown', control)


function moveLeft(){
    undraw()
    currentPosition --
    let touchLeftEdge = current.some(index => (currentPosition + index + 1) % 10 == 0)
    if (touchLeftEdge){currentPosition ++}
    let touchLeftFixed = current.some(index => squares[currentPosition + index].classList.contains('fixed'))
    if (touchLeftFixed){currentPosition ++}
    draw()
}

function moveRight(){
    undraw()
    currentPosition ++
    let touchRightEdge = current.some(index => (currentPosition + index - 1) % 10 == 9)
    if (touchRightEdge){currentPosition --}
    let touchRightFixed = current.some(index => squares[currentPosition + index].classList.contains('fixed'))
    if (touchRightFixed){currentPosition --}
    draw()
}




function rotate(){
    undraw()
    currentRotation ++
    if(currentRotation == 4){
        currentRotation = 0;
    }

    // check rotated position for iTet only
    if(randomTet == 0){
        iTet_pushFromEdge()
        iTet_pushFromFixed()
        iTet_pushFromBaseAndFixedBottom()
        iTet_finalCheck()
    } else {

    // check rotated position for others
        horizontalStuck()
        pushFromEdge()
        pushFromFixed()
        pushFromBaseAndFixedBottom()
        finalCheck()
    }
    current = theTetrominoes[randomTet][currentRotation]; 
    draw()
}

function horizontalStuck(){
    let toBeDrawn = theTetrominoes[randomTet][currentRotation].map(index => currentPosition + index)
    let nextContainFixed = toBeDrawn.some(index => squares[index].classList.contains('fixed'))
    let nextOutsideRightEdge = toBeDrawn.some(index => (index) % 10 == 0)
    let nextOutsideLeftEdge = toBeDrawn.some(index => (index) % 10 == 9)

    // two fixed blocks
    let stuckByRight = current.some(index => squares[currentPosition + index + 1].classList.contains('fixed'))
    let stuckByLeft = current.some(index => squares[currentPosition + index - 1].classList.contains('fixed'))
    if(stuckByRight && stuckByLeft && nextContainFixed){
        if(currentRotation == 0){
            currentRotation = 3
            return true
        } else {
            currentRotation--
            return true
        }
    }
    
    // edge & block left
    let touchLeftEdge = current.some(index => (currentPosition + index) % 10 == 0)
    let stuckByRightAndEdge = current.some(index => squares[currentPosition + index + 1].classList.contains('fixed'))
    if((touchLeftEdge && stuckByRightAndEdge && nextContainFixed) || (touchLeftEdge && stuckByRightAndEdge && nextOutsideLeftEdge)){
        if(currentRotation == 0){
            currentRotation = 3
            return true
        } else {
            currentRotation--
            return true
        }
    }

    //edge & block right
    let touchRightEdge = current.some(index => (currentPosition + index) % 10 == 9)
    let stuckByLeftAndEdge = current.some(index => squares[currentPosition + index - 1].classList.contains('fixed'))
    if((touchRightEdge && stuckByLeftAndEdge && nextContainFixed) || (touchRightEdge && stuckByLeftAndEdge && nextOutsideRightEdge)){
        if(currentRotation == 0){
            currentRotation = 3
            return true
        } else {
            currentRotation--
            return true
        }
    }
    else return false
}


function pushFromEdge(){
    let toBeDrawn = theTetrominoes[randomTet][currentRotation].map(index => currentPosition + index)
    // make sure there's space to push
    let noSpaceForLeftPush = toBeDrawn.some(index => squares[index + 1].classList.contains('fixed'))
    let noSpaceForRightPush = toBeDrawn.some(index => squares[index - 1].classList.contains('fixed'))
    let touchRightEdge = current.some(index => (currentPosition + index) % 10 == 9)
    let pushAwayFromRight = toBeDrawn.some(index => index % 10 == 0)
    if(pushAwayFromRight && touchRightEdge && !noSpaceForRightPush){
        currentPosition--
        return true
    }
    let touchLeftEdge = current.some(index => (currentPosition + index) % 10 == 0)
    let pushAwayFromLeft = toBeDrawn.some(index => index % 10 == 9)
    if(pushAwayFromLeft && touchLeftEdge && !noSpaceForLeftPush){
        currentPosition++
        return true
    }
    else return false
}

function pushFromFixed(){
    let toBeDrawn = theTetrominoes[randomTet][currentRotation].map(index => currentPosition + index)
    let needPush = toBeDrawn.some(index => squares[index].classList.contains('fixed'))
    let noSpaceForLeftPush = toBeDrawn.some(index => squares[index + 1].classList.contains('fixed'))
    let noSpaceForRightPush = toBeDrawn.some(index => squares[index - 1].classList.contains('fixed'))
    let tetAndRotToBePushFromRight = (
        (randomTet == 2 && currentRotation == 2) ||
        (randomTet == 3 && currentRotation == 0) ||
        (randomTet == 3 && currentRotation == 2) ||
        (randomTet == 5 && currentRotation == 2) ||
        (randomTet == 6 && currentRotation == 2)
    )
    if(tetAndRotToBePushFromRight && needPush && !noSpaceForRightPush){
        currentPosition--
        return true
    }
    let tetAndRotToBePushFromLeft = (
        (randomTet == 2 && currentRotation == 0) ||
        (randomTet == 4 && currentRotation == 0) ||
        (randomTet == 4 && currentRotation == 2) ||
        (randomTet == 5 && currentRotation == 0) ||
        (randomTet == 6 && currentRotation == 0)
    )
    if(tetAndRotToBePushFromLeft && needPush && !noSpaceForLeftPush){
        currentPosition++
        return true
    }
    else return false
}

function pushFromBaseAndFixedBottom() {
    // only t-tet applies
    let toBeDrawn = theTetrominoes[randomTet][currentRotation].map(index => currentPosition + index)
    let pushFromBase = toBeDrawn.some(index => squares[index].classList.contains('base'))
    let pushFromFixed = toBeDrawn.some(index => squares[index].classList.contains('fixed'))
    let noSpaceToPushUp = toBeDrawn.some(index => squares[index-10].classList.contains('fixed'))
    if ((randomTet == 2 && currentRotation == 3) && (pushFromBase || pushFromFixed) && !noSpaceToPushUp) {
        currentPosition -= 10
        return true
    }
    else return false
}

function finalCheck(){
    let toBeDrawn = theTetrominoes[randomTet][currentRotation].map(index => currentPosition + index)
    let noSpaceCzFixed = toBeDrawn.some(index => squares[index].classList.contains('fixed'))

    let touchRightEdge = current.some(index => (currentPosition + index) % 10 == 9)
    let pushAwayFromRight = toBeDrawn.some(index => index % 10 == 0)
    let noSpaceCzEdgeRight = touchRightEdge && pushAwayFromRight

    let touchLeftEdge = current.some(index => (currentPosition + index) % 10 == 0)
    let pushAwayFromLeft = toBeDrawn.some(index => index % 10 == 9)
    let noSpaceCzEdgeLeft = touchLeftEdge && pushAwayFromLeft

    if ((noSpaceCzFixed || noSpaceCzEdgeLeft || noSpaceCzEdgeRight) && horizontalStuck()==false && pushFromEdge()==false && pushFromFixed()==false && pushFromBaseAndFixedBottom()==false){
        if(currentRotation == 0){
            currentRotation = 3
        } else currentRotation--
    } 
}


function iTet_pushFromEdge(){
    let toBeDrawn = theTetrominoes[randomTet][currentRotation].map(index => currentPosition + index)
    if (currentRotation == 0 || currentRotation == 2){

        // push from edge with edge touched (for left & right)
        let touchLeftEdge = current.every(index => (currentPosition + index) % 10 == 0)
        let noSpaceForLeftPush = toBeDrawn.some(index => squares[index + 2].classList.contains('fixed'))
        if(touchLeftEdge && !noSpaceForLeftPush){
            currentPosition += 2
            return true
        }
        let touchRightEdge = current.every(index => (currentPosition + index) % 10 == 9)
        let noSpaceForRightPush = toBeDrawn.some(index => squares[index - 1].classList.contains('fixed'))
        if(touchRightEdge && !noSpaceForRightPush){
            currentPosition --
            return true
        }

        // push from edge without edge touched (left only)
        let inSecondColumn = current.every(index => (currentPosition + index) % 10 == 1)
        let noSpaceForLeftPush_LeftOnly = toBeDrawn.some(index => squares[index + 1].classList.contains('fixed'))
        if (inSecondColumn && !noSpaceForLeftPush_LeftOnly){
            currentPosition++
            return true
        } else return false
    } else return false
}
    

function iTet_pushFromFixed(){
    if ((currentRotation == 0 || currentRotation == 2) && iTet_pushFromEdge()==false){
        let toBeDrawn = theTetrominoes[randomTet][currentRotation].map(index => currentPosition + index)
        let needPush = toBeDrawn.some(index => squares[index].classList.contains('fixed'))

        // push from fixed without fixed touched (left only)
        let fixedInLeftLeft = current.some(index => squares[currentPosition + index - 2].classList.contains('fixed'))
        let noSpaceForLeftPush_LeftOnly = toBeDrawn.some(index => squares[index + 1].classList.contains('fixed'))
        let crossRightEdge_LeftOnly = toBeDrawn.some(index => (index + 1) % 10 == 0)
        if(fixedInLeftLeft && needPush && !noSpaceForLeftPush_LeftOnly && !crossRightEdge_LeftOnly){
            currentPosition++
        }
        
        // push from fixed with fixed touched (for left & right)
        let touchLeftFixed = current.some(index => squares[currentPosition + index - 1].classList.contains('fixed'))
        let noSpaceForLeftPush = toBeDrawn.some(index => squares[index + 2].classList.contains('fixed'))
        let crossRightEdge = toBeDrawn.some(index => (index + 2) % 10 == 0)
        if(touchLeftFixed && needPush && !noSpaceForLeftPush && !crossRightEdge){
            currentPosition += 2
        }
        let touchRightFixed = current.some(index => squares[currentPosition + index + 1].classList.contains('fixed'))
        let noSpaceForRightPush = toBeDrawn.some(index => squares[index - 1].classList.contains('fixed'))
        let crossLeftEdge = toBeDrawn.some(index => (index - 1) % 10 == 9)
        if(touchRightFixed && needPush && !noSpaceForRightPush && !crossLeftEdge){
            currentPosition --
        } else return false
    } else return false
}

function iTet_pushFromBaseAndFixedBottom() {
    if(currentRotation == 1 || currentRotation == 3){
        let toBeDrawn = theTetrominoes[randomTet][currentRotation].map(index => currentPosition + index)
        let pushFromBase = toBeDrawn.some(index => squares[index].classList.contains('base'))
        let pushFromFixed = current.some(index => squares[currentPosition + index + 10].classList.contains('fixed'))
        let noSpaceToPushUp = toBeDrawn.some(index => squares[index-10].classList.contains('fixed'))
        let needPush = toBeDrawn.some(index => squares[index].classList.contains('fixed'))
        if ((pushFromBase || pushFromFixed && needPush) && !noSpaceToPushUp) {
            currentPosition -= 10
            return true
        }
    } else return false
}

function iTet_finalCheck(){
    let toBeDrawn = theTetrominoes[randomTet][currentRotation].map(index => currentPosition + index)
    let noSpaceCzFixed = toBeDrawn.some(index => squares[index].classList.contains('fixed'))
    let noSpaceCzEdge = toBeDrawn.some(index => index % 10 == 9) && toBeDrawn.some(index => index % 10 == 0)

    if ((noSpaceCzFixed || noSpaceCzEdge) && iTet_pushFromEdge()==false && iTet_pushFromFixed()==false && iTet_pushFromBaseAndFixedBottom()==false){
        if(currentRotation == 0){
            currentRotation = 3
        } else currentRotation--
    }
}



function deductLine(){
    let oneUnit = []
    for(let i = 0; i < 10; i++){
        oneUnit.push(i)
        //console.log(oneUnit)        // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
    for(let i = 20; i < 220; i += 10){
        let tenArr = oneUnit.map(index => index + i)        // eg. i = 80, tenArr = [80,...,89]
        let fullLine = tenArr.every(index => squares[index].classList.contains('fixed'))
        if(fullLine){
            tenArr.forEach(index => squares[index].classList.remove('fixed'))
            let checkAbove = []
            for (let j = 20; j < i; j++){
                checkAbove.push(j)
            }
            let containFixed = checkAbove.filter(index => squares[index].classList.contains('fixed'))
            containFixed.forEach(index => squares[index].classList.remove('fixed'))
            containFixed.forEach(index => squares[index + 10].classList.add('fixed'))
        }

    }
}
