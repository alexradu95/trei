import { TreiCamera } from './TreiCamera.js';
import { html } from 'lit';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * TreiOrbitCamera component
 * Extends TreiCamera to provide orbit controls for camera movement
 * @extends TreiCamera
 */
export class TreiOrbitCamera extends TreiCamera {
  static properties = {
    ...super.properties,
    enableDamping: { type: Boolean },
    dampingFactor: { type: Number },
    enableZoom: { type: Boolean },
    minDistance: { type: Number },
    maxDistance: { type: Number },
    enablePan: { type: Boolean },
    autoRotate: { type: Boolean },
    autoRotateSpeed: { type: Number },
    debug: { type: Boolean }
  };

  /**
   * @constructor
   */
  constructor() {
    super();
    this.enableDamping = true;
    this.dampingFactor = 0.05;
    this.enableZoom = true;
    this.minDistance = 1;
    this.maxDistance = 1000;
    this.enablePan = true;
    this.autoRotate = false;
    this.autoRotateSpeed = 2.0;
    this.controls = null;
    this.debug = false;
  }

  /**
   * Lifecycle callback when the element is added to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.setupControls();
    this.logDebug('TreiOrbitCamera connected to the DOM');
  }

  /**
   * Lifecycle callback when the element is removed from the DOM
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.controls) {
      this.controls.dispose();
      this.logDebug('Orbit controls disposed');
    }
  }

  /**
   * Set up the OrbitControls
   */
  setupControls() {
    const scene = this.closest('trei-scene');
    if (scene && scene.renderer) {
      this.controls = new OrbitControls(this.threeObject, scene.renderer.domElement);
      this.updateControlsProperties();
      this.logDebug('Orbit controls set up', this.controls);
    } else {
      console.warn('TreiOrbitCamera: No scene or renderer found for setting up controls');
    }
  }

  /**
   * Update the properties of the OrbitControls
   */
  updateControlsProperties() {
    if (this.controls) {
      this.controls.enableDamping = this.enableDamping;
      this.controls.dampingFactor = this.dampingFactor;
      this.controls.enableZoom = this.enableZoom;
      this.controls.minDistance = this.minDistance;
      this.controls.maxDistance = this.maxDistance;
      this.controls.enablePan = this.enablePan;
      this.controls.autoRotate = this.autoRotate;
      this.controls.autoRotateSpeed = this.autoRotateSpeed;
      this.logDebug('Orbit controls properties updated', {
        enableDamping: this.enableDamping,
        dampingFactor: this.dampingFactor,
        enableZoom: this.enableZoom,
        minDistance: this.minDistance,
        maxDistance: this.maxDistance,
        enablePan: this.enablePan,
        autoRotate: this.autoRotate,
        autoRotateSpeed: this.autoRotateSpeed
      });
    }
  }

  /**
   * Lifecycle callback when the element's properties change
   * @param {Map} changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);
    this.logDebug('Properties updated', Object.fromEntries(changedProperties));
    if (this.controls) {
      this.updateControlsProperties();
    }
  }

  /**
   * Update method called every frame
   * @param {number} time - The current time
   */
  update(time) {
    if (this.controls) {
      this.controls.update();
      this.logDebug('Orbit controls updated', {
        position: this.threeObject.position.toArray(),
        rotation: this.threeObject.rotation.toArray()
      });
    }
  }

  /**
   * Log debug information if debug mode is enabled
   * @param {string} message - The debug message
   * @param {*} [data] - Additional data to log
   */
  logDebug(message, data) {
    if (this.debug) {
      console.log(`[TreiOrbitCamera] ${message}`, data);
    }
  }

  /**
   * Render method
   * @returns {TemplateResult}
   */
  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('trei-orbit-camera', TreiOrbitCamera);