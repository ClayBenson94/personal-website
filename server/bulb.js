class Bulb {
    constructor(startingColor, onColorChange) {
        this.color = Object.assign({}, startingColor);
        this.onColorChange = onColorChange;
        this.pattern = null;
        this.patternIntervalID = null;
        this.onColorChange(this.color);
    }

    getColor() {
        return this.color;
    }

    setColor(color) {
        Object.assign(this.color, color);
    }

    getPattern() {
        return this.pattern;
    }

    startPattern(patternObj) {
        let speed, brightnessPercent;
        switch (patternObj.patternName) {
            case 'rainbow':
                speed = parseInt(patternObj.speed);
                brightnessPercent = parseInt(patternObj.brightnessPercent);
                if (isNaN(speed)) throw new Error(`Error in startPattern(): Speed "${speed}" is not a number`);
                if (isNaN(speed)) throw new Error(`Error in startPattern(): Brightness Percent "${brightnessPercent}" is not a number`);

                this.curPattern = patternObj.patternName;
                this.rainbow(speed, brightnessPercent);
                break;
            case 'pulse':
                speed = parseInt(patternObj.speed);
                if (isNaN(speed)) throw new Error(`Error in startPattern(): Speed "${speed}" is not a number`);

                this.curPattern = patternObj.patternName;
                this.pulse(speed, patternObj.color);
                break;
            case 'custom':
                speed = parseInt(patternObj.speed);
                if (isNaN(speed)) throw new Error(`Error in startPattern(): Speed "${speed}" is not a number`);

                this.curPattern = patternObj.patternName;
                this.customColorSet(speed, patternObj.colors, patternObj.smooth);
                break;
            default:
                throw new Error(`Error in startPattern(): Pattern "${patternObj.pattern}" is not a valid pattern`);
        }
    }

    stopPattern() {
        this.pattern = null;
        this.onColorChange(this.color);
    }

    rainbow(speed, brightnessPercent) {
        if (speed < 10) speed = 10;
        if (speed > 100) speed = 100;
        if (brightnessPercent < 1) brightnessPercent = 1;
        if (brightnessPercent > 100) brightnessPercent = 100;

        let brightnessMax = (255 / 100) * brightnessPercent; //Convert to 2.55..255 range

        let stepAmount = brightnessMax / 255;

        let rgb = [brightnessMax, 0, 0];
        let pos = 0;

        clearInterval(this.patternIntervalID);
        this.patternIntervalID = setInterval(() => {
            if (this.curPattern !== 'rainbow') { //null or some other pattern
                clearInterval(this.patternIntervalID);
                return;
            }

            rgb[pos] = rgb[pos] - stepAmount;
            rgb[this.getPos(pos + 1, 2)] = rgb[this.getPos(pos + 1, 2)] + stepAmount;

            if (rgb[pos] <= 0) {
                rgb[pos] = 0;
                rgb[this.getPos(pos + 1, 2)] = brightnessMax;
                pos = this.getPos(pos + 1, 2);
            }

            this.onColorChange({
                r: rgb[0],
                g: rgb[1],
                b: rgb[2],
            });
        }, speed);
    }

    calculateStep(curColor, fromColor, toColor, numSteps) {
        let stepValues = {
            rStep: (toColor.r - fromColor.r) / (numSteps),
            gStep: (toColor.g - fromColor.g) / (numSteps),
            bStep: (toColor.b - fromColor.b) / (numSteps)
        };

        curColor.r += stepValues.rStep;
        curColor.g += stepValues.gStep;
        curColor.b += stepValues.bStep;

        return curColor;
    }

    customColorSet(speed, colorObjArr, smooth) {
        if (speed < 10) speed = 10;
        if (speed > 50) speed = 50;
        if (colorObjArr.length < 2) return;
        let from = 0;
        let to = 1;

        let numSteps = speed * 3;
        let curSteps = 0;
        let curColor = JSON.parse(JSON.stringify(colorObjArr[from]));

        clearInterval(this.patternIntervalID);
        this.patternIntervalID = setInterval(() => {
            if (this.curPattern !== 'custom') { //null or some other pattern
                clearInterval(this.patternIntervalID);
                return;
            }

            if (smooth) {
                curColor = this.calculateStep(curColor, colorObjArr[from], colorObjArr[to], numSteps);
            }
            this.onColorChange(curColor);
            if (curSteps >= numSteps) {
                curColor.r = colorObjArr[to].r;
                curColor.g = colorObjArr[to].g;
                curColor.b = colorObjArr[to].b;
                from = this.getPos(from + 1, colorObjArr.length - 1);
                to = this.getPos(to + 1, colorObjArr.length - 1);
                curSteps = 0;
            }
            curSteps++;
        }, speed);
    }

    pulse(speed, colorObj) {
        if (speed < 25) speed = 25;
        if (speed > 50) speed = 50;
        let maxBrightnessColor = JSON.parse(JSON.stringify(colorObj));
        let minBrightnessColor = {
            r: Math.round(colorObj.r / 5),
            g: Math.round(colorObj.g / 5),
            b: Math.round(colorObj.b / 5)
        };

        let numSteps = speed * 3;
        let curSteps = 0;
        let curColor = JSON.parse(JSON.stringify(minBrightnessColor));
        let pulseUp = true;

        clearInterval(this.patternIntervalID);
        this.patternIntervalID = setInterval(() => {
            if (this.curPattern !== 'pulse') { //null or some other pattern
                clearInterval(this.patternIntervalID);
                return;
            }

            if (pulseUp) {
                curColor = this.calculateStep(curColor, minBrightnessColor, maxBrightnessColor, numSteps);
            } else {
                curColor = this.calculateStep(curColor, maxBrightnessColor, minBrightnessColor, numSteps);
            }
            this.onColorChange(curColor);
            if (curSteps >= numSteps) {
                //Make sure our color is exact
                if (pulseUp) {
                    curColor.r = maxBrightnessColor.r;
                    curColor.g = maxBrightnessColor.g;
                    curColor.b = maxBrightnessColor.b;
                } else {
                    curColor.r = minBrightnessColor.r;
                    curColor.g = minBrightnessColor.g;
                    curColor.b = minBrightnessColor.b;
                }
                pulseUp = !pulseUp;
                curSteps = 0;
            }
            curSteps++;

        }, speed);
    }

    getPos(pos, maxIndex) {
        if (pos < 0) {
            return maxIndex;
        }
        if (pos > maxIndex) {
            return 0;
        }
        return pos;
    }
}

module.exports = Bulb;