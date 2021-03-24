var vertexShaderText = `
    attribute vec3 ppos;
    attribute vec3 anormal;

    uniform mat4 mvp;
    uniform vec3 ambient;
    uniform mat4 normalMatrix;

    varying highp vec3 lighting;

    void main(void) {
        gl_Position = mvp * vec4(ppos.x, ppos.y, ppos.z, 1.0);
        
        highp vec3 ambientLight = ambient;
        highp vec3 directionalLightColor = vec3(1, 1, 1);
        highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
        highp vec4 transformedNormal = normalMatrix * vec4(anormal, 1.0);
        
        highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
        lighting = ambient + (directionalLightColor * directional);

        gl_PointSize = 2.0;
    }`

var fragmentShaderText = `
    varying highp vec3 lighting;

    void main(void) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        gl_FragColor.rgb *= lighting;
    }`

var canvas = document.getElementById('canvas-surface')
var gl = canvas.getContext('webgl')
var program
var aspectRatio
var vertices
var torusNormals
var trans_matrix
var norm_matrix
var ambient_vec
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

    if (object == "torus" && !isImport) {
        setTorus()
    }

    // The function draw() will be called every 40 ms
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
    // var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

	gl.enableVertexAttribArray(positionAttribLocation)
	gl.enableVertexAttribArray(normalAttribLocation)
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

    // var torusNormals = compute_torus_normal(vertices)
    var normalBuffer = gl.createBuffer()
    // console.log(torusNormals)
    // console.log(vertices)
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
        
    if (!isImport) {
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
        trans_matrix = getTransformationMatrix(ox, oy, oz, ax, ay, az, s, d, f, n, aspectRatio, exz, projectionType, projectionDegree);
        norm_matrix = [].concat(...matrix_transpose(matrix_invert(list_to_matrix(trans_matrix, 4))))

        // var ambientVector = null
        var ambientOption = document.getElementById('ambient').value
        if (ambientOption === 'ON') {
            // ambientVector = [0.2, 0.2, 0.2];
            ambient_vec = [0.3, 0.3, 0.3]
        } else {
            ambient_vec = [1.0, 1.0, 1.0]
        }
    }

    // Gets reference on the "uniform" 4x4 matrix transforming coordinates
    var amvp = gl.getUniformLocation(program, "mvp");
    var anormalMat = gl.getUniformLocation(program, "normalMatrix");
    var aambient = gl.getUniformLocation(program, "ambient")

    // console.log(vertices)
    // console.log(torusNormals)
    // mat = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
    
    // Sets the model-view-projections matrix in the shader
    gl.uniformMatrix4fv(amvp, false, trans_matrix)
    gl.uniformMatrix4fv(anormalMat, false, norm_matrix)
    gl.uniform3fv(aambient, ambient_vec)

	// Main render loop
	// gl.useProgram(program)
    // console.log(objectType)

    gl.drawArrays(method, 0, vertices.length/3)
    gl.flush()

    if (isImport)
        isImport = !isImport
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

    let arrObjects = [
        {
            type: "torus",
            vert: Array.from(vertices),
            norm: Array.from(torusNormals),
            transmat: Array.from(trans_matrix),
            normmat: norm_matrix,
            ambientvert: ambient_vec
        }
    ]

    // console.log("arrobject", arrObjects)

    var data = JSON.stringify(arrObjects)
    download(filename + ".json", data)

    console.log("The file was saved!")
}

var isImport = false

var importFile = function() {
    var file = document.getElementById("import_file").files[0]
    var reader = new FileReader()
    // var data = [];
    reader.onload = function(e) {
        isImport = true
        console.log('file imported')
        arrObjects = JSON.parse(e.target.result);
        // console.log(data)
        // arrObjects = data
        let obj = arrObjects[0]
        // console.log("object imported")
        // console.log(obj)
        vertices = new Float32Array(obj.vert)
        torusNormals = new Float32Array(obj.norm)
        trans_matrix = new Float32Array(obj.transmat)
        norm_matrix = obj.normmat
        ambient_vec = obj.ambientvert

        // console.log("vert", vertices)
        // console.log("norm", torusNormals)
        // console.log("trans", trans_matrix)
        // console.log("normmat", norm_matrix)
        // console.log("ambient", ambient_vec)

        running = true
        main(obj.type)
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