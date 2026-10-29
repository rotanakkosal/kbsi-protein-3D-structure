"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Color, Group, Mesh, MeshBasicMaterial, MeshDepthMaterial, OrthographicCamera, PlaneGeometry, ShaderMaterial, WebGLRenderTarget } from "three";
import { HorizontalBlurShader } from "three/examples/jsm/shaders/HorizontalBlurShader.js";
import { VerticalBlurShader } from "three/examples/jsm/shaders/VerticalBlurShader.js";
import { pipelineRuntime } from "./runtime";

interface ContactShadowProps {
  /** Centre of the shadow plane */
  at: [number, number, number];
  /** Width and depth of the plane */
  size: [number, number];
  /** How far above the plane objects still cast a shadow */
  far: number;
  opacity: number;
  color: string;
  blur?: number;
  resolution?: number;
  /** Re-render the shadow every n frames (the scene is drawn once more each time) */
  every?: number;
}

/**
 * A soft contact shadow, after drei's ContactShadows: the scene is drawn from below the plane into
 * a depth texture, blurred, and laid on the plane. To keep it cheap the texture is small and only
 * refreshed every few frames, which is plenty for objects that move slowly.
 */
export function ContactShadow({ at, size, far, opacity, color, blur = 2.4, resolution = 256, every = 3 }: ContactShadowProps) {
  const scene = useThree((s) => s.scene);
  const gl = useThree((s) => s.gl);
  const group = useRef<Group>(null);
  const [w, h] = size;

  const res = useMemo(() => {
    const target = new WebGLRenderTarget(resolution, resolution);
    const blurTarget = new WebGLRenderTarget(resolution, resolution);
    target.texture.generateMipmaps = blurTarget.texture.generateMipmaps = false;
    const plane = new PlaneGeometry(w, h).rotateX(Math.PI / 2);
    const blurPlane = new Mesh(plane);
    const depth = new MeshDepthMaterial();
    depth.depthTest = depth.depthWrite = false;
    depth.onBeforeCompile = (shader) => {
      shader.uniforms.ucolor = { value: new Color(color) };
      shader.fragmentShader = shader.fragmentShader
        .replace("void main() {", "uniform vec3 ucolor;\nvoid main() {")
        // darker where an object is close to the plane
        .replace("vec4( vec3( 1.0 - fragCoordZ ), opacity );", "vec4( ucolor * fragCoordZ * 2.0, 1.0 - fragCoordZ );");
    };
    const hBlur = new ShaderMaterial(HorizontalBlurShader);
    const vBlur = new ShaderMaterial(VerticalBlurShader);
    hBlur.depthTest = vBlur.depthTest = false;
    const camera = new OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0, far);
    const shadowMat = new MeshBasicMaterial({ map: target.texture, transparent: true, opacity, depthWrite: false });
    return { target, blurTarget, plane, blurPlane, depth, hBlur, vBlur, camera, shadowMat };
  }, [w, h, far, color, opacity, resolution]);
  useEffect(
    () => () => {
      const { blurPlane, camera, ...rest } = res;
      void blurPlane;
      void camera;
      Object.values(rest).forEach((r) => r.dispose());
    },
    [res],
  );

  const frame = useRef(0);
  useFrame(() => {
    const g = group.current;
    if (!g) return;
    g.visible = pipelineRuntime.shadows;
    if (!pipelineRuntime.shadows || frame.current++ % every) return;
    const { target, blurTarget, blurPlane, depth, hBlur, vBlur, camera } = res;
    const background = scene.background;
    const override = scene.overrideMaterial;
    g.visible = false;
    scene.background = null;
    scene.overrideMaterial = depth;
    gl.setRenderTarget(target);
    gl.render(scene, camera);
    // one horizontal and one vertical blur pass
    blurPlane.material = hBlur;
    hBlur.uniforms.tDiffuse.value = target.texture;
    hBlur.uniforms.h.value = blur / 256;
    gl.setRenderTarget(blurTarget);
    gl.render(blurPlane, camera);
    blurPlane.material = vBlur;
    vBlur.uniforms.tDiffuse.value = blurTarget.texture;
    vBlur.uniforms.v.value = blur / 256;
    gl.setRenderTarget(target);
    gl.render(blurPlane, camera);
    gl.setRenderTarget(null);
    scene.overrideMaterial = override;
    scene.background = background;
    g.visible = true;
  });

  return (
    <group ref={group} position={at} rotation-x={Math.PI / 2}>
      <mesh geometry={res.plane} material={res.shadowMat} scale={[1, -1, 1]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null} />
      <primitive object={res.camera} />
    </group>
  );
}
