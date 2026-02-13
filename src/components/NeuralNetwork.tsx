"use client";

import { useEffect, useRef } from "react";

export default function NeuralNetwork() {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<any>(null);
    const isVisibleRef = useRef(true);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let animationId: number;
        let scene: any, camera: any, renderer: any;
        let nodes: any[] = [];
        let lines: any[] = [];
        let mouseX = 0;
        let mouseY = 0;

        const init = async () => {
            const THREE = await import("three");

            const width = container.clientWidth;
            const height = container.clientHeight;

            // Scene
            scene = new THREE.Scene();

            // Camera
            camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
            camera.position.z = 30;

            // Renderer
            renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true,
            });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setClearColor(0x000000, 0);
            container.appendChild(renderer.domElement);
            rendererRef.current = renderer;

            // Create nodes
            const nodeCount = 60;
            const nodeMaterial = new THREE.MeshBasicMaterial({
                color: 0xff4d00,
                transparent: true,
                opacity: 0.6,
            });

            for (let i = 0; i < nodeCount; i++) {
                const size = 0.08 + Math.random() * 0.15;
                const geometry = new THREE.SphereGeometry(size, 8, 8);
                const mesh = new THREE.Mesh(geometry, nodeMaterial.clone());

                mesh.position.set(
                    (Math.random() - 0.5) * 40,
                    (Math.random() - 0.5) * 25,
                    (Math.random() - 0.5) * 15
                );

                (mesh as any).velocity = {
                    x: (Math.random() - 0.5) * 0.005,
                    y: (Math.random() - 0.5) * 0.005,
                    z: (Math.random() - 0.5) * 0.002,
                };

                (mesh as any).baseOpacity = 0.3 + Math.random() * 0.5;
                (mesh as any).pulseSpeed = 0.5 + Math.random() * 1.5;
                (mesh as any).pulseOffset = Math.random() * Math.PI * 2;

                scene.add(mesh);
                nodes.push(mesh);
            }

            // Create connections
            const linesMaterial = new THREE.LineBasicMaterial({
                color: 0xff4d00,
                transparent: true,
                opacity: 0.08,
            });

            const connectionThreshold = 12;

            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dist = nodes[i].position.distanceTo(nodes[j].position);
                    if (dist < connectionThreshold && Math.random() > 0.6) {
                        const geometry = new THREE.BufferGeometry().setFromPoints([
                            nodes[i].position,
                            nodes[j].position,
                        ]);
                        const line = new THREE.Line(geometry, linesMaterial.clone());
                        (line as any).nodeA = i;
                        (line as any).nodeB = j;
                        scene.add(line);
                        lines.push(line);
                    }
                }
            }

            // Mouse handler
            const handleMouseMove = (e: MouseEvent) => {
                const rect = container.getBoundingClientRect();
                mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
                mouseY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
            };

            container.addEventListener("mousemove", handleMouseMove);

            // IntersectionObserver - pause when not visible
            const observer = new IntersectionObserver(
                ([entry]) => {
                    isVisibleRef.current = entry.isIntersecting;
                },
                { threshold: 0.1 }
            );
            observer.observe(container);

            // Handle resize
            const handleResize = () => {
                const w = container.clientWidth;
                const h = container.clientHeight;
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                renderer.setSize(w, h);
            };
            window.addEventListener("resize", handleResize);

            // Animate
            const clock = new THREE.Clock();
            const animate = () => {
                animationId = requestAnimationFrame(animate);

                if (!isVisibleRef.current) return;

                const time = clock.getElapsedTime();

                // Update nodes
                for (const node of nodes) {
                    // Gentle drift
                    node.position.x += node.velocity.x;
                    node.position.y += node.velocity.y;
                    node.position.z += node.velocity.z;

                    // Pulse opacity
                    const pulse = Math.sin(time * node.pulseSpeed + node.pulseOffset);
                    node.material.opacity = node.baseOpacity * (0.7 + pulse * 0.3);

                    // Mouse parallax
                    node.position.x += mouseX * 0.003;
                    node.position.y += mouseY * 0.003;

                    // Wrap around
                    if (node.position.x > 22) node.position.x = -22;
                    if (node.position.x < -22) node.position.x = 22;
                    if (node.position.y > 14) node.position.y = -14;
                    if (node.position.y < -14) node.position.y = 14;
                }

                // Update lines
                for (const line of lines) {
                    const posArray = line.geometry.attributes.position.array;
                    const a = nodes[line.nodeA];
                    const b = nodes[line.nodeB];

                    posArray[0] = a.position.x;
                    posArray[1] = a.position.y;
                    posArray[2] = a.position.z;
                    posArray[3] = b.position.x;
                    posArray[4] = b.position.y;
                    posArray[5] = b.position.z;

                    line.geometry.attributes.position.needsUpdate = true;

                    // Fade lines based on distance
                    const dist = a.position.distanceTo(b.position);
                    line.material.opacity = Math.max(0, 0.12 - dist * 0.008);
                }

                // Gentle camera movement
                camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.02;
                camera.position.y += (mouseY * 1.0 - camera.position.y) * 0.02;
                camera.lookAt(0, 0, 0);

                renderer.render(scene, camera);
            };

            animate();

            return () => {
                container.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("resize", handleResize);
                observer.disconnect();
                cancelAnimationFrame(animationId);
                renderer.dispose();
                if (container.contains(renderer.domElement)) {
                    container.removeChild(renderer.domElement);
                }
            };
        };

        // Only init on desktop or powerful devices
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        let cleanup: (() => void) | undefined;

        if (!prefersReducedMotion) {
            init().then((c) => {
                cleanup = c;
            });
        }

        return () => {
            if (cleanup) cleanup();
            if (animationId) cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-0"
            style={{ pointerEvents: "auto" }}
        />
    );
}
