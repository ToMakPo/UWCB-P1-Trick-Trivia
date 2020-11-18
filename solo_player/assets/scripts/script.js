prefs = JSON.parse(localStorage.getItem('TrickTriviaData')) || {
    playerName: '',
    gameSettings: {
        category: '',
        numberOfQuestions: 10,
        difficulty: ''
    }
}
var questions = {}
var info = {}
var score = [0, 0]
const categoryIcons = {
    'General Knowledge': ['https://www.flaticon.com/svg/static/icons/svg/2490/2490419.svg', 9],
    'Books': ['https://www.flaticon.com/svg/static/icons/svg/3655/3655544.svg', 10],
    'Film': ['https://www.flaticon.com/svg/static/icons/svg/1974/1974101.svg', 11],
    'Music': ['https://www.flaticon.com/svg/static/icons/svg/3659/3659832.svg', 12],
    'Musicals & Theatres': ['https://www.flaticon.com/svg/static/icons/svg/1773/1773609.svg', 13],
    'Television': ['https://www.flaticon.com/svg/static/icons/svg/2034/2034830.svg', 14],
    'Video Games': ['https://www.flaticon.com/svg/static/icons/svg/3076/3076944.svg', 15],
    'Board Games': ['https://www.flaticon.com/svg/static/icons/svg/2965/2965874.svg', 16],
    'Science & Nature': ['https://www.flaticon.com/svg/static/icons/svg/2941/2941361.svg', 17],
    'Computers': ['https://www.flaticon.com/svg/static/icons/svg/3030/3030063.svg', 18],
    'Mathematics': ['https://www.flaticon.com/svg/static/icons/svg/3612/3612388.svg', 19],
    'Mythology': ['https://www.flaticon.com/svg/static/icons/svg/1277/1277697.svg', 20],
    'Sports': ['https://www.flaticon.com/svg/static/icons/svg/2997/2997062.svg', 21],
    'Geography': ['https://www.flaticon.com/svg/static/icons/svg/942/942182.svg', 22],
    'History': ['https://www.flaticon.com/svg/static/icons/svg/2201/2201563.svg', 23],
    'Politics': ['https://www.flaticon.com/svg/static/icons/svg/927/927364.svg', 24],
    'Art': ['https://www.flaticon.com/svg/static/icons/svg/1983/1983175.svg', 25],
    'Celebrities': ['https://www.flaticon.com/svg/static/icons/svg/2787/2787948.svg', 26],
    'Animals': ['https://www.flaticon.com/svg/static/icons/svg/2622/2622036.svg', 27],
    'Vehicles': ['https://www.flaticon.com/svg/static/icons/svg/3324/3324498.svg', 28],
    'Comics': ['https://www.flaticon.com/svg/static/icons/svg/1705/1705644.svg', 29],
    'Gadgets': ['https://www.flaticon.com/svg/static/icons/svg/2876/2876630.svg', 30],
    'Japanese Anime & Manga': ['https://www.flaticon.com/svg/static/icons/svg/949/949459.svg', 31],
    'Cartoon & Animations': ['https://www.flaticon.com/svg/static/icons/svg/1507/1507167.svg', 32]
}

//landing page
playerNameInput = $('#player-name-input')
setupGameButton = $('#setup-game-button')

//rules model
showRulesButton = $('#show-rules-button')
gameRulesModel = $('#game-rules-model')
hideRulesButton = $('#hide-rules-button')

//game setup
backButton = $('#back-button')
categoryDropdown = $('#category-dropdown')
questionCountInput = $('#question-count-input')
difficultyRadioButtons = $('.difficulty-radio-button')
startGameButton = $('#start-game-button')

//question & answers
timerDisplay = $('#timer-display')
categoryDisplay = $('#category-display')
categoryIcon = $('#category-icon')
difficultyDisplay = $('#difficulty-display')
questionDisplay = $('#question-display')
answersList = $('#answers-list')
submitAnswerButton = $('#submit-answer-button')

//score
questionResultDisplay = $('#question-result-display')
resultAnimation = $('#result-animation')
nextQuestionTimerDisplay = $('#next-question-timer-display')
nextQuestionButton = $('#next-question-button')

//final
winnerDisplay = $('#winner-display')
finalScoresDisplay = $('#final-scores-display')
finalAnimationBox = $('#final-animation-box')
finalAnimation = $('#final-animation')
endGameButton = $('#end-game-button')

function init() {
    //Display the landing page.
    displayPage('landing')

    //Set the event listener of the back button to go back to the specified page.
    backButton.on('click', event => displayPage('landing'))

    //Set the even listener of the show rules button that will pop up the rules model
    showRulesButton.on('click', event => {
        gameRulesModel.removeClass('hidden')
    })

    //Set the even listener of the hide rules button that will close the rules model
    hideRulesButton.on('click', event => {
        gameRulesModel.addClass('hidden')
    })

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

    //Set the event listener of the setup game button to go to the game setup page
    setupGameButton.on('click', event => displayPage('setup'))
    
    /**Checks that a player name with at least 3 charactors has been provided. */
    function enableButtons() {
        let metMin = playerNameInput.val().length < 3
        setupGameButton.prop('disabled', metMin)
    } enableButtons()

    //Setup the category dropdown
    categoryDropdown
        //Store the new value to local storage
        .on('change', event => {
            let value = categoryDropdown.val()
            prefs.gameSettings.category = value
            savePrefs()
        })
    //Set the value to the one stored in the local storage.
        .val(prefs.gameSettings.category)

    //Setup the question count input
    questionCountInput
        //Set the value to the one stored in the local storage.
        .val(prefs.gameSettings.numberOfQuestions)
        //Store the new value to local storage
        .on('change', event => {
            let value = questionCountInput.val()
            prefs.gameSettings.numberOfQuestions = value
            savePrefs()
        })

    //Setup the difficulty radio buttons
    difficultyRadioButtons
        //Store the new value to local storage
        .on('click', event => {
            let value = $(event.target).val()
            prefs.gameSettings.difficulty = value
            savePrefs()
        })
        //Set the value to the one stored in the local storage.
        $(`[value='${prefs.gameSettings.difficulty}']`).prop('checked', true)
    
    //Set the event listener of the setup game button to go to the game setup page
    startGameButton.on('click', event => {
        questionIndex = -1
        score = [0, 0]
        
        //TODO: have this point to the API
        $.get('/assets/json/debug.json', data => {
            questions = data
            
            displayPage('question')
        })
    })

    answersList.on('click', event => {
        if (event.target.matches('input')) {
            let val = $(event.target).val()
            info.selected = val
        }
    })

    submitAnswerButton.on('click', event => {
        if (info.selected) {
            displayPage('score')
        }
    })

    nextQuestionButton.on('click', event => {
        //TODO: change this back to questions.length
        let pageName = questionIndex + 1 < prefs.gameSettings.numberOfQuestions ? 'question' : 'final'
        displayPage(pageName)
    })

    endGameButton.on('click', event => {
        displayPage('landing')
    })
}

