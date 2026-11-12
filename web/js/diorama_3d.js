import * as THREE from '../vendor/three.module.js';
import { CONFIG } from './game_data.js';
import { CitizenAI } from './citizen_ai.js';

export class Diorama3D {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.zonePositions = {
      '港灣區': new THREE.Vector3(-8, 0.5, -4),
      '舊城區': new THREE.Vector3(-3, 1.0, 5),
      '郊區': new THREE.Vector3(7, 1.5, -6),
      '科技區': new THREE.Vector3(6, 2.0, 4),
      '山城區': new THREE.Vector3(1, 4.0, -7)
    };

    this.wheels = [];
    this.shuttles = [];
    this.markets = [];
    this.inflatables = [];
    this.particles = [];
    this.disasterObjects = [];
    this.clock = new THREE.Clock();
    this.sceneGeneration = 0;
    this.renderer = null;
    this.webglSupported = false;

    this.initScene();
    this.createDioramaBase();
    this.createZones();
    this.citizenAI = new CitizenAI(this);
    this.bindWindowResize();
    if (this.webglSupported && this.renderer) this.animate();
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x352115); // Warm retro dark office atmosphere
    this.scene.fog = new THREE.FogExp2(0x352115, 0.018);

    const aspect = this.canvas.clientWidth / this.canvas.clientHeight || 1;
    this.camera = new THREE.PerspectiveCamera(40, aspect, 0.5, 150);
    this.camera.position.set(18, 20, 22);
    this.camera.lookAt(0, 2.5, 0);

    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true // Required for Polaroid snapshot in ending dossier
      });
      this.renderer.setSize(this.canvas.clientWidth || 800, this.canvas.clientHeight || 600);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.webglSupported = true;
    } catch (e) {
      console.warn('WebGL Renderer could not initialize:', e);
      this.renderer?.dispose?.();
      this.renderer = null;
      this.webglSupported = false;
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xfff3e6, 0.75);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.3);
    sunLight.position.set(25, 35, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 80;
    const d = 16;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    this.scene.add(sunLight);

    // Neon accent point light in Tech zone
    const neonLight = new THREE.PointLight(0x00f5d4, 1.5, 18);
    neonLight.position.set(6, 5, 4);
    this.scene.add(neonLight);

    // Mouse orbital pan interaction
    this.isDragging = false;
    this.prevMousePos = { x: 0, y: 0 };
    this.camAngle = Math.atan2(this.camera.position.z, this.camera.position.x);
    this.camDist = Math.hypot(this.camera.position.x, this.camera.position.z);

    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.prevMousePos = { x: e.clientX, y: e.clientY };
    });
    window.addEventListener('mouseup', () => { this.isDragging = false; });
    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.prevMousePos.x;
      this.camAngle -= dx * 0.006;
      this.camera.position.x = Math.cos(this.camAngle) * this.camDist;
      this.camera.position.z = Math.sin(this.camAngle) * this.camDist;
      this.camera.lookAt(0, 2.5, 0);
      this.prevMousePos = { x: e.clientX, y: e.clientY };
    });
  }

  createDioramaBase() {
    // Large polished wooden tray base
    const trayGeo = new THREE.CylinderGeometry(15, 15.5, 1.2, 48);
    const trayMat = new THREE.MeshStandardMaterial({
      color: 0x4a2e1b,
      roughness: 0.4,
      metalness: 0.1
    });
    const tray = new THREE.Mesh(trayGeo, trayMat);
    tray.position.y = -0.6;
    tray.receiveShadow = true;
    this.scene.add(tray);

    // Golden trim ring around diorama base
    const trimGeo = new THREE.TorusGeometry(15.2, 0.25, 12, 64);
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.8,
      roughness: 0.2
    });
    const trim = new THREE.Mesh(trimGeo, trimMat);
    trim.rotation.x = Math.PI / 2;
    trim.position.y = -0.1;
    this.scene.add(trim);
  }

  createZones() {
    this.zoneMeshes = {};

    // 1. ⚓ 港灣區 (Y: 0.5) - 深藍水面 + 碼頭倉庫
    const harborGroup = new THREE.Group();
    const waterGeo = new THREE.CylinderGeometry(3.6, 3.8, 0.5, 24);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x1b4965,
      roughness: 0.1,
      metalness: 0.6,
      transparent: true,
      opacity: 0.88
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.receiveShadow = true;
    harborGroup.add(waterMesh);

    // Warehouses
    for (let i = 0; i < 4; i++) {
      const whGeo = new THREE.BoxGeometry(0.9, 0.6, 1.4);
      const whMat = new THREE.MeshStandardMaterial({ color: 0x5c677d, roughness: 0.8 });
      const wh = new THREE.Mesh(whGeo, whMat);
      wh.position.set(-1.2 + i * 0.7, 0.4, -0.6 + (i % 2) * 0.8);
      wh.castShadow = true;
      wh.receiveShadow = true;
      harborGroup.add(wh);
    }
    harborGroup.position.copy(this.zonePositions['港灣區']);
    this.scene.add(harborGroup);
    this.zoneMeshes['港灣區'] = harborGroup;

    // 2. 🏘️ 舊城區 (Y: 1.0) - 灰色擁擠建築網格 (供穿模)
    const oldTownGroup = new THREE.Group();
    const oldTownBaseGeo = new THREE.CylinderGeometry(4.2, 4.4, 1.0, 24);
    const oldTownBaseMat = new THREE.MeshStandardMaterial({ color: 0x6c757d, roughness: 0.9 });
    const oldBase = new THREE.Mesh(oldTownBaseGeo, oldTownBaseMat);
    oldBase.receiveShadow = true;
    oldTownGroup.add(oldBase);

    // Dense town houses
    for (let x = -2.2; x <= 2.2; x += 1.1) {
      for (let z = -2.2; z <= 2.2; z += 1.1) {
        if (Math.hypot(x, z) < 3.2) {
          const h = 0.6 + Math.random() * 0.8;
          const houseGeo = new THREE.BoxGeometry(0.8, h, 0.8);
          const houseMat = new THREE.MeshStandardMaterial({
            color: (x + z) % 2 === 0 ? 0xadb5bd : 0xd8d8d8,
            roughness: 0.7
          });
          const house = new THREE.Mesh(houseGeo, houseMat);
          house.position.set(x + (Math.random() - 0.5) * 0.2, 0.5 + h / 2, z + (Math.random() - 0.5) * 0.2);
          house.castShadow = true;
          house.receiveShadow = true;
          oldTownGroup.add(house);
        }
      }
    }
    oldTownGroup.position.copy(this.zonePositions['舊城區']);
    this.scene.add(oldTownGroup);
    this.zoneMeshes['舊城區'] = oldTownGroup;

    // 3. 🚡 郊區發展區 (Y: 1.5) - 淺綠平坦草地
    const subGroup = new THREE.Group();
    const subBaseGeo = new THREE.CylinderGeometry(3.8, 4.0, 1.5, 24);
    const subBaseMat = new THREE.MeshStandardMaterial({ color: 0x70e000, roughness: 0.8 });
    const subBase = new THREE.Mesh(subBaseGeo, subBaseMat);
    subBase.receiveShadow = true;
    subGroup.add(subBase);

    // Sparse tiny trees
    for (let i = 0; i < 6; i++) {
      const treeTrunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.15, 0.4, 6),
        new THREE.MeshStandardMaterial({ color: 0x582f0e })
      );
      const treeTop = new THREE.Mesh(
        new THREE.ConeGeometry(0.4, 0.8, 6),
        new THREE.MeshStandardMaterial({ color: 0x38b000, roughness: 0.6 })
      );
      treeTop.position.y = 0.5;
      const tree = new THREE.Group();
      tree.add(treeTrunk);
      tree.add(treeTop);
      const ang = (i / 6) * Math.PI * 2;
      tree.position.set(Math.cos(ang) * 2.2, 0.75, Math.sin(ang) * 2.2);
      subGroup.add(tree);
    }
    subGroup.position.copy(this.zonePositions['郊區']);
    this.scene.add(subGroup);
    this.zoneMeshes['郊區'] = subGroup;

    // 4. 🏙️ 科技區 (Y: 2.0) - 霓虹藍半透明方塊陣列
    const techGroup = new THREE.Group();
    const techBaseGeo = new THREE.CylinderGeometry(3.6, 3.8, 2.0, 24);
    const techBaseMat = new THREE.MeshStandardMaterial({ color: 0x0a1128, roughness: 0.3, metalness: 0.8 });
    const techBase = new THREE.Mesh(techBaseGeo, techBaseMat);
    techBase.receiveShadow = true;
    techGroup.add(techBase);

    // Neon translucent skyscrapers
    const towers = [
      { x: -0.8, z: -0.8, h: 2.8, color: 0x00f5d4 },
      { x: 0.9, z: -0.6, h: 3.4, color: 0x00bbf9 },
      { x: -0.5, z: 1.0, h: 2.2, color: 0x7209b7 },
      { x: 1.0, z: 0.9, h: 2.6, color: 0x4cc9f0 }
    ];
    for (const t of towers) {
      const towerGeo = new THREE.BoxGeometry(0.9, t.h, 0.9);
      const towerMat = new THREE.MeshPhysicalMaterial({
        color: t.color,
        transmission: 0.7,
        opacity: 0.85,
        transparent: true,
        roughness: 0.1,
        emissive: t.color,
        emissiveIntensity: 0.3
      });
      const tower = new THREE.Mesh(towerGeo, towerMat);
      tower.position.set(t.x, 1.0 + t.h / 2, t.z);
      tower.castShadow = true;
      techGroup.add(tower);
    }
    techGroup.position.copy(this.zonePositions['科技區']);
    this.scene.add(techGroup);
    this.zoneMeshes['科技區'] = techGroup;

    // 5. ⛰️ 山城區 (Y: 4.0) - 陡峭深綠幾何山體
    const mountainGroup = new THREE.Group();
    const mtnGeo = new THREE.ConeGeometry(4.2, 4.0, 7);
    const mtnMat = new THREE.MeshStandardMaterial({
      color: 0x2d6a4f,
      roughness: 0.8,
      flatShading: true
    });
    const mtnMesh = new THREE.Mesh(mtnGeo, mtnMat);
    mtnMesh.castShadow = true;
    mtnMesh.receiveShadow = true;
    mtnMesh.position.y = 2.0;
    mountainGroup.add(mtnMesh);

    // High mountain peak plateau
    const plateauGeo = new THREE.CylinderGeometry(1.6, 2.0, 0.6, 6);
    const plateauMat = new THREE.MeshStandardMaterial({ color: 0x40916c, roughness: 0.7 });
    const plateau = new THREE.Mesh(plateauGeo, plateauMat);
    plateau.position.y = 4.0;
    mountainGroup.add(plateau);

    mountainGroup.position.copy(this.zonePositions['山城區']);
    this.scene.add(mountainGroup);
    this.zoneMeshes['山城區'] = mountainGroup;
  }

  reset() {
    this.sceneGeneration++;
    this.citizenAI?.dispose?.();
    // Rebuild a clean scene including citizens, buses, effects and meshes.
    // Keep the existing renderer and camera; never start a second animation loop.
    const previous = this.scene;
    const disposeMaterial = material => {
      if (Array.isArray(material)) material.forEach(disposeMaterial);
      else if (material) material.dispose?.();
    };
    previous.traverse(obj => {
      obj.geometry?.dispose?.();
      disposeMaterial(obj.material);
    });
    this.wheels = [];
    this.shuttles = [];
    this.markets = [];
    this.inflatables = [];
    this.particles = [];
    this.disasterObjects = [];
    const camera = this.camera;
    const renderer = this.renderer;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x352115);
    this.scene.fog = new THREE.FogExp2(0x352115, 0.018);
    this.camera = camera;
    this.renderer = renderer;
    const ambient = new THREE.AmbientLight(0xfff3e6, 0.75);
    this.scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xfffaed, 1.3);
    sun.position.set(25, 35, 20);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 80;
    Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16 });
    this.scene.add(sun);
    const neon = new THREE.PointLight(0x00f5d4, 1.5, 18);
    neon.position.set(6, 5, 4);
    this.scene.add(neon);
    this.createDioramaBase();
    this.createZones();
    this.citizenAI = new CitizenAI(this);
  }

  /**
   * 上帝之手空投摩天輪 (God-Hand Airdrop)
   */
  spawnWheel(zoneName) {
    const basePos = this.zonePositions[zoneName];
    if (!basePos) return;

    // Count existing wheels in this zone to simulate intentional mesh clipping in Old Town
    const zoneExistingWheels = this.wheels.filter(w => w.zoneName === zoneName).length;
    const offset = new THREE.Vector3(
      zoneExistingWheels * 0.65,
      0,
      zoneExistingWheels * 0.55
    );

    const wheelGroup = new THREE.Group();
    wheelGroup.position.copy(basePos).add(offset);
    wheelGroup.position.y += 22; // Start high for airdrop drop

    // Ferris Wheel Frame
    const ringRadius = 2.4;
    const ringGeo = new THREE.TorusGeometry(ringRadius, 0.12, 8, 32);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xff4d6d,
      roughness: 0.3,
      metalness: 0.4,
      emissive: 0xc9184a,
      emissiveIntensity: 0.2
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.castShadow = true;

    // Spokes
    const spokeCount = 8;
    const spokesGroup = new THREE.Group();
    for (let i = 0; i < spokeCount; i++) {
      const spokeGeo = new THREE.CylinderGeometry(0.04, 0.04, ringRadius * 2, 6);
      const spokeMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const spoke = new THREE.Mesh(spokeGeo, spokeMat);
      spoke.rotation.z = (i / spokeCount) * Math.PI;
      spokesGroup.add(spoke);
    }
    ringMesh.add(spokesGroup);

    // Cabins (Gondolas)
    const cabins = [];
    for (let i = 0; i < spokeCount; i++) {
      const ang = (i / spokeCount) * Math.PI * 2;
      const cabinGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
      const cabinMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0xffb703 : 0x023e8a
      });
      const cabin = new THREE.Mesh(cabinGeo, cabinMat);
      cabin.position.set(Math.cos(ang) * ringRadius, Math.sin(ang) * ringRadius, 0);
      ringMesh.add(cabin);
      cabins.push(cabin);
    }

    // A-frame support tower
    const towerGeo = new THREE.CylinderGeometry(0.1, 0.2, 3.2, 6);
    const towerMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.5 });
    const leg1 = new THREE.Mesh(towerGeo, towerMat);
    leg1.rotation.z = 0.3;
    leg1.position.set(-0.8, -1.3, 0);
    const leg2 = new THREE.Mesh(towerGeo, towerMat);
    leg2.rotation.z = -0.3;
    leg2.position.set(0.8, -1.3, 0);

    const fullAssembly = new THREE.Group();
    fullAssembly.add(ringMesh);
    fullAssembly.add(leg1);
    fullAssembly.add(leg2);
    fullAssembly.position.y = 2.8;

    wheelGroup.add(fullAssembly);
    this.scene.add(wheelGroup);

    // Airdrop drop animation state
    const targetY = basePos.y + (zoneName === '山城區' ? 4.0 : 0.8);
    const dropItem = {
      group: wheelGroup,
      ring: ringMesh,
      cabins: cabins,
      zoneName: zoneName,
      targetY: targetY,
      velY: -0.8,
      landed: false,
      rotationSpeed: 0.015,
      isSeized: false,
      hasRedX: false
    };
    this.wheels.push(dropItem);

    // Red demolition grid wireframe on ground
    const gridGeo = new THREE.RingGeometry(1.0, 3.2, 16);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide,
      wireframe: true
    });
    const grid = new THREE.Mesh(gridGeo, gridMat);
    grid.rotation.x = Math.PI / 2;
    grid.position.copy(basePos).add(offset);
    grid.position.y = targetY + 0.05;
    this.scene.add(grid);
    const scene = this.scene;
    const generation = this.sceneGeneration;
    setTimeout(() => {
      // A reset disposes this grid together with the previous scene.
      if (generation !== this.sceneGeneration) return;
      scene.remove(grid);
      grid.geometry.dispose();
      grid.material.dispose();
    }, 3500);
  }

  /**
   * 長官的紅筆接駁軌道 (Chief's Red Pen)
   */
  buildShuttle(fromZone, toZone) {
    const p1 = this.zonePositions[fromZone].clone();
    const p2 = this.zonePositions[toZone].clone();
    p1.y += (fromZone === '山城區' ? 4.0 : 1.0);
    p2.y += (toZone === '山城區' ? 4.0 : 1.0);

    const isNewtonDrop = ([fromZone, toZone].includes('港灣區') && [fromZone, toZone].includes('山城區'));
    const midPoint = p1.clone().lerp(p2, 0.5);
    midPoint.y = Math.max(p1.y, p2.y) + (isNewtonDrop ? 2.5 : 1.2);

    const curve = new THREE.QuadraticBezierCurve3(p1, midPoint, p2);
    const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.16, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0xe03131, // Chief's Red Pen
      roughness: 0.2,
      metalness: 0.3,
      emissive: 0x961b1b,
      emissiveIntensity: 0.3
    });
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    this.scene.add(tubeMesh);

    // Scaffolding pillars if steep drop to Mountain
    if (isNewtonDrop) {
      for (let t = 0.2; t <= 0.8; t += 0.2) {
        const pt = curve.getPoint(t);
        const pillarGeo = new THREE.CylinderGeometry(0.08, 0.12, pt.y, 6);
        const pillarMat = new THREE.MeshStandardMaterial({ color: 0x666666, wireframe: true });
        const pillar = new THREE.Mesh(pillarGeo, pillarMat);
        pillar.position.set(pt.x, pt.y / 2, pt.z);
        this.scene.add(pillar);
      }
    }

    this.shuttles.push({ tube: tubeMesh, curve: curve });
    if (this.citizenAI) {
      this.citizenAI.spawnBusOnShuttle(curve, isNewtonDrop);
    }
  }

  /**
   * 細胞分裂商圈 (Mitosis Market)
   */
  buildMarket(zoneName) {
    const basePos = this.zonePositions[zoneName];
    if (!basePos) return;

    const marketGroup = new THREE.Group();
    const elevatedY = basePos.y + (zoneName === '山城區' ? 4.0 : 0.8);
    marketGroup.position.set(basePos.x + 1.2, elevatedY, basePos.z + 1.2);

    // Stalls with pink neon tin roof
    for (let i = 0; i < 3; i++) {
      const stallGeo = new THREE.BoxGeometry(0.8, 0.5, 0.6);
      const stallMat = new THREE.MeshStandardMaterial({ color: 0xd9480f });
      const stall = new THREE.Mesh(stallGeo, stallMat);
      stall.position.set(i * 0.7 - 0.7, 0.25, 0);

      // Pink neon roof
      const roofGeo = new THREE.ConeGeometry(0.6, 0.4, 4);
      const roofMat = new THREE.MeshStandardMaterial({
        color: 0xff007f,
        emissive: 0xff007f,
        emissiveIntensity: 0.6
      });
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.rotation.y = Math.PI / 4;
      roof.position.set(i * 0.7 - 0.7, 0.6, 0);

      marketGroup.add(stall);
      marketGroup.add(roof);
    }

    this.scene.add(marketGroup);
    this.markets.push(marketGroup);
    if (this.citizenAI && (zoneName === '舊城區' || Math.random() < 0.5)) {
      this.citizenAI.triggerMarketSlimeMerge(zoneName);
    }
  }

  /**
   * 免洗充氣派對 (Disposable Inflatable Cupid)
   */
  spawnInflatableCupid(zoneName) {
    const basePos = this.zonePositions[zoneName] || this.zonePositions['港灣區'];
    const elevatedY = basePos.y + (zoneName === '山城區' ? 4.0 : 0.8);

    const cupidGroup = new THREE.Group();
    cupidGroup.position.set(basePos.x, elevatedY, basePos.z);
    cupidGroup.scale.set(0.05, 0.05, 0.05); // Rapid inflation animation

    // Pink heart body
    const bodyGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xff758f,
      roughness: 0.2,
      emissive: 0xff4d6d,
      emissiveIntensity: 0.4
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    cupidGroup.add(body);

    // Wings
    const wingGeo = new THREE.BoxGeometry(1.8, 0.4, 0.1);
    const wingMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const wing = new THREE.Mesh(wingGeo, wingMat);
    wing.position.y = 0.5;
    cupidGroup.add(wing);

    this.scene.add(cupidGroup);
    this.inflatables.push({
      group: cupidGroup,
      targetScale: 1.0,
      scaleSpeed: 0.08,
      age: 0
    });
  }

  /**
   * 災難特效：陳情破表大聲公與抗議聲波
   */
  spawnMegaphoneBlast(zoneName = '舊城區') {
    const basePos = this.zonePositions[zoneName];
    const megaphone = new THREE.Mesh(
      new THREE.ConeGeometry(1.5, 3.5, 12),
      new THREE.MeshStandardMaterial({ color: 0xffd000, roughness: 0.3 })
    );
    megaphone.rotation.z = Math.PI / 3;
    megaphone.position.copy(basePos);
    megaphone.position.y += 3.2;
    this.scene.add(megaphone);

    // Shockwave rings
    for (let r = 0; r < 3; r++) {
      const shockGeo = new THREE.RingGeometry(1.5, 1.8, 24);
      const shockMat = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const shock = new THREE.Mesh(shockGeo, shockMat);
      shock.rotation.y = Math.PI / 3;
      shock.position.copy(megaphone.position);
      this.scene.add(shock);
      this.disasterObjects.push({ mesh: shock, grow: true, speed: 0.1 + r * 0.05 });
    }
  }

  /**
   * 災難特效：預算赤字法院查封黃封條
   */
  applyCourtSeizure() {
    this.wheels.forEach(w => {
      if (!w.isSeized) {
        w.isSeized = true;
        const bannerGeo = new THREE.BoxGeometry(3.2, 0.6, 0.2);
        const bannerMat = new THREE.MeshStandardMaterial({
          color: 0xffd000,
          roughness: 0.5,
          emissive: 0x997a00,
          emissiveIntensity: 0.3
        });
        const banner = new THREE.Mesh(bannerGeo, bannerMat);
        banner.position.y = 2.0;
        w.group.add(banner);
      }
    });
  }

  /**
   * 災難特效：摩天輪紅色噴漆 X
   */
  applyRedXGraffiti() {
    this.wheels.forEach(w => {
      if (!w.hasRedX) {
        w.hasRedX = true;
        const x1 = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.3, 0.1), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
        x1.rotation.z = Math.PI / 4;
        const x2 = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.3, 0.1), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
        x2.rotation.z = -Math.PI / 4;
        const xGroup = new THREE.Group();
        xGroup.add(x1);
        xGroup.add(x2);
        xGroup.position.set(0, 2.8, 1.5);
        w.group.add(xGroup);
      }
    });
  }

  triggerVfx(vfxKey) {
    if (vfxKey === 'HIGHLIGHT_ALL_WHEELS' || vfxKey === 'SPONSOR_NEON_WHEEL') {
      this.wheels.forEach(w => {
        w.ring.material.emissive.setHex(0x00f5d4);
        w.ring.material.emissiveIntensity = 0.9;
      });
    } else if (vfxKey === 'MEGAPHONE_BLAST') {
      this.spawnMegaphoneBlast('舊城區');
    } else if (vfxKey === 'SEIZURE_TAPE_WARNING') {
      this.applyCourtSeizure();
    } else if (vfxKey === 'PETITION_RAIN') {
      this.applyRedXGraffiti();
    } else if (vfxKey === 'HEARING_HYPNOSIS_ZZZ' && this.citizenAI) {
      this.citizenAI.triggerPublicHearingSleep();
    }
  }

  bindWindowResize() {
    window.addEventListener('resize', () => {
      // WebGL can fail while the rest of the 2D game remains playable.
      if (!this.canvas || !this.camera || !this.webglSupported || !this.renderer) return;
      const width = Math.max(1, this.canvas.clientWidth || 800);
      const height = Math.max(1, this.canvas.clientHeight || 600);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const delta = this.clock.getDelta();

    // Animate Wheels
    for (const w of this.wheels) {
      if (!w.landed) {
        w.group.position.y += w.velY;
        w.velY -= 0.04; // gravity
        if (w.group.position.y <= w.targetY) {
          w.group.position.y = w.targetY;
          w.landed = true;
          if (this.citizenAI) {
            this.citizenAI.triggerWheelDizziness();
          }
        }
      } else {
        w.ring.rotation.z += w.rotationSpeed;
        // Keep cabins upright
        for (const cabin of w.cabins) {
          cabin.rotation.z = -w.ring.rotation.z;
        }
      }
    }

    // Update Pixel Citizens & Buses
    if (this.citizenAI) {
      this.citizenAI.update(delta);
    }

    // Animate Inflatables
    for (const inf of this.inflatables) {
      if (inf.group.scale.x < inf.targetScale) {
        const next = Math.min(inf.targetScale, inf.group.scale.x + inf.scaleSpeed);
        inf.group.scale.set(next, next, next);
      }
    }

    // Animate Disasters (Shockwaves)
    for (let i = this.disasterObjects.length - 1; i >= 0; i--) {
      const obj = this.disasterObjects[i];
      if (obj.grow) {
        obj.mesh.scale.multiplyScalar(1.03);
        obj.mesh.material.opacity -= 0.01;
        if (obj.mesh.material.opacity <= 0) {
          this.scene.remove(obj.mesh);
          this.disasterObjects.splice(i, 1);
        }
      }
    }

    if (this.webglSupported && this.renderer) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}
