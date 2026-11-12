import * as THREE from '../vendor/three.module.js';

export class CitizenAI {
  constructor(diorama) {
    this.diorama = diorama;
    this.scene = diorama.scene;
    this.citizens = [];
    this.buses = [];
    this.particles = [];
    this.slimes = [];
    this.hearingAsleep = false;
    this.disposed = false;
    this.hearingTimeout = null;

    this.initCitizens();
  }

  initCitizens() {
    // Spawn initial citizens across zones
    const colors = [0x3a86ff, 0xff006e, 0xfb5607, 0xffbe0b, 0x8338ec];
    for (const [zoneName, pos] of Object.entries(this.diorama.zonePositions)) {
      const count = zoneName === '舊城區' ? 12 : 6;
      for (let i = 0; i < count; i++) {
        const cGroup = new THREE.Group();

        // Low-poly humanoid
        const headGeo = new THREE.SphereGeometry(0.12, 8, 8);
        const headMat = new THREE.MeshStandardMaterial({ color: 0xffdbac });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.y = 0.38;

        const bodyGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.28, 6);
        const bodyMat = new THREE.MeshStandardMaterial({
          color: colors[i % colors.length]
        });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.18;

        cGroup.add(head);
        cGroup.add(body);

        const r = Math.random() * 2.2;
        const theta = Math.random() * Math.PI * 2;
        const elev = pos.y + (zoneName === '山城區' ? 4.0 : 0.8);
        cGroup.position.set(pos.x + Math.cos(theta) * r, elev, pos.z + Math.sin(theta) * r);

        this.scene.add(cGroup);
        this.citizens.push({
          group: cGroup,
          head: head,
          body: body,
          zoneName: zoneName,
          basePos: cGroup.position.clone(),
          isDizzy: false,
          isSleeping: false,
          dizzyTimer: 0,
          walkAngle: Math.random() * Math.PI * 2
        });
      }
    }
  }

  /**
   * 1. 極限通勤：80度接駁公車奔馳 + 甩飛出車外掉入海中「啵」一聲復活
   */
  spawnBusOnShuttle(curve, isSteep = false) {
    const busGroup = new THREE.Group();

    // Red double-decker mini bus
    const busBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.4, 0.8),
      new THREE.MeshStandardMaterial({ color: 0xe63946 })
    );
    busBody.position.y = 0.25;
    busGroup.add(busBody);

    // Wheels
    for (const z of [-0.25, 0.25]) {
      for (const x of [-0.28, 0.28]) {
        const w = new THREE.Mesh(
          new THREE.CylinderGeometry(0.09, 0.09, 0.08, 8),
          new THREE.MeshStandardMaterial({ color: 0x111111 })
        );
        w.rotation.z = Math.PI / 2;
        w.position.set(x, 0.09, z);
        busGroup.add(w);
      }
    }

    this.scene.add(busGroup);
    this.buses.push({
      group: busGroup,
      curve: curve,
      progress: 0,
      speed: isSteep ? 0.008 : 0.004,
      isSteep: isSteep
    });
  }

  /**
   * 2. 摩天輪暈眩 Debuff：搭完變成綠色小人吐粒子
   */
  triggerWheelDizziness() {
    this.citizens.slice(0, 8).forEach(c => {
      c.isDizzy = true;
      c.head.material.color.setHex(0x52b788); // Sickness green
      c.body.material.color.setHex(0x2d6a4f);
      c.dizzyTimer = 8.0;
    });
  }

  /**
   * 3. 夜市喪屍史萊姆合體
   */
  triggerMarketSlimeMerge(zoneName = '舊城區') {
    const pos = this.diorama.zonePositions[zoneName];
    if (!pos) return;

    const slimeGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const slimeMat = new THREE.MeshStandardMaterial({
      color: 0x9b5de5,
      roughness: 0.1,
      transparent: true,
      opacity: 0.85
    });
    const slime = new THREE.Mesh(slimeGeo, slimeMat);
    slime.position.set(pos.x + 0.5, pos.y + 1.2, pos.z + 0.5);
    this.scene.add(slime);
    this.slimes.push({ mesh: slime, wobble: 0 });
  }

  /**
   * 4. 公聽會催眠撲街睡覺 (Zzz)
   */
  triggerPublicHearingSleep() {
    if (this.disposed) return;
    if (this.hearingTimeout !== null) clearTimeout(this.hearingTimeout);
    this.hearingAsleep = true;
    this.citizens.forEach(c => {
      c.isSleeping = true;
      c.group.rotation.x = Math.PI / 2; // Collapse flat on ground
      c.group.position.y = c.basePos.y + 0.05;
    });

    this.hearingTimeout = setTimeout(() => {
      this.hearingTimeout = null;
      if (this.disposed) return;
      this.hearingAsleep = false;
      this.citizens.forEach(c => {
        c.isSleeping = false;
        c.group.rotation.x = 0; // Wake up
        c.group.position.y = c.basePos.y;
      });
    }, 10000);
  }

  dispose() {
    this.disposed = true;
    if (this.hearingTimeout !== null) {
      clearTimeout(this.hearingTimeout);
      this.hearingTimeout = null;
    }
    this.citizens.length = 0;
    this.buses.length = 0;
    this.particles.length = 0;
    this.slimes.length = 0;
  }

  update(delta) {
    if (this.disposed) return;
    // Update Buses
    for (let i = this.buses.length - 1; i >= 0; i--) {
      const b = this.buses[i];
      b.progress += b.speed;
      if (b.progress >= 1.0) {
        b.progress = 0;
      }
      const pt = b.curve.getPoint(b.progress);
      const tangent = b.curve.getTangent(b.progress);
      b.group.position.copy(pt);
      b.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);

      // Centrifugal fling off steep tracks
      if (b.isSteep && b.progress > 0.45 && b.progress < 0.55 && Math.random() < 0.04) {
        this.flingCitizenIntoSea(pt);
      }
    }

    // Update Citizens
    for (const c of this.citizens) {
      if (c.isSleeping) continue;

      if (c.isDizzy) {
        c.dizzyTimer -= delta;
        // Drunken zigzag walk
        c.walkAngle += (Math.random() - 0.5) * 0.8;
        c.group.position.x += Math.cos(c.walkAngle) * 0.015;
        c.group.position.z += Math.sin(c.walkAngle) * 0.015;
        c.group.rotation.y = c.walkAngle;

        // Vomit green particles
        if (Math.random() < 0.2) {
          this.spawnVomitParticle(c.group.position);
        }

        if (c.dizzyTimer <= 0) {
          c.isDizzy = false;
          c.head.material.color.setHex(0xffdbac);
        }
      } else {
        // Calm wandering around base area
        const dist = c.group.position.distanceTo(c.basePos);
        if (dist > 1.2) {
          const dir = c.basePos.clone().sub(c.group.position).normalize();
          c.group.position.addScaledVector(dir, 0.008);
        } else {
          c.walkAngle += (Math.random() - 0.5) * 0.3;
          c.group.position.x += Math.cos(c.walkAngle) * 0.005;
          c.group.position.z += Math.sin(c.walkAngle) * 0.005;
        }
      }
    }

    // Update Slimes
    for (const s of this.slimes) {
      s.wobble += delta * 6;
      s.mesh.scale.x = 1.0 + Math.sin(s.wobble) * 0.25;
      s.mesh.scale.y = 1.0 + Math.cos(s.wobble) * 0.2;
      s.mesh.scale.z = 1.0 + Math.sin(s.wobble * 1.2) * 0.25;
    }

    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.mesh.position.add(p.velocity);
      p.life -= delta;
      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        this.particles.splice(i, 1);
      }
    }
  }

  flingCitizenIntoSea(origin) {
    const flingGeo = new THREE.SphereGeometry(0.12, 6, 6);
    const flingMat = new THREE.MeshBasicMaterial({ color: 0xff006e });
    const flinger = new THREE.Mesh(flingGeo, flingMat);
    flinger.position.copy(origin);
    this.scene.add(flinger);

    const seaTarget = this.diorama.zonePositions['港灣區'].clone();
    this.particles.push({
      mesh: flinger,
      velocity: new THREE.Vector3(-0.08, 0.12, -0.06),
      life: 2.5
    });
  }

  spawnVomitParticle(pos) {
    const pGeo = new THREE.BoxGeometry(0.04, 0.04, 0.04);
    const pMat = new THREE.MeshBasicMaterial({ color: 0x70e000 });
    const pMesh = new THREE.Mesh(pGeo, pMat);
    pMesh.position.set(pos.x, pos.y + 0.3, pos.z);
    this.scene.add(pMesh);

    this.particles.push({
      mesh: pMesh,
      velocity: new THREE.Vector3((Math.random() - 0.5) * 0.02, -0.02, (Math.random() - 0.5) * 0.02),
      life: 1.0
    });
  }
}
