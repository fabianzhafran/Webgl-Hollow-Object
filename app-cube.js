var cubeRotation = 0.0;

main2();

//
// Start here
//
function main2() {
  const canvas2 = document.querySelector('#canvas-surface2');
  const gl2 = canvas2.getContext('webgl') || canvas2.getContext('experimental-webgl');

  // If we don't have a GL context, give up now

  if (!gl2) {
	alert('Unable to initialize WebGL. Your browser or machine may not support it.');
	return;
  }

  // Vertex shader program

  const vsSource = `
	attribute vec4 aVertexPosition;
	attribute vec4 aVertexColor;
	uniform mat4 uModelViewMatrix;
	uniform mat4 uProjectionMatrix;
	varying lowp vec4 vColor;
	void main(void) {
	  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
	  vColor = aVertexColor;
	}
  `;

  // Fragment shader program

  const fsSource = `
	varying lowp vec4 vColor;
	void main(void) {
	  gl_FragColor = vColor;
	}
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl2, vsSource, fsSource);

  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVevrtexColor and also
  // look up uniform locations.
  const programInfo = {
	program: shaderProgram,
	attribLocations: {
	  vertexPosition: gl2.getAttribLocation(shaderProgram, 'aVertexPosition'),
	  vertexColor: gl2.getAttribLocation(shaderProgram, 'aVertexColor'),
	},
	uniformLocations: {
	  projectionMatrix: gl2.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
	  modelViewMatrix: gl2.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
	}
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  const buffers = initBuffers(gl2);

  var then = 0;

  // Draw the scene repeatedly
  function render(now) {
	now *= 0.001;  // convert to seconds
	const deltaTime = now - then;
	then = now;

	drawScene(gl2, programInfo, buffers, deltaTime);

	requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple three-dimensional cube.
//
function initBuffers(gl2) {

  // Create a buffer for the cube's vertex positions.

  const positionBuffer = gl2.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl2.bindBuffer(gl2.ARRAY_BUFFER, positionBuffer);

  // Now create an array of positions for the cube.

  const positions = [
	// ~~~~~ FACE LUAR ~~~~~
	// // Front face
	// -1.0, -1.0,  1.0,
	// 1.0, -1.0,  1.0,
	// 1.0,  1.0,  1.0,
	// -1.0,  1.0,  1.0,

	// Front bottom face
	-1.0, -1.0,  1.0,
	 1.0, -1.0,  1.0,
	 1.0, -0.8,  1.0,
	-1.0, -0.8,  1.0,

	// Front right face
	 0.8, -1.0,  1.0,
	 1.0, -1.0,  1.0,
	 1.0,  1.0,  1.0,
	 0.8,  1.0,  1.0,

	// Front top face
	-1.0,  0.8,  1.0,
	 1.0,  0.8,  1.0,
	 1.0,  1.0,  1.0,
	-1.0,  1.0,  1.0,

	// Front left face
	-1.0, -1.0,  1.0,
	-0.8, -1.0,  1.0,
	-0.8,  1.0,  1.0,
	-1.0,  1.0,  1.0,

	// // Back face
	// -1.0, -1.0, -1.0,
	// -1.0,  1.0, -1.0,
	//  1.0,  1.0, -1.0,
	//  1.0, -1.0, -1.0,

	// Back bottom face
	-1.0, -1.0,  -1.0,
	 1.0, -1.0,  -1.0,
	 1.0, -0.8,  -1.0,
	-1.0, -0.8,  -1.0,

	// Back right face
	 0.8, -1.0,  -1.0,
	 1.0, -1.0,  -1.0,
	 1.0,  1.0,  -1.0,
	 0.8,  1.0,  -1.0,

	// Back top face
	-1.0,  0.8,  -1.0,
	 1.0,  0.8,  -1.0,
	 1.0,  1.0,  -1.0,
	-1.0,  1.0,  -1.0,

	// Back left face
	-1.0, -1.0,  -1.0,
	-0.8, -1.0,  -1.0,
	-0.8,  1.0,  -1.0,
	-1.0,  1.0,  -1.0,

	// // Top face
	// -1.0,  1.0,  -1.0,
	// -1.0,  1.0,   1.0,
	//  1.0,  1.0,   1.0,
	//  1.0,  1.0,  -1.0,

	// Top bottom face
	-1.0,  1.0, -1.0,
	 1.0,  1.0, -1.0,
	 1.0,  1.0, -0.8,
	-1.0,  1.0, -0.8,

	// Top right face
	 0.8,  1.0,  -1.0,
	 1.0,  1.0,  -1.0,
	 1.0,  1.0,   1.0,
	 0.8,  1.0,   1.0,

	// Top top face
	-1.0,  1.0,   0.8,
	 1.0,  1.0,   0.8,
	 1.0,  1.0,   1.0,
	-1.0,  1.0,   1.0,

	// Top left face
	-1.0,  1.0,  -1.0,
	-0.8,  1.0,  -1.0,
	-0.8,  1.0,   1.0,
	-1.0,  1.0,   1.0,

	// // Bottom face
	// -1.0, -1.0, -1.0,
	//  1.0, -1.0, -1.0,
	//  1.0, -1.0,  1.0,
	// -1.0, -1.0,  1.0,

	// Bottom bottom face
	-1.0, -1.0, -1.0,
	 1.0, -1.0, -1.0,
	 1.0, -1.0, -0.8,
	-1.0, -1.0, -0.8,

	// Bottom right face
	 0.8, -1.0,  -1.0,
	 1.0, -1.0,  -1.0,
	 1.0, -1.0,   1.0,
	 0.8, -1.0,   1.0,

	// Bottom top face
	-1.0, -1.0,   0.8,
	 1.0, -1.0,   0.8,
	 1.0, -1.0,   1.0,
	-1.0, -1.0,   1.0,

	// Bottom left face
	-1.0, -1.0,  -1.0,
	-0.8, -1.0,  -1.0,
	-0.8, -1.0,   1.0,
	-1.0, -1.0,   1.0,

	// // Right face
	//  1.0, -1.0, -1.0,
	//  1.0,  1.0, -1.0,
	//  1.0,  1.0,  1.0,
	//  1.0, -1.0,  1.0,

	// Right bottom face
	 1.0, -1.0, -1.0,
	 1.0,  1.0, -1.0,
	 1.0,  1.0, -0.8,
	 1.0, -1.0, -0.8,

	// Right right face
	 1.0,  0.8, -1.0,
	 1.0,  1.0, -1.0,
	 1.0,  1.0,  1.0,
	 1.0,  0.8,  1.0,

	// Right top face
	 1.0, -1.0,  0.8,
	 1.0,  1.0,  0.8,
	 1.0,  1.0,  1.0,
	 1.0, -1.0,  1.0,

	// Right left face
	 1.0, -1.0, -1.0,
	 1.0, -0.8, -1.0,
	 1.0, -0.8,  1.0,
	 1.0, -1.0,  1.0,

	// // Left face
	// -1.0, -1.0, -1.0,
	// -1.0, -1.0,  1.0,
	// -1.0,  1.0,  1.0,
	// -1.0,  1.0, -1.0,

	// Left bottom face
	-1.0, -1.0, -1.0,
	-1.0,  1.0, -1.0,
	-1.0,  1.0, -0.8,
	-1.0, -1.0, -0.8,

   // Left right face
	-1.0,  0.8, -1.0,
	-1.0,  1.0, -1.0,
	-1.0,  1.0,  1.0,
	-1.0,  0.8,  1.0,

   // Left top face
	-1.0, -1.0,  0.8,
	-1.0,  1.0,  0.8,
	-1.0,  1.0,  1.0,
	-1.0, -1.0,  1.0,

   // Left left face
	-1.0, -1.0, -1.0,
	-1.0, -0.8, -1.0,
	-1.0, -0.8,  1.0,
	-1.0, -1.0,  1.0,

	// ~~~~~ FACE DALAM ~~~~~

	// // Front face
	// -1.0, -1.0,  1.0,
	// 1.0, -1.0,  1.0,
	// 1.0,  1.0,  1.0,
	// -1.0,  1.0,  1.0,

	// Front bottom face
	-1.0, -1.0,  0.8,
	 1.0, -1.0,  0.8,
	 1.0, -0.8,  0.8,
	-1.0, -0.8,  0.8,

	// Front right face
	 0.8, -1.0,  0.8,
	 1.0, -1.0,  0.8,
	 1.0,  1.0,  0.8,
	 0.8,  1.0,  0.8,

	// Front top face
	-1.0,  0.8,  0.8,
	 1.0,  0.8,  0.8,
	 1.0,  1.0,  0.8,
	-1.0,  1.0,  0.8,

	// Front left face
	-1.0, -1.0,  0.8,
	-0.8, -1.0,  0.8,
	-0.8,  1.0,  0.8,
	-1.0,  1.0,  0.8,

	// // Back face
	// -1.0, -1.0, -1.0,
	// -1.0,  1.0, -1.0,
	//  1.0,  1.0, -1.0,
	//  1.0, -1.0, -1.0,

	// Back bottom face
	-1.0, -1.0,  -0.8,
	 1.0, -1.0,  -0.8,
	 1.0, -0.8,  -0.8,
	-1.0, -0.8,  -0.8,

	// Back right face
	 0.8, -1.0,  -0.8,
	 1.0, -1.0,  -0.8,
	 1.0,  1.0,  -0.8,
	 0.8,  1.0,  -0.8,

	// Back top face
	-1.0,  0.8,  -0.8,
	 1.0,  0.8,  -0.8,
	 1.0,  1.0,  -0.8,
	-1.0,  1.0,  -0.8,

	// Back left face
	-1.0, -1.0,  -0.8,
	-0.8, -1.0,  -0.8,
	-0.8,  1.0,  -0.8,
	-1.0,  1.0,  -0.8,

	// // Top face
	// -1.0,  1.0,  -1.0,
	// -1.0,  1.0,   1.0,
	//  1.0,  1.0,   1.0,
	//  1.0,  1.0,  -1.0,

	// Top bottom face
	-1.0,  0.8, -1.0,
	 1.0,  0.8, -1.0,
	 1.0,  0.8, -0.8,
	-1.0,  0.8, -0.8,

	// Top right face
	 0.8,  0.8,  -1.0,
	 1.0,  0.8,  -1.0,
	 1.0,  0.8,   1.0,
	 0.8,  0.8,   1.0,

	// Top top face
	-1.0,  0.8,   0.8,
	 1.0,  0.8,   0.8,
	 1.0,  0.8,   1.0,
	-1.0,  0.8,   1.0,

	// Top left face
	-1.0,  0.8,  -1.0,
	-0.8,  0.8,  -1.0,
	-0.8,  0.8,   1.0,
	-1.0,  0.8,   1.0,

	// // Bottom face
	// -1.0, -1.0, -1.0,
	//  1.0, -1.0, -1.0,
	//  1.0, -1.0,  1.0,
	// -1.0, -1.0,  1.0,

	// Bottom bottom face
	-1.0, -0.8, -1.0,
	 1.0, -0.8, -1.0,
	 1.0, -0.8, -0.8,
	-1.0, -0.8, -0.8,

	// Bottom right face
	 0.8, -0.8,  -1.0,
	 1.0, -0.8,  -1.0,
	 1.0, -0.8,   1.0,
	 0.8, -0.8,   1.0,

	// // Bottom top face
	-1.0,  -0.8,   0.8,
	 1.0,  -0.8,   0.8,
	 1.0,  -0.8,   1.0,
	-1.0,  -0.8,   1.0,

	// Bottom left face
	-1.0, -0.8,  -1.0,
	-0.8, -0.8,  -1.0,
	-0.8, -0.8,   1.0,
	-1.0, -0.8,   1.0,

	// // Right face
	//  1.0, -1.0, -1.0,
	//  1.0,  1.0, -1.0,
	//  1.0,  1.0,  1.0,
	//  1.0, -1.0,  1.0,

	// Right bottom face
	 0.8, -1.0, -1.0,
	 0.8,  1.0, -1.0,
	 0.8,  1.0, -0.8,
	 0.8, -1.0, -0.8,

	// Right right face
	 0.8,  0.8, -1.0,
	 0.8,  1.0, -1.0,
	 0.8,  1.0,  1.0,
	 0.8,  0.8,  1.0,

	// Right top face
	 0.8, -1.0,  0.8,
	 0.8,  1.0,  0.8,
	 0.8,  1.0,  1.0,
	 0.8, -1.0,  1.0,

	// Right left face
	 0.8, -1.0, -1.0,
	 0.8, -0.8, -1.0,
	 0.8, -0.8,  1.0,
	 0.8, -1.0,  1.0,

	// // Left face
	// -1.0, -1.0, -1.0,
	// -1.0, -1.0,  1.0,
	// -1.0,  1.0,  1.0,
	// -1.0,  1.0, -1.0,

	// Left bottom face
	-0.8, -1.0, -1.0,
	-0.8,  1.0, -1.0,
	-0.8,  1.0, -0.8,
	-0.8, -1.0, -0.8,

   // Left right face
	-0.8,  0.8, -1.0,
	-0.8,  1.0, -1.0,
	-0.8,  1.0,  1.0,
	-0.8,  0.8,  1.0,

   // Left top face
	-0.8, -1.0,  0.8,
	-0.8,  1.0,  0.8,
	-0.8,  1.0,  1.0,
	-0.8, -1.0,  1.0,

   // Left left face
	-0.8, -1.0, -1.0,
	-0.8, -0.8, -1.0,
	-0.8, -0.8,  1.0,
	-0.8, -1.0,  1.0,
  ].map(e => e / 5);

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  gl2.bufferData(gl2.ARRAY_BUFFER, new Float32Array(positions), gl2.STATIC_DRAW);

  // Now set up the colors for the faces. We'll use solid colors
  // for each face.

  const faceColors = [
	// ~~~~ LAYER LUAR ~~~~
	[1.0,  1.0,  1.0,  1.0],    // Front-bottom face: white
	[1.0,  1.0,  1.0,  1.0],    // Front-right face: white
	[1.0,  1.0,  1.0,  1.0],    // Front-top face: white
	[1.0,  1.0,  1.0,  1.0],    // Front-left face: white

	[1.0,  0.0,  0.0,  1.0],    // Back-bottom face: red
	[1.0,  0.0,  0.0,  1.0],    // Back-right face: red
	[1.0,  0.0,  0.0,  1.0],    // Back-top face: red
	[1.0,  0.0,  0.0,  1.0],    // Back-left face: red

	[0.0,  1.0,  0.0,  1.0],    // Top face: green
	[0.0,  1.0,  0.0,  1.0],    // Top face: green
	[0.0,  1.0,  0.0,  1.0],    // Top face: green
	[0.0,  1.0,  0.0,  1.0],    // Top face: green

	[0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
	[0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
	[0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
	[0.0,  0.0,  1.0,  1.0],    // Bottom face: blue

	[1.0,  1.0,  0.0,  1.0],    // Right face: yellow
	[1.0,  1.0,  0.0,  1.0],    // Right face: yellow
	[1.0,  1.0,  0.0,  1.0],    // Right face: yellow
	[1.0,  1.0,  0.0,  1.0],    // Right face: yellow

	[1.0,  0.0,  1.0,  1.0],    // Left face: purple
	[1.0,  0.0,  1.0,  1.0],    // Left face: purple
	[1.0,  0.0,  1.0,  1.0],    // Left face: purple
	[1.0,  0.0,  1.0,  1.0],    // Left face: purple

	// ~~~~ LAYER DALAM ~~~~
	[1.0,  1.0,  1.0,  1.0],    // Front-bottom face: white
	[1.0,  1.0,  1.0,  1.0],    // Front-right face: white
	[1.0,  1.0,  1.0,  1.0],    // Front-top face: white
	[1.0,  1.0,  1.0,  1.0],    // Front-left face: white

	[1.0,  0.0,  0.0,  1.0],    // Back-bottom face: red
	[1.0,  0.0,  0.0,  1.0],    // Back-right face: red
	[1.0,  0.0,  0.0,  1.0],    // Back-top face: red
	[1.0,  0.0,  0.0,  1.0],    // Back-left face: red

	[0.0,  1.0,  0.0,  1.0],    // Top face: green
	[0.0,  1.0,  0.0,  1.0],    // Top face: green
	[0.0,  1.0,  0.0,  1.0],    // Top face: green
	[0.0,  1.0,  0.0,  1.0],    // Top face: green

	[0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
	[0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
	[0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
	[0.0,  0.0,  1.0,  1.0],    // Bottom face: blue

	[1.0,  1.0,  0.0,  1.0],    // Right face: yellow
	[1.0,  1.0,  0.0,  1.0],    // Right face: yellow
	[1.0,  1.0,  0.0,  1.0],    // Right face: yellow
	[1.0,  1.0,  0.0,  1.0],    // Right face: yellow

	[1.0,  0.0,  1.0,  1.0],    // Left face: purple
	[1.0,  0.0,  1.0,  1.0],    // Left face: purple
	[1.0,  0.0,  1.0,  1.0],    // Left face: purple
	[1.0,  0.0,  1.0,  1.0],    // Left face: purple
  ];

  // Convert the array of colors into a table for all the vertices.

  var colors = [];

  for (var j = 0; j < faceColors.length; ++j) {
	const c = faceColors[j];

	// Repeat each color four times for the four vertices of the face
	colors = colors.concat(c, c, c, c);
  }

  const colorBuffer = gl2.createBuffer();
  gl2.bindBuffer(gl2.ARRAY_BUFFER, colorBuffer);
  gl2.bufferData(gl2.ARRAY_BUFFER, new Float32Array(colors), gl2.STATIC_DRAW);

  // Build the element array buffer; this specifies the indices
  // into the vertex arrays for each face's vertices.

  const indexBuffer = gl2.createBuffer();
  gl2.bindBuffer(gl2.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  const indices = generate_indices(positions.length / 12)
  // console.log(indices)

  // const indices = [
  //   0,  1,  2,      0,  2,  3,    // back bottom
  //   4,  5,  6,      4,  6,  7,    // back right
  //   8,  9,  10,     8,  10, 11,   // back top
  //   12, 13, 14,     12, 14, 15,   // back left
  //   16, 17, 18,     16, 18, 19,   // top
  //   20, 21, 22,     20, 22, 23,   // bottom
  //   24, 25, 26,     24, 26, 27,   // right
  //   28, 29, 30,     28, 30, 31,   // left
  // ];

  // Now send the element array to GL

  gl2.bufferData(gl2.ELEMENT_ARRAY_BUFFER,
	  new Uint16Array(indices), gl2.STATIC_DRAW);

  return {
	position: positionBuffer,
	color: colorBuffer,
	indices: indexBuffer,
  };
}

//
// Draw the scene.
//
function drawScene(gl2, programInfo, buffers, deltaTime) {
  let temp = [191.25, 216.75, 204]
  gl2.clearColor(temp[0]/256, temp[1]/256, temp[2]/256, 1.0);  // Clear to black, fully opaque
  gl2.clearDepth(1.0);                 // Clear everything
  gl2.enable(gl2.DEPTH_TEST);           // Enable depth testing
  gl2.depthFunc(gl2.LEQUAL);            // Near things obscure far things

  // Clear the canvas2 before we start drawing on it.

  gl2.clear(gl2.COLOR_BUFFER_BIT | gl2.DEPTH_BUFFER_BIT)

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas2
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl2.canvas.clientWidth / gl2.canvas.clientHeight
  const zNear = 0.1;
  const zFar = 100.0;

  var projectionType = document.getElementById('projection').value
  var projectionDegree = parseInt(document.getElementById('projection-degree').value)

  let projectionMatrix = null
  if (projectionType === 'perspective') {
	  projectionMatrix = ComputeFOVProjection(fieldOfView, aspect, zNear, zFar, false)
  } else {
	  projectionMatrix = [1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  0, 0, 0, 1]
  }

	// Gets control value angles from HTML page via DOM
	var ax = parseInt(document.getElementById('ax').innerHTML, 10)
	var ay = parseInt(document.getElementById('ay').innerHTML, 10)
	var az = parseInt(document.getElementById('az').innerHTML, 10)

	// Use increments via DOM to update angles (still in degrees)
	ax = (ax + parseInt(document.getElementById('dx').value, 10) + 360) % 360
	ay = (ay + parseInt(document.getElementById('dy').value, 10) + 360) % 360
	az = (az + parseInt(document.getElementById('dz').value, 10) + 360) % 360

	// Update HTML page with new values
	document.getElementById('ax').innerHTML = ax.toString()
	document.getElementById('ay').innerHTML = ay.toString()
	document.getElementById('az').innerHTML = az.toString()

	// Convert values to radians
	ax *= 2*Math.PI/360
	ay *= 2*Math.PI/360
	az *= 2*Math.PI/360

	// Gets ox, oy, oz, s, d from the HTML form
	var ox = parseFloat(document.getElementById('ox').value)
	var oy = parseFloat(document.getElementById('oy').value)
	var oz = parseFloat(document.getElementById('oz').value)
	var s = parseFloat(document.getElementById('s').value) //scaling
	var d = parseFloat(document.getElementById('d').value) //distance to camera
	var f = parseFloat(document.getElementById('f').value) //far
	var n = parseFloat(document.getElementById('n').value) //near
	var exz = document.getElementById('exz').checked;
  const modelViewMatrix = getTransformationMatrix(ox, oy, oz, ax, ay, az, s, d, f, n, aspectRatio, exz, projectionType, projectionDegree);

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute
  {
	const numComponents = 3;
	const type = gl2.FLOAT;
	const normalize = false;
	const stride = 0;
	const offset = 0;
	gl2.bindBuffer(gl2.ARRAY_BUFFER, buffers.position);
	gl2.vertexAttribPointer(
		programInfo.attribLocations.vertexPosition,
		numComponents,
		type,
		normalize,
		stride,
		offset);
	gl2.enableVertexAttribArray(
		programInfo.attribLocations.vertexPosition);
  }

  // Tell WebGL how to pull out the colors from the color buffer
  // into the vertexColor attribute.
  {
	const numComponents = 4;
	const type = gl2.FLOAT;
	const normalize = false;
	const stride = 0;
	const offset = 0;
	gl2.bindBuffer(gl2.ARRAY_BUFFER, buffers.color);
	gl2.vertexAttribPointer(
		programInfo.attribLocations.vertexColor,
		numComponents,
		type,
		normalize,
		stride,
		offset);
	gl2.enableVertexAttribArray(
		programInfo.attribLocations.vertexColor);
  }

  // Tell WebGL which indices to use to index the vertices
  gl2.bindBuffer(gl2.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // Tell WebGL to use our program when drawing

  gl2.useProgram(programInfo.program);

  // Set the shader uniforms

  gl2.uniformMatrix4fv(
	  programInfo.uniformLocations.projectionMatrix,
	  false,
	  projectionMatrix);
  gl2.uniformMatrix4fv(
	  programInfo.uniformLocations.modelViewMatrix,
	  false,
	  modelViewMatrix);

  {
	const vertexCount = 48 * 6;
	const type = gl2.UNSIGNED_SHORT;
	const offset = 0;
	gl2.drawElements(gl2.TRIANGLES, vertexCount, type, offset);
  }

  // Update the rotation for the next draw

  cubeRotation += deltaTime;
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl2, vsSource, fsSource) {
  const vertexShader = loadShader(gl2, gl2.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl2, gl2.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl2.createProgram();
  gl2.attachShader(shaderProgram, vertexShader);
  gl2.attachShader(shaderProgram, fragmentShader);
  gl2.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl2.getProgramParameter(shaderProgram, gl2.LINK_STATUS)) {
	alert('Unable to initialize the shader program: ' + gl2.getProgramInfoLog(shaderProgram));
	return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl2, type, source) {
  const shader = gl2.createShader(type);

  // Send the source to the shader object

  gl2.shaderSource(shader, source);

  // Compile the shader program

  gl2.compileShader(shader);

  // See if it compiled successfully

  if (!gl2.getShaderParameter(shader, gl2.COMPILE_STATUS)) {
	alert('An error occurred compiling the shaders: ' + gl2.getShaderInfoLog(shader));
	gl2.deleteShader(shader);
	return null;
  }

  return shader;
}