const grid = document.querySelector(".tile-grid");
// assigning the query selector for the grid to a variable since it's gonna be used a lot.

const colours = [
    "red",
    "green",
    "blue",
    "yellow",
    "purple"
]; // creating an array of colours so we can assign random colours to the tile divs in the HTML.

let tilesArr = document.querySelectorAll(".tile"); // querySelectorAll finds all the HTML tags with the class of "tile" and outputs them into an array so we can loop through it.

// ===== CREATING THE BOARD
// loop through the array of tilesArr,
for (let i = 0; i < tilesArr.length; i++) {
  // and assign a random colour to each one.
  let randomColor = Math.floor(Math.random() * colours.length);
  tilesArr[i].style.backgroundColor = colours[randomColor];

  //also give each tile an id that corresponds to their position so they can be accessed later.
  tilesArr[i].setAttribute("id", i);
}

// ===== SWITCHING THE TILES WITH EACH OTHER
let colorSwap1, colorSwap2, idSwap1, idSwap2; // creating variables to store the values of the background color and id for the selected tile, and the intended tile to swap with

let clickSwap = (e) => { // need the event object which is passed into the callback function from the event listener. can access many properties of the element through the event object.
    let tileElem = e.target; // e.target is the way to access the properties.

    if (colorSwap1 !== undefined && idSwap1 !== idSwap2) { // we only want to swap the colours if there is an existing colour stored in colorSwap1, AND the cursor is hovering over a different tile.
        tilesArr[idSwap2].style.backgroundColor = colorSwap1; // using the id which is equivalent to the index, access the tile in the array and swap the colours.
        tilesArr[idSwap1].style.backgroundColor = colorSwap2; // using the id which is equivalent to the index, access the tile in the array and swap the colours.
        idSwap1 = null; // after the swap has been completed, reset the idSwap1.
        colorSwap1 = undefined; // reset colorSwap1 as well.
    } else { // if there is no existing id stored in idSwap1 and color stored in colorSwap1, do so upon click.
        idSwap1 = Number(tileElem.id); 
        colorSwap1 = tileElem.style.backgroundColor;
    }

    console.log(colorSwap1);
    console.log(idSwap1);
    
  };

let hoverSwap = (e) => { 
    let tileElem = e.target;
    colorSwap2 = tileElem.style.backgroundColor; // 
    idSwap2 = Number(tileElem.id);
    // console.log(colorSwap2);
    // console.log(idSwap2)
}
tilesArr.forEach((tile) => { // give each tile in the grid two event liseners, a click event and a mouseover event
  tile.addEventListener("click", clickSwap);  // the click event listener will either store information upon click, or swap colors if existing information is present.
  tile.addEventListener("mouseover", hoverSwap); // the mouseover event will automatically store the information of whatever tile the user is hovering over for a swap.
});


