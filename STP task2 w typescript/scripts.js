var _turn_ = 0;
var _maxturns_ = 5;
var game;
var faces = [
    {
        src: './assets/faces/face1.png',
        id: 1
    },
    {
        src: './assets/faces/face2.png',
        id: 2
    },
    {
        src: './assets/faces/face3.png',
        id: 3
    }
];
var Locationf = /** @class */ (function () {
    function Locationf(x, y) {
        this.x = x;
        this.y = y;
    }
    Locationf.prototype.associateFace = function (face) {
        this.face = face;
    };
    return Locationf;
}());
var Game = /** @class */ (function () {
    function Game(score) {
        var _this = this;
        this.OnfaceClickhandler = function (event) {
            if (event.target.tagName == 'IMG') {
                if (event.target.id == _this.mainface.id)
                    _this.didChooseRight(false);
                else
                    _this.didChooseRight(true);
            }
        };
        this.score = score;
    }
    Game.prototype.getScore = function () {
        return this.score;
    };
    Game.prototype.chooseMainFace = function () {
        var id = getRandomNumber(3);
        this.mainface = faces.find(function (item) { return item.id == id; });
    };
    Game.prototype.distributeFaces = function (count) {
        var locations = getRandomlocations((count * 2) + 2);
        locations[0].associateFace(faces[(this.mainface.id + 1) % 3]);
        for (var i = 1; i < locations.length; i++) {
            locations[i].associateFace(this.mainface);
        }
        this.locationList = locations;
    };
    Game.prototype.createimageelements = function () {
        var images = this.locationList.map(function (location) {
            var img = document.createElement("img");
            img.className = "face";
            img.src = location.face.src;
            img.style.top = location.x + "%";
            img.style.left = location.y + "%";
            img.dataset.id = "" + location.face.id;
            img.id = "" + location.face.id;
            return img;
        });
        return images;
    };
    Game.prototype.didChooseRight = function (b) {
        b ? this.score += 1 : this.score -= 1;
        endturn();
    };
    return Game;
}());
function getRandomNumber(max) {
    return (Math.floor(((Math.random() * 1000) % max) + 1));
}
function isInsquare(location1, location2) {
    if (location1.x >= (location2 === null || location2 === void 0 ? void 0 : location2.x) - 8 && location1.x < location2.x + 8) {
        if (location1.y >= location2.y - 8 && location1.y < location2.y + 8) {
            return true;
        }
        else
            return false;
    }
    else
        return false;
}
function getRandomlocations(max) {
    var locationList = [];
    for (var i = 0; i < max; i++) {
        var flag = false;
        var _loop_1 = function () {
            var randomX = getRandomNumber(90);
            var randomY = getRandomNumber(90);
            if (!!locationList.find(function (item) { return isInsquare(item, new Locationf(randomX, randomY)); })) {
                console.log('true');
                console.log("Failure .. randomX = ", randomX, ", randomY = ", randomY);
            }
            else {
                console.log("Success .. randomX = ", randomX, ", randomY = ", randomY);
                flag = true;
                locationList.push(new Locationf(randomX, randomY));
            }
        };
        while (!flag) {
            _loop_1();
        }
    }
    return (locationList);
}
function cleargamePanel() {
    document.getElementById('leftside').innerHTML = '';
    document.getElementById('rightside').innerHTML = '';
}
function fillGamepanel() {
    var imgs = game.createimageelements();
    imgs.map(function (img, index) {
        document.getElementById('rightside').appendChild(img);
        if (index > 0) {
            var imgelment = document.createElement('img');
            imgelment.className = "face";
            imgelment.src = img.src;
            imgelment.style.top = img.style.top;
            imgelment.style.left = img.style.left;
            imgelment.dataset.id = img.dataset;
            imgelment.id = img.id;
            document.getElementById('leftside').appendChild(imgelment);
        }
    });
}
function endturn() {
    //game.switchturn();
    document.getElementById('gamePanel').removeEventListener('click', game.OnfaceClickhandler);
    _turn_ += 1;
    if (_turn_ > _maxturns_) {
        updateScore();
        endgame();
    }
    else
        startTurn();
}
function endgame() {
    var scorep1 = game.score;
    var element = document.createElement("div");
    element.className = 'col-12 text-center d-flex align-items-center justify-content-center';
    element.innerHTML = "<h1>Your score is " + scorep1 + "</h1>";
    document.getElementById('gamePanel').innerHTML = '';
    document.getElementById('gamePanel').appendChild(element);
    document.getElementById('gamePanel').style.background = "white !important;";
    var music = new Audio('./assets/applause.mp3');
    music.play();
    music.loop = false;
    music.playbackRate = 2;
}
function updateScore() {
    document.getElementById('scoreleft').innerHTML = game.getScore();
}
function startTurn() {
    cleargamePanel();
    game.chooseMainFace();
    game.distributeFaces(_turn_ + 2);
    fillGamepanel();
    document.getElementById('gamePanel').addEventListener('click', game.OnfaceClickhandler);
    updateScore();
}
function main() {
    game = new Game(0);
    startTurn();
}
main();
