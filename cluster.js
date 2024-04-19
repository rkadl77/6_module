/*основной холст*/
let canvas = document.createElement('canvas');
canvas.id = 'fieldCanvas';
canvas.width = 600;
canvas.height = 600;
document.body.append(canvas);
let ctx = canvas.getContext('2d');

/*значения*/
function createMatrix(x, y){
    let localMatrix = [];
    for(let i = 0; i < x; i++){
        localMatrix[i] = [];
        for(let j = 0; j < y; j++){
            localMatrix[i][j] = 0;
        } 
    }
    return localMatrix;
}
let slider = document.getElementById('slider');
let pointMatrix = createMatrix(canvas.width/slider.value, canvas.height/slider.value);
let clustersNumber = document.getElementById('num_cluster').value;

/*кнопки вызывающие функции*/
 
let startButton = document.getElementById('startButton');
startButton.addEventListener('click', KMean);
let clearButton = document.getElementById('clearButton');
clearButton.addEventListener('click', clearAll);

/*логика рисования канваса*/

function drawPixel(event, ctx, slider){
    let x = Math.floor(event.offsetX / slider.value);
    let y = Math.floor(event.offsetY / slider.value);
    let correctX = x * slider.value;
    let correctY = y * slider.value;
    ctx.fillRect(correctX, correctY, slider.value, slider.value);
    ctx.fillStyle = "#C0C0C0"; 
    pointMatrix[y][x] = 1;
    console.log(pointMatrix);
}

function updateMatrix(){
    pointMatrix = createMatrix(canvas.width/slider.value , canvas.height/slider.value);
}

canvas.addEventListener('mousedown', (event)=>draw(event, canvas, ctx))

function draw(event, canvas, ctx){
drawPixel(event, ctx, slider);
canvas.onmousemove = (event)=>draw(event, canvas, ctx);

canvas.onmouseup = ()=>canvas.onmousemove = null;
canvas.onmouseover = ()=>canvas.onmousemove = null;
}

function clearAll(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pointMatrix = createMatrix(canvas.width/slider.value , canvas.height/slider.value);
}

/*алгоритм*/


function randomInt(min, max){
    return Math.floor(min + Math.floor(Math.random() * (max - min)));
}

function getMax(pointMatrix){
    let data =[0,0];

    for (let i = 0; i < 2; i++)
        for (let j = 0; j < pointMatrix.length; j++)
            if(data[i] < pointMatrix[j][i]) data[i] = pointMatrix[j][i];

    return data;
}

function randomInteger(min, max) {
    let rand = [];
    for(let i = 0;i<2;i++) {
        rand[i] = Math.floor(min[i] + Math.floor(Math.random() * (max[i] - min[i])));
    }

    return rand;
}

function getMin(pointMatrix){
    console.log('getMin', pointMatrix);
    const bigVar = 1.0e+35;
    let data =[bigVar,bigVar];
    for (let i = 0; i < 2; i++){
        for (let j = 0; j < pointMatrix.length; j++){
            if(data[i]>pointMatrix[j][i])data[i] = pointMatrix[j][i];
        }
        }

    return data;
}

function createVector(clustersNumber, pointMatrix){
    let array = new Array(clustersNumber);

    let min = getMin(pointMatrix);
    let max = getMax(pointMatrix);

    for (let i = 0; i < clustersNumber; i++){
        array[i] = randomInteger(min,max);
    }

    return array;
}

function getEuclideanDistance(firstPoint,secondPoint){
    return ((secondPoint[0]-firstPoint[0])**2 + (secondPoint[1]-firstPoint[1])**2)**(1/2);
}

function createClusters(centroids){
    let clusters=[];
    for (let i = 0; i < centroids.length; i++)
        clusters[i] = [];

    const bigVar = 1.0e+35;
    
    for(let i = 0;i < pointMatrix.length; i++){
        let temp = [bigVar];

        for (let j = 0; j < centroids.length;j++) {
            const tempSecond = getEuclideanDistance(pointMatrix[i], centroids[j]);
            if (tempSecond < temp[0]) {
                temp[0] = tempSecond;
                temp[1] = j;
            }

        }

        let temp1 = temp[1];
        let temp2 = clusters[temp[1]].length;
        clusters[temp1][temp2] = pointMatrix[i];

    }
    
    return clusters;
}

function getNewCentroids(clusters){

    let centroids= [];
    for (let i = 0; i < clusters.length; i++)
        centroids[i] = [];

    for (let i = 0;i<2 ;i++){
        for(let j =0; j < clusters.length; j++){
            let temp= 0;
            for(let n = 0; n < clusters[j].length;n++){
                temp += clusters[j][n][i];
            }
            temp/=clusters[j].length;
            centroids[j][i] =temp;
        }
    }

    return centroids;
}

function createMatrixBySize(cols, rows){
    let matrix = [];
    for (let i = 0; i < rows; i++) {

        matrix[i] = [];
        for (let j = 0; j < cols; j++) {
            matrix[i][j] = 0;
        }

    }
    
    return matrix;
}

function createDotsByMatrix(matrixClusters, matrixColor){
    for(let j = 0; j < matrixClusters.length; j++) {
        ctx.fillStyle = `rgb(${matrixColor[j][0]},
                                     ${matrixColor[j][1]},
                                     ${matrixColor[j][2]})`;
        for (let i = 0; i < matrixClusters[j].length; i++) {
            ctx.fillRect(matrixClusters[j][i][0] * slider.value, matrixClusters[j][i][1] * slider.value, slider.value, slider.value);

        }
    }
}

function getNewCluster(centroids, clusters, pointMatrix, colorsClusters, counter = 0){
    createDotsByMatrix(clusters,colorsClusters)
    clusters = createClusters(centroids,pointMatrix);
    let newCentroids = getNewCentroids(clusters);

    counter++;
    let bool = false;
    for (let i = 0; i < centroids.length; i++) {

        if(isNaN(newCentroids[i][0]))return false;
        if (newCentroids[i][0] !== centroids[i][0] ||
            newCentroids[i][1] !== centroids[i][1]) {
            bool = true;
        }
        
    }

    if(bool)return setTimeout(getNewCluster, 800, newCentroids, clusters, pointMatrix, colorsClusters, counter);


    return newCentroids;
}

function KMean(){
    console.log('clusKmean', clustersNumber);
    if(clustersNumber == 0){
        alert("ENTER THE NUMBER OF CLUSTERS");
    }
    
    let centroids = createVector(clustersNumber, pointMatrix);

    let clusters = createClusters(centroids);

    let colorsClusters = createMatrixBySize(clustersNumber, 3);

    colorsClusters = generateColor(clusters, colorsClusters);

    let bool = true;
    while (bool) {

        bool = false;
        let newCentroids = getNewCluster(centroids, clusters, pointMatrix, colorsClusters);
        if (newCentroids===false){
            bool = true;
            centroids = createVector(clustersNumber, pointMatrix);
            newCentroids = getNewCluster(centroids, clusters, pointMatrix, colorsClusters);
        }

    }

}

function generateColor(matrix){
    let newMatrix = matrix;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < 3; j++) {
            newMatrix[i][j] = randomInt(0,255);
        }
    }
    return newMatrix;
}
