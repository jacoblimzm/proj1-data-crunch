// const $body = $("body");
// const $tileGrid = $(".tile-grid"); // assigning the query selector for the grid to a variable since it's gonna be used a lot.
const colors = ["red", "green", "blue", "yellow", "purple"]; // creating an array of colours so we can assign random colours to the tile divs in the HTML.
let num = 8; // the size of the grid;
let score = 0;
let moveCount = 10;
let userName = "";
let blank = "rgb(255, 255, 255)";

let colorSwap1, colorSwap2, idSwap1, idSwap2; // creating variables to store the values of the background color and id for the selected tile, and the intended tile to swap with
let validTilesSwap = []; // array storing position of valid tiles for swapping only if beside each other. ==> click event listener
const checkColorMatch = []; //array which stores all the colors at at one time, to check if a match has been made after a click. if not, swap tile colour back.




// ========== FUNCTIONS FOR CREATING THE BOARD ==========

const createBoard = () => {
    $("body").empty();
    // the round text div
    $h1Round = $("<h1>").text("Round")
    $h2Round = $("<h2>").attr("id", "round").text("1");
    $divRound = $("<div>").attr("id", "round-div");
    $divRound.append($h1Round).append($h2Round);
    
    // score text div
    $h1Score = $("<h1>").text("Score")
    $h2Score = $("<h2>").attr("id", "score").text("0");
    $divScore = $("<div>").attr("id", "score-div");
    $divScore.append($h1Score).append($h2Score);

    // moves left div
    $h1Moves = $("<h1>").text("Moves")
    $h2Moves = $("<h2>").attr("id", "moves").text("10");
    $divMoves = $("<div>").attr("id", "moves-div");
    $divMoves.append($h1Moves).append($h2Moves);

    // tile grid div
    $divGrid = $("<div>").attr("class", "tile-grid");

    // button div
    $button = $("<button>").text("Restart?").attr('id', "restart").attr("class", "btn btn-primary")
    $button.on("click", restartGame);
    $divButton = $("<div>").attr("id", "button-div");
    $divButton.append($button);
    
    $("body").append($divRound).append($divScore).append($divMoves).append($divGrid).append($divButton);

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
    $divTile.css("background-color", colors[randInt()]);
    $divTile.on("click", clickSwap);
    $divTile.on("mouseover", hoverSwap);
    // append each tile to the body.
    $(".tile-grid").append($divTile);
  }
};

  /// ========== CHECKING FOR MATCHES ==========
  // ====== CHECK FOR 3 IN A ROW MATCHES

  const checkRowThree = () => {
    for (let i = 0; i < num ** 2; i++) { // loop through all the tiles in the grid
        // we don't want the matching to cross over, hence need an array of the invalidTiles, which restrict the matching.
        let invalidTiles = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55]; 
        let $divTiles = $(".tile"); // selection of all the tiles
        if (!invalidTiles.includes(i)) { // check to make sure the current tile is valid
            // save the colours of the three tiles.
          let tileColor = $divTiles.eq(i).css("background-color");
          let tileColor1 = $divTiles.eq(i + 1).css("background-color");
          let tileColor2 = $divTiles.eq(i + 2).css("background-color");

          // if the tiles are all the same colur, make them all blank!
          if (tileColor === tileColor1 && tileColor1 === tileColor2) {
            if ($divTiles.eq(i).css("background-color") !== blank) { // but FIRST...!
                score += 3; // add to the overall score of the page IF THE SQUARES ARE NOT BLANKS to prevent adding of score when there are blanks being filled in.
                $("#score").text(score);
            }
            $divTiles.eq(i).css("background-color", blank);
            $divTiles.eq(i + 1).css("background-color", blank);
            $divTiles.eq(i + 2).css("background-color", blank);
          }
        }
      }      
  }

 // ===== CHECK FOR 4 IN A ROW MATCHES

const checkRowFour = () => { // loop through all the tiles in the grid
    for (let i = 0; i < num**2; i++) {
        // we don't want the matching to cross over, hence need an array of the invalidTiles, which restrict the matching.
        let invalidTiles = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55];
        let $divTiles = $(".tile"); // selection of all the tiles
        if (!invalidTiles.includes(i)) { // check to make sure the current tile is valid
            // save the colours of the FOUR tiles.
          let tileColor = $divTiles.eq(i).css("background-color");
          let tileColor1 = $divTiles.eq(i + 1).css("background-color");
          let tileColor2 = $divTiles.eq(i + 2).css("background-color");
          let tileColor3 = $divTiles.eq(i + 3).css("background-color");

        // if the tiles are all the same colur, make them all blank!
        if (tileColor === tileColor1 && tileColor1 === tileColor2 && tileColor2 === tileColor3) {
            if ($divTiles.eq(i).css("background-color") !== blank) { // but FIRST...!
                score += 4; // add to the overall score of the page IF THE SQUARES ARE NOT BLANKS
                $("#score").text(score);
            }
          $divTiles.eq(i).css("background-color", blank);
          $divTiles.eq(i + 1).css("background-color", blank);
          $divTiles.eq(i + 2).css("background-color", blank);
          $divTiles.eq(i + 3).css("background-color", blank);
        }
      }
    }    
}


