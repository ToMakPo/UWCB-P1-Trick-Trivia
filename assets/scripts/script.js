"use strict"
var prefs = JSON.parse(localStorage.getItem('TrickTriviaData')) || {
    playerName: '',
    gameSettings: {
        category: '',
        questionsCount: 10,
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
const playerNameInput = $('#player-name-input')
const setupGameButton = $('#setup-game-button')

//rules model
const showRulesButton = $('#show-rules-button')
const gameRulesModel = $('#game-rules-model')
const hideRulesButton = $('#hide-rules-button')

//game setup
const backButton = $('#back-button')
const categoryDropdown = $('#category-dropdown')
const questionCountInput = $('#question-count-input')
const difficultyRadioButtons = $('.difficulty-radio-button')
const startGameButton = $('#start-game-button')

//question & answers
// const timerDisplay = $('#timer-display')
const scoreElement = $('#score')
const currentQuestionDisplay = $('#current-question-display')
const totalQuestionDisplay = $('#total-questions-display')

const categoryDisplay = $('#category-display')
const categoryIcon = $('#category-icon')
const difficultyDisplay = $('#difficulty-display')
const questionDisplay = $('#question-display')
const answersList = $('#answers-list')
const submitAnswerButton = $('#submit-answer-button')

//score
const questionResultDisplay = $('#question-result-display')
const resultAnimation = $('#result-animation')
// const nextQuestionTimerDisplay = $('#next-question-timer-display')
const nextQuestionButton = $('#next-question-button')

//final
const winnerDisplay = $('#winner-display')
const finalScoresDisplay = $('#final-scores-display')
const finalAnimationBox = $('#final-animation-box')
const finalAnimation = $('#final-animation')
const endGameButton = $('#end-game-button')
const leaderboardButton = $('#see-leaderboard-button')

//leaderboard
const leaderTable = $('#leaderboard-table')
const leaderClearButton = $('#leaderboard-clear')
const endGameButton2 = $('#end-game-button2')

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
        .val(prefs.gameSettings.questionsCount)
        //Store the new value to local storage
        .on('change', event => {
            let value = questionCountInput.val()
            prefs.gameSettings.questionsCount = value
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
        
        let category = prefs.gameSettings.category
        let amount = prefs.gameSettings.questionsCount
        let difficulty = prefs.gameSettings.difficulty
        
        let apiURL = `https://opentdb.com/api.php?type=multiple&category=${category}&amount=${amount}&difficulty=${difficulty}`
        
        $.get(apiURL, data => {
            questions = data
            displayPage('question')
        })
    })

    answersList.on('click', event => {
        if (event.target.matches('input')) {
            let val = $(event.target).val()
            info.selected = val
            displayPage('score')
        }
    })

    submitAnswerButton.on('click', event => {
        if (info.selected) {
            displayPage('score')
        }
    })

    nextQuestionButton.on('click', event => {
        let pageName = questionIndex + 1 < prefs.gameSettings.questionsCount ? 'question' : 'final'
        displayPage(pageName)
    })

    endGameButton.on('click', event => {
        displayPage('landing')
    })

    endGameButton2.on('click', event => {
        displayPage('landing')
    })

    leaderboardButton.on('click', event => {
        displayPage('leaderboard')
    })

    leaderClearButton.on('click', event => {
        clearLeaderboard()
        displayLeaderboard()
    })
}

function saveScoreToLocalStorage(name, score) {
    let newscoreobj = {name: name,score: score};
    let allscores = JSON.parse(localStorage.getItem("allscores"));
    if(allscores == null || (typeof(allscores) != "object"))
    {
      allscores = new Array();
    }
    allscores.push(newscoreobj)
    let jsobjstring = JSON.stringify(allscores);
  
    localStorage.setItem("allscores", jsobjstring);
}

function clearLeaderboard()
{
    // 1) clear the localStorage
    localStorage.setItem("allscores", "[]");
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
            case 'leaderboard': displayLeaderboard(); break
        }

        //Return the selected page.
        return page
    }
    //If no page was selected, then return null.
    return null

    function htmlDecode(input){
        var e = document.createElement('textarea');
        e.innerHTML = input;
        // handle case of empty input
        return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    }

    function displayLanding() {
        setupGameButton.focus()
    }
    function displayGameSetup() {
        startGameButton.focus()
    }
    function displayQuestion() {
        questionIndex++

        
        scoreElement.text(score[0])

        currentQuestionDisplay.text(questionIndex+1) // foolish humans index from 1, not 0
        totalQuestionDisplay.text(prefs.gameSettings.questionsCount)

        if(questionIndex >= questions.results.length)
        {
            console.error("questionIndex >= questions.results.length")
            return
        }
        info = questions.results[questionIndex]

        let category = null
        try {
            category = info.category.split(': ').pop()
        } catch(e) {
            console.log("info = " + JSON.stringify(info))
            console.log("questionIndex = " + questionIndex)
            console.log("questions.results = " + JSON.stringify(questions.results))
            console.error(e)
        }
        
        var scrubText = str => htmlDecode(str)
        questionDisplay.text(scrubText(info.question))
        categoryDisplay.text(category)
        let iconPath = categoryIcons[category][0]
        categoryIcon.attr('src', iconPath)
        difficultyDisplay.text(info.difficulty)

        info.correct_answer = scrubText(info.correct_answer)
        info.incorrect_answers = info.incorrect_answers.map(a => scrubText(a))

        let options = [info.correct_answer, ...info.incorrect_answers]
        let answers = []
        answersList.html('')
        let firstInput = null
        let x = 0
        while (options.length) {
            let i = Math.floor(Math.random() * options.length)
            let a = options.splice(i, 1)[0]
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
            if(!firstInput) {
                firstInput = input
            }
            answersList.append(span)
        }
        firstInput.focus()
        info.answers = answers

        //TODO: Set up timer function
    }
    function displayScore() {
        let correct = info.selected == info.correct_answer
        let correct_answer_text = htmlDecode(questions.results[questionIndex].correct_answer)

        questionResultDisplay.text(correct ? 'CORRECT!' : 'WRONG! The correct answer is "' + correct_answer_text + '"')

        getRightWrongGif(correct, resultAnimation)

        let difficultyReward = 0

        switch (info.difficulty) {
            case 'easy':   difficultyReward = 2; break
            case 'medium': difficultyReward = 4; break
            case 'hard':   difficultyReward = 8; break
        }

        if(correct) {
            score[0] += difficultyReward
        } else {
            score[0] -= (difficultyReward/2)
        }
        score[1] += difficultyReward

        nextQuestionButton.focus()

        //TODO: Set up timer function
    }
    function displayFinal() {
        getFinalGif(finalAnimation)
        winnerDisplay.text(prefs.playerName)
        finalScoresDisplay.text(score[0])
        saveScoreToLocalStorage(prefs.playerName, score[0])
        endGameButton.focus()
    }
}

