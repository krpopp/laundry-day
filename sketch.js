let sketch = function (p) {

    var clothesText = ["shirt", "pants", "panties", "bra", "towel", "pants", "panties"];
    var changeText = ["25¢", "25¢", "25¢", "25¢", "25¢", "25¢", "25¢", "25¢", "25¢", "$1", "$1", "$1", "$1", "$1"];
    var clothes = [];
    var change = [];
    var dryers = [];
    var washers = [];
    var cashMachine;

    var storyLoc = 0;
    var laundryPhase = 0;
    var door;
    var holdingAny = false;
    var colorTypes = ['#FFC0CB', '#4B0082', '#000000', '#90EE90', '#FFDEAD', '#556B2F', '#FF0000', '#C71585', '#0000CD', '#000000', '#4682B4'];
    var sizeTypes = [22, 18, 28, 22, 15, 22, 29, 17];
    var tooMuchWarning = "The machine only takes quarters.";
    var stillDirtyWarning = "Uh this is still dirty.";
    var alreadyWashedWarning = "I already washed that.";
    var cleanWarning = "This is clean!";
    var warningText = [];
    var warningMessageY = [];
    var warningMessageX = [];
    var warningMessageAlpha = [];
    var warning = false;

    //story text
    var storyText = ["It's laundry day again. Today I've brought: ", "Great. All in the washer. Here's my change: ", "I guess I should find a spot to wait.", "The chairs are blue plastic with big, winged seats. I take a seat.", "I go to a corner between a wall and a window. There's a chill.", "I lean up against one of the washing machines."];
    var seatPicking = "There's one *seat* open. There's also a *corner* I can sit in or I could lean against one of the *machines*.";
    var womanPhone = ["The woman *leans* over her clean clothes, sorting them into piles. Her phone is wedged between her cheek and shoulder.", "“No, no,” *she* says. “That’s got nothing to do with *me*.”", "There’s a long pause, culminating in the *woman* folding a pair of jeans with more force than the jeans really deserved.", "“I am there for her, *every time.*... yes, every-“", "She drops her hands, turns so her hip rests of the edge of the counter. Her shoulder falls and she catches her phone, pressing the glass to her cheek so hard that I can see the *skin underneath* reddening.", "(This is all I've written so far!)"];
    var boySeat = ["A little boy sits next to me. I can feel him fidgeting to *look* over at my phone.", "“You got any *games*?” he asks.", "“Yeah, *a couple*,” I say.", "He looks at me, *big, big eyes* asking the question he’s not.", "(This is all I've written so far!)"];
    var girlCorner = ["A *little girl* is sitting criss cross applesauce in one of the carts.", "A *older boy*, with the same chubby cheeks and protruding ears, pushes her up and down the aisle.", "She *grins* beatifically at me when she passes.", "(This is all I've written so far!)"];
    var optionOver = 0;
    var vignettePos = 0;

    var textX = 10;
    var textY = 80;

    var testWord = "machine";

    p.setup = function () {
        p.createCanvas(1700, 800);

        p.shuffle(colorTypes, true);
        p.shuffle(sizeTypes, true);
        p.textSize(22);
        var tempX = 20 + p.textWidth(storyText[0]);
        for (var i = 0; i < clothesText.length; i++) {
            if(i > 0){
                p.textSize(sizeTypes[i-1]);
                tempX = (tempX + p.textWidth(clothesText[i-1])) + 10;
            }
            clothes[i] = new p.Word(tempX, 20, clothesText[i], colorTypes[i], sizeTypes[i], 0);
        }
        p.textSize(22);
        tempX = 20 + p.textWidth(storyText[1]);
        for (var i = 0; i < changeText.length; i++) {
            if(i > 0){
                tempX = (tempX + p.textWidth(changeText[i-1])) + 10;
            }
            change[i] = new p.Word(tempX, 20, changeText[i], 0, 22);
        }
        door = p.loadImage('assets/door.png');
        //clothes[0] = new p.Word(100, 100, "shirt", '#fae', 22);
        //clothes[1] = new p.Word(100, 150, "pants", 0, 22);
        var cost = 2;
        for (var i = 0; i < 2; i++) {
            dryers.push(new p.Machine((i * 300) + 20, p.height - 300, 2, cost.toFixed(2), i));
            dryers.push(new p.Machine((i * 300) + 20, p.height - 550, 2, cost.toFixed(2), i + 2));
        }
        //dryer = new p.Machine(100, window.innerHeight - 300, 2, cost.toFixed(2));
        for (var i = 0; i < 3; i++) {
            washers.push(new p.Machine((i * 300) + 800, p.height - 300, 1, cost.toFixed(2), i));
        }
        //washer = new p.Machine(600, 280, 1, cost.toFixed(2));
        cashMachine = new p.Machine(600, p.height - 365, 3, 0);
    };

    p.draw = function () {
        p.background(255);
        for (var i = 0; i < dryers.length; i++) {
            dryers[i].displayDryer();
        }
        for (var i = 0; i < clothes.length; i++) {
            clothes[i].display();
        }


        for (var i = 0; i < washers.length; i++) {
            if (washers[i].myPhase == 3) {
                p.fill(0);
                p.textSize(22);
                //FIX
                //this disappeared
                p.text(washers[i].minutes + ":" + washers[i].seconds, washers[i].x, washers[i].y - 20);
                washers[i].bubbles();
                p.image(door, washers[i].x-20, washers[i].y-60);
            }
            washers[i].displayWasher(washers[i].myPhase);
        }
        //washer.displayWasher(laundryPhase);
        p.textAlign(p.LEFT, p.TOP);
        //0, 1, 2 is start
        //3 is seat
        //4 is machine
        //5 is corner
        p.text(storyText[storyLoc], 20, 20);
        if (storyLoc == 1) {
            for (var i = 0; i < change.length; i++) {
                change[i].display();
            }
        }
        cashMachine.displayCash();
        if (warning) {
            p.warningMessage(warningText[warningMessageAlpha.length - 1], warningMessageAlpha.length - 1);
        }
        if(storyLoc == 2){
            p.displayOptions(seatPicking, textX, textY);
        } else if (storyLoc > 2){
            p.vignetteText();
        }  
    };

    p.squareWord = function(textSize, word, x, y, rW, rH){
        var wid = 0;
        var hig = 0;
        var higLim = 0;
        p.textSize(textSize);
        while (wid < rW) {
            for (var i = 0; i < word.length; i++) {
                var newChar = word[i];
                p.text(newChar, x+wid, y);
                p.text(newChar, x+wid, y+rH);
                wid = wid + p.textWidth(newChar);
            }
        }
        while(higLim < rH){
            for (var i = 0; i < word.length; i++) {
                var newChar = word[i];
                p.text(newChar, x, y+hig);
                p.text(newChar, x+wid, y+hig);
                higLim = higLim + textSize;
                hig = hig + (textSize*0.7);
            }
        }
    };

    p.circleWord = function(word, x, y, rad){
        for(var i = 0; i  < word.length;i++){
            var angle = p.PI * 2/word.length;
            angle = angle * i;
            var point = p.createVector(p.cos(angle), p.sin(angle));
            p.text(word[i], x+point.x*rad, y+point.y*rad);
        }
    };

    p.vignetteText = function () {
        switch (storyLoc) {
            case 3:
                p.displayOptions(boySeat[vignettePos], textX, textY + 20);
                //p.text(boySeat[vignettePos], textX, textY + 20);
                break;
            case 4:
                p.displayOptions(girlCorner[vignettePos], textX, textY + 20);
                //p.text(girlCorner[vignettePos], textX, textY + 20);
                break;
            case 5:
                p.displayOptions(womanPhone[vignettePos], textX, textY + 20);
                //p.text(womanPhone[vignettePos], textX, textY + 20);
                break;
        }
    };

    p.mousePressed = function () {
        if (!holdingAny) {
            for (var i = 0; i < clothes.length; i++) {
                clothes[i].click();
                if (clothes[i].onWord) {
                    if (clothes[i].state == 0 || clothes[i].state == 1) {
                        clothes[i].holding = true;
                        holdingAny = true;
                    }
                }
            }
            if (storyLoc == 1) {
                for (var i = 0; i < change.length; i++) {
                    change[i].click();
                    if (change[i].onWord) {
                        change[i].holding = true;
                        holdingAny = true;
                    }
                }
            }
            for (var i = 0; i < washers.length; i++) {
                if (washers[i].myPhase == 2) {
                    //     storyLoc = 2;
                    if (washers[i].pressStart(p.mouseX, p.mouseY)) {
                        for (var j = 0; j < clothes.length; j++) {
                            if (clothes[j].machineInside == washers[i].myMachineNum) {
                                clothes[j].state = 2;
                            }
                        }
                        washers[i].timer = setInterval(p.washerTime(i), 1000);
                        washers[i].myPhase = 3;
                        p.checkState();
                    }
                }
            }
        }
        if(storyLoc == 2){
            if(p.hoverOptions(seatPicking, textX, textY)){
                console.log("HEY");
                p.changeStory();
            }
        } else if (storyLoc == 3){
            if(p.hoverOptions(boySeat[vignettePos], textX, textY + 20, 500)){
                p.increaseVignette();
            }
        } else if (storyLoc == 4){
            if(p.hoverOptions(girlCorner[vignettePos], textX, textY + 20, 500)){
                p.increaseVignette();
            }
        } else if (storyLoc == 5){
            if(p.hoverOptions(womanPhone[vignettePos], textX, textY + 20, 500)){
                p.increaseVignette();
            }
        }
    };

    p.increaseVignette = function () {
        vignettePos++;
    };

    p.changeStory = function () {
        switch (optionOver) {
            case "seat":
                console.log(optionOver);
                storyLoc = 3;
                break;
            case "corner":
                console.log(optionOver);
                storyLoc = 4;
                break;
            case "machines":
                console.log(optionOver);
                storyLoc = 5;
                break;
        }
    };

    p.displayOptions = function (_string, x, y) {
        var newString = _string.split("*");
        var lastX = x;
        for (var i = 0; i < newString.length; i++) {
            if (i == 0) {
                p.fill(0);
                p.text(newString[i], x, y);
            } else if (i % 2 == 0) {
                p.fill(0);
                lastX = lastX + p.textWidth(newString[i - 1])
                p.text(newString[i], lastX, y);
            } else {
                p.fill(255, 0, 0);
                lastX = lastX + p.textWidth(newString[i - 1])
                p.text(newString[i], lastX, y);
            }
        }
    };

    p.hoverOptions = function (_string, x, y) {
        var lastX = x;
        var width;
        var newString = _string.split("*");
        for (var i = 0; i < newString.length; i++) {
            if (i > 0) {
                lastX = lastX + p.textWidth(newString[i - 1]);
            }
            if (i % 2 != 0) {
                width = p.textWidth(newString[i]);
                if (p.mouseX > lastX && p.mouseX < lastX + width && p.mouseY > y && p.mouseY < y + 20) {
                    optionOver = newString[i];
                    return true;
                }
            }
        }
    };

    p.warningMessage = function (_message, _count) {
        p.fill(255, 0, 0, warningMessageAlpha[_count]);
        p.text(_message, warningMessageX[_count], warningMessageY[_count]);
        warningMessageY[_count] -= 2;
        if (warningMessageY[_count] < 300) {
            warningMessageAlpha[_count] -= 3;
        }
        if (warningMessageAlpha[_count] <= 0) {
            warningMessageAlpha.splice(_count, 1);
            warningMessageY.splice(_count, 1);
            warningMessageX.splice(_count, 1);
            warning = false;
        }
    };

    //FIX
    //stop the interval when you're finished
    //change the state of the clothes and the machine when they're done
    //also need to create a version of this for the dryers
    p.washerTime = function (num) {
        if (washers[num].counter > 0) {
            washers[num].counter--;
        }
        washers[num].minutes = p.floor(washers[num].counter / 60);
        washers[num].seconds = washers[num].counter % 60;
        if (washers[num].minutes <= 0 && washers[num].seconds <= 0) {
            //FIX change the laundry state and the clothes state when this timer has finished
            clearInterval(washers[i].timer);
        }
    };

    p.machineChecks = function (clothingPiece) {
        for (var i = 0; i < washers.length; i++) {
            if (washers[i].checkColl(clothingPiece.x, clothingPiece.y)) {
                p.changeClothesState("washer", clothingPiece, i, washers[i].myMachineNum);
            }
        }
        for (var i = 0; i < dryers.length; i++) {
            if (dryers[i].checkColl(clothingPiece.x, clothingPiece.y)) {
                p.changeClothesState("dryer", clothingPiece, i, dryers[i].myMachineNum);
            }
        }
    };

    p.changeClothesState = function (machine, clothingPiece, num, machineNum) {
        switch (machine) {
            case "washer":
                if (clothingPiece.isDirty) {
                    clothingPiece.state = 1;
                    clothingPiece.machineInside = machineNum;
                    return true;
                } else if (!clothingPiece.isDirty && !clothingPiece.hasDryed) {
                    warning = true;
                    warningText.push(alreadyWashedWarning);
                    warningMessageAlpha.push(255);
                    warningMessageY.push(washers[num].y);
                    warningMessageX.push(washers[num].x);
                } else if (!clothingPiece.isDirty && clothingPiece.hasDryed) {
                    warning = true;
                    warningText.push(cleanWarning);
                    warningMessageAlpha.push(255);
                    warningMessageY.push(washers[num].y);
                    warningMessageX.push(washers[num].x);
                }
                break;
            case "dryer":
                if (!clothingPiece.isDirty && !clothingPiece.hasDryed) {
                    clothingPiece.state = 2;
                    clothingPiece.machineInside = machineNum;
                } else if (clothingPiece.isDirty && !clothingPiece.hasDryed) {
                    warning = true;
                    warningText.push(stillDirtyWarning);
                    warningMessageAlpha.push(255);
                    warningMessageY.push(dryers[num].y);
                    warningMessageX.push(dryers[num].x);
                } else if (!clothingPiece.isDirty && clothingPiece.hasDryed) {
                    warning = true;
                    warningText.push(cleanWarning);
                    warningMessageAlpha.push(255);
                    warningMessageY.push(dryers[num].y);
                    warningMessageX.push(dryers[num].x);
                }
                break;
        }
    };

    p.mouseReleased = function () {
        for (var i = 0; i < clothes.length; i++) {
            if (clothes[i].holding) {
                p.machineChecks(clothes[i]);
                // for(var i = 0; i < dryers.length; i++){
                //     if(dryers[i].checkColl(clothes[i].x, clothes[i].y)){
                //         clothes[i].state = 2;
                //     } else if(washer.checkColl(clothes[i].x, clothes[i].y)){
                //         clothes[i].state = 1;
                //     } else{
                //         clothes[i].state = 0;
                //     }
                // }
            }
            clothes[i].holding = false;
            clothes[i].onWord = false;
            holdingAny = false;
        }
        //FIX THIS PHASE STUFF IVE CONFUSED MYSELF
        if (storyLoc == 1) {
            for (var i = 0; i < change.length; i++) {
                if (change[i].holding) {
                    for (var j = 0; j < washers.length; j++) {
                        if (washers[j].myPhase == 0) {
                            if (washers[j].checkColl(change[i].x, change[i].y)) {
                                if (change[i].value == 0.25) {
                                    if (washers[j].payed < washers[j].cost) {
                                        washers[j].payed += 0.25;
                                        if (washers[j].payed == washers[j].cost) {
                                            console.log("HIII");
                                            washers[j].myPhase = 2;
                                        }
                                        change.splice(i, 1);
                                    }
                                } else {
                                    warning = true;
                                    warningMessageAlpha.push(255);
                                    warningMessageY.push(washers[j].y);
                                    warningMessageX.push(washers[j].x);
                                    console.log("too much");
                                }
                            }
                        }
                    }
                    if (change[i].value == 1) {
                        if (cashMachine.checkColl(change[i].x, change[i].y)) {
                            change.splice(i, 1);
                            for (var i = 0; i < 4; i++) {

                                //FIX
                                //this is overlapping with the other change
                                if (120 + (change.length * 50) > p.width - 100) {
                                    var newX = 120 + (((change.length - 13) * 50));
                                    var newY = 80;
                                } else {
                                    var newX = 120 + (change.length * 50);
                                    var newY = 50;
                                }
                                change.push(new p.Word(newX, newY, "25¢", 0, 22));
                            }
                        }
                    }
                }
                if (change[i] != null) {
                    change[i].holding = false;
                    change[i].onWord = false;
                    holdingAny = false;
                }
            }
        }
        p.checkState();
    };

    p.mouseDragged = function () {
        for (var i = 0; i < clothes.length; i++) {
            clothes[i].updatedPos();
        }
        if (storyLoc == 1) {
            for (var i = 0; i < change.length; i++) {
                change[i].updatedPos();
            }
        }
    };

    p.checkState = function () {
        if (clothes[0].state == clothes[1].state && clothes[0].state == clothes[2].state && clothes[0].state == clothes[3].state && clothes[0].state == clothes[4].state && clothes[0].state == clothes[5].state && clothes[0].state == clothes[6].state) {
            if (clothes[0].state == 1 && storyLoc == 0) {
                console.log("ALL IN");
                laundryPhase = 1;
                storyLoc = 1;
            } else if (storyLoc == 1 && clothes[0].state == 2) {
                storyLoc = 2;
            }
        }
    };

    p.Word = class {
        constructor(_x, _y, _string, _color, _size) {
            this.x = _x;
            this.y = _y;
            this.baseX = _x;
            this.baseY = _y;
            this.string = _string;
            this.color = _color;
            this.size = _size;
            this.clickX = _x;
            this.clickY = _y;
            p.textSize(_size);
            this.clickW = p.textWidth(this.string);
            this.clickH = _size;
            this.onWord = false;
            this.holding = false;
            this.state = 0;
            this.hasDryed = false;
            this.machineInside = -1;
            if (this.string == "25¢") {
                this.value = 0.25;
            } else if (this.string == "$1") {
                this.value = 1;
            } else {
                this.isDirty = true;
            }
        }

        display() {
            //p.fill(0, 255, 0);
            //p.rect(this.clickX, this.clickY, this.clickW, this.clickH);
            if (this.state == 2) {
                this.shake();
            }
            //p.textAlign(p.LEFT, p.TOP);
            p.fill(this.color);
            p.textSize(this.size);
            p.text(this.string, this.x, this.y);
        }

        shake() {
            this.x = this.x + p.random(-1, 1);
            this.y = this.y + p.random(-1, 1);
            // if(this.x > this.baseX + 3){
            //     this.x--;
            // } else if(this.x < this.baseX - 3){
            //     this.x++;
            // }
            // if(this.y > this.baseY + 2){
            //     this.y--;
            // } else if (this.y < this.baseY - 2){
            //     this.y++;
            // }
        }

        updatedPos() {
            if (this.holding) {
                this.x = p.mouseX;
                this.y = p.mouseY;
                this.clickX = p.mouseX;
                this.clickY = p.mouseY;
            }
        }

        click() {
            if (p.mouseX > this.clickX && p.mouseX < (this.clickX + this.clickW) && p.mouseY > this.clickY && p.mouseY < (this.clickY + this.clickH)) {
                console.log("clicked");
                this.onWord = true;
            }
        }
    }

    p.Machine = class {
        constructor(_x, _y, _type, _cost, _myNum) {
            this.x = _x;
            this.y = _y;
            this.baseX = _x;
            this.baseY = _y;
            this.type = _type;
            this.payed = 0;
            this.cost = _cost;
            this.textX = _x - 15;
            this.textY = _y - 15;
            this.playerActive = false;
            this.myPhase = 0;
            this.counter = 900;
            this.minutes = p.floor(this.counter / 60);
            this.seconds = this.counter % 60;
            this.timer;
            this.myMachineNum = _myNum;
            if (this.type == 2) {
                this.width = p.textWidth("dryerdryerdryerdryerdryer");
                this.leftOff = 1.95;
                this.topOff = 200;
            } else if (this.type == 1) {
                this.width = p.textWidth("washerwasherwasherwash");
                this.bubbleArr = ["0", "O", "o", "0", "0", "0", "0", "0", "0", "o", "0", "o", "0", "o", "0", "0", "0", "0", "O", "0", "o", "o", "0"];
                this.bubbleYPos = [];
                this.bubbleXPos = [];
                for (var i = 0; i < this.bubbleArr.length; i++) {
                    this.bubbleYPos[i] = (_y + 200) + (p.random(-2, 2));
                    this.bubbleXPos[i] = (_x + 20) + ((i * 10) + p.random(-2, 2));
                }
                this.leftOff = 1.95;
                this.topOff = 200;
            } else if (this.type == 3) {
                this.width = p.textWidth("changemachine");
                this.leftOff = 1.85;
                this.topOff = 270;
            }
        }

        shake() {
            this.x = this.x + p.random(-1, 1);
            this.y = this.y + p.random(-1, 1);
            if (this.x > this.baseX + 3) {
                this.x--;
            } else if (this.x < this.baseX - 3) {
                this.x++;
            }
            if (this.y > this.baseY + 2) {
                this.y--;
            } else if (this.y < this.baseY - 2) {
                this.y++;
            }
        }

        displayCash() {
            p.textSize(22);
            p.textLeading(20);
            p.fill(0);
            p.textAlign(p.LEFT, p.TOP);
            p.text("c\nh\na\nn\ng\ne\nm\na\nc\nh\ni\nn\ne", this.x, this.y);
            p.text("changemachine", this.x, this.y);
            p.text("c\nh\na\nn\ng\ne\nm\na\nc\nh\ni\nn\ne", this.x + this.width, this.y);
            p.text("changemachinec", this.x, this.y + this.topOff);
        }

        displayDryer() {
            p.textSize(22);
            p.textLeading(20);
            p.fill(0);
            p.textAlign(p.LEFT, p.TOP);
            p.text(this.payed.toFixed(2) + "/" + this.cost, this.textX + 10, this.textY);
            p.text("d\nr\ny\ne\nr\nd\nr\ny\ne\nr\n", this.x, this.y);
            p.text("dryerdryerdryerdryerdryer", this.x, this.y);
            p.textAlign(p.RIGHT, p.TOP);
            p.text("d\nr\ny\ne\nr\nd\nr\ny\ne\nr\n", this.x + this.width, this.y);
            p.textAlign(p.LEFT, p.TOP);
            p.text("dryerdryerdryerdryerdryerd", this.x, this.y + this.topOff);
            p.textLeading(5);
        }

        displayWasher(phase) {
            p.textSize(22);
            p.textLeading(20);
            p.textAlign(p.LEFT, p.TOP);
            if (phase == 3) {
                this.shake();
            } else if (phase == 2) {
                p.fill(0, 255, 0);
                //FIX
                //each washer needs their own phase
                p.text("Start", this.x, this.y - 15);
            } else if (phase <= 1) {
                p.fill(0);
                p.text(this.payed.toFixed(2) + "/" + this.cost, this.textX + 10, this.textY);
            }
            p.fill(0);
            p.text("w\na\ns\nh\ne\nr\nw\na\ns\nh\n", this.x, this.y);
            p.text("washerwasherwasherwash", this.x, this.y);
            p.textAlign(p.RIGHT, p.TOP);
            p.text("w\na\ns\nh\ne\nr\nw\na\ns\nh\n", this.x + this.width, this.y);
            p.textAlign(p.LEFT, p.TOP);
            p.text("washerwasherwasherwasher", this.x, this.y + this.topOff);
            p.textLeading(5);
        }

        bubbles() {
            p.fill('#00FFFF');
            for (var i = 0; i < this.bubbleArr.length; i++) {
                p.textSize(p.random(18, 20))
                p.text(this.bubbleArr[i], this.bubbleXPos[i], this.bubbleYPos[i]);
                if (this.bubbleYPos[i] > 580) {
                    this.bubbleYPos[i]--;
                } else {
                    this.bubbleXPos[i] = this.bubbleXPos[i] + p.random(-1, 1);
                    this.bubbleYPos[i] = this.bubbleYPos[i] + p.random(-1, 1);
                }
            }
        }

        pressStart(otherX, otherY) {
            if (otherX > this.x && otherX < this.x + p.textWidth("Start") && otherY > this.y - 15 && otherY < this.y) {
                return true;
            }
        }

        checkColl(otherX, otherY) {
            if (otherX > this.x && otherX < this.x + this.width && otherY > this.y && otherY < this.y + this.topOff) {
                return true;
            } else {
                return false;
            }
        }

    }
}