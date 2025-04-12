import { randomColor } from "../utilities/utilities";

class Box{

    constructor(){
        this.grid = document.querySelector('.grid')
        this.numBoxes = 0;
    }

    generateBoard(difficulty){

        this.grid.removeAttribute('data-info-size');
        this.grid.classList.remove('easy','medium', 'hard');
        this.grid.innerHTML= '';
        this.grid.classList.add(difficulty);

        // Variamos la cantidad de cajas segun la dificultad elegida por el usuario.
        switch(difficulty){
            case 'easy':
                this.numBoxes = 12;
                break;
            case 'medium':
                this.numBoxes = 30;
                break;
            case 'hard':
                this.numBoxes = 56;
                break;
        }

        this.grid.setAttribute('data-info-size', this.numBoxes);

        // Creamos un elemento div por cada caja necesaria y aplicamos atributos y clases
        for (let i = 0; i < this.numBoxes; i++){
            
            let newBox = document.createElement('div');

            // Asignar colores a pares de cajas
            if (i % 2 === 1) {
                let pairColor = randomColor();

                newBox.style.backgroundColor = pairColor;
                newBox.setAttribute('data-original-color', pairColor);

                let previousDiv = this.grid.children[i - 1];
                previousDiv.style.backgroundColor = pairColor;
                previousDiv.setAttribute('data-original-color', pairColor);
            }

            newBox.classList.add('box');
            this.grid.appendChild(newBox);
        } 
    }

    createBoardFrom(array){
        
        let gridToLoad = array
       
        this.numBoxes = gridToLoad.length

        for(let i = 0; i < this.numBoxes; i++){

            let newBox = document.createElement('div')
            let color = gridToLoad[i]['color']

            gridToLoad[i]['classes'].forEach( boxClass => {
                newBox.classList.add(boxClass)
            });
            
            newBox.setAttribute('data-original-color', color )
            newBox.style.backgroundColor = color
            this.grid.appendChild(newBox)
        }
    }
}

export default Box;