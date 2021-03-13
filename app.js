var vertexShaderText = 
    `precision mediump float;

    attribute vec2 vertPosition;
    attribute vec3 vertColor;
    varying vec3 fragColor;

    void main() {
        fragColor = vertColor;
        gl_Position = vec4(vertPosition, 0.0, 1.0);
    }`

var fragmentShaderText = 
    `precision mediump float;
    
    varying vec3 fragColor;
    void main() {
        gl_FragColor = vec4(fragColor, 1.0);
    }`

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
    var program = gl.createProgram()
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

    return program
}

var drawObject = function (program, vertices, method, n) {
    var vertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		2, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
	gl.vertexAttribPointer(
		colorAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);

	gl.enableVertexAttribArray(positionAttribLocation)
	gl.enableVertexAttribArray(colorAttribLocation)

	// Main render loop
	gl.useProgram(program)
    gl.drawArrays(method, 0, n)
}

var canvas = document.getElementById('canvas-surface')
var gl = canvas.getContext('webgl')

var load = function() {
    if (!gl) {
        console.log('webgl not supported')
        gl = canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('Your browser does not support WebGL');
	}
}

var main = function (vertices, n, method) {
    // console.log('This is working')

    // Create Shaders
    var vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderText)
    var fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderText)

    // Create program
    var program = createProgram(vertexShader, fragmentShader)

    drawObject(program, vertices, method, n)
}

var isPolygon = false
var isLine = false
var isSquare = false

var x = 0
var y = 0
var width = document.getElementById('canvas-surface').width
var height = document.getElementById('canvas-surface').height

var selectedObject
var idxPoint
var isDrag = false

canvas.addEventListener("mousedown", function(e) {
    x = getXCursorPosition(canvas, e)
    y = getYCursorPosition(canvas, e)   
    // console.log('x : '+ x + ' y : ' + y)
    checkSelectedObject(x, y)
    render(x, y)

    if (selectedObject != null) {
        isDrag = true
        canvas.addEventListener("mouseup", (event) => changeObjectPoint(canvas, event))

        if(!isDrag) {
            canvas.removeEventListener("mouseup", (event) => changeObjectPoint(canvas, event))
        }
    }
})

var render = function(x, y) {
    if (isPolygon) {
        drawPolygon(x, y)
    } else if (isLine) {
       drawLine(x, y)
    } else if (isSquare) {
        drawSquare(x, y)
    }
}

var renderObject = function(vertices, n, method) {
    main(vertices, n, method)
    for (var i=0; i<vertices.length; i+=5) {
        var sq_point = getSquarePoint(vertices[i], vertices[i+1])
        main(sq_point, 4, gl.TRIANGLE_FAN)
        points.push(sq_point)
    }
    // console.log("render object")
    // console.log(points)
}

var renderAll = function() {
    for (var i=0; i<arrObjects.length; i++) {
        main(arrObjects[i].vert, arrObjects[i].n, arrObjects[i].meth)
        // render square points of object
        for (var j=0; j<arrObjects[i].n; j++) {
            main(arrObjects[i].p[j], 4, gl.TRIANGLE_FAN)
        }
    }
}

var getXCursorPosition = function(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    return (x - width/2)/ (width/2);
}

var getYCursorPosition  = function(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const y = event.clientY - rect.top
    return (y - height/2)/ (height/2) * -1;
}

var checkSelectedObject = function(x, y) {
    selectedObject = null
    idxPoint = -1

    arrObjects.forEach(function (item) {
        item.p.forEach(function (item2, idx) {
            // console.log("item2")
            // console.log(item2)
            if (x > item2[0] && y < item2[1] &&
                x < item2[5] && y < item2[6] &&
                x < item2[10] && y > item2[11] &&
                x > item2[15] && y > item2[16]) {
                selectedObject = item
                idxPoint = idx
                console.log("object selected with idx " + idx)
                }
        })
    })
    // console.log(selectedObject)
}

var changeObjectPoint = function(canvas, ev) {
    // console.log("masuk sini ga nih")
    x = getXCursorPosition(canvas, ev)
    y = getYCursorPosition(canvas, ev)
        
    if (isDrag && selectedObject.type != "square") {
        // change vertices point
        selectedObject.vert[idxPoint*5] = x
        selectedObject.vert[idxPoint*5 + 1] = y

        // change square point
        selectedObject.p[idxPoint] = getSquarePoint(x, y)
        renderAll()
        isDrag = false
    } else if (isDrag && selectedObject.type == "square") {
        scaleSquare(x, y)
        renderAll()
        isDrag = false
    }
}

var vertices = []
var rgb = [0.0, 0.0, 0.0]

var arrObjects = []

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