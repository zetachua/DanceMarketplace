declare module '@imgly/background-removal/src/codecs' {
  export { imageEncode, imageDecode };
  import { NdArray } from 'ndarray';
  function imageDecode(blob: Blob): Promise<NdArray<Uint8Array>>;
  function imageEncode(imageTensor: NdArray<Uint8Array>, quality?: number, format?: string): Promise<Blob>;

}
declare module '@imgly/background-removal/src/index' {
  export default removeBackground;
  export { preload, removeBackground, removeForeground, segmentForeground };
  export type { Config, ImageSource };
  import { Config } from '@imgly/background-removal/src/schema';
  import { ImageSource } from '@imgly/background-removal/src/utils';
  function preload(configuration?: Config): Promise<void>;
  /**
   * Removes the background from an image.
   *
   * @param image - The image to remove the background from.
   * @param configuration - Optional configuration for the background removal process.
   * @returns A Promise that resolves to the resulting image with the background removed.
   */
  function removeBackground(image: ImageSource, configuration?: Config): Promise<Blob>;
  /**
   * Removes the foreground from an image.
   *
   * @param image - The image to remove the foreground from.
   * @param configuration - Optional configuration for the foreground removal process.
   * @returns A Promise that resolves to the resulting image with the foreground removed.
   */
  function removeForeground(image: ImageSource, configuration?: Config): Promise<Blob>;
  /**
   * Segments the foreground of an image using a given configuration.
   *
   * @param image - The image source to segment.
   * @param configuration - The optional configuration for the segmentation.
   * @returns A Promise that resolves to the segmented foreground as a Blob.
   */
  function segmentForeground(image: ImageSource, configuration?: Config): Promise<Blob>;

}
declare module '@imgly/background-removal/src/inference' {
  export { initInference, runInference };
  import { Config } from '@imgly/background-removal/src/schema';
  import { NdArray } from 'ndarray';
  function initInference(config?: Config): Promise<{
      config: {
          publicPath?: string;
          debug?: boolean;
          proxyToWorker?: boolean;
          fetchArgs?: any;
          progress?: (args_0: string, args_1: number, args_2: number, ...args_3: unknown[]) => void;
          model?: "small" | "medium";
          output?: {
              format?: "image/png" | "image/jpeg" | "image/webp" | "image/x-rgba8" | "image/x-alpha8";
              quality?: number;
          };
      };
      session: import("onnxruntime-common").InferenceSession;
  }>;
  function runInference(imageTensor: NdArray<Uint8Array>, config: Config, session: any): Promise<NdArray<Uint8Array>>;

}
declare module '@imgly/background-removal/src/onnx' {
  export { createOnnxSession, runOnnxSession };
  import { NdArray } from 'ndarray';
  import * as ort from 'onnxruntime-web';
  import { Config } from '@imgly/background-removal/src/schema';
  function createOnnxSession(model: any, config: Config): Promise<ort.InferenceSession>;
  function runOnnxSession(session: any, inputs: [string, NdArray<Float32Array>][], outputs: [string]): Promise<NdArray<Float32Array>[]>;

}
declare module '@imgly/background-removal/src/resource' {
  export { loadAsBlob, loadAsUrl, preload };
  import { Config } from '@imgly/background-removal/src/schema';
  function preload(config: Config): Promise<void>;
  function loadAsUrl(url: string, config: Config): Promise<string>;
  function loadAsBlob(key: string, config: Config): Promise<Blob>;

}
declare module '@imgly/background-removal/src/schema' {
  export { Config, ConfigSchema, validateConfig };
  import { z } from 'zod';
  const ConfigSchema: z.ZodDefault<z.ZodObject<{
      publicPath: z.ZodEffects<z.ZodDefault<z.ZodOptional<z.ZodString>>, string, string>;
      debug: z.ZodDefault<z.ZodBoolean>;
      proxyToWorker: z.ZodDefault<z.ZodBoolean>;
      fetchArgs: z.ZodDefault<z.ZodAny>;
      progress: z.ZodOptional<z.ZodFunction<z.ZodTuple<[z.ZodString, z.ZodNumber, z.ZodNumber], z.ZodUnknown>, z.ZodVoid>>;
      model: z.ZodDefault<z.ZodEnum<["small", "medium"]>>;
      output: z.ZodDefault<z.ZodObject<{
          format: z.ZodDefault<z.ZodEnum<["image/png", "image/jpeg", "image/webp", "image/x-rgba8", "image/x-alpha8"]>>;
          quality: z.ZodDefault<z.ZodNumber>;
      }, "strip", z.ZodTypeAny, {
          format?: "image/png" | "image/jpeg" | "image/webp" | "image/x-rgba8" | "image/x-alpha8";
          quality?: number;
      }, {
          format?: "image/png" | "image/jpeg" | "image/webp" | "image/x-rgba8" | "image/x-alpha8";
          quality?: number;
      }>>;
  }, "strip", z.ZodTypeAny, {
      publicPath?: string;
      debug?: boolean;
      proxyToWorker?: boolean;
      fetchArgs?: any;
      progress?: (args_0: string, args_1: number, args_2: number, ...args_3: unknown[]) => void;
      model?: "small" | "medium";
      output?: {
          format?: "image/png" | "image/jpeg" | "image/webp" | "image/x-rgba8" | "image/x-alpha8";
          quality?: number;
      };
  }, {
      publicPath?: string;
      debug?: boolean;
      proxyToWorker?: boolean;
      fetchArgs?: any;
      progress?: (args_0: string, args_1: number, args_2: number, ...args_3: unknown[]) => void;
      model?: "small" | "medium";
      output?: {
          format?: "image/png" | "image/jpeg" | "image/webp" | "image/x-rgba8" | "image/x-alpha8";
          quality?: number;
      };
  }>>;
  type Config = z.infer<typeof ConfigSchema>;
  function validateConfig(configuration?: Config): Config;

}
declare module '@imgly/background-removal/src/url' {
  export { isAbsoluteURI, ensureAbsoluteURI };
  function isAbsoluteURI(url: string): boolean;
  function ensureAbsoluteURI(url: string, baseUrl: string): string;

}
declare module '@imgly/background-removal/src/utils' {
  export { imageDecode, imageEncode, tensorResizeBilinear, tensorHWCtoBCHW, imageBitmapToImageData, calculateProportionalSize, imageSourceToImageData, ImageSource };
  import { NdArray } from 'ndarray';
  import { imageDecode, imageEncode } from '@imgly/background-removal/src/codecs';
  import { Config } from '@imgly/background-removal/src/schema';
  type ImageSource = ImageData | ArrayBuffer | Uint8Array | Blob | URL | string;
  function imageBitmapToImageData(imageBitmap: ImageBitmap): ImageData;
  function tensorResizeBilinear(imageTensor: NdArray<Uint8Array>, newWidth: number, newHeight: number): NdArray<Uint8Array>;
  function tensorHWCtoBCHW(imageTensor: NdArray<Uint8Array>, mean?: number[], std?: number[]): NdArray<Float32Array>;
  function calculateProportionalSize(originalWidth: number, originalHeight: number, maxWidth: number, maxHeight: number): [number, number];
  function imageSourceToImageData(image: ImageSource, config: Config): Promise<NdArray<Uint8Array>>;
  export function convertFloat32ToUint8(float32Array: NdArray<Float32Array>): NdArray<Uint8Array>;

}
declare module '@imgly/background-removal' {
  import main = require('@imgly/background-removal/src/index');
  export = main;
}