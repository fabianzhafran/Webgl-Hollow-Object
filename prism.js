var prismRotation = 0.0;

main3();

//
// Start here
//
function main3() {
  const canvas3 = document.querySelector('#canvas-surface3');
  const gl3 = canvas3.getContext('webgl') || canvas3.getContext('experimental-webgl');

  // If we don't have a GL context, give up now

  if (!gl3) {
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
  const shaderProgram2 = initShaderProgram(gl3, vsSource, fsSource);

  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVevrtexColor and also
  // look up uniform locations.
  const programInfo = {
	program: shaderProgram2,
	attribLocations: {
	  vertexPosition: gl3.getAttribLocation(shaderProgram2, 'aVertexPosition'),
	  vertexColor: gl3.getAttribLocation(shaderProgram2, 'aVertexColor'),
	},
	uniformLocations: {
	  projectionMatrix: gl3.getUniformLocation(shaderProgram2, 'uProjectionMatrix'),
	  modelViewMatrix: gl3.getUniformLocation(shaderProgram2, 'uModelViewMatrix'),
	}
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  const buffers = initBuffers2(gl3);

  var then = 0;

  // Draw the scene repeatedly
  function render(now) {
	now *= 0.001;  // convert to seconds
	const deltaTime = now - then;
	then = now;

	drawScene2(gl3, programInfo, buffers, deltaTime);

	requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

//
// initBuffers2
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple three-dimensional prism.
//
function initBuffers2(gl3) {

  // Create a buffer for the prism's vertex positions.

  const positionBuffer = gl3.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl3.bindBuffer(gl3.ARRAY_BUFFER, positionBuffer);

  // Now create an array of positions for the prism.

  
  var positions = [
	  -1, -1, 1,
	  -1, -1, 0.75,
	   1, -1, 0.75,
	   1, -1, 1,

	  -1, 1, 1,
	   1, 1, 1,
	   1, 1, 0.75,
	  -1, 1, 0.75,

	   1, -1, 1,
	   1, -1, 0.75,
	   1,  1, 0.75,
	   1,  1, 1,

	  -1,-1,1,
	  -1,1,1,
	  -1,1,0.75,
	  -1,-1,0.75,


	-1,-1,1,  1,-1,1,  1,1,1,  -1,1,1,        // depan
	-1,-1,0.75,  -1,1,0.75,  1,1,0.75,  1,-1,0.75,
	
	1,-1,1,  1.25,-1, 1,  0.25,-1,-1,  0,-1,-1,         // bawah
	1,1,1,  1.25,1, 1,  0.25,1,-1,  0,1,-1,            // atas
	 1.25,1, 1,   1.25,-1, 1,  0.25,-1,-1,  0.25,1,-1, // kanan
	1,1, 1,   1,-1, 1,  0,-1,-1,  0,1,-1,              // kiri
	1,1,1,  1,-1,1,  1.25,-1,1,  1.25,1,1,             // depan
	0,1,-1,  0,-1,-1,  0.25,-1,-1,  0.25,1,-1,
	
	-1.25,-1,1,  -1,-1, 1,  0,-1,-1,  -0.25,-1,-1,         // bawah
	-1.25,1,1,  -1,1, 1,  0,1,-1,  -0.25,1,-1,            // atas
	-1,1, 1,   -1,-1, 1,  0,-1,-1,  0,1,-1,            // kanan
	-1.25,1, 1,   -1.25,-1, 1,  -0.25,-1,-1,  -0.25,1,-1,           // kiri
	-1,1,1,  -1,-1,1,  -1.25,-1,1,  -1.25,1,1,             // depan
	-0.25,1,-1,  -0.25,-1,-1,  0,-1,-1,  0,1,-1];        // belakang  

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  gl3.bufferData(gl3.ARRAY_BUFFER, new Float32Array(positions), gl3.STATIC_DRAW);

  // Now set up the colors for the faces. We'll use solid colors
  // for each face.

  const faceColors = [
	[1.0,  0.0,  0.0,  1.0],    // Back-left face: red
	[1.0,  0.0,  0.0,  1.0],    // Back-left face: red
	[1.0,  0.0,  0.0,  1.0],    // Back-left face: red
	[1.0,  0.0,  0.0,  1.0],    // Back-left face: red
	[1.0,  0.0,  0.0,  1.0],    // Back-top face: red
	[1.0,  0.0,  0.0,  1.0],    // Back-left face: red

	[0.0,  1.0,  0.0,  1.0],    // Top face: green
	[0.0,  1.0,  0.0,  1.0],    // Top face: green
	[0.0,  1.0,  0.0,  1.0],    // Top face: green
	[0.0,  1.0,  0.0,  1.0],    // Top face: green
	[0.0,  1.0,  0.0,  1.0],    // Top face: green
	[0.0,  1.0,  0.0,  1.0],    // Top face: green

	[1.0,  1.0,  0.0,  1.0],    // Right face: yellow
	[1.0,  1.0,  0.0,  1.0],    // Right face: yellow
	[1.0,  1.0,  0.0,  1.0],    // Right face: yellow
	[1.0,  1.0,  0.0,  1.0],    // Right face: yellow
	[1.0,  1.0,  0.0,  1.0],    // Right face: yellow
	[1.0,  1.0,  0.0,  1.0],    // Right face: yellow
  ];

  // Convert the array of colors into a table for all the vertices.

  var colors = [];

  for (var j = 0; j < faceColors.length; ++j) {
	const c = faceColors[j];

	// Repeat each color four times for the four vertices of the face
	colors = colors.concat(c, c, c, c);
  }

  const colorBuffer = gl3.createBuffer();
  gl3.bindBuffer(gl3.ARRAY_BUFFER, colorBuffer);
  gl3.bufferData(gl3.ARRAY_BUFFER, new Float32Array(colors), gl3.STATIC_DRAW);

  // Build the element array buffer; this specifies the indices
  // into the vertex arrays for each face's vertices.

  const indexBuffer = gl3.createBuffer();
  gl3.bindBuffer(gl3.ELEMENT_ARRAY_BUFFER, indexBuffer);

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

  gl3.bufferData(gl3.ELEMENT_ARRAY_BUFFER,
	  new Uint16Array(indices), gl3.STATIC_DRAW);

  return {
	position: positionBuffer,
	color: colorBuffer,
	indices: indexBuffer,
  };
}

//
// Draw the scene.
//
function drawScene2(gl3, programInfo, buffers, deltaTime) {
  let temp = [191.25, 216.75, 204]
  gl3.clearColor(temp[0]/256, temp[1]/256, temp[2]/256, 1.0);  // Clear to black, fully opaque
  gl3.clearDepth(1.0);                 // Clear everything
  gl3.enable(gl3.DEPTH_TEST);           // Enable depth testing
  gl3.depthFunc(gl3.LEQUAL);            // Near things obscure far things

  // Clear the canvas3 before we start drawing on it.

  gl3.clear(gl3.COLOR_BUFFER_BIT | gl3.DEPTH_BUFFER_BIT)

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas3
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl3.canvas.clientWidth / gl3.canvas.clientHeight
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
	const type = gl3.FLOAT;
	const normalize = false;
	const stride = 0;
	const offset = 0;
	gl3.bindBuffer(gl3.ARRAY_BUFFER, buffers.position);
	gl3.vertexAttribPointer(
		programInfo.attribLocations.vertexPosition,
		numComponents,
		type,
		normalize,
		stride,
		offset);
	gl3.enableVertexAttribArray(
		programInfo.attribLocations.vertexPosition);
  }

  // Tell WebGL how to pull out the colors from the color buffer
  // into the vertexColor attribute.
  {
	const numComponents = 4;
	const type = gl3.FLOAT;
	const normalize = false;
	const stride = 0;
	const offset = 0;
	gl3.bindBuffer(gl3.ARRAY_BUFFER, buffers.color);
	gl3.vertexAttribPointer(
		programInfo.attribLocations.vertexColor,
		numComponents,
		type,
		normalize,
		stride,
		offset);
	gl3.enableVertexAttribArray(
		programInfo.attribLocations.vertexColor);
  }

  // Tell WebGL which indices to use to index the vertices
  gl3.bindBuffer(gl3.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // Tell WebGL to use our program when drawing

  gl3.useProgram(programInfo.program);

  // Set the shader uniforms

  gl3.uniformMatrix4fv(
	  programInfo.uniformLocations.projectionMatrix,
	  false,
	  projectionMatrix);
  gl3.uniformMatrix4fv(
	  programInfo.uniformLocations.modelViewMatrix,
	  false,
	  modelViewMatrix);

  {
	const vertexCount = (72 * 3) / 2;
	const type = gl3.UNSIGNED_SHORT;
	const offset = 0;
	gl3.drawElements(gl3.TRIANGLES, vertexCount, type, offset);
  }

  // Update the rotation for the next draw

  prismRotation += deltaTime;
}