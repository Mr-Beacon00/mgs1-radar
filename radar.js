// Mr_Beacon00's shitty code.
let warning_counter = set_warning_counter = 600600;

const border = document.getElementById("border");
const banner = document.getElementById("banner");
const dotsBorder = document.getElementById("dotsBorder");
const brusher = document.getElementById("brusher");
const staticLayer = document.getElementById("layer");
const numDiv1 = document.getElementById("numDiv1");
const numDiv2 = document.getElementById("numDiv2");
const timerNumDiv1 = document.getElementById("timerNumDiv1");
const timerNumDiv2 = document.getElementById("timerNumDiv2");
const timerNumDiv3 = document.getElementById("timerNumDiv3");
const timerDotDiv = document.getElementById("timerDotDiv");
const dotsImg = document.getElementById("dotsImg");
const size = document.getElementById("sizeSelect");
const typeSelect = document.getElementById("typeSelect");
const isJapanese = document.getElementById("isJapanese");
const isWarning = document.getElementById("isWarning");
const isJamming = document.getElementById("isJamming");

const radarWidth = 71;
const radarHeight = 54;
const radarBorderThickness = 1;
const radarBannerWidth = 69;
const radarBannerTop = 1;
const staticLayerWidth = 69;
const dotsWidth = 56;
const dotsHeight = 64;
const numBoxWidth = 22;
const numBoxHeight = 16;
const timer1BoxWidth = 19;
const timer1BoxHeight = 16;
const timer2BoxWidth = 15;
const timer2BoxHeight = 13;
const timerDotWidth = 25;
const timerDotHeight = 9;
const num1Left = 9;
const num2Left = 38;
const timer1Left = 3;
const timer2Left = 27;
const timer3Left = 51;
const timerDotLeft = 24;
const numTop = 32;
const timerTop = 35;
const timerDotTop = 37;
const stepSize = 1;
const lineStepSize = 2;

let EOL;
let lineHeight;
let brusherLeft = 0;
let line = 0;
let tops = 0;

let number_count = 255;
let numTimer;
let numCountdownStep = 1;

const bannerTotalStep = 15; // 1.0 / 0.20 = 5步
const bannerStepStart = 8;
let bannerCurrentStep = bannerTotalStep;

let lastTime, dotsTimer, bannerTimer, warningTimer;

let images = [
	document.getElementById('digit1'),
	document.getElementById('digit2'),
	document.getElementById('digit3'),
	document.getElementById('digit4'),

	document.getElementById('timerDigit1'),
	document.getElementById('timerDigit2'),
	document.getElementById('timerDigit3'),
	document.getElementById('timerDigit4'),
	document.getElementById('timerDigit5'),
	document.getElementById('timerDigit6')
];

// fuck this, it took me a lot of time.
function dotsUpdate() {
    if (typeSelect.value <= 0) {
        console.log("No dots update, type is none!");
        return;
    }
	// brusher didn't reach end of line
	if (brusherLeft < EOL) {
		brusherLeft += stepSize; // brusher left +1
	} else {
		brusherLeft = 0; // CR
		// if not loop yet
		if (line < lineHeight - lineStepSize) {
			line += lineStepSize; // LF+2 (1 empty line 1 actual line)
		} else if (tops < (dotsHeight - lineHeight)) { // if is in loop
			tops += lineStepSize; // current tops+2
		} else { // loop reach the end
			tops = (tops - line) - (dotsHeight/2 - lineHeight); // reset img to half position
		}
	}

	// brusher scan from left to right
	brusher.style.left = `${brusherLeft*size.value}px`;
	brusher.style.top = `${line*size.value}px`;
	// calculate reversed lines (remaining lines)
	let revLine = (dotsHeight + -tops) - line;
	// unhide bottom
	dotsImg.style.clipPath = `inset(0 0 ${(revLine - lineStepSize)*size.value}px 0)`;
	// scroll up
	dotsImg.style.top = `${-tops*size.value}px`;
}


function banner_step() {
	if (bannerCurrentStep > 1) {
		bannerCurrentStep--;
	} else {
		bannerCurrentStep = bannerTotalStep;
	}
	if (bannerCurrentStep < bannerStepStart) {
		banner.style.opacity = bannerCurrentStep / bannerStepStart;
	} else {
		banner.style.opacity = 1;
	}
}

