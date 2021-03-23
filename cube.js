var drawCube = function() {
    main("cube")
}

var setCube = function() {
    objectType = "cube" 
    vertices = [
        // ~~~~~ FACE LUAR ~~~~~
        // // Front face
        // -1.0, -1.0,  1.0,
        // 1.0, -1.0,  1.0,
        // 1.0,  1.0,  1.0,
        // -1.0,  1.0,  1.0,
    
        // Front bottom face
        -1.0, -1.0,  1.0,
        -1.0, -0.8,  1.0,
        1.0, -1.0,  1.0,
        1.0, -0.8,  1.0,    
        
    //     // Front right face
    //      0.8, -1.0,  1.0,
    //      1.0, -1.0,  1.0,
    //      1.0,  1.0,  1.0,
    //      0.8,  1.0,  1.0,
        
    //     // Front top face
    //     -1.0,  0.8,  1.0,
    //      1.0,  0.8,  1.0,
    //      1.0,  1.0,  1.0,
    //     -1.0,  1.0,  1.0,
        
    //     // Front left face
    //     -1.0, -1.0,  1.0,
    //     -0.8, -1.0,  1.0,
    //     -0.8,  1.0,  1.0,
    //     -1.0,  1.0,  1.0,
    
    //     // // Back face
    //     // -1.0, -1.0, -1.0,
    //     // -1.0,  1.0, -1.0,
    //     //  1.0,  1.0, -1.0,
    //     //  1.0, -1.0, -1.0,
    
    //     // Back bottom face 
    //     -1.0, -1.0,  -1.0,
    //      1.0, -1.0,  -1.0,
    //      1.0, -0.8,  -1.0,
    //     -1.0, -0.8,  -1.0,
         
    //     // Back right face 
    //      0.8, -1.0,  -1.0,
    //      1.0, -1.0,  -1.0,
    //      1.0,  1.0,  -1.0,
    //      0.8,  1.0,  -1.0,
         
    //     // Back top face 
    //     -1.0,  0.8,  -1.0,
    //      1.0,  0.8,  -1.0,
    //      1.0,  1.0,  -1.0,
    //     -1.0,  1.0,  -1.0,
         
    //     // Back left face 
    //     -1.0, -1.0,  -1.0,
    //     -0.8, -1.0,  -1.0,
    //     -0.8,  1.0,  -1.0,
    //     -1.0,  1.0,  -1.0,
    
    //     // // Top face
    //     // -1.0,  1.0,  -1.0,
    //     // -1.0,  1.0,   1.0,
    //     //  1.0,  1.0,   1.0,
    //     //  1.0,  1.0,  -1.0,
    
    //     // Top bottom face
    //     -1.0,  1.0, -1.0,
    //      1.0,  1.0, -1.0,
    //      1.0,  1.0, -0.8,
    //     -1.0,  1.0, -0.8,
    
    //     // Top right face
    //      0.8,  1.0,  -1.0,
    //      1.0,  1.0,  -1.0,
    //      1.0,  1.0,   1.0,
    //      0.8,  1.0,   1.0,
    
    //     // Top top face
    //     -1.0,  1.0,   0.8,
    //      1.0,  1.0,   0.8,
    //      1.0,  1.0,   1.0,
    //     -1.0,  1.0,   1.0,
    
    //     // Top left face
    //     -1.0,  1.0,  -1.0,
    //     -0.8,  1.0,  -1.0,
    //     -0.8,  1.0,   1.0,
    //     -1.0,  1.0,   1.0,
    
    //     // // Bottom face
    //     // -1.0, -1.0, -1.0,
    //     //  1.0, -1.0, -1.0,
    //     //  1.0, -1.0,  1.0,
    //     // -1.0, -1.0,  1.0,
    
    //     // Bottom bottom face
    //     -1.0, -1.0, -1.0,
    //      1.0, -1.0, -1.0,
    //      1.0, -1.0, -0.8,
    //     -1.0, -1.0, -0.8,
    
    //     // Bottom right face
    //      0.8, -1.0,  -1.0,
    //      1.0, -1.0,  -1.0,
    //      1.0, -1.0,   1.0,
    //      0.8, -1.0,   1.0,
    
    //     // Bottom top face
    //     -1.0, -1.0,   0.8,
    //      1.0, -1.0,   0.8,
    //      1.0, -1.0,   1.0,
    //     -1.0, -1.0,   1.0,
    
    //     // Bottom left face
    //     -1.0, -1.0,  -1.0,
    //     -0.8, -1.0,  -1.0,
    //     -0.8, -1.0,   1.0,
    //     -1.0, -1.0,   1.0,
    
    //     // // Right face
    //     //  1.0, -1.0, -1.0,
    //     //  1.0,  1.0, -1.0,
    //     //  1.0,  1.0,  1.0,
    //     //  1.0, -1.0,  1.0,
    
    //     // Right bottom face
    //      1.0, -1.0, -1.0,
    //      1.0,  1.0, -1.0,
    //      1.0,  1.0, -0.8,
    //      1.0, -1.0, -0.8,
    
    //     // Right right face
    //      1.0,  0.8, -1.0,
    //      1.0,  1.0, -1.0,
    //      1.0,  1.0,  1.0,
    //      1.0,  0.8,  1.0,
    
    //     // Right top face
    //      1.0, -1.0,  0.8,
    //      1.0,  1.0,  0.8,
    //      1.0,  1.0,  1.0,
    //      1.0, -1.0,  1.0,
    
    //     // Right left face
    //      1.0, -1.0, -1.0,
    //      1.0, -0.8, -1.0,
    //      1.0, -0.8,  1.0,
    //      1.0, -1.0,  1.0,
    
    //     // // Left face
    //     // -1.0, -1.0, -1.0,
    //     // -1.0, -1.0,  1.0,
    //     // -1.0,  1.0,  1.0,
    //     // -1.0,  1.0, -1.0,
    
    //     // Left bottom face
    //     -1.0, -1.0, -1.0,
    //     -1.0,  1.0, -1.0,
    //     -1.0,  1.0, -0.8,
    //     -1.0, -1.0, -0.8,
    
    //    // Left right face
    //     -1.0,  0.8, -1.0,
    //     -1.0,  1.0, -1.0,
    //     -1.0,  1.0,  1.0,
    //     -1.0,  0.8,  1.0,
    
    //    // Left top face
    //     -1.0, -1.0,  0.8,
    //     -1.0,  1.0,  0.8,
    //     -1.0,  1.0,  1.0,
    //     -1.0, -1.0,  1.0,
    
    //    // Left left face
    //     -1.0, -1.0, -1.0,
    //     -1.0, -0.8, -1.0,
    //     -1.0, -0.8,  1.0,
    //     -1.0, -1.0,  1.0,
    
    //     // ~~~~~ FACE DALAM ~~~~~
        
    //     // // Front face
    //     // -1.0, -1.0,  1.0,
    //     // 1.0, -1.0,  1.0,
    //     // 1.0,  1.0,  1.0,
    //     // -1.0,  1.0,  1.0,
    
    //     // Front bottom face
    //     -1.0, -1.0,  0.8,
    //      1.0, -1.0,  0.8,
    //      1.0, -0.8,  0.8,
    //     -1.0, -0.8,  0.8,
        
    //     // Front right face
    //      0.8, -1.0,  0.8,
    //      1.0, -1.0,  0.8,
    //      1.0,  1.0,  0.8,
    //      0.8,  1.0,  0.8,
        
    //     // Front top face
    //     -1.0,  0.8,  0.8,
    //      1.0,  0.8,  0.8,
    //      1.0,  1.0,  0.8,
    //     -1.0,  1.0,  0.8,
        
    //     // Front left face
    //     -1.0, -1.0,  0.8,
    //     -0.8, -1.0,  0.8,
    //     -0.8,  1.0,  0.8,
    //     -1.0,  1.0,  0.8,
    
    //     // // Back face
    //     // -1.0, -1.0, -1.0,
    //     // -1.0,  1.0, -1.0,
    //     //  1.0,  1.0, -1.0,
    //     //  1.0, -1.0, -1.0,
    
    //     // Back bottom face 
    //     -1.0, -1.0,  -0.8,
    //      1.0, -1.0,  -0.8,
    //      1.0, -0.8,  -0.8,
    //     -1.0, -0.8,  -0.8,
         
    //     // Back right face 
    //      0.8, -1.0,  -0.8,
    //      1.0, -1.0,  -0.8,
    //      1.0,  1.0,  -0.8,
    //      0.8,  1.0,  -0.8,
         
    //     // Back top face 
    //     -1.0,  0.8,  -0.8,
    //      1.0,  0.8,  -0.8,
    //      1.0,  1.0,  -0.8,
    //     -1.0,  1.0,  -0.8,
         
    //     // Back left face 
    //     -1.0, -1.0,  -0.8,
    //     -0.8, -1.0,  -0.8,
    //     -0.8,  1.0,  -0.8,
    //     -1.0,  1.0,  -0.8,
    
    //     // // Top face
    //     // -1.0,  1.0,  -1.0,
    //     // -1.0,  1.0,   1.0,
    //     //  1.0,  1.0,   1.0,
    //     //  1.0,  1.0,  -1.0,
    
    //     // Top bottom face
    //     -1.0,  0.8, -1.0,
    //      1.0,  0.8, -1.0,
    //      1.0,  0.8, -0.8,
    //     -1.0,  0.8, -0.8,
    
    //     // Top right face
    //      0.8,  0.8,  -1.0,
    //      1.0,  0.8,  -1.0,
    //      1.0,  0.8,   1.0,
    //      0.8,  0.8,   1.0,
    
    //     // Top top face
    //     -1.0,  0.8,   0.8,
    //      1.0,  0.8,   0.8,
    //      1.0,  0.8,   1.0,
    //     -1.0,  0.8,   1.0,
    
    //     // Top left face
    //     -1.0,  0.8,  -1.0,
    //     -0.8,  0.8,  -1.0,
    //     -0.8,  0.8,   1.0,
    //     -1.0,  0.8,   1.0,
    
    //     // // Bottom face
    //     // -1.0, -1.0, -1.0,
    //     //  1.0, -1.0, -1.0,
    //     //  1.0, -1.0,  1.0,
    //     // -1.0, -1.0,  1.0,
    
    //     // Bottom bottom face
    //     -1.0, -0.8, -1.0,
    //      1.0, -0.8, -1.0,
    //      1.0, -0.8, -0.8,
    //     -1.0, -0.8, -0.8,
    
    //     // Bottom right face
    //      0.8, -0.8,  -1.0,
    //      1.0, -0.8,  -1.0,
    //      1.0, -0.8,   1.0,
    //      0.8, -0.8,   1.0,
    
    //     // // Bottom top face
    //     -1.0,  -0.8,   0.8,
    //      1.0,  -0.8,   0.8,
    //      1.0,  -0.8,   1.0,
    //     -1.0,  -0.8,   1.0,
    
    //     // Bottom left face
    //     -1.0, -0.8,  -1.0,
    //     -0.8, -0.8,  -1.0,
    //     -0.8, -0.8,   1.0,
    //     -1.0, -0.8,   1.0,
    
    //     // // Right face
    //     //  1.0, -1.0, -1.0,
    //     //  1.0,  1.0, -1.0,
    //     //  1.0,  1.0,  1.0,
    //     //  1.0, -1.0,  1.0,
    
    //     // Right bottom face
    //      0.8, -1.0, -1.0,
    //      0.8,  1.0, -1.0,
    //      0.8,  1.0, -0.8,
    //      0.8, -1.0, -0.8,
    
    //     // Right right face
    //      0.8,  0.8, -1.0,
    //      0.8,  1.0, -1.0,
    //      0.8,  1.0,  1.0,
    //      0.8,  0.8,  1.0,
    
    //     // Right top face
    //      0.8, -1.0,  0.8,
    //      0.8,  1.0,  0.8,
    //      0.8,  1.0,  1.0,
    //      0.8, -1.0,  1.0,
    
    //     // Right left face
    //      0.8, -1.0, -1.0,
    //      0.8, -0.8, -1.0,
    //      0.8, -0.8,  1.0,
    //      0.8, -1.0,  1.0,
    
    //     // // Left face
    //     // -1.0, -1.0, -1.0,
    //     // -1.0, -1.0,  1.0,
    //     // -1.0,  1.0,  1.0,
    //     // -1.0,  1.0, -1.0,
    
    //     // Left bottom face
    //     -0.8, -1.0, -1.0,
    //     -0.8,  1.0, -1.0,
    //     -0.8,  1.0, -0.8,
    //     -0.8, -1.0, -0.8,  
    
    //    // Left right face
    //     -0.8,  0.8, -1.0,
    //     -0.8,  1.0, -1.0,
    //     -0.8,  1.0,  1.0,
    //     -0.8,  0.8,  1.0,
    
    //    // Left top face
    //     -0.8, -1.0,  0.8,
    //     -0.8,  1.0,  0.8,
    //     -0.8,  1.0,  1.0,
    //     -0.8, -1.0,  1.0,
    
    //    // Left left face
    //     -0.8, -1.0, -1.0,
    //     -0.8, -0.8, -1.0,
    //     -0.8, -0.8,  1.0,
    //     -0.8, -1.0,  1.0,
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
    // for (let i = 0; i < k; i++) {
    //     console.log(`${i*4}, ${i*4+1}, ${i*4+2},     ${i*4}, ${i*4+2}, ${i*4+3}`)
    // }
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

function normalize_vector(vec) {
    let magnitude = Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2) + Math.pow(vec[2], 2))

    return vec.map(el => el / magnitude)
}

