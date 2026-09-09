import * as THREE from "three";

// Nalanda University, 5th century CE — a walkable first-person reconstruction.

export const NALANDA_POINTS = {
    explore: { x: 0, z: 24, yaw: 0 },
    library: { x: 0, z: -26, yaw: 0 },
    scholar: { x: -19.5, z: -16.5, yaw: Math.atan2(-19.5 - -23.6, -16.5 - -17.6) },
    discussion: { x: 24, z: -12, yaw: 0 },
};

function makeMonk(scene, robeMat, skinMat, x, z, seated) {
    const g = new THREE.Group();
    if (seated) {
        const body = new THREE.Mesh(new THREE.ConeGeometry(0.75, 1.3, 10), robeMat);
        body.position.y = 0.65;
        g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 10), skinMat);
        head.position.y = 1.5;
        g.add(head);
    } else {
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.42, 1.6, 10), robeMat);
        body.position.y = 0.8;
        g.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 10), skinMat);
        head.position.y = 1.85;
        g.add(head);
    }
    g.position.set(x, 0, z);
    scene.add(g);
    return g;
}

function makeTree(scene, trunkMat, leafMat, x, z) {
    const g = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.6, 5.2, 8), trunkMat);
    trunk.position.y = 2.6;
    g.add(trunk);
    for (const [ox, oy, oz, r] of [[0, 5.6, 0, 2.6], [1.4, 4.8, 0.8, 1.9], [-1.2, 5.1, -0.7, 2.1]]) {
        const f = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), leafMat);
        f.position.set(ox, oy, oz);
        g.add(f);
    }
    g.position.set(x, 0, z);
    scene.add(g);
}

