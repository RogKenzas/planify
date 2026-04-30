import { useEffect, useRef } from "react";

const vertexShaderSource = `
  attribute vec2 a_position;
  varying vec2 vUv;
  void main() {
    vUv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;
  uniform vec2 iResolution;
  uniform float iTime;
  uniform vec2 iMouse;
  
  #define MAX_STEPS 64
  #define MAX_DIST  11.0
  #define SURF_EPS  0.004

  float hash12(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
  }
  float hash11(float p) {
      p = fract(p * 0.1031);
      p *= p + 33.33;
      p *= p + p;
      return fract(p);
  }

  float sdRoundBox(vec3 p, vec3 b, float r) {
      vec3 q = abs(p) - b;
      return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
  }

  float mapScene(vec3 p, out vec2 cellId)
  {
      cellId = vec2(0.0);

      const float spacing = 1.44;
      const int N = 10;

      // Cube shape parameters
      vec3  halfB  = vec3(0.62, 0.35, 0.62);
      float roundR = 0.10;

      vec2 gridMin = -0.5 * float(N - 1) * spacing * vec2(1.0);

      vec2 g = (p.xz - gridMin) / spacing;

      if (g.x < -0.75 || g.y < -0.75 || g.x > float(N)-0.25 || g.y > float(N)-0.25) {
          return 1e6; 
      }

      vec2 base     = floor(g);
      float dBest   = 1e9;
      vec2 bestCell = base;
      
      // Map normalized mouse to world space roughly above the grid
      vec2 normMouse = iMouse.xy / iResolution.xy;
      vec2 mouseWorldXZ = (normMouse - 0.5) * 14.0 * vec2(-1.0, 1.0);

      for (int j = 0; j <= 1; j++) {
          for (int i = 0; i <= 1; i++) {
              vec2 c = base + vec2(float(i), float(j));
              c = clamp(c, vec2(0.0), vec2(float(N-1)));
              vec2 center = gridMin + c * spacing;

              float h0    = hash12(c + 19.7);
              float phase = 6.2831853 * h0;
              float spd   = mix(0.25, 2.55, hash11(h0 + 2.3));
              float amp   = mix(0.03, 0.38, hash11(h0 + 9.1));
              
              // High-end interaction physics
              float distToMouse = length(center - mouseWorldXZ);
              
              // Hover lift
              float hoverLift = smoothstep(3.5, 0.0, distToMouse) * 1.5;
              
              // Ripple effect emitting from the cursor
              float ripple = sin(iTime * 10.0 - distToMouse * 3.0) * smoothstep(5.0, 0.0, distToMouse) * 0.4;

              float bob = amp * sin(iTime * spd + phase) + hoverLift + ripple;

              vec3 q = p - vec3(center.x, bob, center.y);
              float d = sdRoundBox(q, halfB, roundR);

              if (d < dBest) { dBest = d; bestCell = c; }
          }
      }

      cellId = bestCell;
      return dBest;
  }

  float mapOnly(vec3 p) {
      vec2 cid;
      return mapScene(p, cid);
  }

  float raymarch(vec3 ro, vec3 rd, out vec3 pos, out vec2 cellId) {
      float t = max(0.0, (ro.y - 0.9) / -rd.y); 
      cellId = vec2(0.0);

      for (int i = 0; i < MAX_STEPS; i++) {
          pos = ro + rd * t;

          float d = mapScene(pos, cellId);
          if (d < SURF_EPS) return t;

          t += d * 0.9;
          if (t > MAX_DIST) break;
      }

      return -1.0;
  }

  vec3 calcNormal(vec3 p)
  {
      float e = 0.0012;
      vec3 k1 = vec3( 1, -1, -1);
      vec3 k2 = vec3(-1, -1,  1);
      vec3 k3 = vec3(-1,  1, -1);
      vec3 k4 = vec3( 1,  1,  1);

      return normalize(
          k1 * mapOnly(p + k1*e) +
          k2 * mapOnly(p + k2*e) +
          k3 * mapOnly(p + k3*e) +
          k4 * mapOnly(p + k4*e)
      );
  }

  float softShadow(vec3 ro, vec3 rd, float mint, float maxt, float k) {
      float res = 1.0;
      float t = mint;

      for (int i = 0; i < 15; i++) {
          float h = mapOnly(ro + rd * t);
          if (h < 0.004) return 0.0;
          res = min(res, k * h / max(t, 0.08));
          t += clamp(h, 0.05, 0.45);
          if (t > maxt) break;
      }
      return clamp(res, 0.0, 1.0);
  }

  float calcAO(vec3 p, vec3 n)
  {
      float ao  = 0.0;
      float sca = 1.0;

      for (int i = 0; i < 3; i++) {
          float h = 0.03 + 0.10 * float(i);
          float d = mapOnly(p + n * h);
          ao += (h - d) * sca;
          sca *= 0.55;
      }

      return clamp(1.0 - 2.0 * ao, 0.0, 1.0);
  }

  float fresnelSchlick(float cosTheta, float F0) {
      return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
  }

  float specGGX(float NoH, float a) {
      float a2 = a*a;
      float d  = (NoH*NoH)*(a2-1.0)+1.0;
      return a2 / (3.14159 * d*d);
  }

  vec3 shade(vec3 ro, vec3 rd) {
      vec3 p; vec2 cellId;
      float t = raymarch(ro, rd, p, cellId);

      vec3 envColor = vec3(0.);
      // Support native transparency
      if (t < 0.0) return envColor;

      vec3 n = calcNormal(p);
      vec3 v = normalize(-rd);
      
      // Professional interaction: light source slightly follows cursor
      vec2 normMouse = iMouse.xy / iResolution.xy;
      vec3 l1 = normalize(vec3(-0.75 + (normMouse.x-0.5)*1.5, 0.90, 1.05 + (normMouse.y-0.5)*1.5));

      float ao   = calcAO(p, n);
      float NoL1 = max(dot(n, l1), 0.0);

      vec3  h1   = normalize(l1 + v);
      float NoH1 = max(dot(n, h1), 0.0);

      const float matColor = 0.55;

      float h = hash12(cellId + 3.5);
      // Reduced random color variance for a sleek, uniform, high-end look
      vec3  albedo = vec3(matColor) + ((h - 0.5) * 0.05);

      float rough = 0.22;
      float F0    = 0.26;

      float a = max(0.02, rough*rough);
      vec3 diff = albedo * (0.30 * NoL1);

      float D1 = specGGX(NoH1, a);
      float VoH1 = max(dot(v, h1), 0.0);
      float F1   = fresnelSchlick(VoH1, F0);
      float Vis = 0.55 / (a + 0.20);
      float sh1 = softShadow(p + n*0.006, l1, 0.02, 12.0, 12.0);

      // Add a subtle pure white specular interaction highlight rather than a blurry blue glow
      vec2 center = -0.5 * float(9) * 1.44 * vec2(1.0) + cellId * 1.44;
      vec2 mouseWorldXZ = (normMouse - 0.5) * 14.0 * vec2(-1.0, 1.0);
      float distToMouse = length(center - mouseWorldXZ);
      float specHighlight = smoothstep(3.0, 0.0, distToMouse) * 0.8;

      vec3 spec = (D1 * F1 * Vis) * NoL1 * vec3(1.15 + specHighlight) * sh1;
      vec3 col = (diff + spec) * ao;

      return col;
  }

  mat3 lookAt(vec3 ro, vec3 ta, float roll) {
      vec3 fw = normalize(ta - ro);
      vec3 rt = normalize(cross(fw, vec3(0.0, 1.0, 0.0)));
      vec3 up = cross(rt, fw);

      float cs = cos(roll), sn = sin(roll);
      rt = rt*cs + up*sn;
      up = cross(rt, fw);

      return mat3(rt, up, fw);
  }

  void mainImage(out vec4 fragColor, in vec2 fragCoord)
  {
      vec2 uv = (fragCoord.xy - 0.5*iResolution.xy) / iResolution.y;

      vec2 normMouse = iMouse.xy / iResolution.xy;

      // Camera smoothly rotates and pushes based on mouse
      vec3 ro = vec3(0.6 + (normMouse.x-0.5)*3.0, 3.4 - (normMouse.y-0.5)*1.5, -4.2);
      vec3 ta = vec3(0.0 + (normMouse.x-0.5)*0.5, 0.2, -0.6);

      float tt = iTime * 1.45;
      ro.xz += vec2(sin(tt), cos(tt)) * 0.05 + vec2(1.5, 1.5);
      ta.xz += vec2(sin(tt*1.1), cos(tt*0.9)) * 0.03;

      mat3 cam = lookAt(ro, ta, 0.0);

      float focal = 1.20 + sin(tt * 0.5) * 0.1; 
      vec3 rd = normalize(cam * vec3(uv, focal));

      vec3 col = shade(ro, rd);

      col = col / (col + vec3(1.0));
      col = pow(col, vec3(0.95));

      // Proper compositing with WebGL
      float finalAlpha = max(col.r, max(col.g, col.b));
      finalAlpha = smoothstep(0.0, 0.2, finalAlpha);

      fragColor = vec4(col * finalAlpha, finalAlpha);
  }

  void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
  }
`;