function compute_normal(vec_a, vec_b) {
    let cross_result = []
    cross_result.push(vec_a[1]*vec_b[2] - vec_a[2]*vec_b[1])
    cross_result.push(-1*(vec_a[0]*vec_b[2] - vec_a[2]*vec_b[0]))
    cross_result.push(vec_a[0]*vec_b[1] - vec_a[1]*vec_b[0])

    return normalize_vector(cross_result)
}

function compute_cube_normal(vertices) {
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

// Returns the inverse of matrix `M`.
function matrix_invert(M){
    if(M.length !== M[0].length){return;}
    var i=0, ii=0, j=0, dim=M.length, e=0, t=0;
    var I = [], C = [];
    for(i=0; i<dim; i+=1){
        // Create the row
        I[I.length]=[];
        C[C.length]=[];
        for(j=0; j<dim; j+=1){
            if(i==j){ I[i][j] = 1; }
            else{ I[i][j] = 0; }
            C[i][j] = M[i][j];
        }
    }
    
    for(i=0; i<dim; i+=1){
        e = C[i][i];
        if(e==0){
            for(ii=i+1; ii<dim; ii+=1){
                if(C[ii][i] != 0){
                    for(j=0; j<dim; j++){
                        e = C[i][j];       //temp store i'th row
                        C[i][j] = C[ii][j];//replace i'th row by ii'th
                        C[ii][j] = e;      //repace ii'th by temp
                        e = I[i][j];       //temp store i'th row
                        I[i][j] = I[ii][j];//replace i'th row by ii'th
                        I[ii][j] = e;      //repace ii'th by temp
                    }
                    break;
                }
            }
            e = C[i][i];
            if(e==0){return}
        }
        
        for(j=0; j<dim; j++){
            C[i][j] = C[i][j]/e; //apply to original matrix
            I[i][j] = I[i][j]/e; //apply to identity
        }
        
        for(ii=0; ii<dim; ii++){
            if(ii==i){continue;}
            e = C[ii][i];
            for(j=0; j<dim; j++){
                C[ii][j] -= e*C[i][j]; //apply to original matrix
                I[ii][j] -= e*I[i][j]; //apply to identity
            }
        }
    }
    return I;
}

function matrix_transpose(array) {
    return array[0].map((_, colIndex) => array.map(row => row[colIndex]));
}

function list_to_matrix(list, elementsPerSubArray) {
    var matrix = [], i, k;

    for (i = 0, k = -1; i < list.length; i++) {
        if (i % elementsPerSubArray === 0) {
            k++;
            matrix[k] = [];
        }

        matrix[k].push(list[i]);
    }

    return matrix;
}