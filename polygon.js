var n_poly = 1
var n_after = 0

var changeNPoly = function() {
    n_poly = document.getElementById("n-poly").value
    // console.log(n_poly)
}

var setPolygon = function() {
    isLine = false
    isSquare = false
    isPolygon = true
}

var drawPolygon = function(x, y) {
    if (n_after < n_poly) {
        vertices.push(x)
        vertices.push(y)
        vertices.push(rgb[0]/255)
        vertices.push(rgb[1]/255)
        vertices.push(rgb[2]/255)
        n_after++
        // console.log(vertices)
        renderAll()
        if (n_after < n_poly) {
            main(vertices, n_after, gl.TRIANGLE_FAN)
        } else {
            renderObject(vertices, n_after, gl.TRIANGLE_FAN)
        }
    }

    if (n_after == n_poly) {
        console.log("masuk sini")
        arrObjects.push({
            vert: vertices,
            meth: gl.TRIANGLE_FAN,
            n: n_after,
            p: points,
            type: "polygon"
        })
        vertices = []
        n_after = 0
        isPolygon = false
        points = []
    }
}