function displayLeaderboard() {

    let data = JSON.parse(localStorage.getItem("allscores"))
    
    leaderTable.html('')
    
    data.sort((x,y) => y.score - x.score)
    
    for (const d of data) {
        console.log("d=" + JSON.stringify(d))
        let tr = $('<tr>')
        let nameTd = $('<td>').html(d.name)
        let scoreTd = $('<td>').html(d.score)
        tr.append(nameTd, scoreTd)
        leaderTable.append(tr)
    }
}


function getRightWrongGif(correct, element) {
    let options = (correct ? [
        ['correct', 1139],
        ['accurate', 334],
        ['precise', 224],
        ['flawless', 345],
        ['perfect', 4999]
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
        try {
            let gifURL = data.data[0].images.original.url
            element.attr('src', gifURL).removeClass('hidden')
        } catch(e) {
            console.error(e)
        }
    })
}

function getFinalGif(element) {
    let perc = score[0] / score[1]
    let lookup
    if (perc == 1) lookup = ['perfect', 4999]
    else if (perc > 0.9) lookup = ['amazing', 4999]
    else if (perc > 0.8) lookup = ['pretty good', 313]
    else if (perc > 0.7) lookup = ['its okay', 895]
    else if (perc > 0.5) lookup = ['meh', 1278]
    else if (perc > 0.3) lookup = ['yeaiks', 2900]
    else lookup = ['you suck', 287]
    
    let q = lookup[0]
    let offset = Math.floor(Math.random() * lookup[1])

    element.addClass('hidden')

    let apiURL = `https://api.giphy.com/v1/gifs/search?api_key=${config.giphyKey}&q=${q}&limit=1&offset=${offset}&lang=en`
    $.get(apiURL, data => {
        try {
            if(data.data.length == 0) {
                console.error("data.data.length == 0")
                return;
            }
        let gifURL = data.data[0].images.original.url
        element.attr('src', gifURL).removeClass('hidden')
        } catch(e) {
            console.log("data = " + JSON.stringify(data))
            console.error(e)
        }
    })
}