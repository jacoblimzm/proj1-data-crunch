const colors = ["url(public/images/mobile-phone.png)", "url(public/images/location.png)", "url(public/images/camera-with-flash.png)", "url(public/images/magnifying-glass.png)", "url(public/images/house.png)"]; // creating an array of colours so we can assign random colours to the tile divs in the HTML.
const questions = ["Please provide your address for more moves! 🏠", "Please provide your age for more moves! 📇", "Please provide your gender for more moves! 🏳️‍🌈", "Please provide your browsing history for more moves! 🔎", "Please provide the names of your family members for more moves! 👩‍👩‍👧"];
let num = 8; // the size of the grid;
let score = 0;
let moveCount = 10;
let round = 1;
let privacyScore = 500; // hidden privacy score that user cannot see
let difficulty = 0;
let userName = "";
let blank = "none";

let colorSwap1, colorSwap2, idSwap1, idSwap2; // creating variables to store the values of the background-image and id for the selected tile, and the intended tile to swap with
let validTilesSwap = []; // array storing position of valid tiles for swapping only if beside each other. ==> click event listener
const checkColorMatch = []; //array which stores all the colors at at one time, to check if a match has been made after a click. if not, swap tile colour back.



// ========== FUNCTIONS FOR CREATING THE BOARD ==========

const createBoard = () => {
    $("body").empty();
    // the round text div
    $h1Round = $("<h1>").text("Round")
    $h2Round = $("<h2>").attr("id", "round").text(round); // changed the magic text to reflect the variables instead.
    $divRound = $("<div>").attr("id", "round-div");
    $divRound.append($h1Round).append($h2Round);
    
    // score text div
    $h1Score = $("<h1>").text("Score")
    $h2Score = $("<h2>").attr("id", "score").text(score); // changed the magic text to reflect the variables instead.
    $divScore = $("<div>").attr("id", "score-div");
    $divScore.append($h1Score).append($h2Score);

    // moves left div
    $h1Moves = $("<h1>").text("Moves")
    $h2Moves = $("<h2>").attr("id", "moves").text(moveCount); // changed the magic text to reflect the variables instead.
    $divMoves = $("<div>").attr("id", "moves-div");
    $divMoves.append($h1Moves).append($h2Moves);

    // tile grid div
    $divGrid = $("<div>").attr("class", "tile-grid");

    // BUTTON DIV WITH BUTTONS
    // restart button
    $restartButton = $("<button>").text("Restart?").attr("id", "restart").attr("class", "btn btn-primary")
    $restartButton.on("click", restartGame);

    // difficulty button
    $diffButton = $("<button>").text("Too Easy?").attr("id", "difficulty").attr("class", "btn btn-warning")
    $diffButton.on("click", increaseDifficulty)

    $buttonDiv = $("<div>").attr("id", "button-div");
    $buttonDiv.append($restartButton).append($diffButton);


    $("body").append($divRound).append($divScore).append($divMoves).append($divGrid).append($buttonDiv);


    
}

const randInt = () => {
  // random integer generator to be used for random colour picking. dependent on colors array.
  return Math.floor(Math.random() * colors.length);
};

