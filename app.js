var vertexShaderText = 
    `attribute vec3 ppos;
    uniform mat4 mvp;
    void main(void) {
        gl_Position = mvp * vec4(ppos.x, ppos.y, ppos.z, 1.0);
        gl_PointSize = 2.0;
    }`

var fragmentShaderText = 
    `void main(void) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }`

var canvas = document.getElementById('canvas-surface')
var gl = canvas.getContext('webgl')
var program
var aspectRatio
var vertices
var objectType
var running = true

var load = function() {
    if (!gl) {
        console.log('webgl not supported')
        gl = canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('Your browser does not support WebGL');
	}
}

var main = function (object) {
    // Create Shaders
    var fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderText)
    var vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderText)

    // Create program
    createProgram(vertexShader, fragmentShader)

    if (object == "torus") {
        setTorus()
    } else if (object == "cube") {
        setCube()
    }

    // The function draw() will be called every 40 ms
    setInterval("drawObject(gl.TRIANGLE_STRIP)", 40);  
}

var createShader = function(type, source) {
    var shader = gl.createShader(type)

    gl.shaderSource(shader, source)

    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Error compiling shader!', gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return
    }

    return shader
}

var createProgram = function(vertexShader, fragmentShader) {
    program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Error linking program!', gl.getProgramInfoLog(program))
        gl.deleteProgram(program)
        return
    }
    gl.validateProgram(program)
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('Error validating program!', gl.getProgramInfoLog(program))
        gl.deleteProgram(program)
        return
    }
    gl.useProgram(program)
}

var drawObject = function (method) {
	var positionAttribLocation = gl.getAttribLocation(program, 'ppos');
    // var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

	gl.enableVertexAttribArray(positionAttribLocation)
	// gl.enableVertexAttribArray(colorAttribLocation)

    var vertexBufferObject = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject)
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		0, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	)
    // gl.vertexAttribPointer(
	// 	colorAttribLocation, // Attribute location
	// 	3, // Number of elements per attribute
	// 	gl.FLOAT, // Type of elements
	// 	gl.FALSE,
	// 	5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
	// 	2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	// )
    
    // Determination of the aspect ratio
    aspectRatio = canvas.width / canvas.height

    // Tests if canvas should be refreshed
    if (!running || !gl)
        return
        
    // Gets control value angles from HTML page via DOM
    var projectionType = document.getElementById('projection').value
    var projectionDegree = parseInt(document.getElementById('projection-degree').value)

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
    az *= 2*Math.PI/360; 

    // Gets ox, oy, oz, s, d from the HTML form
    var ox = parseFloat(document.getElementById('ox').value)
    var oy = parseFloat(document.getElementById('oy').value)
    var oz = parseFloat(document.getElementById('oz').value)
    var s = parseFloat(document.getElementById('s').value) //scaling
    var d = parseFloat(document.getElementById('d').value) //distance to camera
    var f = parseFloat(document.getElementById('f').value) //far
    var n = parseFloat(document.getElementById('n').value) //near
    var exz = document.getElementById('exz').checked;

    // Gets reference on the "uniform" 4x4 matrix transforming coordinates
    var amvp = gl.getUniformLocation(program, "mvp");

    // Creates matrix using rotation angles
    var mat = getTransformationMatrix(ox, oy, oz, ax, ay, az, s, d, f, n, aspectRatio, exz, projectionType, projectionDegree);
    // console.log(mat.length)
    // mat = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
    
    // Sets the model-view-projections matrix in the shader
    gl.uniformMatrix4fv(amvp, false, mat)

	// Main render loop
	// gl.useProgram(program)
    // console.log(objectType)
    
    let indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    let indices = generate_indices(vertices.length / 12)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices)

    if (objectType === "torus") {
        // console.log(vertices)
        gl.drawArrays(method, 0, vertices.length/3)
        gl.flush()
    } else if (objectType === "cube") {
        // console.log(vertices)
        // let indexBuffer = gl.createBuffer()
        // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
        // let indices = generate_indices(vertices.length / 12)
        // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
        // const vertexCount = 48 * 6
        // const type = gl.UNSIGNED_SHORT
        // const offset = 0
        // gl.drawElements(gl.TRIANGLES, vertexCount, type, offset)
        // gl.flush()
        
        gl.drawArrays(method, 0, vertices.length)
        gl.flush()
    }
}

const hexToRgb = hex =>
  hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
             ,(m, r, g, b) => '#' + r + r + g + g + b + b)
    .substring(1).match(/.{2}/g)
    .map(x => parseInt(x, 16))

var getColor = function() {
    var hex = document.getElementById("color_picker").value
    rgb = hexToRgb(hex)
    // console.log("color " + rgb[0])

    if (selectedObject != null) {
        for (var i=2; i<selectedObject.vert.length; i+=5) {
            selectedObject.vert[i] = rgb[0]/255
            selectedObject.vert[i+1] = rgb[1]/255
            selectedObject.vert[i+2] = rgb[2]/255
        }
    }
    renderAll()
}

var exportFile = function() {
    var filename = document.getElementById("export_file").value

    if (!filename) {
        filename = 'data'
    }

    var data = JSON.stringify(arrObjects);
    download(filename + ".json", data);

    console.log("The file was saved!"); 
}

var importFile = function() {
    var file = document.getElementById("import_file").files[0]
    var reader = new FileReader();
    // var data = [];
    reader.onload = function(e){
        console.log('file imported')
        arrObjects = JSON.parse(e.target.result);
        // console.log(data)
        // arrObjects = data
        renderAll()
    }
    
    reader.readAsText(file);
    if (!file) {
        alert('Blank file')
    }
}

var download = function(filename, text) {
    var element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    element.setAttribute('download', filename)

    element.style.display = 'none'
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)
}

var help = document.getElementById("help");
var btn = document.getElementById("helpBtn");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
    help.style.display = "block";
}

span.onclick = function() {
    help.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == help) {
        help.style.display = "none";
    }
} 