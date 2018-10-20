
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided 'shuffle' method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of 'open' cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


/*
 * Creates a list that holds all of your cards
 * Also creates holding variables for moves, event listner for new game symbol
 * and matched count
 */

var deck = document.querySelector('.deck');
var clickedCards = [];
var moves = 0;
var repeat = document.querySelector('.restart');
let matched = 0;
let timerCount = 0;
let timerStart = false;
let timerId;

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

function shuffler(){
   var cardCollector = Array.from(document.querySelectorAll('.deck li'));
   var shuffling = shuffle(cardCollector);
   for (card of shuffling){
     deck.appendChild(card);
   }
 }
 shuffler();


/*
 * 
 * FUNCTIONS RELATED TO TIMER
*/

function timerStarter(){
    timer = 0;
    var timerElement = document.querySelector('.timer');
        timerId = setInterval(() =>{
        timer ++;
        timerElement.innerHTML = `${timer}`;
        }, 1000)  
}

function timerReset(){
    timerStart = false;
    timerCount = 0;

    var timerElement = document.querySelector('.timer');
    timerElement.innerHTML = '0';
    
}

deck.addEventListener('click', event => {
                      var firstClick = event.target;
    if (conditionals(firstClick)){
        if (!timerStart){
            timerStarter();
            timerStart = true;
        }
    }
                      })

function displayTime(){
    const clock = document.querySelector('.timer');
    clock.innerHTML = time;
}

function stopTimer(){
    clearInterval(timerId);
}


/*
 * FUNCTIONS RELATED TO CARD MATCHING AND PROCESSING
*/ 

// Sets up event listener for clicked cards
deck.addEventListener('click', event =>{
    var clickCard = event.target;
    if (conditionals(clickCard)
       ){
        toggle(clickCard);
        addClickedCards(clickCard);
        if (clickedCards.length === 2){
            checkMatch();
            addMoves();
            starRating();
        }
    }
});

// Set up event listener for new game symbol
repeat.addEventListener('click', event=>{
    newGame();
})


// Function toggles "open" and "show" classlist
function toggle(card){
    card.classList.toggle('open');
    card.classList.toggle('show');
}

// Function adds the clicked card to clickedCards array for comparison
function addClickedCards(clickCard){
    clickedCards.push(clickCard);
    
}

// Function provides preconditions to match cards by avoiding more than 2 open 
// cards, clicking on the same card during the match, and
// attempting to match already matched cards
function conditionals(clickCard){
    return(
    clickCard.classList.contains('card') &&
        clickedCards.length < 2 &&
        !clickedCards.includes(clickCard) &&
        !clickCard.classList.contains('match'))
}

// Function checks whether two clicked cards in clickedCards array match
// Will push to "match" classList if true
// If all matches are made, will end game
function checkMatch(){
    if (
        clickedCards[0].firstElementChild.className ===
        clickedCards[1].firstElementChild.className
        ){
            clickedCards[0].classList.toggle('match');
            clickedCards[1].classList.toggle('match');
            clickedCards = [];
            matched ++;
            if (matched === 8){
                endScreen();
                stopTimer();
            }
    }
    else{
        setTimeout(function() {
                clickedCards.forEach(function(card){
                    card.classList.remove('open', 'show');
                })
                clickedCards = [];
            }, 1000)
    }
}


/*
 * FUNCTIONS RELATED TO GAME STATS
*/ 

// Function keeps counter of moves
function addMoves(){
    moves++;
    var totalMoves = document.querySelector('.moves');
    totalMoves.innerHTML = moves;
}

//Function will check the amount of moves and call deathStar funtion to reduce number of stars
function starRating(){
    if (moves === 14 || moves === 24) {
        deathStar()
    }
}

// Function to reduce the number of stars
function deathStar(stars){
    var stars = document.querySelectorAll('.stars li');
    for (star of stars){
        if (star.style.display != 'none'){
            star.style.display = 'none';
            break;
        }
    }
    
}

// Function starts a new game by calling on functions to shuffle cards 
// and reset moves counter
function newGame(){
    var cardsMatched = Array.from(document.querySelectorAll('.match'));
    newGameCounter();
    
    for (card of cardsMatched){
        card.classList.remove('open', 'show', 'match');
    }
    
    for (card of clickedCards){
        card.classList.remove('open', 'show', 'match');
    }
    
    
    var stars = document.querySelectorAll('.stars li');
    for (star of stars){
        if(star.style.display = 'none'){
            star.style.display = 'inline';
        }
    }
    stopTimer();
    timerReset();
    matched = 0;
    shuffler();
    timerStart();
}


// Function resets move counter to 0
function newGameCounter(){
    moves = 0
    var movesReset = document.querySelector('.moves');
    movesReset.innerHTML = moves;
}

/*
 * FUNCTIONS RELATED TO MODAL
*/ 

// Function calls on function for modal and creates listeners for 
// new game and cancel buttons
function endScreen(){
    toggleModalOn();
    var newGameSelector = document.getElementById('modal-new-game');
    var modalCancel = document.getElementById('modal-cancel');
    
    newGameSelector.addEventListener('click', event=>{
        toggleModalOff();
        newGame();
    })
    
    modalCancel.addEventListener('click', event =>{
        toggleModalOff();
    })
    
}

// Function to bring up end of game modal
function toggleModalOn(){
    var modalWindow = document.querySelector('.modal')
    modalWindow.style.display = 'inherit'
    modalMovesStats();
    modalStarsStats();
    modalTimerStats();
    }

// Function to hide end of game modal
function toggleModalOff(){
    var modalWindow = document.querySelector('.modal')
    modalWindow.style.display = 'none';
    }

// Function that writes stats on end of game modal
function modalMovesStats(){
    var modalMoves = document.querySelector('.modal-moves');
    modalMoves.innerHTML = `Moves: ${moves}`;
}

// Function that counts number of stars in game
function modalStarsStats(){
    var modalStars = document.querySelector('.modal-stars');
    var starsStats = document.querySelectorAll('.stars li');
    var starCount = 0;
    for (star of starsStats){
        if (star.style.display != 'none'){
            starCount++;
        }
    }
    modalStars.innerHTML = `Stars: ${starCount}`;   
}
    
function modalTimerStats(){
    var modalTimer = document.querySelector('.modal-timer');
    modalTimer.innerHTML = `Timer: ${timer}`;
}