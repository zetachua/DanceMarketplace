// src/index.ts
import { memoize } from "lodash";
import ndarray5 from "ndarray";

// src/utils.ts
import ndarray2 from "ndarray";

// src/codecs.ts
import ndarray from "ndarray";
async function imageDecode(blob) {
  const imageBitmap = await createImageBitmap(blob);
  const imageData = imageBitmapToImageData(imageBitmap);
  return ndarray(imageData.data, [imageData.height, imageData.width, 4]);
}
async function imageEncode(imageTensor, quality = 0.8, format = "image/png") {
  const [height, width, channels] = imageTensor.shape;
  switch (format) {
    case "image/x-r8":
      return new Blob([imageTensor.data], { type: "image/x-alpha8" });
    case "image/x-rgba8":
      return new Blob([imageTensor.data], { type: "image/x-rgba8" });
    case `image/png`:
    case `image/jpeg`:
    case `image/webp`:
      const imageData = new ImageData(
        new Uint8ClampedArray(imageTensor.data),
        width,
        height
      );
      var canvas = new OffscreenCanvas(imageData.width, imageData.height);
      var ctx = canvas.getContext("2d");
      ctx.putImageData(imageData, 0, 0);
      return canvas.convertToBlob({ quality, type: format });
    default:
      throw new Error(`Invalid format: ${format}`);
  }
}

// src/url.ts
function isAbsoluteURI(url) {
  const regExp = new RegExp("^(?:[a-z+]+:)?//", "i");
  return regExp.test(url);
}
function ensureAbsoluteURI(url, baseUrl) {
  if (isAbsoluteURI(url)) {
    return url;
  } else {
    return new URL(url, baseUrl).href;
  }
}