function checkType () {
    const type = parseInt(typeSelect.value);
    switch(type) {
        case 1: setJammingType(); break;
        case 2: setEvasionType(); break;
        case 3: setAlertType(); break;
        default: setNoneType(); break;
    }

	// for both evasion and alert
	if (typeSelect.value == 2 || typeSelect.value == 3) {
		setAlertTimer();
	}

	if (isWarning.checked) {
		console.log("warning");
		banner.src = "layers/warning.png";
		staticLayer.src = "layers/layer4.png";
		typeSelect.disabled = true;
		[timerNumDiv1, timerNumDiv2, timerNumDiv3, timerDotDiv].forEach(el => el.style.opacity = 1);
	} else {
		typeSelect.disabled = false;
		[timerNumDiv1, timerNumDiv2, timerNumDiv3, timerDotDiv].forEach(el => el.style.opacity = 0);
	}

	// type 123, dots exist, make brusher and dots visable, init brusher pos with dotsUpdate()
	if (type > 0) {
		dotsBorder.style.opacity = 1;
		brusher.style.opacity = 1;
		dotsBorder.style.width = `${EOL*size.value}px`;
		dotsBorder.style.height = `${lineHeight*size.value}px`;
		brusherLeft = brusherLeft - stepSize;
		dotsUpdate();
	}
}


function setJammingType() {
	console.log("jamming");
	brusher.style.backgroundColor = "rgb(0,160,64)";
	banner.src = "layers/jamming.png";
	staticLayer.src = "layers/layer1.png";
	EOL = 56;
	lineHeight = 16;

	if (line + tops < lineHeight) {
		line = line+tops;
		tops = 0;
	} else  {
		let diff = (lineHeight - lineStepSize) - line;
		line = diff + line;
		tops = tops - diff;
	}
	numDiv1.style.opacity = numDiv2.style.opacity = 0;
	dotsBorder.style.left = `${6*size.value}px`;
	dotsBorder.style.top = `${30*size.value}px`;
}
function setEvasionType() {
	console.log("evasion");
	brusher.style.backgroundColor = "rgb(112, 112, 0)";
	if (isJapanese.checked) {
		banner.src = "layers/escape.png";
	} else {
		banner.src = "layers/evasion_fix.png";
	}
	staticLayer.src = "layers/layer2.png";
}
function setAlertType() {
	console.log("alert");
	brusher.style.backgroundColor = "rgb(216, 0, 0)";
	if (isJapanese.checked) {
		banner.src = "layers/danger_fix.png";
	} else {
		banner.src = "layers/alert.png";
	}
	
	staticLayer.src = "layers/layer3.png";
}
function setNoneType() {
	dots_stop();
	console.log("none");
	banner.src = "";
	staticLayer.src = "";
	numDiv1.style.opacity = 0;
	numDiv2.style.opacity = 0;
	dotsBorder.style.opacity = 0;
	brusher.style.opacity = 0;
	line = 0;
	tops = 0;
	brusherLeft = 0;
}

function setAlertTimer () {
	EOL = 24;
	lineHeight = 12;

	// if change back from jamming, reset brusher(mask layer) position
	if (brusherLeft > EOL) {
		brusherLeft = EOL-stepSize;
	}

	// if change back from jamming, dots position
	let diff = (line + lineStepSize) - lineHeight;
	if (line >= lineHeight && tops <= 0) { // after line 10, scroll first time, not loop yet
		tops = diff;
		line = line - diff;
	} else if (line >= lineHeight && tops >= 0) { //dot already in loop
		tops = diff + tops;
		line = line - diff;
	}

	// only evasion and alert have numbers
	numDiv1.style.opacity = 1;
	numDiv2.style.opacity = 1;
	dotsBorder.style.left = `${38*size.value}px`;
	dotsBorder.style.top = `${14*size.value}px`;
}

// init base number
function init() {
	const sizeValue = size.value;
    
    // Border and main elements
    border.style.cssText = `width:${radarWidth*sizeValue}px;height:${radarHeight*sizeValue}px;border:${radarBorderThickness*sizeValue}px solid black`;
    staticLayer.style.width = `${staticLayerWidth*sizeValue}px`;
    banner.style.cssText = `width:${radarBannerWidth*sizeValue}px;top:${radarBannerTop*sizeValue}px`;
    
    // Number displays
    setupElement(numDiv1, numBoxWidth, numBoxHeight, num1Left, numTop);
    setupElement(numDiv2, numBoxWidth, numBoxHeight, num2Left, numTop);
    setupElement(timerNumDiv1, timer1BoxWidth, timer1BoxHeight, timer1Left, numTop);
    setupElement(timerNumDiv2, timer1BoxWidth, timer1BoxHeight, timer2Left, numTop);
    setupElement(timerNumDiv3, timer2BoxWidth, timer2BoxHeight, timer3Left, timerTop);
    setupElement(timerDotDiv, timerDotWidth, timerDotHeight, timerDotLeft, timerDotTop);
    
    // Brusher and dots
    brusher.style.cssText = `width:${dotsWidth*sizeValue}px;height:${stepSize*sizeValue}px`;
    dotsImg.style.cssText = `height:${dotsHeight*sizeValue}px;clip-path:inset(0 0 ${(dotsHeight - lineStepSize)*sizeValue}px 0)`;
}