// ===== CHECK FOR 3 IN A COL MATCH
const checkColThree = () => {

    for (let i = 0; i < num ** 2; i++) { // loop through all the tiles in the grid
        // array of invalid tiles not needed here, as columns don't cross.
        let $divTiles = $(".tile");
        // save the colours of the THREE tiles. one tile below the current is always i + (n * size of grid).
          let tileColor = $divTiles.eq(i).css("background-color");
          let tileColor1 = $divTiles.eq(i + num).css("background-color");
          let tileColor2 = $divTiles.eq(i + num * 2).css("background-color");
          // if colours are the same, then change all to blank.
          if (tileColor === tileColor1 && tileColor1 === tileColor2) {
            if ($divTiles.eq(i).css("background-color") !== blank) { // but FIRST...!
                score += 3; // add to the overall score of the page IF THE SQUARES ARE NOT BLANKS
                $("#score").text(score);
            }
            $divTiles.eq(i).css("background-color", blank);
            $divTiles.eq(i + num * 1).css("background-color", blank);
            $divTiles.eq(i + num * 2).css("background-color", blank);
          }
        }
};


// ====== CHECK FOR 4 IN A COL MATCH
const checkColFour = () => {
    for (let i = 0; i < num**2; i++) { // loop through all the tiles in the grid
        // array of invalid tiles not needed here, as columns don't cross.
        let $divTiles = $(".tile");
        // save the colours of the FOUR tiles. one tile below the current is always i + (n * size of grid).
          let tileColor = $divTiles.eq(i).css("background-color");
          let tileColor1 = $divTiles.eq(i + num * 1).css("background-color");
          let tileColor2 = $divTiles.eq(i + num * 2).css("background-color");
          let tileColor3 = $divTiles.eq(i + num * 3).css("background-color");

          // if colours are the same, then change all to blank.
        if (tileColor === tileColor1 && tileColor1 === tileColor2 && tileColor2 === tileColor3) {
            if ($divTiles.eq(i).css("background-color") !== blank) { // but FIRST...!
                score += 4; // add to the overall score of the page IF THE SQUARES ARE NOT BLANKS
                $("#score").text(score);
            }
          $divTiles.eq(i).css("background-color", blank);
          $divTiles.eq(i + num * 1).css("background-color", blank);
          $divTiles.eq(i + num * 2).css("background-color", blank);
          $divTiles.eq(i + num * 3).css("background-color", blank);
        }
      }
};
  

// ========== MOVING TILES DOWNWARDS IF THERE ARE EMPTY SPACES ==========

const moveTilesDown = () => {
    
    for (let i = 0; i< num**2; i++) { // loop through all the tiles
        const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]; // defining the first row as it is the most important when 'FILLING UP'
        let $divTiles = $(".tile"); // selecting all the tiles
        let tileColor = $divTiles.eq(i).css("background-color"); // we are interested in a color of a tile...
        let tileColor1 = $divTiles.eq(i + num).css("background-color"); // and the color of the tile directly below it...
        
        if (tileColor1 === blank) { // if the tile directly below is blank...
            $divTiles.eq(i).css("background-color", blank);  // make the tile above blank.
            $divTiles.eq(i + num).css("background-color", tileColor); // give the tile below the color of the tile above!
            
        }

        // if the tile is in the first row, AND it is blank, we want to generate a random colour for it from the colours array.
        if (firstRow.includes(i) && $divTiles.eq(i).css("background-color") === blank) {
            $divTiles.eq(i).css("background-color", colors[randInt()]);
        }
    }

};

// ========== CHECKING FOR MATCHES AND CLEARING BLANKS ==========

// ===== GENERAL CHECKING FOR MATCHES AND CASCADING

