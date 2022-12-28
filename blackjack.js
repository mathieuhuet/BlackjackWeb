/*
Blackjack browser game for Codeworks assignment
by Mathieu Huet, November 23rd 2022
*/

let humanHand = [];
let computerHand = [];
let humanScore = 500;
let humanBet = 20;

/*
Create a object singleDeckOfCards that represent the 52cards of a deck of cards.
It helps manage what happens to our deck of card so there's not five Aces on the board or something like that.
H=Hearts D=Diamonds C=Clubs S=Spades
There's a function drawCard that return a card for the array of _cards and remove it from the array
There's also a function named resetDeck that puts back all the cards in the array
*/
const singleDeckOfCards = {
  _cards: ['AH','2H','3H','4H','5H','6H','7H','8H','9H','0H','JH','QH','KH','AD','2D','3D','4D','5D','6D','7D','8D','9D','0D','JD','QD','KD','AC','2C','3C','4C','5C','6C','7C','8C','9C','0C','JC','QC','KC','AS','2S','3S','4S','5S','6S','7S','8S','9S','0S','JS','QS','KS'],
  drawCard(){
    let rng = Math.floor(Math.random() * this._cards.length)
    card = this._cards[rng]
    this._cards.splice(rng, 1)
    return card
  },
  resetDeck(){
    this._cards = ['AH','2H','3H','4H','5H','6H','7H','8H','9H','0H','JH','QH','KH','AD','2D','3D','4D','5D','6D','7D','8D','9D','0D','JD','QD','KD','AC','2C','3C','4C','5C','6C','7C','8C','9C','0C','JC','QC','KC','AS','2S','3S','4S','5S','6S','7S','8S','9S','0S','JS','QS','KS']
  }
}

/*
Adds up the total of the array of cards according to BlackJack rules.
Will add an element to the array when there's an Ace to cover the value of either 1 or 11
*/
function handTotal (array) {
  let total = [0]
  for (let i = 0; i < array.length; i++){
    if (array[i][0] === 'K' || array[i][0] === 'Q' || array[i][0] === 'J'){
      for (let k = 0; k < total.length; k++){
        total[k] += 10
      }
    } else if (array[i][0] === 'A'){
      for (let k = 0; k < total.length; k++){
        total[k] += 1
      }
      let loop = total.length
      for (let k = 0; k < loop; k++){
        total.push(total[k] + 10)
      }
    } else if (!isNaN(Number(array[i][0]))){
      for (let k = 0; k < total.length; k++){
        if (Number(array[i][0]) === 0){
          total[k] += 10
        } else {
          total[k] += Number(array[i][0])
        }
      }
    }
  }
  return total
}

/*
Check if you've passed the limit(22) you can hold in your hand
*/
function checkBust (array) {
  let bust = false
  array.sort(compareNumbers)
  if (array[0] > 21){
    bust = true
  }
  return bust
}
//Only used to sort the array from the smallest Integer to the bigger one
const compareNumbers = (a,b) => a-b

/*
Check if someone has 21 with their hand. You win the game when you have exactly 21.
*/
function checkBlackjack (array) {
  let blackjack = false;
  for (let i = 0; i < array.length; i++){
    if (array[i] === 21) {
      blackjack = true;
    }
  }
  return blackjack;
}

/*
Check if the Dealer should draw a card.
*/
function checkDealer (array) {
  array = handTotal(array);
  let draw = false;
  for (let i = 0; i < array.length; i++){
    if (array[i] < 17) {
      draw = true;
    }
  }
  for (let i = 0; i < array.length; i++){
    if (array[i] > 17 && array[i] < 22) {
      draw = false;
    }
  }
  return draw;
}


/*
Check who won between the dealer and the player
*/
function checkWinner (humanTotal, computerTotal) {
  let winner = 'draw';
  let humanBestHand = 0;
  let computerBestHand = 0;
  for (let i = 0; i < humanTotal.length; i++) {
    if(humanTotal[i] > humanBestHand && humanTotal[i] <= 21) {
      humanBestHand = humanTotal[i];
    }
  }
  for (let i = 0; i < computerTotal.length; i++) {
    if(computerTotal[i] > computerBestHand && computerTotal[i] <= 21) {
      computerBestHand = computerTotal[i];
    }
  }
  if (computerBestHand === humanBestHand) {
    winner = 'draw';
  } else if (computerBestHand > humanBestHand) {
    winner = 'dealer';
  } else if (humanBestHand > computerBestHand) {
    winner = 'player';
  }
  return winner;
}

/*
Remove the additional cards from the board and reset the deck.
*/
function reset() {
  singleDeckOfCards.resetDeck();
  for(let i = humanHand.length; i > 2; i--){
    $('.player-' + i).remove();
  }
  for(let i = computerHand.length; i > 2; i--){
    $('.dealer-' + i).remove();
  }
}


