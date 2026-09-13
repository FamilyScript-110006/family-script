// components/transition/PageTransitionCanvas.tsx
//
// Ported near-verbatim from the deleted homepage ripple system
// (git show 74e1eb5:src/app/components/homepage/ripple/RippleCanvas.tsx).
// This component only ever deals with a pair of GL textures — it has
// zero coupling to how those textures were produced, so the WebGL
// plumbing here is unchanged from the original. Only the imports and
// the addition of onReady/onError (so the page-transition click
// interceptor can gate itself on WebGL availability) are new.

"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

import {
  RIPPLE_FRAGMENT_SHADER,
  RIPPLE_VERTEX_SHADER,
} from "./PageTransitionShader";

import {
  createRippleTexture,
  disposeTexture,
  uploadFramePair,
  type TransitionFramePair,
} from "./PageTransitionCapture";

/* ============================================================
   TYPES
============================================================ */

export interface PageTransitionOptions {
  originX?: number;
  originY?: number;
  strength?: number;
  duration?: number;
}

export interface PageTransitionCanvasHandle {
  renderTransition: (
    pair: TransitionFramePair,
    options?: PageTransitionOptions,
  ) => Promise<void>;

  cancelTransition: () => void;
}

export interface PageTransitionCanvasProps {
  onReady?: () => void;
  onError?: () => void;
}

/* ============================================================
   CONSTANTS
============================================================ */

const DEFAULT_DURATION = 1250;

// Exported so PageTransitionCapture.ts can capture screenshots at the
// same resolution this canvas's own drawing buffer uses — otherwise
// a high-DPI canvas ends up displaying a lower-resolution texture,
// which the GPU has to upscale (visibly blurry, especially once the
// ripple shader starts resampling it at shifting UV offsets).
export const MAX_PIXEL_RATIO = 2;

/* ============================================================
   EASING
============================================================ */

function easeInOutCubic(
  value: number,
) {
  const t =
    Math.max(
      0,
      Math.min(
        1,
        value,
      ),
    );

  return t < 0.5
    ? 4 *
        t *
        t *
        t
    : 1 -
        Math.pow(
          -2 * t + 2,
          3,
        ) /
          2;
}

/* ============================================================
   SHADER HELPERS
============================================================ */

function createShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
) {
  const shader =
    gl.createShader(
      type,
    );

  if (!shader) {
    throw new Error(
      "Unable to create WebGL shader.",
    );
  }

  gl.shaderSource(
    shader,
    source,
  );

  gl.compileShader(
    shader,
  );

  if (
    !gl.getShaderParameter(
      shader,
      gl.COMPILE_STATUS,
    )
  ) {
    const error =
      gl.getShaderInfoLog(
        shader,
      );

    gl.deleteShader(
      shader,
    );

    throw new Error(
      `Ripple shader error: ${error}`,
    );
  }

  return shader;
}

function createProgram(
  gl: WebGL2RenderingContext,
) {
  const vertexShader =
    createShader(
      gl,
      gl.VERTEX_SHADER,
      RIPPLE_VERTEX_SHADER,
    );

  const fragmentShader =
    createShader(
      gl,
      gl.FRAGMENT_SHADER,
      RIPPLE_FRAGMENT_SHADER,
    );

  const program =
    gl.createProgram();

  if (!program) {
    throw new Error(
      "Unable to create WebGL program.",
    );
  }

  gl.attachShader(
    program,
    vertexShader,
  );

  gl.attachShader(
    program,
    fragmentShader,
  );

  gl.linkProgram(
    program,
  );

  gl.deleteShader(
    vertexShader,
  );

  gl.deleteShader(
    fragmentShader,
  );

  if (
    !gl.getProgramParameter(
      program,
      gl.LINK_STATUS,
    )
  ) {
    const error =
      gl.getProgramInfoLog(
        program,
      );

    gl.deleteProgram(
      program,
    );

    throw new Error(
      `Ripple program error: ${error}`,
    );
  }

  return program;
}

/* ============================================================
   CANVAS
============================================================ */

