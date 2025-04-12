import Timer from './Timer';
import Box from './Box.js';
import { arrayShuffle } from '../utilities/utilities.js';

class Game {

    constructor(){

        this.user;
        this.dificulty;
        this.active;
        this.numCorrects;
        this.currentScore = 0;
        this.timeoutID = null;
        this.currentTime;

        // Estancia(s) de clases
        this.gameBox = new Box()
 
        // ARCHIVOs DATOS USUARIOS
        this.usersData = JSON.parse(localStorage.getItem("users"))
        this.usersGames = JSON.parse(localStorage.getItem("usersGames"))

        //  ELEMENTOS DEL DOM

        // Menu de usuario 
        this.userMenu = document.querySelector('.user__menu')

        // Boton de iniciar sesion y su evento
        this.logInBtn = document.querySelector('.login-btn');
        this.logInBtn.addEventListener('click', () => this.logIn())

        // Boton de log out y su evento
        this.logOutBtn = document.querySelector('.logout--btn')
        this.logOutBtn.addEventListener('click', ()=> this.logOut())
        // Boton de crear usuario y su evento
        this.newUserBtn = document.querySelector('.signup-btn');
        this.newUserBtn.addEventListener('click',() => this.signUp());

        this.newgameContainer = document.querySelector('.newgame__menu')
        this.newgameContainer.addEventListener('click', () => this.newgameContainer.classList.add('hidden'))
        
        // Boton de nueva partida y su evento
        this.newGameBtn = document.querySelector('.newgame--btn');
        this.newGameBtn.addEventListener('click', () => this.dificultyContainer.classList.remove('hidden'))

        // Boton de cargar partida y su evento 
        this.loadGameBtn = document.querySelector('.loadgame--btn')
        this.loadGameBtn.addEventListener('click', () => this.loadGame())

        // Contenedor del formulario de dificultad y sus elementos hijos
        this.dificultyContainer = document.querySelector('.dificulty__container')

        this.dificultyForm = document.querySelector('.dificulty__form')
        this.dificultyForm.addEventListener('submit', (event)=>event.preventDefault());  // Evita que el formulario se envíe y recargue la página

        this.radioBtns = document.querySelectorAll('input[name="difficulty"]')
        this.radioBtns.forEach((radio)=>{
            radio.addEventListener('change', (event)=>{
                this.dificulty = event.target.value;
                this.gameBox.generateBoard(this.dificulty)
            })
        })

        // Boton de inicar partida y su evento
        this.startGameBtn = document.querySelector('.form__btn')
        this.startGameBtn.addEventListener('click', () => this.startGame())

        // Cuadricula del juego
        this.grid = document.querySelector('.grid');

        // Contenedor del marcador y el tiempo
        this.gameInfo = document.querySelector('.game__info')

        // Marcador de tiempo 
        this.clock = document.querySelector('.clock')
        this.timer = new Timer(this.clock)

        // Marcador de puntuacion
        this.scoreSpan = document.querySelector('.score')

        // Contenedor de los botones del juego 

        this.gameBtns = document.querySelector('.game__btns')

        // Boton reiniciar partida
        this.restartBtn = document.querySelector('.btn--restart')
        this.restartBtn.addEventListener('click', () => this.restartGame())

        // Boton cambir dificultad
        this.changeDifficultyBtn = document.querySelector('.btn--change')
        this.changeDifficultyBtn.addEventListener('click', () => this.dificultyContainer.classList.remove('hidden'))

        // Boton guardar partida 
        this.saveGameBtn = document.querySelector('.btn--save')
        this.saveGameBtn.addEventListener('click', () => this.saveGame())
        
    }

    signUp(){

        this.user = prompt('Introduce tu nombre de usuario');

        this.usersData = this.usersData || {};

        this.usersData[this.user] = {
            highestScore: {
                easy: 0,
                medium: 0,
                hard: 0,
            },
            fastestTime: {
                easy: 0,
                medium: 0,
                hard: 0,
            }
        }
        localStorage.setItem("users", JSON.stringify(this.usersData));
    }

    logIn(){
        
        if(this.user){
            alert('Ya estas logueado')
            return
        }

        let userName = prompt('Ingresa tu nombre de usuario')

        if(!this.usersData[userName]){
            alert('Este nombre de usuario no existe')
            return
        }else{
            this.user = userName
        }

        let welcomeMessage = document.createElement('h2')
        welcomeMessage.innerHTML = `Bienvenido ${this.user}`
        this.userMenu.appendChild(welcomeMessage)

        this.logInBtn.classList.add('hidden')
        this.newUserBtn.classList.add('hidden')
        this.logOutBtn.classList.remove('hidden')
    }

    logOut(){

    }

    startGame(){

        this.timer.restart()
        
        this.dificultyContainer.classList.add('hidden')

        if (!this.dificulty){ // Hacemos la comprobacion, si no hay ninguno manda alerta al usuario para que seleccione dificultad
            alert('Por favor seleccione una dificultad')
        }
        
        const gameBtnsContainer = document.querySelector('.game__btns')
        gameBtnsContainer.classList.remove('hidden')

        const gameInfo = document.querySelector('.game__info')
        gameInfo.classList.remove('hidden')
        
        this.boxes = arrayShuffle(Array.from(document.querySelectorAll('.box')));

        this.timer.start(this.clock)

        this.grid.innerHTML = '';
        
        this.boxes.forEach((box)=>{
            box.classList.add('black')
            box.classList.remove('correct', 'active')
            box.setAttribute('draggable', 'false')
            box.addEventListener('click', this.flipCard.bind(this));
            box.addEventListener('dragstart', this.handleDragStart.bind(this));
            box.addEventListener('dragover', this.handleDragOver.bind(this));
            box.addEventListener('drop', this.handleDrop.bind(this));
            this.grid.appendChild(box) 
        })
    }

