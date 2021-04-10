import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

export default class Square {
    constructor(length, breadth, x, y, gl, program, colour) {

        this.len1 = length;
        this.len2 = breadth;
        this.mode = 0;
        this.origColor = colour;
        this.colour = colour;

        this.modelMatrix = mat4.create();
        mat4.identity(this.modelMatrix);

        this.size = 0;
        this.x = x;
        this.y = y;
        this.rotationAngle = 0;
        this.rotationAxis = vec3.fromValues(0, 0, 1);

        this.x1 = this.x - this.len1;
        this.x2 = this.x + this.len1;
        this.x3 = this.x + this.len1;
        this.x4 = this.x - this.len1;

        this.y1 = this.y + 2 * this.len2;
        this.y2 = this.y + 2 * this.len2;
        this.y3 = this.y - 2 * this.len2;
        this.y4 = this.y - 2 * this.len2;

        this.gl = gl;
        this.program = program;

        this.vertexAttributesData = new Float32Array([
            //x,y,z
            this.x1, this.y1, 0.0, 1.0, 0.0, 0.0,
            this.x2, this.y2, 0.0, 1.0, 0.0, 0.0,
            this.x3, this.y3, 0.0, 1.0, 0.0, 0.0,
            this.x4, this.y4, 0.0, 1.0, 0.0, 0.0
        ]);
        this.indexAttributesData = new Uint16Array([
            0, 3, 2,
            0, 2, 1
        ]);

        this.vertexAttributesBuffer = this.gl.createBuffer();
        this.indexAttributesBuffer = this.gl.createBuffer();

        if (!this.vertexAttributesBuffer) {
            console.log("Buffer could not be allocated");
        }
    }
    updateCoordinates() {
        this.x1 = this.x - this.len1 - this.size;
        this.x2 = this.x + this.len1 + this.size;
        this.x3 = this.x + this.len1 + this.size;
        this.x4 = this.x - this.len1 - this.size;

        this.y1 = this.y + 2 * this.len2 + this.size;
        this.y2 = this.y + 2 * this.len2 + this.size;
        this.y3 = this.y - 2 * this.len2 - this.size;
        this.y4 = this.y - 2 * this.len2 - this.size;
    }
    updateVertexData() {
        this.vertexAttributesData = new Float32Array([
            //x,y,z
            this.x1, this.y1, 0.0, 1.0, 0.0, 0.0,
            this.x2, this.y2, 0.0, 1.0, 0.0, 0.0,
            this.x3, this.y3, 0.0, 1.0, 0.0, 0.0,
            this.x4, this.y4, 0.0, 1.0, 0.0, 0.0
        ]);
    }
    drawShape() {

        this.updateCoordinates();
        this.updateVertexData();


        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexAttributesBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexAttributesData, this.gl.DYNAMIC_DRAW);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexAttributesBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indexAttributesData, this.gl.DYNAMIC_DRAW);


        var positionAttribLocation = this.gl.getAttribLocation(this.program, 'vertPosition');
        this.gl.vertexAttribPointer(positionAttribLocation, 3, this.gl.FLOAT, this.gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
        this.gl.enableVertexAttribArray(positionAttribLocation);


        const uPrimitiveColor = this.gl.getUniformLocation(this.program, "uPrimitiveColor");
        this.gl.uniform3fv(uPrimitiveColor, this.colour);
        this.gl.useProgram(this.program);

        mat4.identity(this.modelMatrix);
        mat4.rotate(this.modelMatrix, this.modelMatrix, this.rotationAngle, this.rotationAxis);


        var u_ModelMatrix = this.gl.getUniformLocation(this.program, "u_ModelMatrix");
        this.gl.uniformMatrix4fv(u_ModelMatrix, false, this.modelMatrix);

        this.gl.drawElements(this.gl.TRIANGLES, this.indexAttributesData.length, this.gl.UNSIGNED_SHORT, 0);
    }
}