// MozJPEG
import mozEnc from "/squoosh/codecs/mozjpeg/enc/mozjpeg_enc.js";
// WebP
import webp_enc from "/squoosh/codecs/webp/enc/webp_enc.js";
// AVIF
import avif from "/squoosh/codecs/avif/enc/avif_enc.js";

// JXL
// WP2
// PNG
// OxiPNG
// ImageQuant

// Resize
import * as resize from "/squoosh/codecs/resize/pkg/squoosh_resize.js";

export const loadImage = async src => {
  // Load image
  const img = document.createElement("img");
  img.src = src;
  await new Promise(resolve => (img.onload = resolve));
  // Make canvas same size as image
  const canvas = document.createElement("canvas");
  [canvas.width, canvas.height] = [img.width, img.height];
  // Draw image onto canvas
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, img.width, img.height);
};

export const encodeAvif = async (image, opts) => {
  const module = await avif();

  const defaultOpts = {
    minQuantizer: 33,
    maxQuantizer: 63,
    minQuantizerAlpha: 33,
    maxQuantizerAlpha: 63,
    tileColsLog2: 0,
    tileRowsLog2: 0,
    speed: 8,
    subsample: 1,
  }

  if (!opts) {
    opts = defaultOpts
  }
  const result = module.encode(image.data, image.width, image.height, opts);
  return _imageDataToBolb(result);
};

export const encodeJpeg = async (image, opts) => {
  const module = await mozEnc();

  const defaultOpts = {
    quality: 75,
    baseline: false,
    arithmetic: false,
    progressive: true,
    optimize_coding: true,
    smoothing: 0,
    color_space: 3 /*YCbCr*/,
    quant_table: 3,
    trellis_multipass: false,
    trellis_opt_zero: false,
    trellis_opt_table: false,
    trellis_loops: 1,
    auto_subsample: true,
    chroma_subsample: 2,
    separate_chroma_quality: false,
    chroma_quality: 75,
  }

  if (!opts) {
    opts = defaultOpts
  }

  const result = module.encode(image.data, image.width, image.height, opts);
  return _imageDataToBolb(result);
};

export const encodeWebP = async (image, opts) => {
  const module = await webp_enc();

  const defaultOpts = {
    quality: 75,
    target_size: 0,
    target_PSNR: 0,
    method: 4,
    sns_strength: 50,
    filter_strength: 60,
    filter_sharpness: 0,
    filter_type: 1,
    partitions: 0,
    segments: 4,
    pass: 1,
    show_compressed: 0,
    preprocessing: 0,
    autofilter: 0,
    partition_limit: 0,
    alpha_compression: 1,
    alpha_filtering: 1,
    alpha_quality: 100,
    lossless: 0,
    exact: 0,
    image_hint: 0,
    emulate_jpeg_size: 0,
    thread_level: 0,
    low_memory: 0,
    near_lossless: 100,
    use_delta_palette: 0,
    use_sharp_yuv: 0,
  }

  if (!opts) {
    opts = defaultOpts
  }

  const result = module.encode(image.data, image.width, image.height, opts);
  return _imageDataToBolb(result);
};

export const rotateImage = async (image, rotateDimention) => {
  const r = await fetch("/squoosh/codecs/rotate/rotate.wasm");
  const buf = await r.arrayBuffer();
  const instancePromise = await WebAssembly.instantiate(buf);
  const instance = instancePromise.instance;
  const bytesPerImage = image.width * image.height * 4;
  const numPagesNeeded = Math.ceil((bytesPerImage * 2 + 8) / (64 * 1024));
  const numPagesAvailable = Math.floor(
    instance.exports.memory.buffer.byteLength / (64 * 1024)
  );
  const additionalPagesToAllocate = numPagesNeeded - numPagesAvailable;
  if (additionalPagesToAllocate > 0) {
    instance.exports.memory.grow(additionalPagesToAllocate);
  }
  const view = new Uint8ClampedArray(instance.exports.memory.buffer);
  view.set(image.data, 8);
  instance.exports.rotate(image.width, image.height, rotateDimention);
  const flipDimensions = rotateDimention % 180 !== 0;
  const flipWidth = flipDimensions ? image.height : image.width
  const flipHeight = flipDimensions ? image.width : image.height
  const imageData = new ImageData(
    view.slice(bytesPerImage + 8, bytesPerImage * 2 + 8),
    flipWidth,
    flipHeight
  );
  return _imageDataToUrl(imageData, flipWidth, flipHeight);
};

export const resizeImage = async (image, outputWidth, outputHeight, aspectRatio = true) => {
  await resize.default("/squoosh/codecs/resize/pkg/squoosh_resize_bg.wasm");
  if (aspectRatio) {
    const finalSize = _resizeWithAspect(image.width, image.height, outputWidth, outputHeight)
    outputWidth = finalSize.width
    outputHeight = finalSize.height
  }
  const opts = {
    method: 3, // triangle = 0, catrom = 1, mitchell = 2, lanczos3 = 3
    fitMethod: 'stretch',
    premultiply: true,
    linearRGB: true,
  }

  let uintArray = resize.resize(
    image.data,
    image.width,
    image.height,
    outputWidth,
    outputHeight,
    opts.method,
    opts.premultiply,
    opts.linearRGB
  )
  return _Uint8ArrayToUrl(uintArray, outputWidth, outputHeight)
};

function _resizeWithAspect(
  input_width,
  input_height,
  target_width,
  target_height,
) {
  if (!target_width && !target_height) {
    throw Error('Need to specify at least width or height when resizing');
  }
  if (target_width && target_height) {
    return { width: target_width, height: target_height };
  }
  if (!target_width) {
    return {
      width: Math.round((input_width / input_height) * target_height),
      height: target_height,
    };
  }
  if (!target_height) {
    return {
      width: target_width,
      height: Math.round((input_height / input_width) * target_width),
    };
  }
}

const _imageDataToBolb = async (imageResult, type, id) => {
  const blob = new Blob([imageResult], { type: type });
  return URL.createObjectURL(blob);
};

function _Uint8ArrayToUrl(ubuf, width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  const imgData = ctx.createImageData(width, height);
  for (let i = 0; i < ubuf.length; i += 4) {
    imgData.data[i] = ubuf[i];   //red
    imgData.data[i + 1] = ubuf[i + 1]; //green
    imgData.data[i + 2] = ubuf[i + 2]; //blue
    imgData.data[i + 3] = ubuf[i + 3]; //alpha
  }
  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL();
}

function _imageDataToUrl(imageData, width ,height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/jpeg', 1.0);
}
