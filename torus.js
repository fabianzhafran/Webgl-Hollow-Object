var drawTorus = function() {
    main("torus")
}

var setTorus = function() {
    // the torus factor
    var interleave = 1.0
    var numsegs = 40
    var numssegs = 40
    var sradius = 0.3

    // Creates the object in "vertices"
    objectType = "torus"
    vertices = makeTorus(0.7, sradius, numsegs, numssegs, interleave)
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
var getTransformationMatrix = function(ox, oy, oz, rx, ry, rz, s, d, f, n, ar, exz)
{
    // Pre-computes trigonometric values
    var cx = Math.cos(rx), sx = Math.sin(rx);
    var cy = Math.cos(ry), sy = Math.sin(ry);
    var cz = Math.cos(rz), sz = Math.sin(rz);

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
}

// Creates a 3D torus in the XY plane, returns the vertices in a Float32Array
// r:  big radius
// sr: section radius
// n:  number of faces
// sn: number of faces on section
// k:  factor between 0 and 1 defining the space between strips of the torus
var makeTorus = function(r, sr, n, sn, k) {
    // Temporary arrays for the vertices and the normals
    var tv = new Array()
    
    // Iterates along the big circle and then around a section
    for(var i=0; i<n; i++)
        for(var j=0; j<sn+1*(i==n-1); j++) {
            // Pre-calculation of angles
            var a =  2*Math.PI*(i+j/sn)/n
            var a2 = 2*Math.PI*(i+j/sn+k)/n
            var sa = 2*Math.PI*j/sn
            
            // Coordinates on the surface of the torus  
            tv.push((r+sr*Math.cos(sa))*Math.cos(a)) // X
            tv.push((r+sr*Math.cos(sa))*Math.sin(a)) // Y
            tv.push(sr*Math.sin(sa))                 // Z
            
            // Second vertex to close triangle
            tv.push((r+sr*Math.cos(sa))*Math.cos(a2)) // X
            tv.push((r+sr*Math.cos(sa))*Math.sin(a2)) // Y
            tv.push(sr*Math.sin(sa))                  // Z
        }

    // Converts and returns array
    // console.log(tv)
    return new Float32Array(tv)
}