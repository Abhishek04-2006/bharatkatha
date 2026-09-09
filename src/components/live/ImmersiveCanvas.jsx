import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import * as THREE from "three";
import { buildWorld, buildStoryPanels } from "@/lib/liveScene";

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const ImmersiveCanvas = forwardRef(function ImmersiveCanvas({ theme, paragraphs, setup, onZone }, ref) {
    const containerRef = useRef(null);
    const apiRef = useRef({});
    const onZoneRef = useRef(onZone);
    onZoneRef.current = onZone;

    useImperativeHandle(ref, () => ({
        setMove: (x, y) => apiRef.current.setMove?.(x, y),
        requestLock: () => apiRef.current.requestLock?.(),
        teleport: (x, z, yaw) => apiRef.current.teleport?.(x, z, yaw),
        enterVR: () => apiRef.current.enterVR?.(),
        snapshot: () => apiRef.current.snapshot?.(),
    }));

    useEffect(() => {
        const container = containerRef.current;
        const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.xr.enabled = true;
        container.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            70,
            container.clientWidth / container.clientHeight,
            0.1,
            600
        );
        camera.rotation.order = "YXZ";
        camera.position.y = 1.7; // realistic eye height
        const player = new THREE.Group();
        player.add(camera);
        player.position.set(0, 0, 14);
        scene.add(player);

        // Custom world (Experience) or default themed katha world (LiveExperience)
        let tick = null;
        let zones = null;
        if (setup) {
            const extras = setup(scene, camera, player);
            tick = extras?.tick || null;
            zones = extras?.zones || null;
        } else {
            const { lanterns } = buildWorld(scene, theme);
            buildStoryPanels(scene, paragraphs);
            tick = (t) => {
                for (const l of lanterns) {
                    l.position.y = l.userData.baseY + Math.sin(t * 0.8 + l.userData.phase) * 0.5;
                }
            };
        }

        // ---- Input state ----
        let keys = {};
        const move = { x: 0, y: 0 };
        let yaw = 0;
        let pitch = 0;
        let dragging = false;
        let lastX = 0;
        let lastY = 0;
        let locked = false;

        const onKeyDown = (e) => { keys[e.key.toLowerCase()] = true; };
        const onKeyUp = (e) => { keys[e.key.toLowerCase()] = false; };
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);

        const el = renderer.domElement;
        const onLockChange = () => { locked = document.pointerLockElement === el; };
        document.addEventListener("pointerlockchange", onLockChange);

        const requestLock = () => {
            try {
                // Browsers throttle re-locking right after an exit (ESC) and reject
                // asynchronously — swallow that rejection to avoid a SecurityError.
                const p = el.requestPointerLock?.();
                if (p && typeof p.catch === "function") p.catch(() => { });
            } catch { /* ignore */ }
        };
        el.addEventListener("click", requestLock);

        const applyLook = (dx, dy) => {
            yaw -= dx;
            pitch = clamp(pitch - dy, -1.25, 1.25);
        };
        const onMouseDown = (e) => { dragging = true; lastX = e.clientX; lastY = e.clientY; };
        const onMouseUp = () => { dragging = false; };
        const onMouseMove = (e) => {
            if (locked) applyLook(e.movementX * 0.0022, e.movementY * 0.0022);
            else if (dragging) {
                applyLook((e.clientX - lastX) * 0.005, (e.clientY - lastY) * 0.005);
                lastX = e.clientX;
                lastY = e.clientY;
            }
        };
        el.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mouseup", onMouseUp);
        window.addEventListener("mousemove", onMouseMove);

        // Touch look (drag anywhere on the canvas)
        let lastTouch = null;
        const onTouchStart = (e) => {
            if (e.touches.length) lastTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        };
        const onTouchMove = (e) => {
            if (!lastTouch || !e.touches.length) return;
            const t = e.touches[0];
            applyLook((t.clientX - lastTouch.x) * 0.005, (t.clientY - lastTouch.y) * 0.005);
            lastTouch = { x: t.clientX, y: t.clientY };
        };
        const onTouchEnd = () => { lastTouch = null; };
        el.addEventListener("touchstart", onTouchStart, { passive: true });
        el.addEventListener("touchmove", onTouchMove, { passive: true });
        el.addEventListener("touchend", onTouchEnd, { passive: true });

        // Resize
        const ro = new ResizeObserver(() => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            renderer.setSize(w, h);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        });
        ro.observe(container);

        // Imperative API for the page
        apiRef.current = {
            setMove: (x, y) => { move.x = x; move.y = y; },
            requestLock,
            teleport: (x, z, targetYaw) => {
                player.position.set(x, 0, z);
                yaw = targetYaw;
                pitch = 0;
            },
            snapshot: () => {
                renderer.render(scene, camera);
                return renderer.domElement.toDataURL("image/png");
            },
            enterVR: async () => {
                try {
                    const session = await navigator.xr.requestSession("immersive-vr", {
                        optionalFeatures: ["local-floor", "bounded-floor", "hand-tracking"],
                    });
                    renderer.xr.setSession(session);
                } catch { /* VR unavailable or refused */ }
            },
        };

        // ---- Render loop ----
        const clock = new THREE.Clock();
        let currentZone = null;
        const up = new THREE.Vector3(0, 1, 0);
        const fwd = new THREE.Vector3();
        const right = new THREE.Vector3();

        renderer.setAnimationLoop(() => {
            const dt = Math.min(clock.getDelta(), 0.05);
            const t = clock.elapsedTime;

            camera.rotation.set(pitch, yaw, 0);

            let ix = (keys["d"] || keys["arrowright"] ? 1 : 0) - (keys["a"] || keys["arrowleft"] ? 1 : 0) + move.x;
            let iz = (keys["w"] || keys["arrowup"] ? 1 : 0) - (keys["s"] || keys["arrowdown"] ? 1 : 0) - move.y;

            if (renderer.xr.isPresenting) {
                const session = renderer.xr.getSession();
                for (const source of session.inputSources) {
                    const gp = source.gamepad;
                    if (gp && gp.axes.length >= 4) {
                        ix += gp.axes[2];
                        iz -= gp.axes[3];
                    }
                }
            }
            ix = clamp(ix, -1, 1);
            iz = clamp(iz, -1, 1);

            if (ix !== 0 || iz !== 0) {
                if (renderer.xr.isPresenting) {
                    renderer.xr.getCamera().getWorldDirection(fwd);
                    fwd.y = 0;
                    fwd.normalize();
                    right.crossVectors(fwd, up).normalize();
                } else {
                    fwd.set(-Math.sin(yaw), 0, -Math.cos(yaw));
                    right.set(Math.cos(yaw), 0, -Math.sin(yaw));
                }
                const speed = 6;
                player.position.addScaledVector(fwd, iz * speed * dt);
                player.position.addScaledVector(right, ix * speed * dt);
                player.position.x = clamp(player.position.x, -55, 55);
                player.position.z = clamp(player.position.z, -140, 40);
            }

            tick?.(t, dt);

            if (zones) {
                let hit = null;
                for (const z of zones) {
                    const dx = player.position.x - z.x;
                    const dz = player.position.z - z.z;
                    if (dx * dx + dz * dz < z.r * z.r) {
                        hit = z;
                        break;
                    }
                }
                if (hit !== currentZone) {
                    currentZone = hit;
                    onZoneRef.current?.(hit);
                }
            }

            renderer.render(scene, camera);
        });

        return () => {
            renderer.setAnimationLoop(null);
            ro.disconnect();
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
            window.removeEventListener("mouseup", onMouseUp);
            window.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("pointerlockchange", onLockChange);
            el.removeEventListener("click", requestLock);
            el.removeEventListener("mousedown", onMouseDown);
            el.removeEventListener("touchstart", onTouchStart);
            el.removeEventListener("touchmove", onTouchMove);
            el.removeEventListener("touchend", onTouchEnd);
            el.remove();
            renderer.dispose();
        };
    }, [theme, paragraphs, setup]);

    return <div ref={containerRef} className="absolute inset-0" />;
});

export default ImmersiveCanvas;