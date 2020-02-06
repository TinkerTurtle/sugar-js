"use strict";
/***
 Usage:
    var gl = canvas.getContext("webgl");
    var sl = Shaderlibrary(gl, './js');
    await sl.load('box', 'vertex.shader', 'fragment.shader');
    gl.useProgram(sl.program['box']);
***/
var Shaderlibrary = function(gl, rootFolder) {
    var shaders = {};
    var shaderSrc = {};

    async function load(programName, vertexFilename, fragmentFilename) {
        shaderSrc[programName] = {};

        await Promise.all([
            fetch(rootFolder + '/' + vertexFilename)
                .then(function(res){
                    if(!res.ok) {
                        console.log(res.status);
                    }
                    return res.text();
                })
                .then(function(res){ shaderSrc[programName].vertex = res; }),
            fetch(rootFolder + '/' + fragmentFilename)
                .then(function(res){
                    if(!res.ok) {
                        console.log(res.status);
                    }
                    return res.text();
                })
                .then(function(res){ shaderSrc[programName].fragment = res; }),
        ]);
        var vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, shaderSrc[programName].vertex);
        gl.compileShader(vs);
        if(!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(vs));
        }

        var fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, shaderSrc[programName].fragment);
        gl.compileShader(fs);
        if(!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(fs));
        }

        shaders[programName] = gl.createProgram();
        gl.attachShader(shaders[programName], vs);
        gl.attachShader(shaders[programName], fs);
        gl.linkProgram(shaders[programName]);
        console.log('Loaded shader: ' + programName);
    }

    return {
        shader: function(name) { return shaders[name]; },
        load: load,
        program: shaders
    };
};