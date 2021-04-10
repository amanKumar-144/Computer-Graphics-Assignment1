import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';
export default class Circle {
    constructor(x, y, gl, program, colour) {
        this.x = x;
        this.y = y;
        this.gl = gl;
        this.program = program;
        this.colour = colour;

        this.mode = 0;
        this.origColor = colour;

        this.modelMatrix = mat4.create();
        mat4.identity(this.modelMatrix);


        this.x1 = this.x - (this.radius + this.size);
        this.x2 = this.x + (this.radius + this.size);
        this.x3 = this.x;
        this.x4 = this.x;
        this.y1 = this.y;
        this.y2 = this.y + 2 * (this.radius + this.size);
        this.y3 = this.y;
        this.y4 = this.y - 2 * (this.radius + this.size);

        this.rotationAngle = 0;
        this.rotationAxis = vec3.fromValues(0, 0, 1);

        this.radius = 0.05;
        this.size = 0;

        this.vertices = [];
        for (var i = 0; i <= 360; i = i + 1) {
            var angle1 = i * Math.PI / 180;
            var vert1 = [this.x + (this.radius + this.size) * Math.cos(angle1), this.y + 2 * (this.radius + this.size) * Math.sin(angle1)];
            var vert2 = [this.x, this.y];
            this.vertices = this.vertices.concat(vert1);
            this.vertices = this.vertices.concat(vert2);
        }
        this.vertexBuffer = this.gl.createBuffer()

    }
    printVertices() {
        console.log("The circle vertices are ");
        console.log(this.vertices.length);
        for (var i = 0; i < this.vertices.length; i++) {
            console.log("The vertices are " + this.vertices[i]);
        }
    }
    updateCoordinates() {
        this.vertices = [];
        for (var i = 0; i <= 360; i = i + 2) {
            var angle1 = i * Math.PI / 180;
            var vert1 = [this.x + (this.radius + this.size) * Math.cos(angle1), this.y + 2 * (this.radius + this.size) * Math.sin(angle1)];
            var vert2 = [this.x, this.y];
            this.vertices = this.vertices.concat(vert1);
            this.vertices = this.vertices.concat(vert2);
        }
        this.x1 = this.x - (this.radius + this.size);
        this.x2 = this.x;
        this.x3 = this.x + (this.radius + this.size);
        this.x4 = this.x;

        this.y1 = this.y;
        this.y2 = this.y + 2 * (this.radius + this.size);
        this.y3 = this.y;
        this.y4 = this.y - 2 * (this.radius + this.size);
    }

    drawShape() {
        this.updateCoordinates();


        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
        var aPosition = this.gl.getAttribLocation(this.program, 'vertPosition');
        this.gl.enableVertexAttribArray(aPosition);
        this.gl.vertexAttribPointer(aPosition, 2, this.gl.FLOAT, this.gl.FALSE, 0, 0);


        const uPrimitiveColor = this.gl.getUniformLocation(this.program, "uPrimitiveColor");
        this.gl.uniform3fv(uPrimitiveColor, this.colour);
        this.gl.useProgram(this.program);

        mat4.identity(this.modelMatrix);
        mat4.rotate(this.modelMatrix, this.modelMatrix, this.rotationAngle, this.rotationAxis);


        var u_ModelMatrix = this.gl.getUniformLocation(this.program, "u_ModelMatrix");
        this.gl.uniformMatrix4fv(u_ModelMatrix, false, this.modelMatrix);

        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.vertices.length / 2);
    }
}