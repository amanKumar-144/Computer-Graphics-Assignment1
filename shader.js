export default class Shader {
    constructor(gl, vertexShaderSrc, fragmentShaderSrc) {
        this.gl = gl;
        this.vertexShaderSrc = vertexShaderSrc;
        this.fragmentShaderSrc = fragmentShaderSrc;
    }
    link() {
        var program = this.gl.createProgram();
        var vertexShader = this.compile(this.gl.VERTEX_SHADER, this.vertexShaderSrc);
        var fragmentShader = this.compile(this.gl.FRAGMENT_SHADER, this.fragmentShaderSrc);

        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);

        this.gl.linkProgram(program);
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.log("Error in linking the program ::", this.gl.getProgramInfoLog(program));
            return;
        }

        this.gl.validateProgram(program);
        if (!this.gl.getProgramParameter(program, this.gl.VALIDATE_STATUS)) {
            console.log("Error in validating the program ::", this.gl.getProgramInfoLog(program));
            return;
        }
        this.gl.deleteShader(vertexShader);
        this.gl.deleteShader(fragmentShader);

        return program; //The Main Program
    }
    compile(shaderType, shaderSourceText) {
        var shader = this.gl.createShader(shaderType);
        this.gl.shaderSource(shader, shaderSourceText);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.log("Error in compiling the shader ::", this.gl.getShaderInfoLog(shader));
            return;
        }
        return shader;
    }
}