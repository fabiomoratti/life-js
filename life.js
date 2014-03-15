/**
 * Created by fabio on 05/03/14.
 */

var canvas = document.getElementById('lifeCanvas');
var ctx = canvas.getContext('2d');

/**
 * This is the model of the Life matrix.
 */
function LifeMatrix(width, height) {
    this.width = width;
    this.height = height;
    this.evenMatrix = [];
    this.init(this.evenMatrix);
    this.oddMatrix = [];
    this.iteration = 0;
    this.isEven = true;

}

/**
 * Initialize a matrix with a random pattern.
 * @param matrix the matrix to be initialized.
 */
LifeMatrix.prototype.init = function (matrix) {
    for (var i = 0; i < this.width; i++) {
        for (var j = 0; j < this.height; j++) {
            matrix[i + j * this.width] = Math.floor(Math.random() * 2);
        }
    }
};

/**
 * Compute the next generation of the matrix.
 */
LifeMatrix.prototype.nextGeneration = function () {

    // get a reference to the current and next generation matrices.
    var current, next;
    if (this.isEven) {
        current = this.evenMatrix;
        next = this.oddMatrix;
    } else {
        current = this.oddMatrix;
        next = this.evenMatrix;
    }

    // temporary simplification: we don't update cells on the border of the matrix.
    // this is wrong, but will deal with it later.
    var iMax = this.width - 1;
    var jMax = this.height - 1;
    var count;
    for (var i = 1; i < iMax; i++) {
        for (var j = 1; j < jMax; j++) {
            count = this.countNeighbors(current, i, j);
            // morta
            if (current[i + j * this.width] == 0) {
                if (count == 3) {
                    next[i + j * this.width] = 1;
                } else if((count == 0) && (Math.floor(Math.random() * 100)==1)){
                    next[i + j * this.width] = 1;
                } else{
                    next[i + j * this.width] = 0;
                }
            }
            // viva
            else {
                if (count == 2 || count == 3 ) {
                    next[i + j * this.width] = 1;
                } else {
                    next[i + j * this.width] = 0;
                }
            }
        }
    }
    this.iteration++;
    this.isEven = !this.isEven;
};

LifeMatrix.prototype.countNeighbors = function (matrix, x, y) {
    // Il codice puo' essere ottimizzato precalcolando y+this.width.
    // Interessante capire quanto si riesce ad ottimizzare;
    return matrix[x - 1 + this.width * (y + 1)] + matrix[x + this.width * (y + 1)] + matrix[x + 1 + this.width * (y + 1)] +
        matrix[x - 1 + this.width * y] + matrix[x + 1 + this.width * y] +
        matrix[x - 1 + this.width * (y - 1)] + matrix[x + this.width * (y - 1)] + matrix[x + 1 + this.width * (y - 1)];
};

LifeMatrix.prototype.get = function (i) {
    // get a reference to the current and next generation matrices.
    var current;
    if (this.isEven) {
        current = this.evenMatrix;
    } else {
        current = this.oddMatrix;
    }
    return current[i];
};
// ---------------------------------------------------------------------------------------------------------------------
// Animation loop & functions
// ---------------------------------------------------------------------------------------------------------------------
function loop() {
    clear();
    update();
    draw();
    queue();
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
    life.nextGeneration();
}

function draw() {
    var imageData = ctx.createImageData(canvas.width, canvas.height);
    var iMax = life.width * life.height;
    var pixelIndex, cell;
    for (var i = 0; i < iMax; i++) {
        pixelIndex = 4 * i;
        cell = life.get(i);
        imageData.data[pixelIndex ] = 255 - cell * 255;
        imageData.data[pixelIndex + 1] = 255 - cell * 255;
        imageData.data[pixelIndex + 2] = 255 - cell * 255;
        imageData.data[pixelIndex + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
}

function queue() {
    window.requestAnimationFrame(loop);
}

var life = new LifeMatrix(canvas.width, canvas.height);
loop();