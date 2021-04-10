import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';
import Shader from "./shader.js";
import fragmentShaderSrc from "./fragment.js";
import vertexShaderSrc from "./vertex.js";
import BoundingBox from "./BoundingBox.js";
import Square from "./Square.js";
import Circle from "./Circle.js";

var canvas = document.getElementById("myCanvas");
var gl = canvas.getContext("webgl");

var c = document.getElementById("text");
var ctx = c.getContext("2d");


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
c.width = window.innerWidth;
c.height = window.innerHeight;

console.log("Hello World");
var shader = new Shader(gl, vertexShaderSrc, fragmentShaderSrc);
var program = shader.link();

var mode = 0;
var xCoor = 0;
var yCoor = 0;
var finalX = 0;
var finalY = 0;
var shapesList = [];
var nearestIndex = -1;


var bBox = new BoundingBox(gl, program);

window.addEventListener("click", function(event) {
    xCoor = event.clientX;
    yCoor = event.clientY;

    finalX = (xCoor / canvas.width) * (2) - 1;
    finalY = (yCoor / canvas.height) * (2) - 1;
    finalY = -finalY;
    console.log("The screen coordinates are ", xCoor, " ", yCoor);
    console.log("The WebGL coordinates are ", finalX, " ", finalY);
    if (mode == 1) {
        var maxDist = 1000;
        nearestIndex = -1;
        for (var i = 0; i < shapesList.length; i++) {
            var tempDist = Math.abs(finalX - shapesList[i].x) + Math.abs(finalY - shapesList[i].y);
            if (tempDist < maxDist) {
                maxDist = tempDist;
                nearestIndex = i;
            }
        }
    }
});

