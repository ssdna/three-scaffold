export const mergeMeshes = function (meshes) {
  var combined = new THREE.Geometry()

  for (var i = 0; i < meshes.length; i++) {
    meshes[i].updateMatrix()
    combined.merge(meshes[i].geometry, meshes[i].matrix)
  }

  return combined
}

export const clamp = function (v, min, max) {
  return Math.min(Math.max(v, min), max)
}

export const rule3 = function (v, vmin, vmax, tmin, tmax) {
  var nv = Math.max(Math.min(v, vmax), vmin)
  var dv = vmax - vmin
  var pc = (nv - vmin) / dv
  var dt = tmax - tmin
  var tv = tmin + (pc * dt)
  return tv
}
