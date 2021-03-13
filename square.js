var setSquare = function() {
    isLine = false
    isSquare = true
    isPolygon = false
}

var drawSquare = function(c1, c2, s=0.2) {
    vertices = getSquareVertices(c1, c2, s)
    
    // console.log(vertices)
    renderAll()
    renderObject(vertices, 4, gl.TRIANGLE_FAN)

    console.log("masuk sini")
    arrObjects.push({
        vert: vertices,
        meth: gl.TRIANGLE_FAN,
        n: 4,
        p: points,
        type: "square"
    })
    vertices = []
    isSquare = false
    points = []
}

var getSquareVertices = function(c1, c2, s) {
    var x = c1 - s/2
    var y = c2 + s/2
    var x2 = x + s
    var y2 = y - s
    
    return [
        x, y, rgb[0]/255, rgb[1]/255, rgb[2]/255,
        x2, y, rgb[0]/255, rgb[1]/255, rgb[2]/255,
        x2, y2, rgb[0]/255, rgb[1]/255, rgb[2]/255,
        x, y2, rgb[0]/255, rgb[1]/255, rgb[2]/255
    ]
}

var points = []

var getSquarePoint = function(x, y) {
    return [
        x-0.025, y+0.025, 1.0, 1.0, 1.0,
        x+0.025, y+0.025, 1.0, 1.0, 1.0,
        x+0.025, y-0.025, 1.0, 1.0, 1.0,
        x-0.025, y-0.025, 1.0, 1.0, 1.0
    ]
}

var getCenterSquare = function() {
    var cx = selectedObject.vert[0] + selectedObject.vert[5]
    var cy = selectedObject.vert[1] + selectedObject.vert[16]
    return [cx/2, cy/2]
}

var scaleSquare = function(newx, newy) {
    var center = getCenterSquare()
    var x_diff = Math.abs(newx - center[0])
    var y_diff = Math.abs(newy - center[1])
    var s = Math.max(x_diff, y_diff) * 2

    selectedObject.vert = getSquareVertices(center[0], center[1], s)
    var pts = []
    for (var i=0; i<selectedObject.vert.length; i+=5) {
        var sq_point = getSquarePoint(selectedObject.vert[i], selectedObject.vert[i+1])
        pts.push(sq_point)
    }
    selectedObject.p = pts
}