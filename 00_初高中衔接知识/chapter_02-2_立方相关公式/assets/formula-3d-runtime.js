/*
 * Build with esbuild:
 * esbuild formula-3d-runtime.js --bundle --format=iife
 *   --global-name=DGFormula3DRuntime --minify --charset=utf8
 *   --legal-comments=eof --target=es2018
 *   --outfile=formula-3d-runtime.bundle.js
 * Then strip trailing whitespace from the generated shader source lines.
 */
import * as THREE from './vendor/three-r160/three.module.min.js?v=20260731-esm';
import {DGDimensionLabels} from './dimension-labels.js?v=20260731-esm';

export {THREE, DGDimensionLabels};
