
"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Props {
  modelUrl?: string;
  fallbackColor?: string;
  fallbackMessage?: string;
  className?: string;
}

export default function ModelViewer3D({ modelUrl, fallbackColor = "#8b7355", fallbackMessage, className }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 4);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // Lighting — dramatic souls-style
    const ambientLight = new THREE.AmbientLight(0x1a1008, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xc9a961, 2.5);
    keyLight.position.set(2, 4, 2);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x3a2a10, 1.2);
    rimLight.position.set(-3, 2, -2);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0x8b4513, 0.6, 8);
    fillLight.position.set(0, -1, 2);
    scene.add(fillLight);

    // Placeholder geometry (shown when no model URL is provided)
    const group = new THREE.Group();

    if (!modelUrl) {
      // Humanoid placeholder silhouette
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(fallbackColor),
        roughness: 0.8,
        metalness: 0.4,
        emissive: new THREE.Color(0x2a1a05),
        emissiveIntensity: 0.3,
      });

      // Body
      const bodyGeo = new THREE.CapsuleGeometry(0.28, 0.7, 8, 16);
      const body = new THREE.Mesh(bodyGeo, mat);
      body.position.y = 0.6;
      body.castShadow = true;
      group.add(body);

      // Head
      const headGeo = new THREE.SphereGeometry(0.22, 16, 16);
      const head = new THREE.Mesh(headGeo, mat);
      head.position.y = 1.45;
      head.castShadow = true;
      group.add(head);

      // Left arm
      const armGeo = new THREE.CapsuleGeometry(0.09, 0.55, 6, 12);
      const leftArm = new THREE.Mesh(armGeo, mat);
      leftArm.position.set(-0.42, 0.65, 0);
      leftArm.rotation.z = 0.3;
      leftArm.castShadow = true;
      group.add(leftArm);

      // Right arm
      const rightArm = new THREE.Mesh(armGeo, mat);
      rightArm.position.set(0.42, 0.65, 0);
      rightArm.rotation.z = -0.3;
      rightArm.castShadow = true;
      group.add(rightArm);

      // Left leg
      const legGeo = new THREE.CapsuleGeometry(0.11, 0.6, 6, 12);
      const leftLeg = new THREE.Mesh(legGeo, mat);
      leftLeg.position.set(-0.18, -0.1, 0);
      leftLeg.castShadow = true;
      group.add(leftLeg);

      // Right leg
      const rightLeg = new THREE.Mesh(legGeo, mat);
      rightLeg.position.set(0.18, -0.1, 0);
      rightLeg.castShadow = true;
      group.add(rightLeg);

      // Ground shadow disc
      const discGeo = new THREE.CircleGeometry(0.5, 32);
      const discMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.4,
      });
      const disc = new THREE.Mesh(discGeo, discMat);
      disc.rotation.x = -Math.PI / 2;
      disc.position.y = -0.72;
      group.add(disc);

      // Rune ring on ground
      const ringGeo = new THREE.RingGeometry(0.55, 0.6, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(fallbackColor),
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = -0.71;
      group.add(ring);
    }

    scene.add(group);

    // Mouse orbit controls (manual)
    let isDragging = false;
    let prevMouseX = 0;
    let rotationY = 0;
    let targetRotationY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const delta = e.clientX - prevMouseX;
      targetRotationY += delta * 0.01;
      prevMouseX = e.clientX;
    };
    const onMouseUp = () => { isDragging = false; };

    const onTouchStart = (e: TouchEvent) => {
      isDragging = true;
      prevMouseX = e.touches[0]?.clientX ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const delta = (e.touches[0]?.clientX ?? 0) - prevMouseX;
      targetRotationY += delta * 0.01;
      prevMouseX = e.touches[0]?.clientX ?? 0;
    };

    mount.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    mount.addEventListener("touchstart", onTouchStart);
    mount.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onMouseUp);

    // Animate
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isDragging) {
        targetRotationY += 0.004;
      }
      rotationY += (targetRotationY - rotationY) * 0.08;
      group.rotation.y = rotationY;
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      mount.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      mount.removeEventListener("touchstart", onTouchStart);
      mount.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onMouseUp);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [modelUrl, fallbackColor]);

  return (
    <div className={`relative w-full h-full ${className ?? ""}`}>
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      {/* Overlay label */}
      <div className="absolute bottom-3 left-0 right-0 flex flex-col items-center gap-1 pointer-events-none">
        {!modelUrl && (
          <span className="text-xs souls-title tracking-widest text-[oklch(0.72_0.08_75/60%)]">
            {fallbackMessage ?? "3D Model Placeholder"}
          </span>
        )}
        <span className="text-xs souls-text text-[oklch(0.35_0.01_60)]">
          Drag to rotate
        </span>
      </div>
    </div>
  );
}