function setupElement(element, width, height, left, top) {
    const sizeValue = size.value;
    element.style.width = `${width*sizeValue}px`;
    element.style.height = `${height*sizeValue}px`;
    element.style.left = `${left*sizeValue}px`;
    element.style.top = `${top*sizeValue}px`;
}

function number_countdown_step() {
	if (number_count <= 0) {
		resetNumTimer();
		if (typeSelect.value == 2 && !isJamming.checked) { // if evasion and jamming not checked
			setType(0); // skip jamming, back to none
		} else {
			setType(typeSelect.value -= 1); // only -1, back to jamming
		}
	} else {
		number_count-=numCountdownStep; // step
	}
	let out = Math.floor((number_count+1)*39.05859375);
	let zStr = out.toString().padStart(4, '0');
    for (let i = 0; i < 4; i++) {
        images[i].src = `digits/${zStr[i]}.png`;
    }
}

function warning_countdown_step() {
    const now = performance.now();
    const delta = now - lastTime;
    lastTime = now;
    warning_counter -= delta;

	// IS TIME TO STOP!
    if (warning_counter < 30 || !isWarning.checked) {
        warning_counter = 0;
        warning_countdown_stop();
		//return
    }

    const min = Math.floor(warning_counter / 60000);
    const sec = Math.floor((warning_counter % 60000) / 1000);
    const cs = Math.floor((warning_counter % 1000) / 10); // ms but 99 (centiseconds)
	if (isWarning.checked) {
		if (cs >= 50) {
			timerDotDiv.style.opacity = 1;
		} else {
			timerDotDiv.style.opacity = 0.5;
		}
	} else {
		timerDotDiv.style.opacity = 0;
	}
    const minStr = min.toString().padStart(2, '0');
    const secStr = sec.toString().padStart(2, '0');
    const csStr = cs.toString().padStart(2, '0');

    images[4].src = `warning_digits/${minStr[0]}.png`;
    images[5].src = `warning_digits/${minStr[1]}.png`;
    images[6].src = `warning_digits/${secStr[0]}.png`;
    images[7].src = `warning_digits/${secStr[1]}.png`;
    images[8].src = `warning_digits/ms${csStr[0]}.png`;
    images[9].src = `warning_digits/ms${csStr[1]}.png`;
}

// 1 evasion 9920, 2 unused yet 9881, 3 alert 9842, 4 fast alert 9803
function number_countdown_start() {
	if (typeSelect.value >= 2) {
		resetNumTimer();
		number_count = 255;
		numCountdownStep = 1;
		numTimer = setInterval(number_countdown_step, 20);
	} else {
		console.log("no number")
	}
}

function resetNumTimer() {
	clearInterval(numTimer);
	number_count = 255;
}

function dots_start() {
	if (typeSelect.value > 0) {
		dots_stop();
		dotsTimer = setInterval(dotsUpdate, 33);
	} else {
		console.log("type is not 123, or already start!");
	}
}

function bannerFlashStart(){
	if (typeSelect.value > 0 || isWarning.checked) {
		bannerFlashStop();
		bannerTimer = setInterval(banner_step, 40);
	} else {
		console.log("No banner start, type is not 123 or warning!");
	}
}

function bannerFlashStop(){
	clearInterval(bannerTimer);
}

function warning_countdown_start() {
	if (isWarning.checked) {
		warning_counter = set_warning_counter
		lastTime = performance.now();
		warningTimer = setInterval(warning_countdown_step, 20);
	} else {
		console.log("No warning timer start, warning not checked!");
	}
}

function warning_countdown_stop() {
	clearInterval(warningTimer);
}

function setType(typeID) {
	typeSelect.value = typeID;
	resetNumTimer();
	checkType();
}

function dots_stop() {
	clearInterval(dotsTimer);
	dotsTimer = "";
}

size.onchange = function() {
	init();
	checkType();
};

isJapanese.onchange = checkType;
typeSelect.onchange = function() {
	setType(typeSelect.value);
};
isWarning.onchange = function() {
	setType(0);
};

init();
checkType();