// src/utils.ts
function imageBitmapToImageData(imageBitmap) {
  var canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
  var ctx = canvas.getContext("2d");
  ctx.drawImage(imageBitmap, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
function tensorResizeBilinear(imageTensor, newWidth, newHeight) {
  const [srcHeight, srcWidth, srcChannels] = imageTensor.shape;
  const scaleX = srcWidth / newWidth;
  const scaleY = srcHeight / newHeight;
  const resizedImageData = ndarray2(
    new Uint8Array(srcChannels * newWidth * newHeight),
    [newHeight, newWidth, srcChannels]
  );
  for (let y = 0; y < newHeight; y++) {
    for (let x = 0; x < newWidth; x++) {
      const srcX = x * scaleX;
      const srcY = y * scaleY;
      const x1 = Math.max(Math.floor(srcX), 0);
      const x2 = Math.min(Math.ceil(srcX), srcWidth - 1);
      const y1 = Math.max(Math.floor(srcY), 0);
      const y2 = Math.min(Math.ceil(srcY), srcHeight - 1);
      const dx = srcX - x1;
      const dy = srcY - y1;
      for (let c = 0; c < srcChannels; c++) {
        const p1 = imageTensor.get(y1, x1, c);
        const p2 = imageTensor.get(y1, x2, c);
        const p3 = imageTensor.get(y2, x1, c);
        const p4 = imageTensor.get(y2, x2, c);
        const interpolatedValue = (1 - dx) * (1 - dy) * p1 + dx * (1 - dy) * p2 + (1 - dx) * dy * p3 + dx * dy * p4;
        resizedImageData.set(y, x, c, Math.round(interpolatedValue));
      }
    }
  }
  return resizedImageData;
}
function tensorHWCtoBCHW(imageTensor, mean = [128, 128, 128], std = [256, 256, 256]) {
  var imageBufferData = imageTensor.data;
  const [srcHeight, srcWidth, srcChannels] = imageTensor.shape;
  const stride = srcHeight * srcWidth;
  const float32Data = new Float32Array(3 * stride);
  for (let i = 0, j = 0; i < imageBufferData.length; i += 4, j += 1) {
    float32Data[j] = (imageBufferData[i] - mean[0]) / std[0];
    float32Data[j + stride] = (imageBufferData[i + 1] - mean[1]) / std[1];
    float32Data[j + stride + stride] = (imageBufferData[i + 2] - mean[2]) / std[2];
  }
  return ndarray2(float32Data, [1, 3, srcHeight, srcWidth]);
}
async function imageSourceToImageData(image, config) {
  if (typeof image === "string") {
    image = ensureAbsoluteURI(image, config.publicPath);
    image = new URL(image);
  }
  if (image instanceof URL) {
    const response = await fetch(image, {});
    image = await response.blob();
  }
  if (image instanceof ArrayBuffer || ArrayBuffer.isView(image)) {
    image = new Blob([image]);
  }
  if (image instanceof Blob) {
    image = await imageDecode(image);
  }
  return image;
}
function convertFloat32ToUint8(float32Array) {
  const uint8Array = new Uint8Array(float32Array.data.length);
  for (let i = 0; i < float32Array.data.length; i++) {
    uint8Array[i] = float32Array.data[i] * 255;
  }
  return ndarray2(uint8Array, float32Array.shape);
}

// src/onnx.ts
import ndarray3 from "ndarray";
import * as ort from "onnxruntime-web";

// src/resource.ts
async function preload(config) {
  const resourceUrl = new URL("resources.json", config.publicPath);
  const resourceResponse = await fetch(resourceUrl);
  if (!resourceResponse.ok) {
    throw new Error(
      `Resource metadata not found. Ensure that the config.publicPath is configured correctly.`
    );
  }
  const resourceMap = await resourceResponse.json();
  const keys = Object.keys(resourceMap);
  await Promise.all(
    keys.map(async (key) => {
      return loadAsBlob(key, config);
    })
  );
}
async function loadAsUrl(url, config) {
  return URL.createObjectURL(await loadAsBlob(url, config));
}
async function loadAsBlob(key, config) {
  const resourceUrl = new URL("resources.json", config.publicPath);
  const resourceResponse = await fetch(resourceUrl);
  if (!resourceResponse.ok) {
    throw new Error(
      `Resource metadata not found. Ensure that the config.publicPath is configured correctly.`
    );
  }
  const resourceMap = await resourceResponse.json();
  const entry = resourceMap[key];
  if (!entry) {
    throw new Error(
      `Resource ${key} not found. Ensure that the config.publicPath is configured correctly.`
    );
  }
  const chunks = entry.chunks;
  let downloadedSize = 0;
  const responses = chunks.map(async (chunk) => {
    const url = config.publicPath ? new URL(chunk.hash, config.publicPath).toString() : chunk.hash;
    const response = await fetch(url, config.fetchArgs);
    const blob = await response.blob();
    if (chunk.size !== blob.size) {
      throw new Error(
        `Failed to fetch ${key} with size ${chunk.size} but got ${blob.size}`
      );
    }
    if (config.progress) {
      downloadedSize += chunk.size;
      config.progress(`fetch:${key}`, downloadedSize, entry.size);
    }
    return blob;
  });
  const allChunkData = await Promise.all(responses);
  const data = new Blob(allChunkData, { type: entry.mime });
  if (data.size !== entry.size) {
    throw new Error(
      `Failed to fetch ${key} with size ${entry.size} but got ${data.size}`
    );
  }
  return data;
}

// src/feature-detect.js
var simd = async () => WebAssembly.validate(
  new Uint8Array([
    0,
    97,
    115,
    109,
    1,
    0,
    0,
    0,
    1,
    5,
    1,
    96,
    0,
    1,
    123,
    3,
    2,
    1,
    0,
    10,
    10,
    1,
    8,
    0,
    65,
    0,
    253,
    15,
    253,
    98,
    11
  ])
);
var threads = () => (async (e) => {
  try {
    return "undefined" != typeof MessageChannel && new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)), WebAssembly.validate(e);
  } catch (e2) {
    return false;
  }
})(
  new Uint8Array([
    0,
    97,
    115,
    109,
    1,
    0,
    0,
    0,
    1,
    4,
    1,
    96,
    0,
    0,
    3,
    2,
    1,
    0,
    5,
    4,
    1,
    3,
    1,
    1,
    10,
    11,
    1,
    9,
    0,
    65,
    0,
    254,
    16,
    2,
    0,
    26,
    11
  ])
);

