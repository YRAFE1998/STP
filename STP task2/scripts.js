var _turn_ = 0 ;
var _maxturns_ = 5;

var player1;
var player2;


const faces = [
    {   
        src:'./assets/faces/trumpface1.png',
        id:1
    },
    {
        src:'./assets/faces/trumpface2.png',
        id:2
    },
    {
        src:'./assets/faces/trumpface3.png',
        id:3
    }
    ]


class Location{
    constructor(x,y){
        this.x=x;
        this.y=y;   
    }

    associateFace(face){
        this.face=face;
    }
}


class Player{
    constructor(id,isMyturn,score){
        this.id=id;
        this.isMyturn=isMyturn;
        this.score=score;
    }
    
    switchturn(){
        this.isMyturn=!this.isMyturn;
    }
    getScore(){
        return this.score;
    }
    chooseMainFace(){
        let id = getRandomNumber(3);
        this.mainface = faces.find( item => item.id==id);
    }
    distributeFaces(count){
        const locations = getRandomlocations((count*2) + 2);
        locations[0].associateFace(faces[(this.mainface.id+1)%3]);
        for(let i=1;i<locations.length;i++){
            locations[i].associateFace(this.mainface);
        }
        this.locationList=locations;
    }
    createimageelements(){
        const images = this.locationList.map((location) => {
            let img = document.createElement("img");
            img.className="face";
            img.src = location.face.src;
            img.style =`top:${location.x}%;left:${location.y}%`;
            img.dataset.id = `${location.face.id}`; 
            img.id = `${location.face.id}`;
            return img;
        })
        return images;
    }

    OnfaceClickhandler = (event) => {
        if(event.target.id == this.mainface.id)
            this.didChooseRight(false);
        else
            this.didChooseRight(true);    
    }

    didChooseRight(b){
        b?this.score+=1:this.score-=1;
        endturn();
    }
}


function chooseMainFace(){
    player1.chooseMainFace();
    player2.chooseMainFace();

}

function distributeFaces(count){
    player1.distributeFaces(count);
    player2.distributeFaces(count);
    
}

function getRandomNumber(max){
    return(Math.floor(((Math.random()*1000) %max) +1));
}

function getRandomlocations(max){
    var locationList = [];
    for(let i=0;i<max;i++){
        locationList.push(new Location(getRandomNumber(90),getRandomNumber(90)));
    }
    return(locationList);
}
function cleargamePanel(){
    document.getElementById('leftside').innerHTML='';
    document.getElementById('rightside').innerHTML='';
}
function  fillGamepanel(){
    var imgs = player1.createimageelements();
    imgs.map((img) =>{
        document.getElementById('leftside').appendChild(img);
    })
    imgs = player2.createimageelements();
    imgs.map((img) =>{
        document.getElementById('rightside').appendChild(img);
    })
}




function endturn(){
    player1.switchturn();
    player2.switchturn();
    _turn_ +=1 ;

    if(_turn_ > _maxturns_){
        updateScore();
        endgame();
    }
    else
        startTurn();

}

function endgame(){

    var scorep1 = player1.score;
    var scorep2 = player2.score;
    var message;
    if(scorep1>scorep2)
        message = "Left player won"
    else if(scorep2>scorep1)
        message = "Right player won"
    else
        message = "THAT'S A DRAW, GOOD GAME Y'ALL"

    const element = document.createElement("div");
    element.className = 'col-12 text-center d-flex align-items-center justify-content-center';
    element.innerHTML=`<h1>${message}</h1>`;
    document.getElementById('gamePanel').innerHTML = '';
    document.getElementById('gamePanel').appendChild(element);
    document.getElementById('gamePanel').style=`background:white !important;`;
    
    const music = new Audio('./assets/applause.mp3');
    music.play();
    music.loop =false;
    music.playbackRate = 2;
}

function updateScore(){
   document.getElementById('scoreleft').innerHTML = player1.getScore();
   document.getElementById('scoreright').innerHTML = player2.getScore();
}


function switchsides(){
   
    if(player1.isMyturn){
        document.getElementById('leftside').addEventListener('click', player1.OnfaceClickhandler,);
        document.getElementById('rightside').removeEventListener('click',player2.OnfaceClickhandler);

        document.getElementById('leftside').classList.remove('overlay');        
        document.getElementById('rightside').classList.add('overlay');
    }
    else{
        document.getElementById('leftside').removeEventListener('click',player1.OnfaceClickhandler);
        document.getElementById('rightside').addEventListener('click', player2.OnfaceClickhandler);
        document.getElementById('leftside').classList.add('overlay');        
        document.getElementById('rightside').classList.remove('overlay');

    }
}

function startTurn(){

        if(player1.isMyturn){
            cleargamePanel();
            chooseMainFace();
            distributeFaces(_turn_+2);
            fillGamepanel();
        }
        switchsides();
        updateScore();
}

function main(){
    player1 = new Player(1,true,0);
    player2 = new Player(2,false,0);
    startTurn();
}

main();
