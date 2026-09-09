import * as THREE from "three";

// Theme palettes per katha setting (falls back to Nalanda)
const THEMES = {
    Nalanda: { bg: 0x140d07, fog: 0x241708, ground: 0x4a3421, tile: 0x6b4f2e, pillar: 0x8a4f2a, accent: 0xffb347, wall: 0x3a2a18, skyLight: 0xffe0b0, monument: "stupa" },
    Pataliputra: { bg: 0x0f0c08, fog: 0x1e150a, ground: 0x3d3220, tile: 0x5c4a2e, pillar: 0x9a7440, accent: 0xffcf70, wall: 0x322818, skyLight: 0xffe6c0, monument: "palace" },
    Rajasthan: { bg: 0x160e07, fog: 0x2d1c0c, ground: 0x6b4a26, tile: 0x8a6435, pillar: 0xb08050, accent: 0xffb347, wall: 0x5c3f1e, skyLight: 0xffdca0, monument: "fort" },
    "Tamil Nadu": { bg: 0x0d0b08, fog: 0x191408, ground: 0x35301c, tile: 0x55482a, pillar: 0x7a6a3a, accent: 0xffd070, wall: 0x2c2415, skyLight: 0xfff0c8, monument: "temple" },
    Varanasi: { bg: 0x0b0d0f, fog: 0x14181f, ground: 0x3a3a3a, tile: 0x565450, pillar: 0x8a8272, accent: 0xffc266, wall: 0x2e2c28, skyLight: 0xffe8c8, monument: "ghat" },
};

export function resolveTheme(name) {
    return THEMES[name] || THEMES.Nalanda;
}

function buildMonument(scene, T, at) {
    const g = new THREE.Group();
    g.position.copy(at);
    const mat = new THREE.MeshStandardMaterial({ color: T.pillar, roughness: 0.85 });
    const capMat = new THREE.MeshStandardMaterial({ color: T.accent, roughness: 0.4, metalness: 0.35 });

    if (T.monument === "temple") {
        for (let i = 0; i < 5; i++) {
            const w = 14 - i * 2.2;
            const b = new THREE.Mesh(new THREE.BoxGeometry(w, 3, w), mat);
            b.position.y = 1.5 + i * 3;
            g.add(b);
        }
        const kal = new THREE.Mesh(new THREE.ConeGeometry(1.6, 5, 8), capMat);
        kal.position.y = 17.5;
        g.add(kal);
    } else if (T.monument === "stupa") {
        const base = new THREE.Mesh(new THREE.BoxGeometry(18, 2, 18), mat);
        base.position.y = 1;
        g.add(base);
        const dome = new THREE.Mesh(new THREE.SphereGeometry(7, 20, 16), mat);
        dome.position.y = 7;
        dome.scale.y = 0.85;
        g.add(dome);
        const spire = new THREE.Mesh(new THREE.ConeGeometry(1.2, 6, 8), capMat);
        spire.position.y = 16;
        g.add(spire);
    } else if (T.monument === "fort") {
        for (const sx of [-1, 1]) {
            const t = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 4.2, 16, 10), mat);
            t.position.set(sx * 9, 8, -3);
            g.add(t);
        }
        const wall = new THREE.Mesh(new THREE.BoxGeometry(24, 12, 6), mat);
        wall.position.y = 6;
        g.add(wall);
        for (let i = 0; i < 7; i++) {
            const m = new THREE.Mesh(new THREE.BoxGeometry(2, 1.6, 1), mat);
            m.position.set(-6 + i * 2, 12.8, 0);
            g.add(m);
        }
    } else if (T.monument === "palace") {
        const hall = new THREE.Mesh(new THREE.BoxGeometry(26, 10, 14), mat);
        hall.position.y = 5;
        g.add(hall);
        const roof = new THREE.Mesh(new THREE.ConeGeometry(16, 7, 4), capMat);
        roof.position.y = 13.5;
        roof.rotation.y = Math.PI / 4;
        g.add(roof);
        for (let i = -2; i <= 2; i++) {
            const c = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 10, 8), capMat);
            c.position.set(i * 5.5, 5, 8);
            g.add(c);
        }
    } else {
        // ghat
        for (let s = 0; s < 5; s++) {
            const step = new THREE.Mesh(new THREE.BoxGeometry(30 - s * 3, 1.6, 4), mat);
            step.position.set(0, 0.8 + s * 1.6, s * 3.4);
            g.add(step);
        }
        const lampMat = new THREE.MeshBasicMaterial({ color: 0xffc266 });
        for (let i = 0; i < 10; i++) {
            const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), lampMat);
            lamp.position.set(-12 + i * 2.7, 1.8 + (i % 2) * 1.4, 0.5);
            g.add(lamp);
        }
    }
    scene.add(g);
}