export function buildNalandaWorld(scene) {
    // Atmosphere — late golden-hour over red brick
    scene.background = new THREE.Color(0x150d06);
    scene.fog = new THREE.FogExp2(0x2a1a0a, 0.016);
    scene.add(new THREE.HemisphereLight(0xffe0b0, 0x4a3421, 1.0));
    const sun = new THREE.DirectionalLight(0xffc98a, 1.3);
    sun.position.set(40, 70, 30);
    scene.add(sun);

    const brick = new THREE.MeshStandardMaterial({ color: 0x9a4425, roughness: 0.9 });
    const brickDark = new THREE.MeshStandardMaterial({ color: 0x7c331c, roughness: 0.95 });
    const stone = new THREE.MeshStandardMaterial({ color: 0xb08d5a, roughness: 0.85 });
    const wood = new THREE.MeshStandardMaterial({ color: 0x5c3a1e, roughness: 0.9 });
    const robe = new THREE.MeshStandardMaterial({ color: 0xc9601a, roughness: 0.8 });
    const skin = new THREE.MeshStandardMaterial({ color: 0xb98a5f, roughness: 0.7 });
    const leaf = new THREE.MeshStandardMaterial({ color: 0x4a6b2f, roughness: 0.9 });
    const dark = new THREE.MeshBasicMaterial({ color: 0x160b04 });
    const scrollMat = new THREE.MeshStandardMaterial({ color: 0xd9b47a, roughness: 0.8 });

    // Ground + central stone path
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), new THREE.MeshStandardMaterial({ color: 0x7a5a33, roughness: 1 }));
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);
    for (let z = 26; z > -33; z -= 3) {
        const tile = new THREE.Mesh(new THREE.BoxGeometry(5, 0.15, 2.6), stone);
        tile.position.set(0, 0.08, z);
        scene.add(tile);
    }

    // ---- Great Stupa (right of the path) ----
    const stupa = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const w = 13 - i * 2.6;
        const tier = new THREE.Mesh(new THREE.BoxGeometry(w, 1.8, w), brick);
        tier.position.y = 0.9 + i * 1.8;
        stupa.add(tier);
        for (let j = 0; j < 4; j++) {
            const ang = (j * Math.PI) / 2;
            const niche = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2, 0.8), stone);
            niche.position.set(Math.sin(ang) * (w / 2 + 0.3), 1.4 + i * 1.8, Math.cos(ang) * (w / 2 + 0.3));
            niche.rotation.y = ang;
            stupa.add(niche);
        }
    }
    const dome = new THREE.Mesh(new THREE.SphereGeometry(3.2, 18, 14), brick);
    dome.position.y = 8.2;
    dome.scale.y = 0.8;
    stupa.add(dome);
    const spire = new THREE.Mesh(new THREE.ConeGeometry(0.9, 4.5, 8), stone);
    spire.position.y = 11.4;
    stupa.add(spire);
    stupa.position.set(8, 0, -6);
    scene.add(stupa);

    // ---- Viharas (monastery blocks) ----
    const vihara = (x, z, dir) => {
        const g = new THREE.Group();
        const main = new THREE.Mesh(new THREE.BoxGeometry(13, 5.5, 12), brick);
        main.position.set(0, 2.75, 0);
        g.add(main);
        const roof = new THREE.Mesh(new THREE.BoxGeometry(14, 0.6, 13), wood);
        roof.position.set(0, 5.8, 0);
        g.add(roof);
        const door = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.4, 1.4), dark);
        door.position.set(dir * 6.6, 1.2, 0);
        g.add(door);
        for (const wz of [-4, -2, 2, 4]) {
            const win = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1, 0.9), dark);
            win.position.set(dir * 6.6, 3.2, wz);
            g.add(win);
        }
        g.position.set(x, 0, z);
        scene.add(g);
    };
    vihara(-16, -6, 1);
    vihara(16, -22, -1);

    // ---- Dharmaganja (the great library, north end) ----
    const lib = new THREE.Group();
    const platform = new THREE.Mesh(new THREE.BoxGeometry(22, 0.6, 16), stone);
    platform.position.set(0, 0.3, 0);
    lib.add(platform);
    for (const cx of [-9, -3, 3, 9]) {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.5, 6.5, 10), brick);
        col.position.set(cx, 3.6, 7.5);
        lib.add(col);
    }
    const roof1 = new THREE.Mesh(new THREE.BoxGeometry(24, 0.8, 18), wood);
    roof1.position.set(0, 7, 0);
    lib.add(roof1);
    const roof2 = new THREE.Mesh(new THREE.BoxGeometry(16, 0.7, 12), wood);
    roof2.position.set(0, 8.5, 0);
    lib.add(roof2);
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(22, 8, 1), brick);
    backWall.position.set(0, 4.2, -8);
    lib.add(backWall);
    for (const sx of [-11, 11]) {
        const side = new THREE.Mesh(new THREE.BoxGeometry(1, 8, 16), brick);
        side.position.set(sx, 4.2, 0);
        lib.add(side);
    }
    for (let row = 0; row < 3; row++) {
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(14, 3.4, 1.1), wood);
        shelf.position.set(0, 2.3, 3.5 - row * 3.4);
        lib.add(shelf);
        for (let i = 0; i < 8; i++) {
            const scroll = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.9, 8), scrollMat);
            scroll.rotation.z = Math.PI / 2;
            scroll.position.set(-6 + i * 1.7, 3.4, 3.5 - row * 3.4);
            lib.add(scroll);
        }
    }
    lib.position.set(0, 0, -41);
    scene.add(lib);

    // ---- Debate courtyard (east) ----
    const court = new THREE.Group();
    const dais = new THREE.Mesh(new THREE.CylinderGeometry(7, 7.4, 0.35, 24), stone);
    dais.position.y = 0.18;
    court.add(dais);
    for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const seat = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.4, 1.3), brickDark);
        seat.position.set(Math.sin(a) * 5.2, 0.45, Math.cos(a) * 5.2);
        seat.rotation.y = a;
        court.add(seat);
    }
    court.position.set(24, 0, -18);
    scene.add(court);
    makeMonk(scene, robe, skin, 24, -18.8, true);
    makeMonk(scene, robe, skin, 24, -17.2, true);
    for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + 0.5;
        makeMonk(scene, robe, skin, 24 + Math.sin(a) * 4.4, -18 + Math.cos(a) * 4.4, true);
    }

    // ---- Elder scholar under the Bodhi tree (west) ----
    makeTree(scene, wood, leaf, -25.4, -19.6);
    makeMonk(scene, robe, skin, -23.4, -17.4, true);

    // ---- Perimeter trees & boundary walls ----
    const TREES = [[-28, 10], [28, 8], [-30, -34], [30, -34], [-12, 12], [12, 14], [-30, -26], [28, -4], [10, -54], [-10, -54], [20, 30], [-20, 30]];
    TREES.forEach(([x, z]) => makeTree(scene, wood, leaf, x, z));
    const wallSpecs = [
        [0, 30, 70, 1], [0, -56, 70, 1], [-35, -13, 1, 88], [35, -13, 1, 88],
    ];
    wallSpecs.forEach(([x, z, w, d]) => {
        const wall = new THREE.Mesh(new THREE.BoxGeometry(w, 4, d), brickDark);
        wall.position.set(x, 2, z);
        scene.add(wall);
    });

    // ---- Banners along the path ----
    const flagMat = new THREE.MeshStandardMaterial({ color: 0xd94f2e, roughness: 0.8, side: THREE.DoubleSide });
    for (let z = 18; z > -30; z -= 6) {
        for (const sx of [-4.2, 4.2]) {
            const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 5.5, 6), wood);
            pole.position.set(sx, 2.75, z);
            scene.add(pole);
            const flag = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.75), flagMat);
            flag.position.set(sx > 0 ? sx - 0.6 : sx + 0.6, 5, z);
            scene.add(flag);
        }
    }

    // ---- Walking monks ----
    const walkers = [
        { x: -2.2, z: 16, speed: 1.4, phase: 0.3 },
        { x: -1.4, z: 4, speed: 1.0, phase: 1.7 },
        { x: 1.2, z: -8, speed: 1.8, phase: 2.9 },
        { x: 2.4, z: 8, speed: 1.2, phase: 4.1 },
        { x: -0.6, z: 0, speed: 1.6, phase: 5.5 },
    ].map((w) => ({ ...w, mesh: makeMonk(scene, robe, skin, w.x, w.z, false) }));

    // ---- Golden dust ----
    const N = 700;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 120;
        pos[i * 3 + 1] = Math.random() * 20 + 0.5;
        pos[i * 3 + 2] = 28 - Math.random() * 100;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xffb347, size: 0.16, transparent: true, opacity: 0.5 })));

    const zones = [
        { id: "stupa", x: 8, z: -6, r: 10, title: "The Great Stupa", text: "Rising tier upon tier, its niches hold images of the Buddha. Pilgrims circle it clockwise, whispering prayers." },
        { id: "viharaA", x: -16, z: -6, r: 9, title: "Vihara — Scholars' Quarters", text: "Rows of tiny cells where monks sleep, study and copy manuscripts by the light of oil lamps." },
        { id: "viharaB", x: 16, z: -22, r: 9, title: "Vihara — Courtyard Monastery", text: "Lessons in grammar and logic ring from these walls at first light." },
        { id: "scholar", x: -24, z: -18, r: 8, title: "The Elder Under the Bodhi Tree", text: "A senior monk sits in the shade, always ready for a seeker's question." },
        { id: "debate", x: 24, z: -18, r: 9, title: "The Debate Courtyard", text: "Here logic is sharpened like a blade — scholars defend their theses before assembled peers." },
        { id: "library", x: 0, z: -41, r: 10, title: "Dharmaganja — The Nine-Storey Library", text: "Shelf upon shelf of palm-leaf manuscripts. It was said the collection took months to survey." },
    ];

    const tick = (t, dt) => {
        for (const w of walkers) {
            w.z -= w.speed * dt;
            if (w.z < -30) w.z = 22;
            w.mesh.position.z = w.z;
            w.mesh.position.y = Math.abs(Math.sin(t * 5 + w.phase)) * 0.06;
        }
    };

    return { tick, zones };
}