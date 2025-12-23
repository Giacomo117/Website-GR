"use client"

import { useEffect, useRef, useState } from "react"

export function ShaderAnimation() {
  const containerRef = useRef(null)
  const [webglFailed, setWebglFailed] = useState(false)
  const sceneRef = useRef({
    camera: null,
    scene: null,
    renderer: null,
    uniforms: null,
    animationId: null,
  })

  useEffect(() => {
    // Load Three.js dynamically
    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/89/three.min.js"
    script.onload = () => {
      if (containerRef.current && window.THREE) {
        initThreeJS()
      }
    }
    document.head.appendChild(script)

    return () => {
      // Cleanup
      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId)
      }
      if (sceneRef.current.renderer) {
        sceneRef.current.renderer.dispose()
      }
      // Only remove script if it exists in the document
      if (script.parentNode) {
        document.head.removeChild(script)
      }
    }
  }, [])

  const initThreeJS = () => {
    if (!containerRef.current || !window.THREE) return

    // Check WebGL support
    const testCanvas = document.createElement('canvas')
    const testGl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')
    if (!testGl) {
      console.warn('WebGL not supported')
      setWebglFailed(true)
      return
    }

    const THREE = window.THREE
    const container = containerRef.current

    // Clear any existing content
    container.innerHTML = ""

    // Initialize camera
    const camera = new THREE.Camera()
    camera.position.z = 1

    // Initialize scene
    const scene = new THREE.Scene()

    // Create geometry
    const geometry = new THREE.PlaneBufferGeometry(2, 2)

    // Define uniforms
    const isMobile = window.innerWidth < 768
    const uniforms = {
      time: { type: "f", value: 1.0 },
      resolution: { type: "v2", value: new THREE.Vector2() },
      yOffset: { type: "f", value: isMobile ? 2.0 : 0.0 },
    }

    // Vertex shader
    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `

    // Fragment shader - use mediump for mobile compatibility
    const fragmentShader = `
      #ifdef GL_ES
      precision mediump float;
      #else
      precision highp float;
      #endif
      
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359
      uniform vec2 resolution;
      uniform float time;
      uniform float yOffset;

      float random (in float x) {
        return fract(sin(x)*10000.0);
      }
      float random2 (vec2 st) {
        return fract(sin(dot(st.xy,
          vec2(12.9898,78.233)))*
          43758.5453123);
      }

      varying vec2 vUv;
      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        uv.y += yOffset;

        vec2 fMosaicScal = vec2(4.0, 2.0);
        vec2 vScreenSize = vec2(256.0, 256.0);
        uv.x = floor(uv.x * vScreenSize.x / fMosaicScal.x) / (vScreenSize.x / fMosaicScal.x);
        uv.y = floor(uv.y * vScreenSize.y / fMosaicScal.y) / (vScreenSize.y / fMosaicScal.y);

        float t = time*0.06+random(uv.x)*0.4;
        float lineWidth = 0.0008;
        vec3 color = vec3(0.0);
        for(int j = 0; j < 3; j++){
          for(int i=0; i < 5; i++){
            float fi = float(i);
            float fj = float(j);
            color[j] += lineWidth*fi*fi / abs(fract(t - 0.01*fj+fi*0.01)*1.0 - length(uv));
          }
        }
        gl_FragColor = vec4(color[2],color[1],color[0],1.0);
      }
    `

    // Create material
    let material
    try {
      material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      })
    } catch (e) {
      console.warn('Shader compilation failed:', e)
      setWebglFailed(true)
      return
    }

    // Create mesh and add to scene
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Initialize renderer with mobile-friendly settings
    const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const pixelRatio = isMobileDevice ? Math.min(window.devicePixelRatio, 2) : window.devicePixelRatio
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: !isMobileDevice,
      powerPreference: 'low-power'
    })
    renderer.setPixelRatio(pixelRatio)
    container.appendChild(renderer.domElement)

    // Store references
    sceneRef.current = {
      camera,
      scene,
      renderer,
      uniforms,
      animationId: null,
    }

    // Handle resize
    const onWindowResize = () => {
      const rect = container.getBoundingClientRect()
      renderer.setSize(rect.width, rect.height)
      uniforms.resolution.value.x = renderer.domElement.width
      uniforms.resolution.value.y = renderer.domElement.height
    }

    onWindowResize()
    window.addEventListener("resize", onWindowResize, false)

    // Animation loop
    const animate = () => {
      sceneRef.current.animationId = requestAnimationFrame(animate)
      uniforms.time.value += 0.05
      renderer.render(scene, camera)
    }

    animate()
  }

  // CSS fallback for when WebGL fails
  if (webglFailed) {
    return (
      <div className="w-full h-full absolute bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/50 via-purple-900/30 to-blue-900/50 animate-pulse" />
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60"
              style={{
                top: `${15 + i * 12}%`,
                left: '-100%',
                right: '-100%',
                animation: `slideRight ${3 + i * 0.5}s linear infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
          {[...Array(8)].map((_, i) => (
            <div
              key={i + 8}
              className="absolute h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-40"
              style={{
                top: `${20 + i * 10}%`,
                left: '-100%',
                right: '-100%',
                animation: `slideLeft ${4 + i * 0.3}s linear infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
        <style jsx>{`
          @keyframes slideRight {
            from { transform: translateX(-50%); }
            to { transform: translateX(50%); }
          }
          @keyframes slideLeft {
            from { transform: translateX(50%); }
            to { transform: translateX(-50%); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full absolute"
    />
  )
}