const checkAndClear = () => {
    // check for matches
    checkRowFour();
    checkColFour();
    checkRowThree();
    checkColThree(); 

    for (let i = 0; i < num**2; i++) { // looping through the tile colors AFTER a check for matches has been made, which will generate blank tiles if matches made.
        const tileColor = $(".tile").eq(i).css("background-color");
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
    checkRowFour();
    checkColFour();
    checkRowThree();
    checkColThree(); 

    for (let i = 0; i < num**2; i++) { // looping through the tile colors AFTER a check for matches has been made.
        const tileColor = $(".tile").eq(i).css("background-color");
        checkColorMatch.push(tileColor) // pushing them into the checkColorMatch holder array
    }     
        
    if (checkColorMatch.includes(blank)) { // if any tile is blank, means a match has been made.
        idSwap1 = null; // after the swap has been completed, reset the idSwap1.
        colorSwap1 = undefined; // reset colorSwap1 as well.
        moveCount -= 1; // decrease count every time a VALID move has been made
        $("#moves").text(moveCount) // update the move counter with the VALID moves left.
        
    } else { // if no tile is blank, means no match has been made, then it is an invalid move, and tiles will swap back.
        
        setTimeout(() => { // setTimeOut function to make the color swap back visible.
            $(".tile").eq(idSwap2).css("background-color", colorSwap2); // using the id which is equivalent to the index, access the tile in the array and swap the color BACK
            $(".tile").eq(idSwap1).css("background-color", colorSwap1); // using the id which is equivalent to the index, access the tile in the array and swap the color BACK
            idSwap1 = null; // after the swap has been completed, reset the idSwap1.
            colorSwap1 = undefined; // reset colorSwap1 as well.
        }, 150);
        
    }
    while (checkColorMatch.includes(blank)) { // while the array with the colors of the tiles contain blanks,
        moveTilesDown(); // got to move the tiles down.
        checkColorMatch.pop();
    }
    checkColorMatch.length = 0;
}


// ========== EVENT LISTENERS ==========

// ====== COLOUR SWAPPING FUNCTIONALITY USING CLICK AND HOVER

// HOVER EVENT LISTENER
const hoverSwap = (e) => {
  let tileElem = e.target; // grabbing the event object and the target, which is the div, because we are interested in the properties.
  // console.log(tileElem) // console.log to ensure we have grabbed the correct target. the DIV node should be logged.
  let $tileElem = $(tileElem); // wrapping the vanilla JS node in money so it becomes a jQuery object and we can work with it.
  colorSwap2 = $tileElem.css("background-color"); // store the colour so that we may use it to swap colours.
  idSwap2 = Number($tileElem.attr("id")); // the attribute is returned as a string by default, so convert into a number.
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
  

  // === stateMachine to determine which tiles should have the halo or not.
  if ($(".tile").hasClass("clicked")) {
      if ($tileElem.hasClass("clicked")) {
        $tileElem.removeClass("clicked");
      } else {
          if (validTilesSwap.includes(idSwap2)) { // this refers to idSwap2 because the tile you're intending to swap to is the one you're hovering over.
          // and it will check against the validTilesSwap array which SHOULD be filled (as a tile is already highlighted), meaning that a prior tile has been clicked before.
              $(".tile").eq(idSwap1).removeClass("clicked");
          } else {
            $(".tile").eq(idSwap1).removeClass("clicked");
            $tileElem.addClass("clicked");
          }
      }
  } else {
    $tileElem.addClass("clicked"); // also, add "clicked" class to show that the tile has been selected.
  }

  if (colorSwap1 !== undefined && validTilesSwap.includes(idSwap2)) {
    // we only want to swap the colours if there is an existing colour stored in colorSwap1(which means a prior click has been made), AND the cursor is hovering over a different tile that is VALID.
    // console.log($(".tile").eq(idSwap2)) // check we have selected the right jQuery object.
    $(".tile").eq(idSwap2).css("background-color", colorSwap1); // using the id which is equivalent to the index, access the tile in the array and swap the colours.
    $(".tile").eq(idSwap1).css("background-color", colorSwap2); // using the id which is equivalent to the index, access the tile in the array and swap the colours.
    
    // we want to make sure there are matches, if no matches switch back. this is enclosed in the checkSwapValid() functionality.
    // NOTE: this is a bit of an issue because checkSwapValid will call a few functions as well.
    // ALSO NOTE: the checkSwapValid is NOT independent. uses globally declared values.
    checkSwapValid(); 
    
     
  } else { // if there is no existing id stored in idSwap1 and color stored in colorSwap1, store upon click.
    // because this means game just started, or swap just been made.
    idSwap1 = parseInt($tileElem.attr("id"));
    colorSwap1 = $tileElem.css("background-color");
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
    console.log(validTilesSwap);
  }
  // console.log(colorSwap1); // make sure we have grabbed the right info
  // console.log(idSwap1); // make sure we have grabbed the right info
};


// ===== RESTART BUTTON

const restartGame = () => { // restart event click handler
    $(".tile-grid").empty();  // empty the tile grid div.
    score = 0; // reset it to zero
    moveCount = 10; // reset the move to 10.
    $("#score").text(score); // update the score.
    $("#moves").text(moveCount); // update the moves.
    createTiles(); // create tiles
    // checkAndClear(); // check and clear the board. (NOT NECESSARY NOW SINCE CHECK AND CLEAR RUNNING IN BACK)
}


// ===== PLAY GAME, WHICH TAKES THE USER'S NAME. HANDLES THE FORM'S DATA
const playGame = (e) => {

    // GETTING FORM DATA

    // Method 1 - Simply targeting the specific input element
    // console.log($("#userName").val())

    // Method 2- Parsing the entire form's data into an object which you can then retrieve with the 'name' attribute.
    const formData = new FormData(e.target);
    userName = formData.get("user-name");
    e.preventDefault();
    createBoard();
    createTiles();
    checkAndClear();    

    // Only when the play button is clicked, does the checking of the matches begin!!!
    setInterval(() => {
        console.log("Hello")
        checkAndClear();
    }, 500);
}


// ========== MAIN jQUERY FUNCTION ==========
$(() => {

    // attaching a 
    $("form").on("submit", playGame)






  // ========== THE START PAGE ==========

  // $body.empty();
  // $landingDiv = $("<div>").attr("id", "landing");
  // $body.append($landingDiv);


}); // end of jQuery onready function.
