//
// Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;

// we keep all local parameters for the program in a single object
var ctx = {
    shaderProgram: -1,
    aVertexPositionId: -1,
    aColorId: -1,
    aTextureId: -1
};

var cubeColor = 0;

var cubeTexture = 0;

var cubeWire = 0;

var sphere = 0;

var i = 0;


/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    console.log("Startup started")
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    draw();
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');
    setUpAttributesAndUniforms();
    setUpBuffers();
    gl.clearColor(1,0,0,0.5);
    gl.enable(gl.DEPTH_TEST);
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.aColorId = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");
    ctx.aTextureId = gl.getAttribLocation(ctx.shaderProgram, "aVertexTextureCoord");
    ctx.aNormalId = gl.getAttribLocation(ctx.shaderProgram, "aVertexNormal");
    ctx.uSampler = gl.getUniformLocation(ctx.shaderProgram, "uSampler");
    ctx.uModelViewMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uModelViewMatrix");
    ctx.uProjectionMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMatrix");
    ctx.uNormalMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uNormalMatrix");
}

/**
 * Setup the buffers to use. If morre objects are needed this should be split in a file per object.
 */
function setUpBuffers(){
    sphere = SolidSphere(gl, 3, 3);
    cubeColor = coloredCube(gl, -1.5, -1, 0);
    //cubeTexture = texturedCube(gl, 0.5, -1, 0);
    cubeWire = wireCube(gl, -0.5, 0.5, 0);
  // sphere = SolidSphere(gl, 3, 3);

}

function matrixStuff(X, Y, Z){

    var modelview = mat4.create();
    mat4.lookAt(modelview, [0, 0, -2], [0, 0, 0], [0, 1, 0]); //von woher wird geschaut?
    //                     Kamera-Ort   Zentrum   Wo ist oben?

    var projectionview = mat4.create();
    mat4.ortho(projectionview, -2, 2, -2, 2, -10, 10);

    mat4.translate(modelview, modelview, [X, Y, Z]);

    mat4.rotate(modelview, modelview, i, [1, 1, 1]);

    var normalMatrix = mat4.create();

    mat4.invert(normalMatrix, modelview);
    //mat4.transpose(normalMatrix);

    gl.uniformMatrix4fv(ctx.uModelViewMatrixId, false, modelview);
    gl.uniformMatrix4fv(ctx.uProjectionMatrixId, false, projectionview);
    //gl.uniformMatrix4fv(ctx.uNormalMatrixId, false, new WebGLFLoatArray(normalMatrix.flatten()));
}

/**
 * Draw the scene.
 */
function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    cubeWire.draw(gl, ctx.aVertexPositionId);
    cubeColor.draw(gl, ctx.aVertexPositionId, ctx.aColorId);
    cubeTexture.draw(gl, ctx.aVertexPositionId, ctx.aColorId, ctx.aTextureId);
    window.requestAnimationFrame(draw)
    i += 0.05;
}