// src/onnx.ts
async function createOnnxSession(model, config) {
  const capabilities = {
    simd: await simd(),
    threads: await threads(),
    numThreads: navigator.hardwareConcurrency ?? 4,
    // @ts-ignore
    webgpu: navigator.gpu !== void 0
  };
  if (config.debug) {
    console.debug("Capabilities:", capabilities);
    ort.env.debug = true;
    ort.env.logLevel = "verbose";
  }
  ort.env.wasm.numThreads = capabilities.numThreads;
  ort.env.wasm.simd = capabilities.simd;
  ort.env.wasm.proxy = config.proxyToWorker;
  ort.env.wasm.wasmPaths = {
    "ort-wasm-simd-threaded.wasm": capabilities.simd && capabilities.threads ? await loadAsUrl(
      "/onnxruntime-web/ort-wasm-simd-threaded.wasm",
      config
    ) : void 0,
    "ort-wasm-simd.wasm": capabilities.simd && !capabilities.threads ? await loadAsUrl("/onnxruntime-web/ort-wasm-simd.wasm", config) : void 0,
    "ort-wasm-threaded.wasm": !capabilities.simd && capabilities.threads ? await loadAsUrl("/onnxruntime-web/ort-wasm-threaded.wasm", config) : void 0,
    "ort-wasm.wasm": !capabilities.simd && !capabilities.threads ? await loadAsUrl("/onnxruntime-web/ort-wasm.wasm", config) : void 0
  };
  if (config.debug) {
    console.debug("ort.env.wasm:", ort.env.wasm);
  }
  const ort_config = {
    executionProviders: ["wasm"],
    graphOptimizationLevel: "all",
    executionMode: "parallel",
    enableCpuMemArena: true
  };
  const session = await ort.InferenceSession.create(model, ort_config).catch(
    (e) => {
      throw new Error(
        `Failed to create session: ${e}. Please check if the publicPath is set correctly.`
      );
    }
  );
  return session;
}
async function runOnnxSession(session, inputs, outputs) {
  const feeds = {};
  for (const [key, tensor] of inputs) {
    feeds[key] = new ort.Tensor(
      "float32",
      new Float32Array(tensor.data),
      tensor.shape
    );
  }
  const outputData = await session.run(feeds, {});
  const outputKVPairs = [];
  for (const key of outputs) {
    const output = outputData[key];
    const shape = output.dims;
    const data = output.data;
    const tensor = ndarray3(data, shape);
    outputKVPairs.push(tensor);
  }
  return outputKVPairs;
}

// src/schema.ts
import { z } from "zod";

// package.json
var package_default = {
  name: "@imgly/background-removal",
  version: "1.3.0",
  description: "Background Removal in the Browser",
  keywords: [
    "background-removal",
    "client-side",
    "data-privacy",
    "image-segmentation",
    "image-matting",
    "onnx"
  ],
  repository: {
    type: "git",
    url: "git+https://github.com/imgly/background-removal-js.git"
  },
  license: "SEE LICENSE IN LICENSE.md",
  author: {
    name: "IMG.LY GmbH",
    email: "support@img.ly",
    url: "https://img.ly"
  },
  bugs: {
    email: "support@img.ly"
  },
  source: "./src/index.ts",
  main: "./dist/index.cjs",
  module: "./dist/index.mjs",
  types: "./dist/index.d.ts",
  exports: {
    ".": {
      require: "./dist/index.cjs",
      import: "./dist/index.mjs",
      types: "./dist/index.d.ts"
    }
  },
  homepage: "https://img.ly/showcases/cesdk/web/background-removal",
  files: [
    "LICENSE.md",
    "README.md",
    "CHANGELOG.md",
    "dist/",
    "bin/"
  ],
  scripts: {
    start: "npm run watch",
    clean: "npx rimraf dist",
    test: "true",
    resources: "node ../../scripts/package-resources.mjs",
    "changelog:create": "node ../../scripts/changelog/create.mjs",
    "changelog:generate": "node ../../scripts/changelog/generate.mjs",
    build: "npm run clean && npm run resources && npm run changelog:generate && node scripts/build.mjs",
    watch: "npm run clean && npm run resources && npm run changelog:generate && node scripts/watch.mjs",
    publish: "npm run build && npm publish --access public",
    lint: "npx prettier --write ."
  },
  dependencies: {
    "@types/lodash": "^4.14.195",
    "@types/node": "^20.3.1",
    lodash: "^4.17.21",
    ndarray: "^1.0.19",
    "onnxruntime-web": "^1.16.3",
    zod: "^3.21.4"
  },
  devDependencies: {
    assert: "^2.0.0",
    esbuild: "^0.18.18",
    glob: "^10.3.3",
    "npm-dts": "^1.3.12",
    process: "^0.11.10",
    "ts-loader": "^9.4.3",
    tslib: "^2.5.3",
    typescript: "^5.1.3",
    util: "^0.12.5",
    webpack: "^5.85.1",
    "webpack-cli": "^5.1.4"
  }
};