const createTiles = () => {
  for (let i = 0; i < num ** 2; i++) {
    // for loop that will change based on number of tiles per row.
    // create the individual tiles
    let $divTile = $("<div>");
    // give them class of "tile" and a unique id each.
    $divTile.addClass("tile").attr("id", i);
    //calling the random number function to pick random colours.
    $divTile.css("background-image", colors[randInt()]);
    $divTile.on("click", clickSwap);
    $divTile.on("mouseover", hoverSwap);
    // append each tile to the body.
    $(".tile-grid").append($divTile);
  }
};

  /// ========== CHECKING FOR MATCHES ==========

  const createInvalidTilesArray = (size, match) => {
    let hold = [];
    let invalidTile = [];
    for (let i = 0; i < size; i++) { // so "8" can be replaced by however large the grid is. in this case 8x8.
      hold.push([...Array(size).keys()]); // push an array of length 8, starting from 0 into a holding array.
      hold[i] = hold[i].map(x => x + (size * i)) // add on the array based on which "row" it is in. i = 0 => row 1, i = 1 => row 2....
    }
  
    for (let i = 0; i < size; i++) {
      hold[i] = hold[i].filter(x => x > size * (i + 1) - match) // filter out the invalid tiles, which are always more than (size * row) - match: i + 1 because i = 0. match is the number of tiles in a row.
      invalidTile.push(...hold[i]) // push the array into the invalidTiles array, then use spread operator to expand the elements.
    }
    return invalidTile
  }

  // ====== CHECK FOR ROW MATCHES

  const checkRowMatch = (gridSize, rowMatch) => {
    for (let i = 0; i < gridSize ** 2; i++) { // loop through all the tiles in the grid
        // we don't want the matching to cross over, hence need an array of the invalidTiles, which restrict the matching.
        let invalidTiles = createInvalidTilesArray(gridSize, rowMatch); // creates an array of the invalid tiles based on gridSize (size of the grid) and rowMatch (matches in a row required).
        let $divTiles = $(".tile"); // selection of all the tiles
        let rowIndex = [...Array(rowMatch).keys()]; // automatically create an array rowMatch elements long. keys() iterates through the indexes and fills it sequentially from 0.
        
        if (!invalidTiles.includes(i)) { // check to make sure the current tile is valid
          let firstTileColor = $divTiles.eq(i).css("background-image"); // we want to compare the rest of the tiles to the first.

          // booleans
          let isBlank = $divTiles.eq(i).css("background-image") === blank; // we also need to know if the current tile is blank.
          let isEveryTileSame = rowIndex.every( index => 
            $divTiles.eq(i + index).css("background-image") === firstTileColor); // is every tile the same colour? this is where rowIndex comes into play. every can iterate through the index, behaving like a loop.
          
            
          if (isEveryTileSame && !isBlank) {  
              score += rowMatch; // add to the overall score of the page IF THE SQUARES ARE NOT BLANKS to prevent score build when there are blanks being filled in.
              privacyScore -= rowMatch;
              $("#score").text(score);
              rowIndex.forEach( index => 
                $divTiles.eq(i + index).css("background-image", blank)
                ); // again using rowIndex to iterate down from the current tile.
          }
        }
      }      
  }


// ===== CHECK FOR 3 IN A COL MATCH
const checkColMatch = (gridSize, colMatch) => {

    for (let i = 0; i < gridSize ** 2; i++) { // loop through all the tiles in the grid
        // array of invalid tiles not needed here, as columns don't cross.
        let $divTiles = $(".tile");
        let colIndex = [...Array(colMatch).keys()];
        let firstTileColor = $divTiles.eq(i).css("background-image");


        //booleans - similar to checking for rows, we need two booleans for columns. Knowing if the tile is blank(or not) and if it is same colour as the first tile
        let isBlank = $divTiles.eq(i).css("background-image") === blank;
        let isEveryTileSame = colIndex.every( index => 
          $divTiles.eq(i + gridSize * index).css("background-image") === firstTileColor
          );
        

        if (isEveryTileSame && !isBlank) {
          score += colMatch;
          privacyScore -= colMatch;
          $("#score").text(score);
          colIndex.forEach( index => 
            $divTiles.eq(i + gridSize * index).css("background-image", blank)
            );
        }
    }
};
  

// ========== MOVING TILES DOWNWARDS IF THERE ARE EMPTY SPACES ==========

const moveTilesDown = () => {
    
    for (let i = 0; i< num**2; i++) { // loop through all the tiles
        // const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]; // defining the first row as it is the most important when 'FILLING UP'
        const firstRow = [...Array(num).keys()];
        let $divTiles = $(".tile"); // selecting all the tiles
        let tileColor = $divTiles.eq(i).css("background-image"); // we are interested in a-image of a tile...
        let tileColor1 = $divTiles.eq(i + num).css("background-image"); // and the-image of the tile directly below it...
        
        if (tileColor1 === blank) { // if the tile directly below is blank...
            $divTiles.eq(i).css("background-image", blank);  // make the tile above blank.
            $divTiles.eq(i + num).css("background-image", tileColor); // give the tile below the-image of the tile above!
            
        }

        // if the tile is in the first row, AND it is blank, we want to generate a random colour for it from the colours array.
        if (firstRow.includes(i) && $divTiles.eq(i).css("background-image") === blank) {
            $divTiles.eq(i).css("background-image", colors[randInt()]);
        }
    }

};

// ========== CHECKING FOR MATCHES AND CLEARING BLANKS ==========

// ===== GENERAL CHECKING FOR MATCHES AND CASCADING

