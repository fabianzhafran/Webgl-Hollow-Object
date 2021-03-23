

function initShaderProgram(gl2, vsSource, fsSource) {
    const vertexShader = loadShader(gl2, gl2.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl2, gl2.FRAGMENT_SHADER, fsSource);
  
    const shaderProgram = gl2.createProgram();
    gl2.attachShader(shaderProgram, vertexShader);
    gl2.attachShader(shaderProgram, fragmentShader);
    gl2.linkProgram(shaderProgram);
  
    if (!gl2.getProgramParameter(shaderProgram, gl2.LINK_STATUS)) {
      alert('Unable to initialize the shader program: ' + gl2.getProgramInfoLog(shaderProgram));
      return null;
    }
  
    return shaderProgram;
  }
  
  function loadShader(gl2, type, source) {
    const shader = gl2.createShader(type);
    gl2.shaderSource(shader, source);
    gl2.compileShader(shader);
    if (!gl2.getShaderParameter(shader, gl2.COMPILE_STATUS)) {
      alert('An error occurred compiling the shaders: ' + gl2.getShaderInfoLog(shader));
      gl2.deleteShader(shader);
      return null;
    }
  
    return shader;
  }