// src/schema.ts
var ConfigSchema = z.object({
  publicPath: z.string().optional().describe("The public path to the wasm files and the onnx model.").default("https://unpkg.com/${PACKAGE_NAME}@${PACKAGE_VERSION}/dist/").transform((val) => {
    return val.replace("${PACKAGE_NAME}", package_default.name).replace("${PACKAGE_VERSION}", package_default.version);
  }),
  debug: z.boolean().default(false).describe("Whether to enable debug logging."),
  proxyToWorker: z.boolean().default(true).describe("Whether to proxy inference to a web worker."),
  fetchArgs: z.any().default({}).describe("Arguments to pass to fetch when loading the model."),
  progress: z.function().args(z.string(), z.number(), z.number()).returns(z.void()).describe("Progress callback.").optional(),
  model: z.enum(["small", "medium"]).default("medium"),
  output: z.object({
    format: z.enum([
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/x-rgba8",
      "image/x-alpha8"
    ]).default("image/png"),
    quality: z.number().default(0.8)
  }).default({})
}).default({});
function validateConfig(configuration) {
  const config = ConfigSchema.parse(configuration ?? {});
  if (config.debug)
    console.log("Config:", config);
  if (config.debug && !config.progress) {
    config.progress = config.progress ?? ((key, current, total) => {
      console.debug(`Downloading ${key}: ${current} of ${total}`);
    });
    if (!crossOriginIsolated) {
      console.debug(
        "Cross-Origin-Isolated is not enabled. Performance will be degraded. Please see  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer."
      );
    }
  }
  return config;
}

// src/inference.ts
import ndarray4 from "ndarray";
async function initInference(config) {
  config = validateConfig(config);
  if (config.debug)
    console.debug("Loading model...");
  const model = config.model;
  const blob = await loadAsBlob(`/models/${model}`, config);
  const arrayBuffer = await blob.arrayBuffer();
  const session = await createOnnxSession(arrayBuffer, config);
  return { config, session };
}
async function runInference(imageTensor, config, session) {
  if (config.progress)
    config.progress("compute:inference", 0, 1);
  const resolution = 1024;
  const [srcHeight, srcWidth, srcChannels] = imageTensor.shape;
  let tensorImage = tensorResizeBilinear(imageTensor, resolution, resolution);
  const inputTensor = tensorHWCtoBCHW(tensorImage);
  const predictionsDict = await runOnnxSession(
    session,
    [["input", inputTensor]],
    ["output"]
  );
  let alphamask = ndarray4(predictionsDict[0].data, [resolution, resolution, 1]);
  alphamask = convertFloat32ToUint8(alphamask);
  alphamask = tensorResizeBilinear(alphamask, srcWidth, srcHeight);
  if (config.progress)
    config.progress("compute:inference", 1, 1);
  return alphamask;
}

// src/index.ts
var src_default = removeBackground;
var init = memoize(initInference, (config) => JSON.stringify(config));
async function preload2(configuration) {
  const config = validateConfig(configuration);
  await preload(config);
  return;
}
async function removeBackground(image, configuration) {
  const { config, session } = await init(configuration);
  const imageTensor = await imageSourceToImageData(image, config);
  const [width, height, channels] = imageTensor.shape;
  const alphamask = await runInference(imageTensor, config, session);
  const stride = width * height;
  const outImageTensor = imageTensor;
  for (let i = 0; i < stride; i += 1) {
    outImageTensor.data[4 * i + 3] = alphamask.data[i];
  }
  const outImage = await imageEncode(
    outImageTensor,
    config.output.quality,
    config.output.format
  );
  return outImage;
}
async function removeForeground(image, configuration) {
  const { config, session } = await init(configuration);
  const imageTensor = await imageSourceToImageData(image, config);
  const [width, height, channels] = imageTensor.shape;
  const alphamask = await runInference(imageTensor, config, session);
  const stride = width * height;
  const outImageTensor = imageTensor;
  for (let i = 0; i < stride; i += 1) {
    outImageTensor.data[4 * i + 3] = 255 - alphamask.data[i];
  }
  const outImage = await imageEncode(
    outImageTensor,
    config.output.quality,
    config.output.format
  );
  return outImage;
}
async function segmentForeground(image, configuration) {
  const { config, session } = await init(configuration);
  const imageTensor = await imageSourceToImageData(image, config);
  const [height, width, channels] = imageTensor.shape;
  const alphamask = await runInference(imageTensor, config, session);
  const stride = width * height;
  if (config.output.format === "image/x-alpha8") {
    const outImage = await imageEncode(
      alphamask,
      config.output.quality,
      config.output.format
    );
    return outImage;
  } else {
    const outImageTensor = ndarray5(new Uint8Array(channels * stride), [
      height,
      width,
      channels
    ]);
    for (let i = 0; i < stride; i += 1) {
      const index = 4 * i + 3;
      outImageTensor.data[index] = alphamask.data[i];
      outImageTensor.data[index + 1] = alphamask.data[i];
      outImageTensor.data[index + 2] = alphamask.data[i];
      outImageTensor.data[index + 3] = 255;
    }
    const outImage = await imageEncode(
      outImageTensor,
      config.output.quality,
      config.output.format
    );
    return outImage;
  }
}
export {
  src_default as default,
  preload2 as preload,
  removeBackground,
  removeForeground,
  segmentForeground
};
//# sourceMappingURL=index.mjs.map