const checkAndClear = () => {
    // check for matches
    checkRowMatch(num, 4);
    checkColMatch(num, 4);
    checkRowMatch(num, 3);
    checkColMatch(num, 3); 

    for (let i = 0; i < num**2; i++) { // looping through the tile colors AFTER a check for matches has been made, which will generate blank tiles if matches made.
        const tileColor = $(".tile").eq(i).css("background-image");
        checkColorMatch.push(tileColor) // pushing them into the checkColorMatch holder array
    }     
    while (checkColorMatch.includes(blank)) { // while the array contains a blank
        moveTilesDown(); // recall that this will move tiles down AND generate new tiles
        checkColorMatch.pop(); // remove an element so this loop will run a max of array.length times, or until there are no more blanks.
    }
    checkColorMatch.length = 0; // empty the array so that it can be reused again for the next clicks
}


// ===== ONLY ALLOWING FOR SWAP IF THE MATCH IS VALID 

const checkSwapValid = () => { 
    // similar to checkAndClear but specific to the click functionality. 
    // this is because we need to create the colours array to check for matches before allowing/disallowing a swap.
    // we can and have reduced it to simply just a check and clear function above.
    // NOT the best practice but will do for now.

    // checking for any matches!!!
    checkRowMatch(num, 4);
    checkColMatch(num, 4);
    checkRowMatch(num, 3);
    checkColMatch(num, 3); 

    // Block1
    for (let i = 0; i < num**2; i++) { // looping through the tile colors AFTER a check for matches has been made.
        const tileColor = $(".tile").eq(i).css("background-image");
        checkColorMatch.push(tileColor) // pushing them into the checkColorMatch holder array
    }     
    
    // Block2
    const isMatchMade = checkColorMatch.includes(blank);
    if (isMatchMade) { // if any tile is blank, means a match has been made.
        idSwap1 = null; // after the swap has been completed, reset the idSwap1.
        colorSwap1 = undefined; // reset colorSwap1 as well.

        moveCount -= 1; // decrease count every time a VALID move has been made
        round += 1; // only increase the round IF a VALID move has been made.
        $("#round").text(round);
        $("#moves").text(moveCount) // update the move counter with the VALID moves left.

        if (moveCount <= 0) { // if out of moves, ===> END GAME!!
            pauseGame();
        }
    } else { // if no tile is blank, means no match has been made, then it is an invalid move, and tiles will swap back.
        
        setTimeout(() => { // setTimeOut function to make the-image swap back visible.
            $(".tile").eq(idSwap2).css("background-image", colorSwap2); // using the id which is equivalent to the index, access the tile in the array and swap the-image BACK
            $(".tile").eq(idSwap1).css("background-image", colorSwap1); // using the id which is equivalent to the index, access the tile in the array and swap the-image BACK
            idSwap1 = null; // after the swap has been completed, reset the idSwap1.
            colorSwap1 = undefined; // reset colorSwap1 as well.
        }, 150);
        
    }

    // Block3
    while (checkColorMatch.includes(blank)) { // while the array with the colors of the tiles contain blanks,
        moveTilesDown(); // got to move the tiles down.
        checkColorMatch.pop();
    }
    checkColorMatch.length = 0; // when there are no more blank tiles, the array will still have some colours inside. so clear the array.
}


// ========== EVENT LISTENERS ==========

// ===== COLOUR SWAPPING FUNCTIONALITY USING CLICK AND HOVER

// STATE MACHINE TO DEAL WITH THE TILE SELECTION HIGHLIGHT

const tileHighlight = ($nodeObj) => {
    if ($(".tile").hasClass("clicked")) { // check if ANY of the tiles has been clicked prior,
        if ($nodeObj.hasClass("clicked")) { // check if the prior clicked tile is the one currently about to be clicked
          $nodeObj.removeClass("clicked"); // if YES, remove the class.
        } else { // if NOT, need to check if the tile about to be clicked is in a valid position. the validTilesSwap array will contain that information if a prior tile has been clicked before.
            if (validTilesSwap.includes(idSwap2)) { // this refers to idSwap2 because the tile you're intending to swap to is the one you're hovering over.
                // if it is a valid move, great, remove the highlight from the previously clicked tile.
                $(".tile").eq(idSwap1).removeClass("clicked");
            } else {
              // if not a valid move, remove highlight from previously clicked tile and add highlight to the current clicked tile
              $(".tile").eq(idSwap1).removeClass("clicked");
              $nodeObj.addClass("clicked");
            }
        }
    } else { 
      $nodeObj.addClass("clicked"); // if no tiles clicked prior, add the highlight to the current tile being clicked.
    }
    
}


