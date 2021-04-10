const vertexShaderSrc = `
precision mediump float;
attribute vec3 vertPosition;
varying vec3 vertColor;
uniform mat4 u_ModelMatrix;
void main()
{
    gl_Position=u_ModelMatrix*vec4(vertPosition,1.0);
}
`;
export default vertexShaderSrc;