import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Diorama3D } from '../js/diorama_3d.js';

const css = readFileSync(new URL('../css/desk.css', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const mobile = css.slice(css.indexOf('Mobile UI: mayor + sign-language interpreter'));
assert(mobile.length > 7000, 'Missing dedicated mobile CSS');
assert.match(mobile, /max-width:\s*760px/, 'Mobile breakpoint missing');
assert.match(mobile, /max-height:\s*540px/, 'Landscape breakpoint missing');

// Required regions are present once and use the same existing DOM and game engine.
for (const id of ['cable-news-banner', 'mayor-quote-text', 'interpreter-face',
                   'news-ticker-text', 'diorama-canvas', 'action-drawer',
                   'sticky-notes-zone', 'director-meltdown-props',
                   'diorama-base-dashboard', 'document-overlay-modal']) {
  assert.equal((html.match(new RegExp('id="' + id + '"', 'g')) || []).length, 1, id);
}
assert(html.includes('viewport-fit=cover'), 'Respect iOS safe areas');
assert.match(mobile, /\.mayor-quote-box\s*\{[^}]*order:\s*1/);
assert.match(mobile, /\.interpreter-box\s*\{[^}]*order:\s*2/);
assert.match(mobile, /\.news-badge\s*\{[^}]*position:\s*fixed[^}]*bottom:/s);
assert.match(mobile, /\.news-ticker-wrap\s*\{[^}]*position:\s*fixed[^}]*bottom:/s);
assert.match(mobile, /#main-viewport-layout\s*\{[^}]*min-height:\s*0/s);
assert.match(mobile, /#diorama-3d-wrapper\s*\{[^}]*height:\s*100%/s);
assert.match(mobile, /#diorama-canvas\s*\{[^}]*touch-action:\s*none/s);
assert.match(mobile, /#action-drawer\s*\{[^}]*right:\s*0/s);
assert.match(mobile, /#zone-picker-modal\s*\{[^}]*right:\s*4px/s);
assert.match(mobile, /#zone-picker-modal\s*\{[^}]*width:\s*min\(74vw, 300px\)/s);
assert.match(mobile, /\.drawer-toggle-tab\s*\{[^}]*left:\s*-42px/s);
assert.match(mobile, /#sticky-notes-zone\s*\{[^}]*flex-direction:\s*column/s);
assert.match(mobile, /#director-meltdown-props\s*\{[^}]*bottom:\s*7px/s);
assert.match(mobile, /#official-document\s*\{[^}]*overflow-y:\s*auto/s);
assert.match(mobile, /\.dossier-booklet\s*\{[^}]*flex-direction:\s*column/s);

// Camera is tested WITHOUT a WebGL renderer or DOM (pure geometry/framing).
const previousWindow = globalThis.window;
const calls = [];
const camera = {
  aspect: null,
  position: {
    xyz: null,
    set(x,y,z) { this.xyz = [x,y,z]; }
  },
  lookAt(...args) { calls.push(['lookAt',...args]); },
  updateProjectionMatrix() { calls.push(['projection']); }
};
const host = {camera, camAngle: Math.atan2(22,18), camDist: Math.hypot(18,22)};
const originalRadial = Math.hypot(18,22);
try {
  globalThis.window = {matchMedia: () => ({matches: true})};
  Diorama3D.prototype.fitCameraToViewport.call(host, 390, 620);
  assert.equal(camera.aspect, 390 / 620);
  assert(host.camDist >= originalRadial * 1.8, 'Portrait must widen full 3D model view');
  assert(Math.abs(Math.hypot(camera.position.xyz[0],camera.position.xyz[2])-host.camDist)<0.01);

  Diorama3D.prototype.fitCameraToViewport.call(host, 844, 230);
  assert.equal(camera.aspect, 844 / 230);
  assert(host.camDist >= originalRadial * 1.29, 'Short landscape must pull back too');

  globalThis.window.matchMedia = () => ({matches:false});
  Diorama3D.prototype.fitCameraToViewport.call(host,1280,720);
  assert(Math.abs(host.camDist-originalRadial)<1e-6,'Desktop camera must retain original distance');

  // Window and visualViewport resizing should update canvas and camera framing.
  const listeners = {}, visualListeners = {};
  globalThis.window.addEventListener = (name, fn) => {listeners[name]=fn;};
  globalThis.window.visualViewport = {addEventListener(name,fn){visualListeners[name]=fn;}};
  let resized = null;
  const viewportHost = {
    canvas:{clientWidth:390,clientHeight:620},
    webglSupported:true,
    camera,
    renderer:{setSize(w,h){resized=[w,h];}},
    fitCameraToViewport(w,h){Diorama3D.prototype.fitCameraToViewport.call(host,w,h);}
  };
  Diorama3D.prototype.bindWindowResize.call(viewportHost);
  assert.equal(typeof listeners.resize,'function');
  assert.equal(typeof visualListeners.resize,'function');
  listeners.resize();
  assert.deepEqual(resized,[390,620]);
  viewportHost.canvas.clientWidth=844;
  viewportHost.canvas.clientHeight=230;
  visualListeners.resize();
  assert.deepEqual(resized,[844,230]);

  // Disabled WebGL must never attempt renderer methods.
  viewportHost.renderer=null;
  assert.doesNotThrow(()=>listeners.resize());
} finally {
  if(previousWindow===undefined) delete globalThis.window;
  else globalThis.window=previousWindow;
}
console.log('Responsive mobile layout and 3D viewport framing checks passed (browser QA still required).');
