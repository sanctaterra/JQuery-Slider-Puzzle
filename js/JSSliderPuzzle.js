/* *** *** ***

This JS file has been developed by Mark Holden
for use with the JSSliderPuzzle.html
See Readme.txt in /jssliderpuzzle for more information

*** *** *** */

$(document).ready(function(){
	
	/* **
	Future TODOs:
	* Image uploader
		- Split image into parts
		- Place image parts into elements
	* Competiton Timer
	* Timer to delay tile selection - block repetitive commands / allow animation to finish before the next move can be made
	
	Future Improvements:
	* Expand possible grid sizes
		- Player selects size grid they want
		- Number of tiles = sq(grid-size)
		- Work out background image placement
	* Gap is always in the same place - improve?
	
	Notes:
	Tiles are placed randomly by shuffling - this can result in some combinations being UNSOLVABLE
	This issue was discovered after placing the puzzle into http://analogbit.com/software/puzzletools/ during testing
	* Finding Unsolvable configurations may be well beyond the scope of this project
	
	** */
	
	/* Initialisation */
	

	/* Get page elements */
	var $gameBoard = $('#game-board');																	// Game board
	var $container = $('#container');																			// Container of the board
	var $tiles = $('.game-tile');																					// Tiles
	var $scoreCounter = $('#score .score');																	// Score counter
	var $imageSelection = $("#image-selection")	;														// Get selectable images
	var currentImage = $imageSelection.find("img.active-selection").attr("src");	// Get active selection image path
	var $resetButton = $("#reset");																			// Reset button

	/* Set Background images on the game board and target board */
	$tiles.each(function(){
		$(this).css({
			"background-image": "url(" + currentImage + ")"
		});
	});
	$("#game-target").css({
		"background-image": "url(" + currentImage + ")"
	});
	
	// var $gridSize = $('grid-size selector');		// TODO: Grid size selector - see above
	

	/* Create variables */
	var gameArray = [];				// Array for tile pieces
	var winningArray = [];			// winning condition checker
	var tempArray = [];				// Temporary Array
	var top = 0; 							// Tile top position
	var left = 0; 							// Tile left position
	var currentScore = 0; 			// Current Score counter
	var currentState = 0; 			// Current state checker
	var gridSize = 3;					// Grid Size
	var rowChecker = [false];		// Dynamic array to hold whether beginning rows are complete or not
	

	/* Constants */
	const TILE_SIZE = 102;												// Size of the tiles 		// TODO: Improve - rather than hardcode
	const POSITIVE_TILE_MOVEMENT = "+=" + TILE_SIZE; 	// For css animation
	const NEGATIVE_TILE_MOVEMENT = "-=" + TILE_SIZE;	// For css animation
	

	/* Function Declarations */

	/* Randomise the winning array to create the starting configuration
	** Note ** the following function is adapted from the Fisher-Yates (Knuth) Shuffle: https://github.com/coolaj86/knuth-shuffle */
	shuffle_array = function(array){
		var currentIndex = array.length,
									temporaryValue,
									randomIndex;
		
		while(0 !== currentIndex){
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex -= 1;
				temporaryValue = array[currentIndex];
				array[currentIndex] = array[randomIndex];
				array[randomIndex] = temporaryValue;
			}
		return array;
	}
	
	// Search array for the given element
	search_array = function(object){
		for(var y = 0; y < gridSize ; y++){			// For loop along Y
			for(var x = 0; x < gridSize; x++){		// For loop along X
				if($(gameArray[[x,y]]).is(object)){	// Check if object
					return [x,y];								// Return Index
				}
				else {
					continue;
				}
			}
		}
	}
	
	// Check if the game has been completed yet
	winning_check = function(){
		
		/* **
		Loop through the arrays to compare if the JQuery objects match, if at any point they do not match, return.
		If at the end of the loop, there is no false return, then the arrays match and the game has been won.
		
		This has been updated to include a 'row-checker', this keeps track of complete rows (starting from the top)
		If a row is complete, the following function will assume it's complete and therefore not spend time looking for
		mis-matches
		** */
		
		var win = (function(){														// Lets see if we've won yet!
			var c = 0;
			while(c < gridSize){
				if(rowChecker[c] == true){ 									
					c += 1;																	// Row is complete, so no need to check, move onto the next
					continue;
				}
				else { 																		// Row is not complete, so start looking for mismatches
					for(var y = 0 + c; y < gridSize; y++){						// Check each value
						for(var x = 0; x < gridSize; x++){
							if(gameArray[[x,y]] !== winningArray[[x,y]]){
								rowChecker[c] = false;								// This row is incomplete, so rowChecker needs to be set to false
								return false;												// A mismatch has been found - we haven't won just yet!
							} else {
								continue;													// So far all matching, continue checking
							}
						}
						rowChecker[c] = true;										// At the end of the loop, and this row has no mismatches so update the rowChecker
						c += 1;
					}
					return true;															// For loop has passed without returning false - this means we've won!
				}
			}
			window.alert('Something went wrong in row-checking. Please contact the developer');													
		}());

		// Final check
		if(win == true){
			$scoreCounter.text('YOU WIN!');	// They match, so the game has been completed!
			currentState = 1;						// The game has been won, prevent future action
		}
		else {
			return;
		}
		
		/* **
		This method loops through each axis and comparing the elements one at a time
		This problem could result in large amounts of wasted time on larger puzzles
		This issue has been partly overcome by using the rowChecker solution, which stores
		a related true value for each y row. Each related row is set to true when a full loop is completed without mismatching
		** */
		
	}
	
	// Reset Game, either by selecting the Reset Button or selecting a new image
	reset = function(img = null){
		
		sort_tiles = function(){								// Sort tiles into starting position first
			$tiles.sort(function(a,b){
				var x = a.getAttribute('data-tile');
				var y = b.getAttribute('data-tile');
				if(x > y){
					return 1;
				}
				if(x < y){
					return -1;
				}
				return 0;
			});
			$tiles.detach().appendTo($gameBoard);		// Reinject into the html
		};
		
		// Reset to 0
		sort_tiles();
		currentScore = 0;
		$scoreCounter.text(currentScore);
		currentState = 0;
		
		if(img != null){ // Change image if required
			currentImage = img;
			$tiles.each(function(){											// Set Background images on the game board and target board
				$(this).css({
					"background-image": "url(" + currentImage + ")"
				});
			});
			$("#game-target").css({
				"background-image": "url(" + currentImage + ")"
			});			
		}
		
		// All resets done, initialise Arrays
		initialise_arrays();
	}
	
	// Array Initialisation
	initialise_arrays = function(){
		tempArray = $tiles.toArray();								// Place tiles into an Array
		tempArray[tempArray.length] = null;						// Note: the gameArray empty element comes up as null. The winningArray element will be undefined. This will prevent equality checks as null != undefined (This accesses the +1 empty element that is not currently apparent in the tilelist)
		
		// Insert tiles into the winning area (i.e, the right order) for later comparison checks
		for(var i = 0; i < tempArray.length; i++){
			for(var y = 0; y < gridSize; y++){
				for(var x = 0; x < gridSize; x++, i++){
					winningArray[[x,y]] = tempArray[i];
				}
			}
		}

		tempArray = 0;													// Clear temp array
		tempArray = shuffle_array($tiles.toArray());			// Shuffle Array and place the return into Temp
		
		// Insert tempArray into a multidimensional array
		for(var i = 0; i < tempArray.length; i++){
			for(var y = 0; y < gridSize; y++){ 					// For loop along Y
				for(var x = 0; x < gridSize; x++, i++){ 		// For loop along X
					$(tempArray[i]).css({								// Set position for the current element
						top: TILE_SIZE * y + 'px',
						left: TILE_SIZE * x + 'px'
					});
					gameArray[[x,y]] = tempArray[i]; 			// Insert selected element into array
				}
			}
		}
	}
	
	initialise_arrays();
	
	// On selecting a new image
	$("#image-selection img").on('click', function(){
		var selection = this.getAttribute('src');
		reset(selection);
		$(".active-selection").removeClass('active-selection');
		$(this).addClass("active-selection");
		
	});
	
	// On selecting the reset button
	$resetButton.on('click', function(){
		reset();
	});
	
	/* **
	All Initialisation is complete, now enter the main game state
	that will be actived by the user selecting a tile (if the game_state does not
	already imply that game has been won).
	The game works by getting the tile that has been selected, searching
	both axis to see if movement is available. If a tile should not move, then the function will
	return nothing. If movement is possible, it will do so along the correct axis, animate the tile,
	update the score counter and then check if the winning condition has been met.
	Once the winning condition has been met, no further action will be available to the player
	** */	
	
	$('.game-tile').on('click', function(){
		if(currentState == 0){
			var selection = $(this);
			var selectionIndex = search_array(selection);	// Find this element in the array

			var currentX = selectionIndex[0];					// search array and go through the indexes to find empty element. if 'next to' empty element, then move
			var currentY = selectionIndex[1];
			
			// Main movement function
			is_empty = function(index, direction){ 			// Index we are moving the element to, and the direction the index is in to the selection
				currentScore = currentScore + 1; 				// Movement is allowed so increase the score
				$scoreCounter.text(currentScore);
				
				// Animate the movement
				switch(direction){
					case 'left':
						selection.animate({
							left: NEGATIVE_TILE_MOVEMENT
						}, 1000, function(){
						});
						break;
					case 'right':
						selection.animate({
							left: POSITIVE_TILE_MOVEMENT
						}, 1000, function(){
						});
						break;
					case 'above':
						selection.animate({
							top: NEGATIVE_TILE_MOVEMENT
						}, 1000, function(){
						});
						break;
					case 'below':
						selection.animate({
							top: POSITIVE_TILE_MOVEMENT
						}, 1000, function(){
						});
						break;
					default:
						// Something went wrong!
						window.alert('Something went wrong in moving the tile. Please contact the developer');
				}
				
				// Now place the moved element into its new index			
				gameArray[[index[0], index[1]]] = gameArray[[currentX, currentY]];		// Copy the element to the new array position
				gameArray[[currentX, currentY]] = null; 											// Set original index to null TODO: While this works, it doesn't feel 'right'? - I want to move the element itself, not just copy it across - optimal?
				
				// All movement done! Now have we won?
				winning_check();
				
				return;
			}

			// Check index in array. If the expression returns true, then an element is in the way, and therefore the selection cannot move to this position
			// If the test returns false, then there is no contained element, and the selection can move to the new position			

			// search X axis first

			/* Convert X position to case values
				0 = top / right
				1 = centre
				2 = bottom / left
			*/
			var currentXCase;
			if(currentX == 0){																// Left most position
				currentXCase = 0;
			}
			else if(currentX == gridSize - 1){											// Right most position
				currentXCase = 2;
			}
			else {																				// Every other position
				currentXCase = 1;
			}
			
			switch(currentXCase){
				case 0:																			// Element is on the left, so test the right side
					if(gameArray[[currentX + 1, currentY]] == null){
						is_empty([currentX + 1, currentY], 'right');					// Element is empty, so call is_empty with empty index and position
						return;
					}
					else {
						break;																	// Tested index is not empty, so break and move onto the Y axis
					}
				case 1:																			// Element is in the centre, so test both sides
					if(gameArray[[currentX - 1, currentY]] == null){ 			// Test left side first
						is_empty([currentX - 1, currentY], 'left');
						return;
					}
					else if(gameArray[[currentX + 1, currentY]] == null){ 	// Now test right side
						is_empty([currentX + 1, currentY], 'right');
						return;
					} else {
						break;
					}
					break;
				case 2: 																			// Final case, right-most tile, so test left side only
					if(gameArray[[currentX - 1, currentY]] == null){
						is_empty([currentX - 1, currentY], 'left');
						return;
					}
					else {
						break;
					}
				default:
					// Something went wrong!
					window.alert('Something went wrong X axis testing. Please contact the developer');
			}		


			// No movement on the X axis, so search the Y axis

			// Note - detection is now required to check if a row that is registered as 'true' has been altered. If so, then it must be set to false;
			
			/* Convert Y position to case values
				0 = top / right
				1 = centre
				2 = bottom / left
			*/
			var currentYCase;
			if(currentY == 0){																// Left most position
				currentYCase = 0;
			}
			else if(currentY == gridSize - 1){											// Right most position
				currentYCase = 2;
			}
			else {																				// Every other position
				currentYCase = 1;
			}

			switch(currentYCase){
				case 0: 																			// Element is at the top, so test the below ( y values increase as visually going down )
					if(gameArray[[currentX, currentY + 1]] == null){
						if(rowChecker[currentY] == true){							// Only updating the rowChecker if movement can occur
							rowChecker[currentY] = false;
						}
						is_empty([currentX, currentY + 1], 'below');				// Element is empty, so call is_empty with empty index and position
						return;
					}
					else {
						break;																	// Tested index is not empty, so break and return - no movement available
					}
				case 1: 																			// Element is in the centre, so test both above and below
					if(gameArray[[currentX, currentY - 1]] == null){			// Test above first
						if(rowChecker[currentY] == true){
							rowChecker[currentY] = false;
						}
						is_empty([currentX, currentY - 1], 'above');
						return;
					}
					else if(gameArray[[currentX, currentY + 1]] == null){ 	// Now test below
						if(rowChecker[currentY] == true){
							rowChecker[currentY] = false;
						}
						is_empty([currentX, currentY + 1], 'below');
						return;
					} else {
						break;
					}
					break;
				case 2:																			// Final case, bottom-most tile, so test above only
					if(gameArray[[currentX, currentY - 1]] == null){
						if(rowChecker[currentY] == true){
							rowChecker[currentY] = false;
						}
						is_empty([currentX, currentY - 1], 'above');
						return;
					}
					else {
						break;
					}
				default:
					// Something went wrong!
					window.alert('Something went wrong Y axis testing. Please contact the developer');
			}
			
			// An unmoveable tile had been selected, nothing further can happen
			
		}else{
			// Nothing - the game has been won!
			return;
		}
	})
});