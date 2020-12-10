import webp_enc from "../codecs/webp/enc/webp_enc.js";
import avif from "../codecs/avif/enc/avif_enc.js";
import mozEnc from '../codecs/mozjpeg/enc/mozjpeg_enc.js';

export const loadImage = async (src) => {
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
}

export const encodeAvif = async (image) => {
  const module = await avif();
  const result = module.encode(image.data, image.width, image.height,{
    minQuantizer: 33,
    maxQuantizer: 63,
    minQuantizerAlpha: 33,
    maxQuantizerAlpha: 63,
    tileColsLog2: 0,
    tileRowsLog2: 0,
    speed: 8,
    subsample: 1,
  });
  return result
}

export const encodeJpeg = async (image) => {
  const module = await mozEnc();
  const result = module.encode(image.data, image.width, image.height,{
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
  });
  return result
}

export const encodeWebP = async (image) => {
  const module = await webp_enc();
  const result = module.encode(image.data, image.width, image.height, {
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
  });
  return result
}

export const setImage = async (imageResult, type, id) => {
  const blob = new Blob([imageResult], { type: type });
  const blobURL = URL.createObjectURL(blob);
  const img = document.getElementById(id);
  img.src = blobURL;
}