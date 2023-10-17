document.addEventListener('DOMContentLoaded', () => {

    fetch('http://localhost:3000/pups')
    .then(res => res.json())
    .then(data =>{
        showAllDogList(data);
        showDetails();
        //Filter
        const filterButton = document.querySelector('#good-dog-filter');
        filterButton.addEventListener('click',function(){
            if(filterButton.innerText==='Filter good dogs: OFF'){
                filterButton.innerText = 'Filter good dogs: ON'
                document.querySelector('#dog-bar').innerHTML ='';
                showGoodDogList()
            }else{
                filterButton.innerText = 'Filter good dogs: OFF' 
                showAllDogList(data);   
                showDetails();  
            }
        })
    })
})

//Display dogNames
function showAllDogList(arr){
    for (const item of arr){
        let card = document.createElement('span');
        card.className = 'dogNames'
        card.innerText= item.name;
        document.querySelector('#dog-bar').appendChild(card);
    }
}

//Show Good Dog Names
function showGoodDogList(){
    fetch('http://localhost:3000/pups')
    .then(res => res.json())
    .then(data =>{
        for (const item of data){
            if(item.isGoodDog ==='true'){
                let card = document.createElement('span');
                card.className = 'dogNames'
                card.innerText= item.name;
                document.querySelector('#dog-bar').appendChild(card);
            }
        }  
        showDetails();  
    })
}

//Display EachDogs (image, name, button)
function showDetails(){
    const buttons = document.querySelectorAll('.dogNames');
    buttons.forEach(function(button){
        button.addEventListener('click',function(){
            let dogName = button.textContent;
            let selectedDog = {};
            fetch('http://localhost:3000/pups')
            .then(res => res.json())
            .then(data =>{
            for (const item of data){
                if (item.name === dogName){
                    selectedDog = item;                     
                }
            }
            let dogCard = document.createElement('div');
            if(selectedDog.isGoodDog === 'true'){
                dogCard.innerHTML = `
                    <img src="${selectedDog.image}" />
                    <h2>${selectedDog.name}</h2>
                    <button id='is-good'>Good Dog!</button>
                    ` 
            }else{
                dogCard.innerHTML = `
                <img src="${selectedDog.image}" />
                <h2>${selectedDog.name}</h2>
                <button id='is-good'>Bad Dog!</button>
                ` 
            }
                document.querySelector('#dog-info').innerHTML= '';
                document.querySelector('#dog-info').appendChild(dogCard);

                isGoodChange(selectedDog)
        })
    })
    })
}

  //Status change
  function isGoodChange(selectedDog){
    const isGood = document.querySelector('#is-good'); 
    isGood.addEventListener('click',function(){
        if(isGood.textContent==="Good Dog!"){
            isGood.textContent = "Bad Dog!"
            //update the data on server
            updateDogIsGood(selectedDog.id, false)

        }else{
            isGood.textContent = "Good Dog!"   
            updateDogIsGood(selectedDog.id, true)                        
        }
    })
}

function updateDogIsGood(id,isGood){
    fetch(`http://localhost:3000/pups/${id}`,{
        method:'PATCH',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({isGoodDog: `${isGood}`})
    })
    .then(res => res.json())
}
