var vertexShaderText = `
    attribute vec3 ppos;
    attribute vec3 anormal;
    attribute vec4 pcolor;

    uniform mat4 mvp;
    uniform vec3 ambient;
    uniform mat4 normalMatrix;

    varying highp vec3 lighting;
    varying mediump vec4 forward_color;

    void main(void) {
        gl_Position = mvp * vec4(ppos.x, ppos.y, ppos.z, 1.0);
        
        highp vec3 ambientLight = ambient;
        highp vec3 directionalLightColor = vec3(1, 1, 1);
        highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
        highp vec4 transformedNormal = normalMatrix * vec4(anormal, 1.0);
        
        highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
        lighting = ambient + (directionalLightColor * directional);

        gl_PointSize = 2.0;
        forward_color = pcolor;
    }`

var fragmentShaderText = `
    varying highp vec3 lighting;
    varying mediump vec4 forward_color;

    void main(void) {
        gl_FragColor = forward_color;
        gl_FragColor.rgb *= lighting;
    }`

var canvas = document.getElementById('canvas-surface')
var gl = canvas.getContext('webgl')
var program
var aspectRatio
var verticesTorus
var colorsTorus
var torusNormals
var objectType
var running = false

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
    }

    setInterval("drawObject(gl.TRIANGLE_STRIP)", 40)
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
	var positionAttribLocation = gl.getAttribLocation(program, 'ppos')
    var normalAttribLocation = gl.getAttribLocation(program, 'anormal')
    var colorAttribLocation = gl.getAttribLocation(program, 'pcolor');

	gl.enableVertexAttribArray(positionAttribLocation)
	gl.enableVertexAttribArray(normalAttribLocation)
	gl.enableVertexAttribArray(colorAttribLocation)

    var vertexBufferObject = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject)
	gl.bufferData(gl.ARRAY_BUFFER, verticesTorus, gl.STATIC_DRAW)
    gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		0, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	)

    // Connects colorsTorus array to vertex shader via the 'pcolor' attribute
    var cbuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, cbuffer)
    gl.bufferData(gl.ARRAY_BUFFER, colorsTorus, gl.STATIC_DRAW)
    gl.vertexAttribPointer(
        colorAttribLocation, 
        4, 
        gl.FLOAT, 
        gl.FALSE, 
        0, 
        0
    )

    // var torusNormals = compute_torus_normal(verticesTorus)
    var normalBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, torusNormals, gl.STATIC_DRAW)
    gl.vertexAttribPointer(
		normalAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
        0,
        0
	)
    
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
    az *= 2*Math.PI/360

    // Gets ox, oy, oz, s, d from the HTML form
    var ox = parseFloat(document.getElementById('ox').value)
    var oy = parseFloat(document.getElementById('oy').value)
    var oz = parseFloat(document.getElementById('oz').value)
    var s = parseFloat(document.getElementById('s').value) //scaling
    var d = parseFloat(document.getElementById('d').value) //distance to camera
    var f = parseFloat(document.getElementById('f').value) //far
    var n = parseFloat(document.getElementById('n').value) //near
    var exz = document.getElementById('exz').checked

    // Creates matrix using rotation angles
    let trans_matrix = getTransformationMatrix(ox, oy, oz, ax, ay, az, s, d, f, n, aspectRatio, exz, projectionType, projectionDegree);
    let norm_matrix = [].concat(...matrix_transpose(matrix_invert(list_to_matrix(trans_matrix, 4))))

    let ambient_vec
    var ambientOption = document.getElementById('ambient').value
    if (ambientOption === 'ON') {
        ambient_vec = [0.3, 0.3, 0.3]
    } else {
        ambient_vec = [1.0, 1.0, 1.0]
    }

    // Gets reference on the "uniform" 4x4 matrix transforming coordinates
    var amvp = gl.getUniformLocation(program, "mvp");
    var anormalMat = gl.getUniformLocation(program, "normalMatrix");
    var aambient = gl.getUniformLocation(program, "ambient")
    
    // Sets the model-view-projections matrix in the shader
    gl.uniformMatrix4fv(amvp, false, trans_matrix)
    gl.uniformMatrix4fv(anormalMat, false, norm_matrix)
    gl.uniform3fv(aambient, ambient_vec)

    gl.drawArrays(method, 0, verticesTorus.length/3)
    gl.flush()

    if (isImport)
        isImport = !isImport
}

var exportFile = function() {
    var filename = document.getElementById("export_file").value

    if (!filename) {
        filename = 'data'
    }

    let arrObjects = [
        {
            type: "torus",
            vert: Array.from(verticesTorus),
            colors: Array.from(colorsTorus)
        },
        {
            type: "cube",
            vert: verticesCube,
            colors: colorsCube
        },
        {
            type: "prism",
            vert: verticesPrism,
            colors: colorsPrism
        }
    ]

    var data = JSON.stringify(arrObjects)
    download(filename + ".json", data)

    console.log("The file was saved!")
}

var isImport = false

var importFile = function() {
    var file = document.getElementById("import_file").files[0]
    var reader = new FileReader()
    reader.onload = function(e) {
        isImport = true
        console.log('file imported')
        arrObjects = JSON.parse(e.target.result);
        let objTorus = arrObjects[0]
        verticesTorus = new Float32Array(objTorus.vert)
        colorsTorus = new Float32Array(objTorus.colors)
        
        let objCube = arrObjects[1]
        verticesCube = objCube.vert
        colorsCube = objCube.colors

        let objPrism = arrObjects[2]
        verticesPrism = objPrism.vert
        colorsPrism = objPrism.colors

        running = true
        
        main(objTorus.type)
        main2()
        main3()
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

var help = document.getElementById("help")
var btn = document.getElementById("helpBtn")
var span = document.getElementsByClassName("close")[0]

btn.onclick = function() {
    help.style.display = "block"
}

span.onclick = function() {
    help.style.display = "none"
}

window.onclick = function(event) {
    if (event.target == help) {
        help.style.display = "none"
    }
} 