    restartGame(){

        if(this.timeoutID){
            clearTimeout(this.timeoutID);
            this.timeoutID = null
        }

        this.timer.restart()
    
        let activeBoxes = document.querySelectorAll('.correct , .active')
        let everyBox = Array.from(document.querySelectorAll('.box'))
        let coloredBoxes = everyBox.filter(box => !box.classList.contains('black'))
        let boxesToReset = [...activeBoxes, ...coloredBoxes]

        boxesToReset.forEach(box =>{
            box.classList.add('black')
            box.classList.remove('active','correct')
            box.classList.add('black')
            box.setAttribute('draggable', 'false');
            box.addEventListener('click',this.flipCard)
        })

        this.numCorrects = 0;
        this.active = null;
        this.boxes = arrayShuffle(this.boxes)
        this.grid.innerHTML = ''

        this.boxes.forEach(box => this.grid.appendChild(box));

        this.currentScore = 0;
        this.handleScore()
    }

    saveGame(){

        if (!this.user){
            alert('Debes iniciar sesion para guardar la partida')
            return
        }

        this.currentTime = this.timer.stop()
        this.usersGames = this.usersGames || {}

        let currentGrid = Array.from(this.grid.children).map(box => ({
            classes: [...box.classList], // Guardamos las clases CSS
            color: box.getAttribute('data-original-color')
        }));

        this.usersGames[this.user] = {
            grid: currentGrid,
            score: this.currentScore,
            time : this.currentTime
        }

        localStorage.setItem("usersGames", JSON.stringify(this.usersGames));

        alert('Partida guardada')
    }

    loadGame(){

        this.gameInfo.classList.remove('hidden')
        this.gameBtns.classList.remove('hidden')

        if(!this.user){
            this.user = prompt('Ingresa tu nombre de usuario para cargar partida')
        }

        this.currentScore = this.usersGames[this.user]['score']
        this.handleScore(this.currentScore)

        this.currentTime = this.usersGames[this.user]['time']
        let splitTime = this.currentTime.split(':')
        this.timer.startFrom(splitTime[0], splitTime[1])

        
        let gridToLoad = this.usersGames[this.user]['grid']
        this.gameBox.createBoardFrom(gridToLoad)

        this.boxes = Array.from(document.querySelectorAll('.box'));

        this.grid.innerHTML= ''

        this.boxes.forEach((box) => {
            box.addEventListener('click', this.flipCard.bind(this));
            box.addEventListener('dragstart', this.handleDragStart.bind(this));
            box.addEventListener('dragover', this.handleDragOver.bind(this));
            box.addEventListener('drop', this.handleDrop.bind(this));
            this.grid.appendChild(box) 
        })
    }

    storeUserData(){

        // if(!this.user){
        // this.user = prompt('Introduce tu nombre de usuario')
        // }

        this.user = 'Jesus'

        let highestScore = users[this.user]['highestScore'][this.dificulty]
        let fastestTime = users[this.user]['fastestTime'][this.dificulty]

        if(!users || !users[this.user]){
            alert('No existe ningun usuario con ese nombre')
        }

        if (this.currentScore > highestScore){
            highestScore = this.currentScore
        }

        if (this.currentTime > fastestTime){
            fastestTime = this.currentTime
        }

        localStorage.setItem("users", JSON.stringify(users));


    }

    flipCard(event){
        this.currentBox = event.target;

        if (!this.active && this.currentBox && !this.currentBox.classList.contains('correct')) {
            this.active = this.currentBox;
            this.active.classList.add('active');
            this.active.classList.remove('black');
            this.active.setAttribute('draggable', 'true');
        }
    }

    handleDragStart(event) {
        if (event.target.getAttribute('draggable') === 'false' || event.target !== this.active) {
            event.preventDefault();
        }
    }

    handleDragOver(event) {
        if (event.target.classList.contains('black')) {
            event.preventDefault();
        }
    }

    handleDrop(event) {
        const targetBox = event.target.closest('.box');
    
        if (!targetBox || targetBox === this.active) return;
    
        targetBox.classList.remove('black');
    
        if (this.active.dataset.originalColor !== targetBox.dataset.originalColor) {
            this.handleError(targetBox);
        } else {
            this.handleCorrect(targetBox);
        }
    }

    handleCorrect(targetBox){
        this.currentScore += 100;
        this.handleScore()

        this.active.classList.remove('active', 'black')
        this.active.classList.add('correct')
        this.active.setAttribute('draggable', 'false');
        this.active.removeEventListener('click', this.flipCard);

        targetBox.classList.remove('black');
        targetBox.classList.add('correct');
        targetBox.removeEventListener('click', this.flipCard);

        this.active = null;
        this.numCorrects ++;
        this.checkWin()
    }

    handleError(targetBox) {
        this.currentScore -= 10;
        this.handleScore()

        this.active.classList.remove('active');
        this.active.setAttribute('draggable', 'false');
        
        this.timeoutID = setTimeout(() => {
            this.active.classList.add('black');
            targetBox.classList.add('black');
            this.active = null;
        }, 800);
    }

    handleScore(){
        this.scoreSpan.innerHTML = `Puntuación: ${this.currentScore}`;
    }

    
}

export default Game;