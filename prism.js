var prismRotation = 0.0;

var verticesPrism = [
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

	-1, -1, 1,
	-1,  1, 1,
	-1,  1, 0.75,
	-1, -1, 0.75,

  	-1, -1, 1,
	 1, -1, 1,
	 1,  1, 1,
	-1,  1, 1,

	-1, -1, 0.75,
	-1,  1,	0.75,
	 1,  1, 0.75,
   1, -1, 0.75,
  
   1,    -1,  1,  
   1.25, -1,  1,  
   0.25, -1, -1,  
   0,    -1, -1,         // bawah
  
1,1,1,  
1.25,1, 1, 
0.25,1,-1,  
0,1,-1,            // atas
   
1.25,1, 1,   1.25,-1, 1,  0.25,-1,-1,  0.25,1,-1, // kanan
  1,1, 1,   1,-1, 1,  0,-1,-1,  0,1,-1,              // kiri
  1,1,1,  1,-1,1,  1.25,-1,1,  1.25,1,1,             // depan
  0,1,-1,  0,-1,-1,  0.25,-1,-1,  0.25,1,-1,
  
  -1.25,-1,1,  -1,-1, 1,  0,-1,-1,  -0.25,-1,-1,         // bawah
  -1.25,1,1,  -1,1, 1,  0,1,-1,  -0.25,1,-1,            // atas
  -1,1, 1,   -1,-1, 1,  0,-1,-1,  0,1,-1,            // kanan
  -1.25,1, 1,   -1.25,-1, 1,  -0.25,-1,-1,  -0.25,1,-1,           // kiri
  -1,1,1,  -1,-1,1,  -1.25,-1,1,  -1.25,1,1,             // depan
  -0.25,1,-1,  -0.25,-1,-1,  0,-1,-1,  0,1,-1
];
var colorsPrism =  [

[1.0,  1.0,  1.0,  1.0],    // Right face: yellow
[1.0,  1.0,  1.0,  1.0],    // Right face: yellow
[1.0,  1.0,  1.0,  1.0],    // Right face: yellow
[1.0,  1.0,  1.0,  1.0],    // Right face: yellow
[1.0,  1.0,  1.0,  1.0],    // Right face: yellow
[1.0,  1.0,  1.0,  1.0],    // Right face: yellow

[1.0,  1.0,  1.0,  1.0],    // Right face: yellow
[1.0,  1.0,  1.0,  1.0],    // Right face: yellow
[1.0,  1.0,  1.0,  1.0],    // Right face: yellow
[1.0,  1.0,  1.0,  1.0],    // Right face: yellow
[1.0,  1.0,  1.0,  1.0],    // Right face: yellow
[1.0,  1.0,  1.0,  1.0],    // Right face: yellow

[1.0,  1.0,  1.0,  1.0],    // Right face: yellow
[1.0,  1.0,  1.0,  1.0],    // Right face: yellow
[1.0,  1.0,  1.0,  1.0],    // Right face: yellow
[1.0,  1.0,  1.0,  1.0],    // Right face: yellow
[1.0,  1.0,  1.0,  1.0],    // Right face: yellow
[1.0,  1.0,  1.0,  1.0],    // Right face: yellow
];

main3();

function main3() {
  const canvas3 = document.querySelector('#canvas-surface3');
  const gl3 = canvas3.getContext('webgl') || canvas3.getContext('experimental-webgl');;

  if (!gl3) {
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

  const shaderProgram = initShaderProgram(gl3, vsSource, fsSource);

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl3.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl3.getAttribLocation(shaderProgram, 'aVertexColor'),
      vertexNormal: gl3.getAttribLocation(shaderProgram, 'aVertexNormal'),
      // vertexAmbient: gl3.getAttribLocation(shaderProgram, 'aVertexAmbient'),
    },
    uniformLocations: {
      projectionMatrix: gl3.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl3.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      normalMatrix: gl3.getUniformLocation(shaderProgram, 'uNormalMatrix'),
      ambientLight: gl3.getUniformLocation(shaderProgram, 'uAmbientLight')
    }
  };
  const buffers = initBuffers3(gl3);

  var then = 0;
  // drawScene3(gl3, programInfo, buffers, deltaTime);
  function render(now) {
    if (running) {
      now *= 0.001;
      const deltaTime = now - then;
      then = now;
  
      drawScene3(gl3, programInfo, buffers, deltaTime);
    }

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

function initBuffers3(gl3) {
  const positionBuffer = gl3.createBuffer();

  gl3.bindBuffer(gl3.ARRAY_BUFFER, positionBuffer);

  const positions = verticesPrism;

  gl3.bufferData(gl3.ARRAY_BUFFER, new Float32Array(positions), gl3.STATIC_DRAW);

  const normalBuffer = gl3.createBuffer();
  gl3.bindBuffer(gl3.ARRAY_BUFFER, normalBuffer);

  const vertexNormals = compute_cube_normal(positions)
  // console.log(positions)
  // console.log(vertexNormals)

  gl3.bufferData(gl3.ARRAY_BUFFER, new Float32Array(vertexNormals),
                gl3.STATIC_DRAW);

  const faceColors = colorsPrism;

  var colors = [];
  for (var j = 0; j < faceColors.length; ++j) {
    const c = faceColors[j];
    colors = colors.concat(c, c, c, c);
  }
  console.log(colors)
  const colorBuffer = gl3.createBuffer();
  gl3.bindBuffer(gl3.ARRAY_BUFFER, colorBuffer);
  gl3.bufferData(gl3.ARRAY_BUFFER, new Float32Array(colors), gl3.STATIC_DRAW);

  const indexBuffer = gl3.createBuffer();
  gl3.bindBuffer(gl3.ELEMENT_ARRAY_BUFFER, indexBuffer);
  const indices = generate_indices(positions.length / 12);

  gl3.bufferData(gl3.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices), gl3.STATIC_DRAW);

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

function drawScene3(gl3, programInfo, buffers, deltaTime) {
	let temp = [191.25, 216.75, 204]
	gl3.clearColor(temp[0]/256, temp[1]/256, temp[2]/256, 1.0);
  gl3.clearDepth(1.0);
  gl3.enable(gl3.DEPTH_TEST);
  gl3.depthFunc(gl3.LEQUAL);


  gl3.clear(gl3.COLOR_BUFFER_BIT | gl3.DEPTH_BUFFER_BIT);

  const fieldOfView = 45 * Math.PI / 180;
  const aspect = gl3.canvas.clientWidth / gl3.canvas.clientHeight;
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

  { // color buffer
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

  { // normal buffer
    const numComponents = 3;
    const type = gl3.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl3.bindBuffer(gl3.ARRAY_BUFFER, buffers.normal);
    gl3.vertexAttribPointer(
        programInfo.attribLocations.vertexNormal,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl3.enableVertexAttribArray(
        programInfo.attribLocations.vertexNormal);
  }

  gl3.bindBuffer(gl3.ELEMENT_ARRAY_BUFFER, buffers.indices);

  gl3.useProgram(programInfo.program);

  gl3.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl3.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);
  gl3.uniformMatrix4fv(
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
  gl3.uniform3fv(programInfo.uniformLocations.ambientLight, ambientVector);

  {
    const vertexCount = (72 * 3) / 2;
    const type = gl3.UNSIGNED_SHORT;
    const offset = 0;
    gl3.drawElements(gl3.TRIANGLES, vertexCount, type, offset);
  }
  prismRotation += deltaTime;
}