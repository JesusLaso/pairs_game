function randomColor(){
    let color = '#';
    let colorDigits = '0123456789ABCDEF';
    for (let i = 0; i<6; i++){
        let randomIndex = Math.floor(Math.random()*16) 
        color += colorDigits[randomIndex]
    }
    return color;
}

function arrayShuffle(array){

    for (let i = array.length - 1; i>0; i--){
        const j = Math.floor(Math.random() * (i+1));
        [array[i],array[j]] = [array[j],array[i]]
    }
    return array
}

export { arrayShuffle , randomColor};