// HOVER EVENT LISTENER
const hoverSwap = (e) => {
  let tileElem = e.target; // grabbing the event object and the target, which is the div, because we are interested in the properties.
  // console.log(tileElem) // console.log to ensure we have grabbed the correct target. the DIV node should be logged.
  let $tileElem = $(tileElem); // wrapping the vanilla JS node in money so it becomes a jQuery object and we can work with it.
  colorSwap2 = $tileElem.css("background-image"); // store the colour so that we may use it to swap colours.
  console.log(colorSwap2)
  idSwap2 = Number($tileElem.attr("id")); // the attribute is returned as a string by default, so convert into a number.
  console.log(idSwap2)
  // console.log(colorSwap2); // console.log to make sure we have grabbed the right information
//   console.log(idSwap2) // console.log to make sure we have grabbed the right information
};

// CLICK EVENT LISTENER
const clickSwap = (e) => {
  // need the event object which is passed into the callback function from the event listener. can access many properties of the element through the event object.
  let tileElem = e.target; // e.target is the way to access the properties with an anonymous function.
  let $tileElem = $(tileElem);
  let rightEdgeTiles = [7, 15, 23, 31, 39, 47, 55]; // don't want the RIGHT EDGE tiles to be able to be swapped with LEFT EDGE tile on following row
  let leftEdgeTiles = [0, 8, 16, 24, 32, 40, 48, 56]; // don't want the LEFT EDGE tiles to be able to be swapped with RIGHT EDGE tile on following row
  
  // stateMachine to determine which tiles should have the halo or not.
  tileHighlight($tileElem);

  if (colorSwap1 !== undefined && validTilesSwap.includes(idSwap2)) {
    // we only want to swap the colours if there is an existing colour stored in colorSwap1(which means a prior click has been made), AND the cursor is hovering over a different tile that is VALID.
    // console.log($(".tile").eq(idSwap2)) // check we have selected the right jQuery object.
    $(".tile").eq(idSwap2).css("background-image", colorSwap1) // using the id which is equivalent to the index, access the tile in the array and swap the colours.
    $(".tile").eq(idSwap1).css("background-image", colorSwap2) // using the id which is equivalent to the index, access the tile in the array and swap the colours.
    
    // we want to make sure there are matches, if no matches switch back. this is enclosed in the checkSwapValid() functionality.
    // NOTE: this is a bit of an issue because checkSwapValid will call a few functions as well.
    // ALSO NOTE: the checkSwapValid is NOT independent. uses globally declared values.
    checkSwapValid(); 
    
     
  } else { // if there is no existing id stored in idSwap1 and-image stored in colorSwap1, store upon click.
    // because this means game just started, or swap just been made.
    idSwap1 = parseInt($tileElem.attr("id"));
    colorSwap1 = $tileElem.css("background-image");
    // ==== we also want to restrict the tiles that can be swapped to simply the tiles directly beside, above, and below it.
    if (rightEdgeTiles.includes(idSwap1)) {
      // if right edge tile is clicked, the valid tiles for swapping are only above, left, below (which are n(size of grid) tiles away)
      validTilesSwap = [idSwap1 - num, idSwap1 - 1, idSwap1 + num];
    } else if (leftEdgeTiles.includes(idSwap1)) {
      // if left edge tile is clicked, the valid tiles for swapping are only above, right, below
      validTilesSwap = [idSwap1 - num, idSwap1 + 1, idSwap1 + num];
    } else {
      validTilesSwap = [idSwap1 - num, idSwap1 - 1, idSwap1 + 1, idSwap1 + num]; // all other tiles, above, left, right, below can be swapped.
    }
    // console.log(validTilesSwap);
  }
  // console.log(colorSwap1); // make sure we have grabbed the right info
  // console.log(idSwap1); // make sure we have grabbed the right info
};


// ===== RESTART BUTTON

const restartGame = () => { // restart event click handler
    createBoard();  // empty the tile grid div. used to be $(".tile-grid").empty but changed so restart will clear endgame pop-up.
    colors.splice(5, difficulty + 1); // we have to reset the colors array to the original set, which has 5 colors (ends at index 4), we want to remove (difficulty+1) elements because difficulty starts from 0;
    score = 0; // reset score to zero
    moveCount = 10; // reset the moveCount to 10.
    round = 1; // reset round to 1
    privacyScore = 500; // reset the privacyScore to 500.
    difficulty = 0;
    $("#score").text(score); // update the score.
    $("#moves").text(moveCount); // update the moves.
    $("#round").text(round); // update the number of rounds.
    createTiles(); // create tiles
    // checkAndClear(); // check and clear the board. (NOT NECESSARY NOW SINCE CHECK AND CLEAR RUNNING IN BACK)
}