/*
Dealer show his card and the result is displayed
*/
function showResult() {
  $('#playagain').text('Play Again');
  $('.dealer-2').attr('src', `./Images/Cards/${computerHand[1]}.png`);
  while(checkDealer(computerHand)){
    $('.dealer-' + computerHand.length).after(function() {
      computerHand.push(singleDeckOfCards.drawCard());
      return '\n<img class="dealer-' + computerHand.length + ' card" src="./Images/Cards/' + computerHand[computerHand.length - 1] + '.png">';
    });
  }
  let winner = checkWinner(handTotal(humanHand), handTotal(computerHand));
  if (checkBust(handTotal(humanHand))) {
    $('h1').text('You busted 21, the dealer win.');
  } else if (checkBust(handTotal(computerHand))) {
    $('h1').text('The dealer busted 21, YOU win!\n(Balance:' + humanScore + '$ + ' + humanBet + '$x2)');
    humanScore = humanScore + (humanBet * 2);
    $('#human-score').text(humanScore);
  } else if (winner === 'draw') {
    $('h1').text('Draw.\nRetake your bet.(Balance:' + humanScore + '$ + ' + humanBet + '$)');
    humanScore = humanScore + humanBet;
    $('#human-score').text(humanScore);
  } else if (checkBlackjack(handTotal(humanHand))) {
    $('h1').text('You got a Blackjack, YOU win!\n(Balance:' + humanScore + '$ + ' + humanBet + '$x2)');
    humanScore = humanScore + (humanBet * 2);
    $('#human-score').text(humanScore);
  } else if (checkBlackjack(handTotal(computerHand))) {
    $('h1').text('The dealer got a Blackjack.');
  } else if (winner === 'dealer') {
    $('h1').text('The dealer win.');
  } else if (winner === 'player') {
    $('h1').text('YOU win!\n(Balance:' + humanScore + '$ + ' + humanBet + '$x2)');
    humanScore = humanScore + (humanBet * 2);
    $('#human-score').text(humanScore);
  }
  $('#hit').attr('disabled', true);
  $('#stand').attr('disabled', true);
  $('#playagain').attr('disabled', false);
}


//The Play/PlayAgain button
$('#playagain').click(function() {
  $('#bet').attr('disabled', false);
  $('#human-bet').attr('disabled', false);
  $('h1').text("Blackjack");
  reset();
  humanHand = [singleDeckOfCards.drawCard()];
  humanHand.push(singleDeckOfCards.drawCard());
  computerHand = [singleDeckOfCards.drawCard()];
  computerHand.push(singleDeckOfCards.drawCard());
  $('.player-1').attr('src', `./Images/Cards/default.png`);
  $('.player-2').attr('src', `./Images/Cards/default.png`);
  $('.dealer-1').attr('src', `./Images/Cards/default.png`);
  $('.dealer-2').attr('src', `./Images/Cards/default.png`);
  $('#playagain').attr('disabled', true);
});

//The BET button
$('#bet').click(function() {
  if (Number($('#human-bet').val()) > humanScore) {
    $('h1').text("You don't have enough\nmoney in your balance\nto make such a bet.\nTRY AGAIN WITH A LOWER BET.");
  } else {
    $('#human-bet').attr('disabled', true);
    $('#bet').attr('disabled', true);
    humanBet = Number($('#human-bet').val());
    humanScore = humanScore - humanBet;
    $('#human-score').text(humanScore);
    $('h1').text("Blackjack");
    $('.player-1').attr('src', `./Images/Cards/${humanHand[0]}.png`);
    $('.player-2').attr('src', `./Images/Cards/${humanHand[1]}.png`);
    $('.dealer-1').attr('src', `./Images/Cards/${computerHand[0]}.png`);
    if (checkBlackjack(handTotal(humanHand)) || checkBlackjack(handTotal(computerHand))) {
      showResult();
    } else {
      $('#hit').attr('disabled', false);
      $('#stand').attr('disabled', false);
    }
  }
});

//The HIT button
$('#hit').click(function() {
  $('.player-' + humanHand.length).after(function() {
    humanHand.push(singleDeckOfCards.drawCard());
    return '\n<img class="player-' + humanHand.length + ' card" src="./Images/Cards/' + humanHand[humanHand.length - 1] + '.png">';
  });
  if (checkBust(handTotal(humanHand)) || checkBlackjack(handTotal(humanHand))) {
    showResult()
  }
});

//The Stand button
$('#stand').click(function() {
  showResult();
});

//The Double button
$('#double').click(function() {

});

//The Split button
$('#split').click(function() {
  
});

//The Surrender button
$('#surrender').click(function() {
  
});
