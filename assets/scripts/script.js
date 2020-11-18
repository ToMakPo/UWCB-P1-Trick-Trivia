// Click Rule Button to show the Rule 
$("#show-rule-hover").on("click", function showRuleButton() {
    var x = document.getElementById("game-rule-text");
    if (x.style.display === "none") {
        x.style.display = "inline-block";
    } else {
        x.style.display = "none";
    }
})

// TODO: Function to play the sound/music in the game.
    // Maybe a "click" sound for the buttons
    // Play a music while in the WAITING room.
    // Music when join the game

/// USED TO RUN THE GAME ///
prefs = JSON.parse(localStorage.getItem('TrickTriviaData')) || {
    playerName: '',
    hostSettings: {
        category: '',
        maxPlayers: 4,
        numberOfQuestions: 10,
        difficulty: ''
    }
}
gameSettings = {}
isHost = false

backButton = $('#back-button')

playerNameInput = $('#player-name-input')
hostGameButton = $('#host-game-button')
joinGameButton = $('#join-game-button')

categoryDropdown = $('#category-dropdown')
playerCountDisplay = $('#player-count-display')
playerCountSlider = $('#player-count-slider')
questionCountDisplay = $('#question-count-display')
questionCountSlider = $('#question-count-slider')
difficultyRadioButtons = $('.difficulty-radio-button')
createGameButton = $('#create-game-button')

function init() {
    //Display the landing page.
    displayPage('game-setup')

    //Set the event listener of the back button to go back to the specified page.
    backButton.on('click', event => displayPage(backButton.data('page')))

    playerNameInput
        //Set the value of the player name to the one stored in the local storage.
        .val(prefs.playerName)
        //Save the player name to local storage when done entering name.
        .on('blur', event => {
            prefs.playerName = playerNameInput.val().trim()
            playerNameInput.val(prefs.playerName)
            savePrefs()
            enableButtons()
        })
        //Prevent user from entering anything other than letters, numbers, and spaces.
        .on('keypress', event => {
            if (!/[a-zA-Z0-9 ]/.test(event.key)) {
                event.preventDefault()
            }
        })

    //Set the event listener of the host game button to go to the game setup page
    hostGameButton.on('click', event => displayPage('game-setup'))

    //Set the event listener of the join game button to go to the join game page
    joinGameButton.on('click', event => displayPage('join-game'))
    
    /**Checks that a player name with at least 3 charactors has been provided. */
    function enableButtons() {
        let metMin = playerNameInput.val().length < 3
        hostGameButton.prop('disabled', metMin)
        joinGameButton.prop('disabled', metMin)
    } enableButtons()

    categoryDropdown
        .val(prefs.hostSettings.category)
        .on('slidestop', event => {
            let category = categoryDropdown.val()
            gameSettings.category = category
            prefs.hostSettings.category = category
            savePrefs()
        })
        
    $( "#mySlider" ).slider({
        range: "max",
        min: 2,
        max: 8,
        value: 2,
        slide: function( event, ui ) {
            $( "#total" ).val( ui.value );
        }
    });
    $( "#total" ).val( $( "#mySlider" ).slider( "value" ) );

    playerCountSlider.slider({
        range: 'max',
        min: 2,
        max: 10,
        value: prefs.hostSettings.maxPlayers,
        slide: (event, ui) => {
            let maxPlayers = playerCountSlider.val()
            console.log('maxPlayers: ', maxPlayers);
            playerCountDisplay.text(maxPlayers)
            gameSettings.maxPlayers = maxPlayers
            prefs.hostSettings.maxPlayers = maxPlayers
            savePrefs()
        }
    })
    playerCountDisplay.text(playerCountSlider.slider('value'))

    questionCountSlider
        .val(prefs.hostSettings.numberOfQuestions)
        .on('change', event => {
            let numberOfQuestions = questionCountSlider.val()
            questionCountDisplay.text(numberOfQuestions)
            gameSettings.numberOfQuestions = numberOfQuestions
            prefs.hostSettings.numberOfQuestions = numberOfQuestions
            savePrefs()
        })
        
    questionCountDisplay.text(questionCountSlider.val())
}

/**Save the prefs to local storage. */
function savePrefs() {
    localStorage.setItem('TrickTriviaData', JSON.stringify(prefs))
}

/* PAGE CONTROLE */
const pages = $('.page')
/**Hide all of the pages except for the one that matches the id passed in.
 * If the id does not exist, then nothing will happen. 
 * 
 * @param {string} pageID The id of the page to be displayed.
 */
function displayPage(pageID) {
    //Makes it so that you dont have to add '#' or 'page' but you can if you want to.
    pageID = pageID.replace('#', '').replace('-page', '')

    //Can only get elements with both the 'page' class and the given id name. 
    var page = $(`.page#${pageID}-page`)

    //Checks that the given id found a page
    if (page.length) {
        //Hide all pages, then unhide the selected page.
        pages.addClass('hidden')
        page.removeClass('hidden')

        //Apply page specific settings
        switch (pageID) {
            case 'landing': displayLanding(); break
            case 'game-setup': displayGameSetup(); break
            case 'join-game': displayJoinGame(); break
        }

        //Return the selected page.
        return page
    }
    //If no page was selected, then return null.
    return null

    function displayLanding() {
        backButton
            .addClass('hidden')
            .data('page', '')
    }
    function displayGameSetup() {
        backButton
            .removeClass('hidden')
            .data('page', 'landing')
    }
    function displayJoinGame() {
        backButton
            .removeClass('hidden')
            .data('page', 'landing')
    }
}
