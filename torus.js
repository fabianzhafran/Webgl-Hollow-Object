var drawTorus = function() {
    main("torus")
    running = true
}

var setTorus = function() {
    if (!isImport) {
        // the torus factor
        var interleave = 1.0
        var numsegs = 40
        var numssegs = 40
        var sradius = 0.2

        // Creates the object in "vertices"
        objectType = "torus"
        var obj = makeTorus(0.7, sradius, numsegs, numssegs, interleave)
        verticesTorus = obj.vertices
        colorsTorus = obj.colors
    }
    torusNormals = compute_torus_normal(verticesTorus)
}

// Returns a transformation matrix as a flat array with 16 components, given:
// ox, oy, oz: new origin (translation)
// rx, ry, rz: rotation angles (radians)
// s: scaling factor
// d: distance between camera and origin after translation,
//     if d <= -n skips projection completely
// f: z coordinate of far plane (normally positive)
// n: z coordinate of near plane (normally negative)
// ar: aspect ratio of the viewport (e.g. 16/9)
// exz: if true exchanges X and Z coords after projection
var getTransformationMatrix = function(ox, oy, oz, rx, ry, rz, s, d, f, n, ar, exz, projectionType, projectionDegree)
{
    // Pre-computes trigonometric values
    var cx = Math.cos(rx), sx = Math.sin(rx);
    var cy = Math.cos(ry), sy = Math.sin(ry);
    var cz = Math.cos(rz), sz = Math.sin(rz);

    if (projectionType === 'perspective') {
        // Tests if d is too small, hence making perspective projection not possible
        if (d <= -n) {
            // Transformation matrix without projection
            return new Float32Array([
            (cy*cz*s)/ar,cy*s*sz,-s*sy,0,
            (s*(cz*sx*sy-cx*sz))/ar,s*(sx*sy*sz+cx*cz),cy*s*sx,0,
            (s*(sx*sz+cx*cz*sy))/ar,s*(cx*sy*sz-cz*sx),cx*cy*s,0,
            (s*(cz*((-oy*sx-cx*oz)*sy-cy*ox)-(oz*sx-cx*oy)*sz))/ar,
            s*(((-oy*sx-cx*oz)*sy-cy*ox)*sz+cz*(oz*sx-cx*oy)),
            s*(ox*sy+cy*(-oy*sx-cx*oz)),1    
            ])
        }
        else {
            // Pre-computes values determined with wxMaxima
            var A=d
            var B=(n+f+2*d)/(f-n)
            var C=-(d*(2*n+2*f)+2*f*n+2*d*d)/(f-n)
            
            // Tests if X and Z must be exchanged
            if(!exz) {
                // Full transformation matrix
                return new Float32Array([
                    (cy*cz*s*A)/ar,cy*s*sz*A,-s*sy*B,-s*sy,
                    (s*(cz*sx*sy-cx*sz)*A)/ar,s*(sx*sy*sz+cx*cz)*A,cy*s*sx*B,cy*s*sx,
                    (s*(sx*sz+cx*cz*sy)*A)/ar,s*(cx*sy*sz-cz*sx)*A,cx*cy*s*B,cx*cy*s,
                    (s*(cz*((-oy*sx-cx*oz)*sy-cy*ox)-(oz*sx-cx*oy)*sz)*A)/ar,
                    s*(((-oy*sx-cx*oz)*sy-cy*ox)*sz+cz*(oz*sx-cx*oy))*A,
                    C+(s*(ox*sy+cy*(-oy*sx-cx*oz))+d)*B,s*(ox*sy+cy*(-oy*sx-cx*oz))+d
                ])
            }
            else {
                // Full transformation matrix with XZ exchange
                return new Float32Array([
                    -s*sy*B,cy*s*sz*A,(cy*cz*s*A)/ar,-s*sy,
                    cy*s*sx*B,s*(sx*sy*sz+cx*cz)*A,(s*(cz*sx*sy-cx*sz)*A)/ar,cy*s*sx,
                    cx*cy*s*B,s*(cx*sy*sz-cz*sx)*A,(s*(sx*sz+cx*cz*sy)*A)/ar,cx*cy*s,
                    C+(s*(ox*sy+cy*(-oy*sx-cx*oz))+d)*B,s*(((-oy*sx-cx*oz)*sy-cy*ox)*sz+cz*(oz*sx-cx*oy))*A,
                    (s*(cz*((-oy*sx-cx*oz)*sy-cy*ox)-(oz*sx-cx*oy)*sz)*A)/ar,s*(ox*sy+cy*(-oy*sx-cx*oz))+d
                ])
            }
        }
    } else {
        let translation = [1, 0, 0, -1*ox, 0, 1, 0, -1*oy, 0, 0, 1, -1*oz, 0, 0, 0, 1]
        let zRotation = [cz, -1*sz, 0, 0, sz, cz, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
        let xRotation = [1, 0, 0, 0, 0, cx, -1*sx, 0, 0, sx, cx, 0, 0, 0, 0, 1]
        let yRotation = [cy, 0, sy, 0, 0, 1, 0, 0, -1*sy, 0, cy, 0, 0, 0, 0, 1]
        let scalingAndAR = [s, 0, 0, 0, 0, s/ar, 0, 0, 0, 0, s, 0, 0, 0, 0, 1]

        let orthographicProjection = [
            2 / 1,  0,      0,      0,
            0,     -2 / 1, 0,      0,
            0,          0,  2 / f - n,  0,
            0,          0,      0,      1+d,
        ]
        if (projectionType === 'oblique') {
            // console.log(projectionDegree)
            let projectionRadian = projectionDegree * 2 * Math.PI / 180
            orthographicProjection[0*4 + 2] = 1/Math.tan(projectionRadian)
            orthographicProjection[0*4 + 2] = 1/Math.tan(projectionRadian)
            // console.log(1/Math.tan(projectionRadian))
            // orthographicProjection[0*4 + 2] = -1 / Math.tan(projectionRadian)
            // orthographicProjection[1*4 + 2] = -1 / Math.tan(projectionRadian) 
        }
        
        let and_rotation = multiply_4d(yRotation, multiply_4d(xRotation, multiply_4d(zRotation, translation)))
        let and_scalingAndAR = multiply_4d(scalingAndAR, and_rotation)
        let and_projection = multiply_4d(orthographicProjection, and_scalingAndAR)
        return new Float32Array(and_projection)
    }

}

// Creates a 3D torus in the XY plane, returns the data in a new object composed of
//   several Float32Array objects named 'vertices' and 'colors', according to
//   the following parameters:
// r:  big radius
// sr: section radius
// n:  number of faces
// sn: number of faces on section
// k:  factor between 0 and 1 defining the space between strips of the torus
function makeTorus(r, sr, n, sn, k) {
    // Temporary arrays for the vertices, normals and colors
    var tv = new Array();
    var tc = new Array();
    
    // Iterates along the big circle and then around a section
    for(var i=0;i<n;i++)               // Iterates over all strip rounds
        for(var j=0;j<sn+1*(i==n-1);j++) // Iterates along the torus section
            for(var v=0;v<2;v++) {          // Creates zigzag pattern (v equals 0 or 1)
                // Pre-calculation of angles
                var a =  2*Math.PI*(i+j/sn+k*v)/n
                var sa = 2*Math.PI*j/sn
                var x, y, z
        
                // Coordinates on the surface of the torus
                tv.push(x = (r+sr*Math.cos(sa))*Math.cos(a)) // X
                tv.push(y = (r+sr*Math.cos(sa))*Math.sin(a)) // Y
                tv.push(z = sr*Math.sin(sa))                 // Z
        
                // Colors
                tc.push(1.0)  // R
                tc.push(1.0)  // G
                tc.push(1.0)  // B
                tc.push(1.0)  // Alpha
            }
    
    // Converts and returns array
    var res = new Object()
    res.vertices = new Float32Array(tv)
    res.colors = new Float32Array(tc)
    return res
}

let torus_compute = 0

function compute_torus_normal(vertices) {
    let normals = []
    // console.log(vertices.length)
    for (let i = 0; i < vertices.length; i += 12) {
        let point_a = [vertices[i + 0], vertices[i + 1], vertices[i + 2]]
        let point_b = [vertices[i + 3], vertices[i + 4], vertices[i + 5]]
        let point_d = [vertices[i + 9], vertices[i + 10], vertices[i + 11]]

        let vec_ab = [point_b[0]-point_a[0], point_b[1]-point_a[1], point_b[2]-point_a[2]]
        let vec_ad = [point_d[0]-point_a[0], point_d[1]-point_a[1], point_d[2]-point_a[2]]

        let cross_result = compute_normal(vec_ab, vec_ad)
        for (let j = 0; j < 12; j += 3) {
            normals.push(cross_result[0]); normals.push(cross_result[1]); normals.push(cross_result[2]);
        }
        // console.log(normals.length)
    }
    return new Float32Array(normals)
}