window.addEventListener("keydown", function(event) {
    if (event.key == '+' && mode == 1) {
        console.log("PLUS SIGN");
        for (var i = 0; i < shapesList.length; i++) {
            if (nearestIndex == i) {
                shapesList[nearestIndex].colour = [0.0, 0.0, 0.0];
                shapesList[nearestIndex].size = shapesList[nearestIndex].size + 0.01;

            } else {
                shapesList[i].colour = shapesList[i].origColor;
            }
        }

    } else if (event.key == '-' && mode == 1) {
        console.log("MINUS SIGN");
        for (var i = 0; i < shapesList.length; i++) {
            if (nearestIndex == i) {
                shapesList[nearestIndex].colour = [0.0, 0.0, 0.0];
                shapesList[nearestIndex].size = shapesList[nearestIndex].size - 0.01;

            } else {
                shapesList[i].colour = shapesList[i].origColor;
            }
        }

    } else if (event.key == 'x' && mode == 1) {
        console.log("Delete the object");
        if (nearestIndex != -1) {
            shapesList.splice(nearestIndex, 1);
        }

    } else if (event.keyCode == 37 && mode == 2) {
        bBox.rotationAngle = bBox.rotationAngle + 0.1;
        for (var i = 0; i < shapesList.length; i++) {
            shapesList[i].rotationAngle = shapesList[i].rotationAngle + 0.1;
        }

    } else if (event.keyCode == 39 && mode == 2) {
        bBox.rotationAngle = bBox.rotationAngle - 0.1;
        for (var i = 0; i < shapesList.length; i++) {
            shapesList[i].rotationAngle = shapesList[i].rotationAngle - 0.1;
        }
    } else if (event.keyCode == 37 && mode == 1) {
        console.log("Key PRESSED 37");
        for (var i = 0; i < shapesList.length; i++) {
            if (nearestIndex == i) {
                shapesList[nearestIndex].colour = [0.0, 0.0, 0.0];
                shapesList[nearestIndex].x = shapesList[nearestIndex].x - 0.05;
            } else {
                shapesList[i].colour = shapesList[i].origColor;
            }
        }

    } else if (event.keyCode == 38 && mode == 1) {
        console.log("Key PRESSED 38");
        for (var i = 0; i < shapesList.length; i++) {
            if (nearestIndex == i) {
                shapesList[nearestIndex].colour = [0.0, 0.0, 0.0];
                shapesList[nearestIndex].y = shapesList[nearestIndex].y + 0.05;
            } else {
                shapesList[i].colour = shapesList[i].origColor;
            }
        }

    } else if (event.keyCode == 39 && mode == 1) {
        console.log("Key PRESSED 39");
        for (var i = 0; i < shapesList.length; i++) {
            if (nearestIndex == i) {
                shapesList[nearestIndex].colour = [0.0, 0.0, 0.0];
                shapesList[nearestIndex].x = shapesList[nearestIndex].x + 0.05;
            } else {
                shapesList[i].colour = shapesList[i].origColor;
            }
        }

    } else if (event.keyCode == 40 && mode == 1) {
        console.log("Key PRESSED 40");
        for (var i = 0; i < shapesList.length; i++) {
            if (nearestIndex == i) {
                shapesList[nearestIndex].colour = [0.0, 0.0, 0.0];
                shapesList[nearestIndex].y = shapesList[nearestIndex].y - 0.05;
            } else {
                shapesList[i].colour = shapesList[i].origColor;
            }
        }

    } else if (event.key == 'r' && mode == 0) {
        console.log("Form a rectangle");
        var length = 0.06;
        var breadth = 0.03;
        var square = new Square(length, breadth, finalX, finalY, gl, program, [1.0, 0.0, 0.0]);
        shapesList.push(square);
    } else if (event.key == 's' && mode == 0) {
        console.log("Form a square");
        var length = 0.03;
        var breadth = 0.03;
        var square = new Square(length, breadth, finalX, finalY, gl, program, [1.0, 0.0, 1.0]);
        shapesList.push(square);
    } else if (event.key == 'c' && mode == 0) {
        var circle = new Circle(finalX, finalY, gl, program, [0.0, 0.0, 1.0]);
        shapesList.push(circle);
        console.log("Form a circle");
    } else if (event.key == 'm') {
        mode = (mode + 1) % 3;
        //alert("The mode is " + mode);
        if (mode == 0) {
            bBox.x1 = 0;
            bBox.y1 = 0;
            bBox.x2 = 0;
            bBox.y2 = 0;
            bBox.x3 = 0;
            bBox.y3 = 0;
            bBox.x4 = 0;
            bBox.y4 = 0;
            bBox.rotationAngle = 0;
            for (var i = 0; i < shapesList.length; i++) {
                var shape = shapesList[i];
                shape.colour = shape.origColor;
                shape.rotationAngle = 0;
            }
            nearestIndex = -1;
        }
        if (mode == 2) {
            nearestIndex = -1;
            var minX = 100;
            var maxX = -100;
            var minY = 100;
            var maxY = -100;

            for (var i = 0; i < shapesList.length; i++) {
                var shape = shapesList[i];
                if (shape.y1 < minY) minY = shape.y1;
                if (shape.y2 < minY) minY = shape.y2;
                if (shape.y3 < minY) minY = shape.y3;
                if (shape.y4 < minY) minY = shape.y4;
                if (shape.y1 > maxY) maxY = shape.y1;
                if (shape.y2 > maxY) maxY = shape.y2;
                if (shape.y3 > maxY) maxY = shape.y3;
                if (shape.y4 > maxY) maxY = shape.y4;
                if (shape.x1 < minX) minX = shape.x1;
                if (shape.x2 < minX) minX = shape.x2;
                if (shape.x3 < minX) minX = shape.x3;
                if (shape.x4 < minX) minX = shape.x4;
                if (shape.x1 > maxX) maxX = shape.x1;
                if (shape.x2 > maxX) maxX = shape.x2;
                if (shape.x3 > maxX) maxX = shape.x3;
                if (shape.x4 > maxX) maxX = shape.x4;
            }
            bBox.x1 = minX;
            bBox.y1 = maxY;
            bBox.x2 = maxX;
            bBox.y2 = maxY;
            bBox.x3 = maxX;
            bBox.y3 = minY;
            bBox.x4 = minX;
            bBox.y4 = minY;
        }
    }
});


function animate() {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 0.3);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    ctx.clearRect(0, 0, c.width, c.height);
    ctx.font = "70px Verdana";
    var gradient = ctx.createLinearGradient(0, 0, c.width, 0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    ctx.fillStyle = gradient;
    ctx.fillText("The mode value is " + mode, 500, 80);

    ctx.font = "30px Verdana";
    var gradient = ctx.createLinearGradient(0, 0, c.width, 0);
    gradient.addColorStop("1.0", "red");
    gradient.addColorStop("0", "magenta");
    ctx.fillStyle = gradient;
    ctx.fillText("Press r to select Rectangle,s to select Square and c to select Circle", 500, 150);


    if (mode == 2) {
        bBox.drawBoundingBox();
    }
    for (var i = 0; i < shapesList.length; i++) {
        var shape = shapesList[i];
        shape.drawShape();
    }

    window.requestAnimationFrame(animate);
}
animate();