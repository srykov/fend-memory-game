/*
 * Create a list that holds all of your cards
 */
 const deck = ['fa-diamond', 'fa-diamond', 'fa-leaf', 'fa-leaf', 'fa-bicycle', 'fa-bicycle', 'fa-bolt', 'fa-bolt', 'fa-bomb', 'fa-bomb', 'fa-anchor', 'fa-anchor', 'fa-cube', 'fa-cube', 'fa-paper-plane-o', 'fa-paper-plane-o'];

 let openCards = [];
 let numMoves = 0;
 let numMatches = 0;

document.addEventListener('DOMContentLoaded', initializeGame);

/*
 * Perform all of the tasks necessary to initialize a new game.
 */
function initializeGame(){

	resetMoveCounter();

	displayCards();
	const resetButton = document.querySelector('.fa-repeat');
	resetButton.addEventListener('click', handleReset);
}

/*
 * Perform all of the tasks necessary to end the game.
 */
function endGame(){
	const deckDiv = document.querySelector('.deck');
	const cards = deckDiv.querySelectorAll('.card');

	openCards = [];
	numMatches = 0;

	for(let i = 0; i < cards.length; i++){
		const icon = cards[i].querySelector('i');
		cards[i].removeChild(icon);
	}
	const resetButton = document.querySelector('.fa-repeat');
	resetButton.removeEventListener('click', handleReset);
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function displayCards(){
	shuffle(deck);

	const deckDiv = document.querySelector('.deck');
	const cards = deckDiv.querySelectorAll('.card');

	for(let i = 0; i < cards.length; i++){

		cards[i].classList.remove('show', 'open', 'match');

		const icon = document.createElement('i');
		icon.classList.add('fa', deck[i]);
		cards[i].appendChild(icon);
	}
	deckDiv.addEventListener('click', handleClickCard);

}

/*
 * Increment the moves counter by one and display it on the page.
 */
function incrementMoveCounter(){
	numMoves++;
	const moves = document.querySelector('.moves');
	moves.textContent = numMoves;
}

/*
 * Reset the moves counter to zero and display it on the page.
 */
function resetMoveCounter(){
	numMoves = 0;
	const moves = document.querySelector('.moves');
	moves.textContent = numMoves;
}


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * Handle click event on a card.
 *
 */
function handleClickCard(event){

	//only handle click events on cards
	if(event.target.nodeName.toLowerCase() == 'li'){
		const card = event.target;

		//only handle click events on face *down* cards
		if(!card.classList.contains('open')){

			//display the card's symbol
			flipCard(event.target);

			//add the card to a list of open cards
			addToOpenCards(event.target);

			if(openCards.length %2 == 0){

				const currentCard = openCards[openCards.length - 1];
				const previousCard = openCards[openCards.length - 2];

				//there is an even nuber of cards on the open cards stack, so check for a match
				if(isMatch(currentCard, previousCard)){
					//mark cards as matched & lock in open position
					makeMatch(currentCard, previousCard);
				} else{
					//no match, after a delay (to allow user to see the cards),
					//flip cards back over & remove from list
					matchFail(currentCard, previousCard);
				}
			}
			//increment the move counter and display it on the page
			incrementMoveCounter();

			//TODO: if all cards have matched, display a message with the final score
		}

		if(numMatches == 8){
			winGame();
		}
	}

}

function winGame(){
	setTimeout(function(){
		playSound('win');
	}, 1000);
	endGame();
}

/*
 * Flip card over. If the card was previously face down, display the cards symbol, and vice versa.
 */
function flipCard(card){
	playSound('flip');
	card.classList.toggle('open');
	card.classList.toggle('show');
}

/*
 * Push card onto stack of open cards.
 */
function addToOpenCards(card){
	openCards.push(card);
}

/*
 * Check to see if the last two cards on the open cards stack are a match.
 */
function isMatch(currentCard, previousCard){

	let matchFound = false;

	//get the symbols for the last two cards, so we can compare them
	const currentSymbol = currentCard.querySelector('i').classList.item(1);
	const previousSymbol = previousCard.querySelector('i').classList.item(1);

	if(currentSymbol === previousSymbol){
		matchFound = true;
	}
	return matchFound;
}

/*
 * Perform actions require on match success.
 */
function makeMatch(currentCard, previousCard){
	currentCard.classList.add('match');
	previousCard.classList.add('match');
	numMatches++;
	setTimeout(function(){
		playSound('match');
	}, 1000);
}

/*
 * Perform actions required on match failure.
 */
function matchFail(currentCard, previousCard){

	setTimeout(function(){
		// flip cards back over
		flipCard(currentCard);
		flipCard(previousCard);

		//take the last two cards off the stack
		openCards.pop();
		openCards.pop();
	}, 1000);
}

/*
 * Play a sound, given an action.
 *
 */
  function playSound(action) {
    const audio = document.querySelector(`audio[data-key="${action}"]`);
    if (!audio) return;

    audio.currentTime = 0;
    audio.play();
  }

/*
 * Handle click event on the reset button
 */
function handleReset(event){
	endGame();
	initializeGame();
}