const PageTransitionCanvas =
  forwardRef<
    PageTransitionCanvasHandle,
    PageTransitionCanvasProps
  >(function PageTransitionCanvas(
    { onReady, onError },
    ref,
  ) {
    const canvasRef =
      useRef<HTMLCanvasElement | null>(
        null,
      );

    const glRef =
      useRef<WebGL2RenderingContext | null>(
        null,
      );

    const programRef =
      useRef<WebGLProgram | null>(
        null,
      );

    const vaoRef =
      useRef<WebGLVertexArrayObject | null>(
        null,
      );

    const beforeTextureRef =
      useRef<WebGLTexture | null>(
        null,
      );

    const afterTextureRef =
      useRef<WebGLTexture | null>(
        null,
      );

    const animationFrameRef =
      useRef<number | null>(
        null,
      );

    const transitionIdRef =
      useRef(0);

    const initializedRef =
      useRef(false);

    /* ==========================================================
       UNIFORMS
    ========================================================== */

    const uniformsRef =
      useRef<{
        before: WebGLUniformLocation | null;
        after: WebGLUniformLocation | null;
        resolution: WebGLUniformLocation | null;
        progress: WebGLUniformLocation | null;
        origin: WebGLUniformLocation | null;
        strength: WebGLUniformLocation | null;
        time: WebGLUniformLocation | null;
      } | null>(
        null,
      );

    /* ==========================================================
       RESIZE
    ========================================================== */

    const resizeCanvas =
      useCallback(() => {
        const canvas =
          canvasRef.current;

        const gl =
          glRef.current;

        if (
          !canvas ||
          !gl
        ) {
          return;
        }

        const pixelRatio =
          Math.min(
            window.devicePixelRatio ||
              1,
            MAX_PIXEL_RATIO,
          );

        const width =
          Math.max(
            1,
            Math.round(
              window.innerWidth *
                pixelRatio,
            ),
          );

        const height =
          Math.max(
            1,
            Math.round(
              window.innerHeight *
                pixelRatio,
            ),
          );

        if (
          canvas.width !==
            width ||
          canvas.height !==
            height
        ) {
          canvas.width =
            width;

          canvas.height =
            height;

          /*
           * Fixed px, not "100vw"/"100vh" — vw/vh units track the
           * LIVE viewport continuously via pure CSS, independent of
           * this function ever running again. If the viewport resizes
           * while a transition is mid-animation (resizeCanvas is
           * deliberately skipped during that window — see
           * handleResize below), a vw/vh-sized box would still
           * silently stretch its now-mismatched buffer to fit the new
           * size. Pixel sizing pins the box to exactly what the
           * buffer was captured for, immune to viewport changes until
           * the next explicit resize.
           */

          canvas.style.width =
            `${window.innerWidth}px`;

          canvas.style.height =
            `${window.innerHeight}px`;
        }

        gl.viewport(
          0,
          0,
          width,
          height,
        );
      }, []);

    /* ==========================================================
       INITIALIZE WEBGL
    ========================================================== */

    useEffect(() => {
      const canvas =
        canvasRef.current;

      if (!canvas) {
        return;
      }

      const gl =
        canvas.getContext(
          "webgl2",
          {
            alpha: true,
            antialias: true,
            premultipliedAlpha:
              false,
            preserveDrawingBuffer:
              false,
            powerPreference:
              "high-performance",
          },
        );

      if (!gl) {
        console.error(
          "WebGL2 is not available.",
        );

        onError?.();

        return;
      }

      glRef.current =
        gl;

      try {
        const program =
          createProgram(
            gl,
          );

        programRef.current =
          program;

        const vao =
          gl.createVertexArray();

        if (!vao) {
          throw new Error(
            "Unable to create ripple VAO.",
          );
        }

        vaoRef.current =
          vao;

        gl.bindVertexArray(
          vao,
        );

        /*
         * Full-screen triangle.
         *
         * No vertex buffer is required because the vertex shader
         * uses gl_VertexID.
         */

        gl.bindVertexArray(
          null,
        );

        uniformsRef.current = {
          before:
            gl.getUniformLocation(
              program,
              "u_before",
            ),

          after:
            gl.getUniformLocation(
              program,
              "u_after",
            ),

          resolution:
            gl.getUniformLocation(
              program,
              "u_resolution",
            ),

          progress:
            gl.getUniformLocation(
              program,
              "u_progress",
            ),

          origin:
            gl.getUniformLocation(
              program,
              "u_origin",
            ),

          strength:
            gl.getUniformLocation(
              program,
              "u_strength",
            ),

          time:
            gl.getUniformLocation(
              program,
              "u_time",
            ),
        };

        beforeTextureRef.current =
          createRippleTexture(
            gl,
          );

        afterTextureRef.current =
          createRippleTexture(
            gl,
          );

        gl.useProgram(
          program,
        );

        /*
         * Texture units remain constant for the entire lifetime
         * of the canvas.
         */

        const uniforms =
          uniformsRef.current;

        if (
          uniforms.before
        ) {
          gl.uniform1i(
            uniforms.before,
            0,
          );
        }

        if (
          uniforms.after
        ) {
          gl.uniform1i(
            uniforms.after,
            1,
          );
        }

        /*
         * Completely transparent initial frame.
         *
         * This is important: there is no black canvas flash.
         */

        gl.clearColor(
          0,
          0,
          0,
          0,
        );

        gl.clear(
          gl.COLOR_BUFFER_BIT,
        );

        initializedRef.current =
          true;

        resizeCanvas();

        onReady?.();
      } catch (error) {
        console.error(
          error,
        );

        onError?.();
      }

      const handleResize =
        () => {
          // Skip resizing while a transition is actively animating.
          // The uploaded before/after textures are fixed-size
          // screenshots — if the canvas's own dimensions (and the
          // u_resolution uniform used for aspect-correction) change
          // mid-animation, the still-static texture content no longer
          // matches, which reads as a sudden stretch/zoom. This
          // commonly happens when navigating between pages of very
          // different heights (the vertical scrollbar appearing or
          // disappearing changes window.innerWidth). The next
          // renderTransition() call always resizes before uploading
          // new textures, so any pending size change is picked up
          // then instead.
          if (
            animationFrameRef.current !==
            null
          ) {
            return;
          }

          resizeCanvas();
        };

      window.addEventListener(
        "resize",
        handleResize,
      );

      return () => {
        window.removeEventListener(
          "resize",
          handleResize,
        );

        if (
          animationFrameRef.current !==
          null
        ) {
          cancelAnimationFrame(
            animationFrameRef.current,
          );
        }

        animationFrameRef.current =
          null;

        transitionIdRef.current++;

        if (
          beforeTextureRef.current
        ) {
          disposeTexture(
            gl,
            beforeTextureRef.current,
          );
        }

        if (
          afterTextureRef.current
        ) {
          disposeTexture(
            gl,
            afterTextureRef.current,
          );
        }

        if (
          vaoRef.current
        ) {
          gl.deleteVertexArray(
            vaoRef.current,
          );
        }

        if (
          programRef.current
        ) {
          gl.deleteProgram(
            programRef.current,
          );
        }

        beforeTextureRef.current =
          null;

        afterTextureRef.current =
          null;

        vaoRef.current =
          null;

        programRef.current =
          null;

        glRef.current =
          null;

        initializedRef.current =
          false;
      };
    }, [
      resizeCanvas,
      onReady,
      onError,
    ]);

    /* ==========================================================
       RENDER FRAME
    ========================================================== */

    const renderFrame =
      useCallback(
        (
          progress: number,
          originX: number,
          originY: number,
          strength: number,
          time: number,
        ) => {
          const canvas =
            canvasRef.current;

          const gl =
            glRef.current;

          const program =
            programRef.current;

          const vao =
            vaoRef.current;

          const beforeTexture =
            beforeTextureRef.current;

          const afterTexture =
            afterTextureRef.current;

          const uniforms =
            uniformsRef.current;

          if (
            !canvas ||
            !gl ||
            !program ||
            !vao ||
            !beforeTexture ||
            !afterTexture ||
            !uniforms
          ) {
            return;
          }

          gl.viewport(
            0,
            0,
            canvas.width,
            canvas.height,
          );

          gl.clearColor(
            0,
            0,
            0,
            0,
          );

          gl.clear(
            gl.COLOR_BUFFER_BIT,
          );

          gl.useProgram(
            program,
          );

          gl.bindVertexArray(
            vao,
          );

          /*
           * Texture 0 = current section.
           */

          gl.activeTexture(
            gl.TEXTURE0,
          );

          gl.bindTexture(
            gl.TEXTURE_2D,
            beforeTexture,
          );

          /*
           * Texture 1 = incoming grayscale section.
           */

          gl.activeTexture(
            gl.TEXTURE1,
          );

          gl.bindTexture(
            gl.TEXTURE_2D,
            afterTexture,
          );

          if (
            uniforms.resolution
          ) {
            gl.uniform2f(
              uniforms.resolution,
              canvas.width,
              canvas.height,
            );
          }

          if (
            uniforms.progress
          ) {
            gl.uniform1f(
              uniforms.progress,
              progress,
            );
          }

          if (
            uniforms.origin
          ) {
            gl.uniform2f(
              uniforms.origin,
              originX,
              originY,
            );
          }

          if (
            uniforms.strength
          ) {
            gl.uniform1f(
              uniforms.strength,
              strength,
            );
          }

          if (
            uniforms.time
          ) {
            gl.uniform1f(
              uniforms.time,
              time,
            );
          }

          gl.drawArrays(
            gl.TRIANGLES,
            0,
            3,
          );

          gl.bindVertexArray(
            null,
          );
        },
        [],
      );

    /* ==========================================================
       RENDER TRANSITION
    ========================================================== */

    const renderTransition =
      useCallback(
        (
          pair: TransitionFramePair,
          options: PageTransitionOptions = {},
        ) => {
          const canvas =
            canvasRef.current;

          const gl =
            glRef.current;

          const beforeTexture =
            beforeTextureRef.current;

          const afterTexture =
            afterTextureRef.current;

          if (
            !canvas ||
            !gl ||
            !beforeTexture ||
            !afterTexture ||
            !initializedRef.current
          ) {
            return Promise.resolve();
          }

          const duration =
            Math.max(
              500,
              options.duration ??
                DEFAULT_DURATION,
            );

          const originX =
            options.originX ??
            0.5;

          const originY =
            options.originY ??
            1;

          const strength =
            options.strength ??
            1.05;

          /*
           * Cancel previous animation.
           */

          transitionIdRef.current++;

          const transitionId =
            transitionIdRef.current;

          if (
            animationFrameRef.current !==
            null
          ) {
            cancelAnimationFrame(
              animationFrameRef.current,
            );

            animationFrameRef.current =
              null;
          }

          /*
           * Resize BEFORE uploading textures.
           */

          resizeCanvas();

          /*
           * Upload exactly once.
           *
           * renderFrame never uploads textures.
           */

          uploadFramePair(
            gl,
            pair,
            beforeTexture,
            afterTexture,
          );

          /*
           * Render the initial state while the canvas is still
           * invisible.
           */

          const startTime =
            performance.now();

          renderFrame(
            0,
            originX,
            originY,
            strength,
            0,
          );

          /*
           * Make sure the browser has actually painted the
           * prepared first frame before showing the canvas.
           */

          return new Promise<void>(
            (resolve) => {
              requestAnimationFrame(
                () => {
                  if (
                    transitionId !==
                    transitionIdRef.current
                  ) {
                    canvas.style.opacity =
                      "0";

                    resolve();

                    return;
                  }

                  canvas.style.opacity =
                    "1";

                  const animate =
                    (
                      timestamp: number,
                    ) => {
                      if (
                        transitionId !==
                        transitionIdRef.current
                      ) {
                        animationFrameRef.current =
                          null;

                        canvas.style.opacity =
                          "0";

                        resolve();

                        return;
                      }

                      const elapsed =
                        timestamp -
                        startTime;

                      const linearProgress =
                        Math.min(
                          elapsed /
                            duration,
                          1,
                        );

                      const progress =
                        easeInOutCubic(
                          linearProgress,
                        );

                      renderFrame(
                        progress,
                        originX,
                        originY,
                        strength,
                        timestamp /
                          1000,
                      );

                      if (
                        linearProgress <
                        1
                      ) {
                        animationFrameRef.current =
                          requestAnimationFrame(
                            animate,
                          );

                        return;
                      }

                      /*
                       * Render one final frame.
                       */

                      renderFrame(
                        1,
                        originX,
                        originY,
                        strength,
                        timestamp /
                          1000,
                      );

                      animationFrameRef.current =
                        null;

                      /*
                       * The DOM section is now underneath and
                       * ready to take over.
                       */

                      canvas.style.opacity =
                        "0";

                      resolve();
                    };

                  animationFrameRef.current =
                    requestAnimationFrame(
                      animate,
                    );
                },
              );
            },
          );
        },
        [
          renderFrame,
          resizeCanvas,
        ],
      );

    /* ==========================================================
       CANCEL
    ========================================================== */

    const cancelTransition =
      useCallback(() => {
        transitionIdRef.current++;

        if (
          animationFrameRef.current !==
          null
        ) {
          cancelAnimationFrame(
            animationFrameRef.current,
          );

          animationFrameRef.current =
            null;
        }

        if (
          canvasRef.current
        ) {
          canvasRef.current.style.opacity =
            "0";
        }
      }, []);

    /* ==========================================================
       PUBLIC HANDLE
    ========================================================== */

    useImperativeHandle(
      ref,
      () => ({
        renderTransition,
        cancelTransition,
      }),
      [
        renderTransition,
        cancelTransition,
      ],
    );

    /* ==========================================================
       RENDER
    ========================================================== */

    return (
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        data-page-transition-overlay=""
        className="
          pointer-events-none
          fixed
          inset-0
          z-[9999]
          block
          h-screen
          w-screen
          opacity-0
        "
        style={{
          background:
            "transparent",
          willChange:
            "opacity",
        }}
      />
    );
  });

PageTransitionCanvas.displayName =
  "PageTransitionCanvas";

export default PageTransitionCanvas;