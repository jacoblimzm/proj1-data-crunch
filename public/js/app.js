const $tileGrid = $(".tile-grid");
// assigning the query selector for the grid to a variable since it's gonna be used a lot.
const colors = ["red", "green", "blue", "yellow", "purple"]; // creating an array of colours so we can assign random colours to the tile divs in the HTML.
let num = 8;
let score = 0;
let blank = "rgb(255, 255, 255)";

// ========== FUNCTION FOR CREATING THE BOARD ==========

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
    $tileGrid.append($divTile);
  }
};

// ========== COLOUR SWAPPING FUNCTIONALITY USING CLICK AND HOVER EVENT LISTENERS ==========

const hoverSwap = (e) => {
  let tileElem = e.target; // grabbing the event object and the target, which is the div, because we are interested in the properties.
  // console.log(tileElem) // console.log to ensure we have grabbed the correct target. the DIV node should be logged.
  let $tileElem = $(tileElem); // wrapping the vanilla JS node in money so it becomes a jQuery object and we can work with it.
  colorSwap2 = $tileElem.css("background-color"); // store the colour so that we may use it to swap colours.
  idSwap2 = Number($tileElem.attr("id")); // the attribute is returned as a string by default, so convert into a number.
  // console.log(colorSwap2); // console.log to make sure we have grabbed the right information
  console.log(idSwap2) // console.log to make sure we have grabbed the right information
};

let colorSwap1, colorSwap2, idSwap1, idSwap2; // creating variables to store the values of the background color and id for the selected tile, and the intended tile to swap with
let validTilesSwap = [];
const clickSwap = (e) => {
  // need the event object which is passed into the callback function from the event listener. can access many properties of the element through the event object.
  let tileElem = e.target; // e.target is the way to access the properties with an anonymous function.
  let $tileElem = $(tileElem);

  let rightEdgeTiles = [7, 15, 23, 31, 39, 47, 55]; // don't want the RIGHT EDGE tiles to be able to be swapped with LEFT EDGE tile on following row
  let leftEdgeTiles = [0, 8, 16, 24, 32, 40, 48, 56]; // don't want the LEFT EDGE tiles to be able to be swapped with RIGHT EDGE tile on following row

  if (colorSwap1 !== undefined && validTilesSwap.includes(idSwap2)) {
    // we only want to swap the colours if there is an existing colour stored in colorSwap1, AND the cursor is hovering over a different tile.
    //   console.log($(".tile").eq(idSwap2)) // check we have selected the right jQuery object.
    $(".tile").eq(idSwap2).css("background-color", colorSwap1); // using the id which is equivalent to the index, access the tile in the array and swap the colours.
    $(".tile").eq(idSwap1).css("background-color", colorSwap2); // using the id which is equivalent to the index, access the tile in the array and swap the colours.
    idSwap1 = null; // after the swap has been completed, reset the idSwap1.
    colorSwap1 = undefined; // reset colorSwap1 as well.
  } else {
    // if there is no existing id stored in idSwap1 and color stored in colorSwap1, store upon click.
    // because this means game just started, or swap just been made.
    idSwap1 = parseInt($tileElem.attr("id"));
    colorSwap1 = $tileElem.css("background-color");
    // ==== we also want to restrict the tiles that can be swapped to simply the tiles directly beside, above, and below it.
    if (rightEdgeTiles.includes(idSwap1)) {
      // if right edge tile is clicked, the valid tiles for swapping are only above, left, below
      validTilesSwap = [idSwap1 - 8, idSwap1 - 1, idSwap1 + 8];
    } else if (leftEdgeTiles.includes(idSwap1)) {
      // if left edge tile is clicked, the valid tiles for swapping are only above, right, below
      validTilesSwap = [idSwap1 - 8, idSwap1 + 1, idSwap1 + 8];
    } else {
      validTilesSwap = [idSwap1 - 8, idSwap1 - 1, idSwap1 + 1, idSwap1 + 8]; // all other tiles, above, left, right, below can be swapped.
    }
    //
  }
  // console.log(colorSwap1); // make sure we have grabbed the right info
  // console.log(idSwap1); // make sure we have grabbed the right info
};

