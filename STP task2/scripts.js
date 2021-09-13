var _turn_ = 0 ;
var _maxturns_ = 5;

var player1;
var player2;


const faces = [
    {   
        src:'./assets/faces/face1.png',
        id:1
    },
    {
        src:'./assets/faces/face2.png',
        id:2
    },
    {
        src:'./assets/faces/face3.png',
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
    constructor(score){
        this.score=score;
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
        if (event.target.tagName == 'IMG'){
            if(event.target.id == this.mainface.id)
                this.didChooseRight(false);
            else
                this.didChooseRight(true);  
        }  
    }

    didChooseRight(b){
        b?this.score+=1:this.score-=1;
        endturn();
    }
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
    imgs.map((img,index) =>{
        document.getElementById('rightside').appendChild(img);
        if(index>0){
            let imgelment = document.createElement('img');
            imgelment.className="face";
            imgelment.src = img.src;
            imgelment.style.top =img.style.top;
            imgelment.style.left =img.style.left;
            imgelment.dataset.id =img.dataset; 
            imgelment.id = img.id;
            document.getElementById('leftside').appendChild(imgelment);
        }
    })
}




function endturn(){
    //player1.switchturn();
    document.getElementById('gamePanel').removeEventListener('click', player1.OnfaceClickhandler);
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
    
    const element = document.createElement("div");
    element.className = 'col-12 text-center d-flex align-items-center justify-content-center';
    element.innerHTML=`<h1>Your score is ${scorep1}</h1>`;
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
}


function switchsides(){
   
    if(player1.isMyturn){
        document.getElementById('leftside').addEventListener('click', player1.OnfaceClickhandler);
        document.getElementById('rightside').removeEventListener('click',player2.OnfaceClickhandler);
    }
    else{
        document.getElementById('leftside').removeEventListener('click',player1.OnfaceClickhandler);
        document.getElementById('rightside').addEventListener('click', player2.OnfaceClickhandler);

    }
}

function startTurn(){

        cleargamePanel();
        player1.chooseMainFace();
        player1.distributeFaces(_turn_+2);
        fillGamepanel();
        document.getElementById('gamePanel').addEventListener('click', player1.OnfaceClickhandler);
        updateScore();
}

function main(){
    player1 = new Player(0);
    startTurn();
}

main();
