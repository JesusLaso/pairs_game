class Timer{

    constructor(clock){
        this.seconds = 0;
        this.minutes = 0;
        this.interval = null;
        this.clock = clock;
    }

    start(){

        if (this.interval) return;

        this.updateClock();

        this.interval = setInterval(()=> {
            this.seconds++;
            if (this.seconds == 60){
                this.seconds = 0;
                this.minutes ++;
            }
            this.updateClock();
        }, 1000)
    }

    startFrom(minutes, seconds){
        this.seconds = seconds;
        this.minutes = minutes;
        this.start();
    }

    stop(){
        clearInterval(this.interval);
        this.interval = null;

        return `${this.minutes} : ${this.seconds}`;
    }

    catch(){
        return `${this.minutes} : ${this.seconds}`; 
    }

    restart(){
        this.stop(); // Detenemos el temporizador
        this.seconds = 0;
        this.minutes = 0;
        this.start(); // Reiniciamos el temporizador
    }

    updateClock(){
        this.clock.textContent = 
            `${this.minutes.toString().padStart(2,'0')} : ${this.seconds.toString().padStart(2,'0')}`;
    }

}

export default Timer;