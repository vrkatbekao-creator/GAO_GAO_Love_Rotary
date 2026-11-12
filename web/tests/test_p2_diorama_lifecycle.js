import assert from 'node:assert/strict';
import * as THREE from '../vendor/three.module.js';
import { Diorama3D } from '../js/diorama_3d.js';
import { CitizenAI } from '../js/citizen_ai.js';

// Test renderer absence safely, without instantiating WebGL in Node.
const previousWindow = globalThis.window;
const listeners = {};
globalThis.window = { addEventListener(type, handler) { listeners[type] = handler; } };
try {
  let resized = 0, sized = null;
  const fallback = {
    canvas:{ clientWidth:0, clientHeight:0 },
    camera:{aspect:1,updateProjectionMatrix(){resized++;}},
    renderer:null,
    webglSupported:false
  };
  Diorama3D.prototype.bindWindowResize.call(fallback);
  assert.doesNotThrow(() => listeners.resize());
  assert.equal(resized, 0, 'No camera / renderer updates without WebGL');

  fallback.renderer = { setSize(w,h) { sized = [w,h]; } };
  fallback.webglSupported = true;
  listeners.resize();
  assert.deepEqual(sized, [800,600], 'Zero-sized canvas uses a nonzero fallback size');
  assert.equal(resized, 1);
  assert.equal(fallback.camera.aspect, 800/600);

  // Scene reset invalidates delayed callbacks and disposes the old citizen AI.
  const firstScene = new THREE.Scene();
  let disposed = 0;
  const sceneHost = {
    scene:firstScene,
    sceneGeneration:2,
    camera:{},
    renderer:fallback.renderer,
    wheels:[{}],shuttles:[{}],markets:[{}],inflatables:[{}],
    particles:[{}], disasterObjects:[{}],
    zonePositions: { '港灣區':new THREE.Vector3(0,0,0) },
    citizenAI:{dispose(){disposed++;}},
    createDioramaBase(){},
    createZones(){}
  };
  Diorama3D.prototype.reset.call(sceneHost);
  assert.equal(sceneHost.sceneGeneration,3);
  assert.equal(disposed,1);
  assert.notEqual(sceneHost.scene,firstScene);
  assert.equal(sceneHost.wheels.length,0);
  assert(sceneHost.citizenAI instanceof CitizenAI);

  const citizen = sceneHost.citizenAI;
  citizen.hearingTimeout = setTimeout(() => { throw new Error('Stale hearing timer fired'); }, 1000);
  citizen.dispose();
  assert.equal(citizen.disposed,true);
  assert.equal(citizen.hearingTimeout,null);
  assert.equal(citizen.citizens.length,0);
} finally {
  if (previousWindow === undefined) delete globalThis.window;
  else globalThis.window = previousWindow;
}
console.log('P2 3D lifecycle and WebGL fallback checks passed.');
