var drawPrism = function() {
    main("prism");
    running = true;
}

var setPrism = function() {
    objectType = "prism" 
    vertices = [
        -1.0, -1.0,  1.0,
        -1.0, -0.8,  1.0,
        1.0, -1.0,  1.0,
        1.0, -0.8,  1.0,    
      ].map(e => e * 3);
}

function generate_indices(k) {
    let temp = [];
    for (let i = 0; i < k; i++) {
        temp.push(i*4);
        temp.push(i*4 + 1);
        temp.push(i*4 + 2);
        temp.push(i*4);
        temp.push(i*4 + 2);
        temp.push(i*4 + 3);
    }
    
    return temp;
}

function ComputeFOVProjection(fov, aspect, nearDist, farDist, leftHanded /* = true */ )
{
    let result = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
    if ( fov <= 0 || aspect == 0 )
    {
        return;
    }

    frustumDepth = farDist - nearDist;
    oneOverDepth = 1 / frustumDepth;

    result[1*4 + 1] = 1 / Math.tan(0.5 * fov);
    result[0*4 + 0] = 1.8106601717798212
    result[2*4 + 2] = -farDist * oneOverDepth;
    result[3*4 + 2] = (-farDist * nearDist) * oneOverDepth;
    result[2*4 + 3] = -1;
    result[3*4 + 3] = 0;
    return result
}

function compute_prism_normal(vertices) {
    let normals = []
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
    }
    return normals
}