// ========== MAIN jQUERY FUNCTION ==========
$(() => {
  createTiles(); // creating the tiles

  //   let $tiles = $(".tile"); // returns ALL the jQuery nodes with .tile class. diff from a regular array. it is a collection.
  //   $tiles.on("click", clickSwap); // apply the event listener to ALL tiles
  //   $tiles.on("mouseover", hoverSwap); // apply the event listener to ALL tiles

  /// ========== CHECKING FOR MATCHES ==========

  // ====== CHECK FOR 3 IN A ROW MATCHES
//   for (let i = 0; i < num ** 2; i++) {
//     let invalidTiles = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
//     let $divTiles = $(".tile");

//     if (!invalidTiles.includes(i)) {
//       let tileColor = $divTiles.eq(i).css("background-color");
//       let tileColor1 = $divTiles.eq(i + 1).css("background-color");
//       let tileColor2 = $divTiles.eq(i + 2).css("background-color");
//       if (tileColor === tileColor1 && tileColor1 === tileColor2) {
//         $divTiles.eq(i).css("background-color", blank);
//         $divTiles.eq(i + 1).css("background-color", blank);
//         $divTiles.eq(i + 2).css("background-color", blank);
//         score += 3;
//         console.log(score);
//       }
//     }
//   }

 // ===== CHECK FOR 4 IN A ROW MATCHES
//   for (let i = 0; i < num**2; i++) {
//       let invalidTiles = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55];
//       let $divTiles = $(".tile");

//       if (!invalidTiles.includes(i)) {
//         let tileColor = $divTiles.eq(i).css("background-color");
//         let tileColor1 = $divTiles.eq(i + 1).css("background-color");
//         let tileColor2 = $divTiles.eq(i + 2).css("background-color");
//         let tileColor3 = $divTiles.eq(i + 3).css("background-color");
//       if (tileColor === tileColor1 && tileColor1 === tileColor2 && tileColor2 === tileColor3) {
//         $divTiles.eq(i).css("background-color", blank);
//         $divTiles.eq(i + 1).css("background-color", blank);
//         $divTiles.eq(i + 2).css("background-color", blank);
//         $divTiles.eq(i + 3).css("background-color", blank);
//         score += 4;
//         console.log(score);
//       }
//     }
//   }


// ===== CHECK FOR 3 IN A COL MATCH

// for (let i = 0; i < num ** 2; i++) {
//     let $divTiles = $(".tile");

    
//       let tileColor = $divTiles.eq(i).css("background-color");
//       let tileColor1 = $divTiles.eq(i + 8).css("background-color");
//       let tileColor2 = $divTiles.eq(i + 16).css("background-color");
//       if (tileColor === tileColor1 && tileColor1 === tileColor2) {
//         $divTiles.eq(i).css("background-color", blank);
//         $divTiles.eq(i + 8).css("background-color", blank);
//         $divTiles.eq(i + 16).css("background-color", blank);
//         score += 3;
//         console.log(score);
//       }
//     }


// ====== CHECK FOR 4 IN A COL MATCH

  for (let i = 0; i < num**2; i++) {
      
      let $divTiles = $(".tile");

        let tileColor = $divTiles.eq(i).css("background-color");
        let tileColor1 = $divTiles.eq(i + 8).css("background-color");
        let tileColor2 = $divTiles.eq(i + 16).css("background-color");
        let tileColor3 = $divTiles.eq(i + 24).css("background-color");
      if (tileColor === tileColor1 && tileColor1 === tileColor2 && tileColor2 === tileColor3) {
        $divTiles.eq(i).css("background-color", blank);
        $divTiles.eq(i + 8).css("background-color", blank);
        $divTiles.eq(i + 16).css("background-color", blank);
        $divTiles.eq(i + 24).css("background-color", blank);
        score += 4;
        console.log(score);
      }
    }

    setTimeout(() => {

        for (let i = 0; i< num**2; i++) {

            let $divTiles = $(".tile");
            let tileColor = $divTiles.eq(i).css("background-color");
            let tileColor1 = $divTiles.eq(i + 8).css("background-color");
            console.log(tileColor1)
            if (tileColor1 === blank) {
                $divTiles.eq(i).css("background-color", blank);
                $divTiles.eq(i + 8).css("background-color", tileColor);
                
            }
        }
        
    }, 2000);
    

}); // end of jQuery onready function.