export function buildWorld(scene, settingName) {
    const T = resolveTheme(settingName);
    scene.background = new THREE.Color(T.bg);
    scene.fog = new THREE.FogExp2(T.fog, 0.02);

    scene.add(new THREE.HemisphereLight(T.skyLight, T.ground, 0.9));
    const sun = new THREE.DirectionalLight(0xffd9a0, 1.2);
    sun.position.set(30, 60, 20);
    scene.add(sun);

    // Ground
    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(500, 500),
        new THREE.MeshStandardMaterial({ color: T.ground, roughness: 1 })
    );
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Stone walkway
    const tileMat = new THREE.MeshStandardMaterial({ color: T.tile, roughness: 0.9 });
    for (let z = 20; z > -180; z -= 6) {
        const tile = new THREE.Mesh(new THREE.BoxGeometry(6, 0.15, 5), tileMat);
        tile.position.set(0, 0.08, z);
        scene.add(tile);
    }

    // Flanking pillar rows
    const pillarMat = new THREE.MeshStandardMaterial({ color: T.pillar, roughness: 0.85 });
    const capMat = new THREE.MeshStandardMaterial({ color: T.accent, roughness: 0.5, metalness: 0.3 });
    for (let z = 6; z > -170; z -= 14) {
        for (const x of [-10, 10]) {
            const base = new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 2), pillarMat);
            base.position.set(x, 0.25, z);
            scene.add(base);
            const p = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.7, 9, 10), pillarMat);
            p.position.set(x, 4.5, z);
            scene.add(p);
            const cap = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.6, 1.8), capMat);
            cap.position.set(x, 9.3, z);
            scene.add(cap);
        }
    }

    // Torana arches over the path
    const beamMat = new THREE.MeshStandardMaterial({ color: T.pillar, roughness: 0.8 });
    for (let z = -10; z > -160; z -= 30) {
        const beam = new THREE.Mesh(new THREE.BoxGeometry(22, 1.2, 1.2), beamMat);
        beam.position.set(0, 10.5, z);
        scene.add(beam);
        for (const x of [-10, 10]) {
            const finial = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.55, 1.8, 8), capMat);
            finial.position.set(x, 10.5, z);
            scene.add(finial);
        }
    }

    // Distant city silhouette
    const wallMat = new THREE.MeshStandardMaterial({ color: T.wall, roughness: 1 });
    for (let i = 0; i < 26; i++) {
        const h = 6 + (i % 5) * 3;
        const w = new THREE.Mesh(new THREE.BoxGeometry(6 + (i % 3) * 3, h, 6), wallMat);
        const side = i % 2 ? 1 : -1;
        w.position.set(side * (26 + (i % 4) * 7), h / 2, -i * 8 + 30);
        scene.add(w);
    }

    // Monument finale at the end of the walk
    buildMonument(scene, T, new THREE.Vector3(0, 0, -150));

    // Golden dust motes
    const N = 900;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 160;
        pos[i * 3 + 1] = Math.random() * 22 + 0.5;
        pos[i * 3 + 2] = 20 - Math.random() * 220;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    scene.add(
        new THREE.Points(
            dustGeo,
            new THREE.PointsMaterial({ color: T.accent, size: 0.18, transparent: true, opacity: 0.55 })
        )
    );

    // Floating lanterns
    const lanterns = [];
    const lMat = new THREE.MeshBasicMaterial({ color: T.accent });
    for (let i = 0; i < 34; i++) {
        const l = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 10), lMat);
        const y = 4 + Math.random() * 9;
        l.position.set((Math.random() - 0.5) * 70, y, 15 - Math.random() * 190);
        l.userData = { baseY: y, phase: Math.random() * Math.PI * 2 };
        lanterns.push(l);
        scene.add(l);
    }

    return { lanterns, theme: T };
}

function makeTextTexture(index, text) {
    const c = document.createElement("canvas");
    c.width = 768;
    c.height = 480;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "rgba(12,9,6,0.94)";
    ctx.fillRect(0, 0, 768, 480);
    ctx.strokeStyle = "#c8934a";
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, 748, 460);
    ctx.textAlign = "center";

    ctx.fillStyle = "#c8934a";
    ctx.font = "600 26px Georgia, serif";
    ctx.fillText(`— Katha ${index} —`, 384, 70);

    ctx.fillStyle = "#f0d9a8";
    ctx.font = "28px Georgia, serif";
    const words = text.split(" ");
    const lines = [];
    let line = "";
    for (const w of words) {
        const test = line ? line + " " + w : w;
        if (ctx.measureText(test).width > 640 && line) {
            lines.push(line);
            line = w;
        } else {
            line = test;
        }
    }
    if (line) lines.push(line);
    const shown = lines.slice(0, 9);
    if (lines.length > 9) shown[8] = shown[8] + "…";
    shown.forEach((l, i) => ctx.fillText(l, 384, 130 + i * 38));

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
}

export function buildStoryPanels(scene, paragraphs) {
    const panels = [];
    (paragraphs || []).forEach((text, i) => {
        const tex = makeTextTexture(i + 1, text);
        const panel = new THREE.Mesh(
            new THREE.PlaneGeometry(7, 4.4),
            new THREE.MeshBasicMaterial({ map: tex, transparent: true })
        );
        const z = -8 - i * 9.5;
        const x = (i % 2 === 0 ? -1 : 1) * 3.4;
        panel.position.set(x, 2.9, z);
        panel.rotation.y = (i % 2 === 0 ? 1 : -1) * 0.35;
        scene.add(panel);
        panels.push(panel);
    });
    return panels;
}