// ========== STARTING THE GAME ==========
const playGame = () => {
    createBoard();
    createTiles();
    checkAndClear();    
    // Only when the play button is clicked, does the checking of the matches begin!!!
    setInterval(() => {
        checkAndClear(); 
    }, 500);
}

// ===== SEND INSTRUCTIONS, WHICH WILL SHOW THE INSTRUCTIONS FOR THE USER UPON CLICK! HANDLES THE FORM'S DATA AS WELL.
const sendInstructions = (e) => {
     
  // GETTING FORM DATA
    // Method 1 - Simply targeting the specific input element
    // console.log($("#userName").val())
  
    // Method 2- Parsing the entire form's data into an object which you can then flexibly retrieve with the 'name' attribute.
    const formData = new FormData(e.target);
    userName = formData.get("user-name"); // the data of the input whic you're interested in MUST have the 'name' attribute.
    e.preventDefault(); // prevent the default refresh behaviour of a form or submit button when submitted.
    $(".instructions").slideDown("slow")
    $(".play").on("click", playGame);

}

// ========== PAUSES/ENDS THE GAME WHEN THE NUMBER OF MOVES HIT ZERO ==========
const pauseGame = () => {

    // creating the div to hold the title, text, and buttons.
    let $endDiv = $("<div>").addClass("end-game"); //create a div to hold the information of the end-game text and options
    let $h1GameOver = $("<h1>").text(`Oh no, you're out of moves ${userName}!`); // with the userName entered and captured by the game, we will reflect it back
    let $pGameOver = $("<p>").text(questions[Math.floor(Math.random() * questions.length)]); // the questions will be randomly selected from the question array
    $endDiv.append($h1GameOver).append($pGameOver); // append both the h1 and the paragraph element to the div.

    // create the button div, with two buttons.
    let $buttonDiv = $("<div>").addClass("d-grid gap-2 col-6 mx-auto") // create the button div for the Bootstrap buttons
    let $buttonYes = $("<button>").addClass("yes btn btn-success").attr("type", "button").text("HELL YEAH!"); // Bootstrap success button
    $buttonYes.on("click", continueGame);
    let $buttonNo = $("<button>").addClass("no btn btn-outline-danger").attr("type", "button").text("NOPE... END THE GAME FOR ME..."); // Bootstrap danger button
    $buttonNo.on("click", endGame);
    $buttonDiv.append($buttonYes).append($buttonNo); // append the buttons on the button div

    $endDiv.append($buttonDiv); 
    $("body").append($endDiv);
    $endDiv.slideDown("slow");
}

// ===== CONTINUE GAME WITH MORE MOVES IF USER INDICATES YES.
const continueGame = () => {
  moveCount = 3; // only need to reset the moveCount to 3 if the player wants to continue with the game.
  $("#moves").text(moveCount); 
  $(".end-game").remove();
}

// ====== END GAME WITH REVEAL OF SCORE IF USER INDICATES NO.
const endGame = () => {
  // using existing h1 and p elements in the div to display information.
  $(".end-game h1").text(`Game Over ${userName}!`); 
  $(".end-game p").html(`While you were having fun and matching tiles, 
  we were matching information on you as well. 🕵️‍♂️
  The more matches you made, the more information 
  was linked to you. As a result, your Privacy Score was impacted! 
  Your final result: <strong>Game Score: ${score}. Privacy Score: ${privacyScore}</strong>.`)
}

const increaseDifficulty = () => { //
  const additionalColors = ["pink", "grey", "turquoise"]; // array holding more colours to push into the colors array.
  colors.push(additionalColors[difficulty]); // 
  difficulty += 1; // increase difficulty count which will allow to 'cycle' through the additional colors array.
  createBoard(); 
  createTiles();
}

// ========== MAIN jQUERY FUNCTION ==========
$(() => {

    // since HTML page loads immediately, attach the sendInstructions event listener to the form which will kickstart the process.
    $("form").on("submit", sendInstructions);





}); // end of jQuery onready function.