/**Save the prefs to local storage. */
function savePrefs() {
    localStorage.setItem('TrickTriviaData', JSON.stringify(prefs))
}

/* PAGE CONTROLE */
const pages = $('.page')
var questionIndex
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
            case 'setup': displayGameSetup(); break
            case 'question': displayQuestion(); break
            case 'score': displayScore(); break
            case 'final': displayFinal(); break
        }

        //Return the selected page.
        return page
    }
    //If no page was selected, then return null.
    return null

    function displayLanding() {}
    function displayGameSetup() {}
    function displayQuestion() {
        questionIndex++

        info = questions.results[questionIndex]

        let category = info.category.split(': ').pop()
        var scrubText = str => str
            .replace(/(&quot;|&(l|r)dquo;)/g, '"')
            .replace(/(&quot;|&(l|r)squo;)/g, "'")
        questionDisplay.text(scrubText(info.question))
        categoryDisplay.text(category)
        let iconPath = categoryIcons[category][0]
        categoryIcon.attr('src', iconPath)
        difficultyDisplay.text(info.difficulty)

        let options = [info.correct_answer, ...info.incorrect_answers]
        let answers = []
        answersList.html('')
        let x = 0
        while (options.length) {
            let i = Math.floor(Math.random() * options.length)
            let a = scrubText(options.splice(i, 1)[0])
            x++
            answers.push(a)
            let input = $('<input>')
            input.attr('type', 'radio')
            input.attr('name', 'answer')
            input.attr('id', `answer-${x}`)
            input.val(a)
            let label = $('<label>')
                .attr('for', `answer-${x}`)
                .text(a)
            let span = $('<span>')
                .append(input, label)
            answersList.append(span)
        }
        info.answers = answers

        //TODO: Set up timer function
    }
    function displayScore() {
        let correct = info.selected == info.correct_answer
        questionResultDisplay.text(correct ? 'You got it right!' : 'You got it wrong!')

        getRightWrongGif(correct, resultAnimation)

        switch (info.difficulty) {
            case 'easy': score[0] += correct ? 2 : -1; score[1] += 2; break
            case 'medium': score[0] += correct ? 4 : -2; score[1] += 4; break
            case 'hard': score[0] += correct ? 8 : -4; score[1] += 8; break
        }

        //TODO: Set up timer function
    }
    function displayFinal() {
        getFinalGif(finalAnimation)
        winnerDisplay.text(prefs.playerName)
        finalScoresDisplay.text(score[0])
    }
}

function getRightWrongGif(correct, element) {
    let options = (correct ? [
        ['correct', 1139],
        ['accurate', 334],
        ['precise', 224],
        ['flawless', 345],
        ['perfect', 7958]
    ] : [
        ['incorrect', 170],
        ['wrong', 3167],
        ['inaccurate', 174],
        ['invalid', 39],
        ['mistaken', 871]
    ])
    let lookup = options[Math.floor(Math.random() * 5)]
    let q = lookup[0]
    let offset = Math.floor(Math.random() * lookup[1])

    element.addClass('hidden')

    let apiURL = `https://api.giphy.com/v1/gifs/search?api_key=${config.giphyKey}&q=${q}&limit=1&offset=${offset}&lang=en`

    $.get(apiURL, data => {
        let gifURL = data.data[0].images.original.url
        element.attr('src', gifURL).removeClass('hidden')
    })
    //TODO: sometimes the gif doesn't load. Fix it.
}

function getFinalGif(element) {
    let perc = score[0] / score[1]
    let lookup
    if (perc == 1) lookup = ['perfect', 8575]
    else if (perc > 0.9) lookup = ['amazing', 6535]
    else if (perc > 0.8) lookup = ['pretty good', 313]
    else if (perc > 0.7) lookup = ['its okay', 895]
    else if (perc > 0.5) lookup = ['meh', 1278]
    else if (perc > 0.3) lookup = ['yeaiks', 2900]
    else if (perc > 0.0) lookup = ['you suck', 287]
    
    let q = lookup[0]
    let offset = Math.floor(Math.random() * lookup[1])

    element.addClass('hidden')

    let apiURL = `https://api.giphy.com/v1/gifs/search?api_key=${config.giphyKey}&q=${q}&limit=1&offset=${offset}&lang=en`
    $.get(apiURL, data => {
        let gifURL = data.data[0].images.original.url
        element.attr('src', gifURL).removeClass('hidden')
    })
    //TODO: sometimes the gif doesn't load. Fix it.
}