interface SquareWaveProps {
    className?: string;
}

export default function SquareWaveShader({ className }: SquareWaveProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const targetMouseRef = useRef({ x: 0, y: 0 });
    const currentMouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
        if (!gl) {
            console.error("WebGL not supported");
            return;
        }

        const compileShader = (type: number, source: string) => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error("Shader compile err:", gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("Program link err:", gl.getProgramInfoLog(program));
            return;
        }

        gl.useProgram(program);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        const iResolutionLocation = gl.getUniformLocation(program, "iResolution");
        const iTimeLocation = gl.getUniformLocation(program, "iTime");
        const iMouseLocation = gl.getUniformLocation(program, "iMouse");

        const startTime = performance.now();
        let animationFrameId: number;

        const render = () => {
            const displayWidth = canvas.clientWidth;
            const displayHeight = canvas.clientHeight;
            if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
                canvas.width = displayWidth;
                canvas.height = displayHeight;
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            }

            gl.clearColor(0.0, 0.0, 0.0, 0.0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            // Interpolate mouse smoothly for premium feel
            currentMouseRef.current.x += (targetMouseRef.current.x - currentMouseRef.current.x) * 0.05;
            currentMouseRef.current.y += (targetMouseRef.current.y - currentMouseRef.current.y) * 0.05;

            const currentTime = (performance.now() - startTime) / 1000;

            gl.uniform2f(iResolutionLocation, gl.canvas.width, gl.canvas.height);
            gl.uniform1f(iTimeLocation, currentTime);
            gl.uniform2f(iMouseLocation, currentMouseRef.current.x, currentMouseRef.current.y);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            targetMouseRef.current.x = e.clientX - rect.left;
            targetMouseRef.current.y = canvas.height - (e.clientY - rect.top);
        };

        const handleMouseLeave = () => {
            targetMouseRef.current.x = canvas.width / 2;
            targetMouseRef.current.y = canvas.height / 2;
        };

        // Strict listener on canvas only
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseleave", handleMouseLeave);

        // Initialize mouse in center
        targetMouseRef.current.x = canvas.width / 2;
        targetMouseRef.current.y = canvas.height / 2;
        currentMouseRef.current.x = targetMouseRef.current.x;
        currentMouseRef.current.y = targetMouseRef.current.y;

        return () => {
            cancelAnimationFrame(animationFrameId);
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseleave", handleMouseLeave);
            gl.deleteProgram(program);
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
            gl.deleteBuffer(positionBuffer);
        };
    }, []);

    return <canvas ref={canvasRef} className={` w-full h-full block ${className || ""}`} />;
}
