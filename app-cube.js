
var cubeRotation = 0.0;

main2();

function main2() {
  const canvas2 = document.querySelector('#canvas-surface2');
  const gl2 = canvas2.getContext('webgl') || canvas2.getContext('experimental-webgl');;

  if (!gl2) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Vertex shader program
  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    attribute vec3 aVertexNormal;
    
    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform vec3 uAmbientLight;

    varying highp vec4 vColor;
    varying highp vec3 vLighting;
    
    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;

      highp vec3 ambientLight = uAmbientLight;
      highp vec3 directionalLightColor = vec3(1, 1, 1);
      highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

      highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional);
    }
  `;

  // Fragment shader program
  const fsSource = `
    varying highp vec4 vColor;
    varying highp vec3 vLighting;

    void main(void) {
      gl_FragColor = vColor;
      gl_FragColor.rgb *= vLighting;
    }
  `;

  const shaderProgram = initShaderProgram(gl2, vsSource, fsSource);

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl2.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl2.getAttribLocation(shaderProgram, 'aVertexColor'),
      vertexNormal: gl2.getAttribLocation(shaderProgram, 'aVertexNormal'),
      // vertexAmbient: gl2.getAttribLocation(shaderProgram, 'aVertexAmbient'),
    },
    uniformLocations: {
      projectionMatrix: gl2.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl2.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      normalMatrix: gl2.getUniformLocation(shaderProgram, 'uNormalMatrix'),
      ambientLight: gl2.getUniformLocation(shaderProgram, 'uAmbientLight')
    }
  };
  const buffers = initBuffers(gl2);

  var then = 0;
  function render(now) {
    now *= 0.001;
    const deltaTime = now - then;
    then = now;

    drawScene(gl2, programInfo, buffers, deltaTime);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

function initBuffers(gl2) {
  const positionBuffer = gl2.createBuffer();

  gl2.bindBuffer(gl2.ARRAY_BUFFER, positionBuffer);

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
  ];

  gl2.bufferData(gl2.ARRAY_BUFFER, new Float32Array(positions), gl2.STATIC_DRAW);

  const normalBuffer = gl2.createBuffer();
  gl2.bindBuffer(gl2.ARRAY_BUFFER, normalBuffer);

  const vertexNormals = compute_cube_normal(positions)

  gl2.bufferData(gl2.ARRAY_BUFFER, new Float32Array(vertexNormals),
                gl2.STATIC_DRAW);

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
  var colors = [];
  for (var j = 0; j < faceColors.length; ++j) {
    const c = faceColors[j];
    colors = colors.concat(c, c, c, c);
  }
  console.log(colors)
  const colorBuffer = gl2.createBuffer();
  gl2.bindBuffer(gl2.ARRAY_BUFFER, colorBuffer);
  gl2.bufferData(gl2.ARRAY_BUFFER, new Float32Array(colors), gl2.STATIC_DRAW);

  const indexBuffer = gl2.createBuffer();
  gl2.bindBuffer(gl2.ELEMENT_ARRAY_BUFFER, indexBuffer);
  const indices = generate_indices(positions.length / 12);

  gl2.bufferData(gl2.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices), gl2.STATIC_DRAW);

  return {
    position: positionBuffer,
    color: colorBuffer,
    normal: normalBuffer,
    indices: indexBuffer,
    faceColors: faceColors
  };
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

function drawScene(gl2, programInfo, buffers, deltaTime) {
	let temp = [191.25, 216.75, 204]
	gl2.clearColor(temp[0]/256, temp[1]/256, temp[2]/256, 1.0);
  gl2.clearDepth(1.0);
  gl2.enable(gl2.DEPTH_TEST);
  gl2.depthFunc(gl2.LEQUAL);


  gl2.clear(gl2.COLOR_BUFFER_BIT | gl2.DEPTH_BUFFER_BIT);

  const fieldOfView = 45 * Math.PI / 180;
  const aspect = gl2.canvas.clientWidth / gl2.canvas.clientHeight;
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

	if (!running || !gl)
	  	return

	var ax = parseInt(document.getElementById('ax').innerHTML, 10)
	var ay = parseInt(document.getElementById('ay').innerHTML, 10)
	var az = parseInt(document.getElementById('az').innerHTML, 10)

	ax = (ax + parseInt(document.getElementById('dx').value, 10) + 360) % 360
	ay = (ay + parseInt(document.getElementById('dy').value, 10) + 360) % 360
	az = (az + parseInt(document.getElementById('dz').value, 10) + 360) % 360

	document.getElementById('ax').innerHTML = ax.toString()
	document.getElementById('ay').innerHTML = ay.toString()
	document.getElementById('az').innerHTML = az.toString()

	ax *= 2*Math.PI/360
	ay *= 2*Math.PI/360
	az *= 2*Math.PI/360

	var ox = parseFloat(document.getElementById('ox').value)
	var oy = parseFloat(document.getElementById('oy').value)
	var oz = parseFloat(document.getElementById('oz').value)
	var s = parseFloat(document.getElementById('s').value)
	var d = parseFloat(document.getElementById('d').value)
	var f = parseFloat(document.getElementById('f').value)
	var n = parseFloat(document.getElementById('n').value)
	var exz = document.getElementById('exz').checked;
  let modelViewMatrix = getTransformationMatrix(ox, oy, oz, ax, ay, az, s, d, f, n, aspectRatio, exz, projectionType, projectionDegree);

  let modelViewtemp = list_to_matrix(modelViewMatrix, 4);
  let normalMatrix = [].concat(...matrix_transpose(matrix_invert(modelViewtemp)));

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

  { // color buffer
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

  { // normal buffer
    const numComponents = 3;
    const type = gl2.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl2.bindBuffer(gl2.ARRAY_BUFFER, buffers.normal);
    gl2.vertexAttribPointer(
        programInfo.attribLocations.vertexNormal,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl2.enableVertexAttribArray(
        programInfo.attribLocations.vertexNormal);
  }

  gl2.bindBuffer(gl2.ELEMENT_ARRAY_BUFFER, buffers.indices);

  gl2.useProgram(programInfo.program);

  gl2.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl2.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);
  gl2.uniformMatrix4fv(
      programInfo.uniformLocations.normalMatrix,
      false,
      normalMatrix);
  let ambientOption = document.getElementById('ambient').value;
  let ambientVector = null;
  if (ambientOption === 'ON') {
    // ambientVector = [0.2, 0.2, 0.2];
    ambientVector = [0.3, 0.3, 0.3];
  } else {
    ambientVector = [1.0, 1.0, 1.0];
  }
  gl2.uniform3fv(programInfo.uniformLocations.ambientLight, ambientVector);

  {
    const vertexCount = 48 * 6;
    const type = gl2.UNSIGNED_SHORT;
    const offset = 0;
    gl2.drawElements(gl2.TRIANGLES, vertexCount, type, offset);
  }
  cubeRotation += deltaTime;
}

function initShaderProgram(gl2, vsSource, fsSource) {
  const vertexShader = loadShader(gl2, gl2.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl2, gl2.FRAGMENT_SHADER, fsSource);

  const shaderProgram = gl2.createProgram();
  gl2.attachShader(shaderProgram, vertexShader);
  gl2.attachShader(shaderProgram, fragmentShader);
  gl2.linkProgram(shaderProgram);

  if (!gl2.getProgramParameter(shaderProgram, gl2.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl2.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

function loadShader(gl2, type, source) {
  const shader = gl2.createShader(type);
  gl2.shaderSource(shader, source);
  gl2.compileShader(shader);
  if (!gl2.getShaderParameter(shader, gl2.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl2.getShaderInfoLog(shader));
    gl2.deleteShader(shader);
    return null;
  }

  return shader;
}