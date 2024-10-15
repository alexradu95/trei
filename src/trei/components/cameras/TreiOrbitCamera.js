import { TreiCamera } from '@/trei/components/cameras/TreiCamera.js';
import { html } from 'lit';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * @class TreiOrbitCamera
 * @extends TreiCamera
 * @classdesc Extends TreiCamera to provide orbit controls for camera movement.
 */
export class TreiOrbitCamera extends TreiCamera {
  static properties = {
    ...super.properties,
    /**
     * @property {boolean} enableDamping - Enables damping for the orbit controls.
     */
    enableDamping: { type: Boolean },
    /**
     * @property {number} dampingFactor - The damping factor for the orbit controls.
     */
    dampingFactor: { type: Number },
    /**
     * @property {boolean} enableZoom - Enables zoom for the orbit controls.
     */
    enableZoom: { type: Boolean },
    /**
     * @property {number} minDistance - The minimum distance for the orbit controls.
     */
    minDistance: { type: Number },
    /**
     * @property {number} maxDistance - The maximum distance for the orbit controls.
     */
    maxDistance: { type: Number },
    /**
     * @property {boolean} enablePan - Enables panning for the orbit controls.
     */
    enablePan: { type: Boolean },
    /**
     * @property {boolean} autoRotate - Enables auto-rotation for the orbit controls.
     */
    autoRotate: { type: Boolean },
    /**
     * @property {number} autoRotateSpeed - The speed of auto-rotation for the orbit controls.
     */
    autoRotateSpeed: { type: Number },
    /**
     * @property {boolean} debug - Enables or disables debug mode.
     */
    debug: { type: Boolean }
  };

  /**
   * Creates an instance of TreiOrbitCamera.
   * Initializes the orbit controls properties.
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
    console.debug('TreiOrbitCamera initialized');
  }

  /**
   * Lifecycle callback when the element is added to the DOM.
   * Sets up the orbit controls.
   */
  connectedCallback() {
    super.connectedCallback();
    this.setupControls();
    this.logDebug('TreiOrbitCamera connected to the DOM');
  }

  /**
   * Lifecycle callback when the element is removed from the DOM.
   * Disposes of the orbit controls.
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.controls) {
      this.controls.dispose();
      this.logDebug('Orbit controls disposed');
    }
  }

  /**
   * Sets up the OrbitControls.
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
   * Updates the properties of the OrbitControls.
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
   * Lifecycle callback when the element's properties change.
   * Updates the orbit controls properties.
   * @param {Map} changedProperties - The properties that changed.
   */
  updated(changedProperties) {
    super.updated(changedProperties);
    this.logDebug('Properties updated', Object.fromEntries(changedProperties));
    if (this.controls) {
      this.updateControlsProperties();
    }
  }

  /**
   * Update method called every frame.
   * Updates the orbit controls.
   * @param {number} time - The current time.
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
   * Logs debug information if debug mode is enabled.
   * @param {string} message - The debug message.
   * @param {*} [data] - Additional data to log.
   */
  logDebug(message, data) {
    if (this.debug) {
      console.log(`[TreiOrbitCamera] ${message}`, data);
    }
  }

  /**
   * Renders the HTML template for the component.
   * @returns {TemplateResult} The Lit HTML template.
   */
  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('trei-orbit-camera', TreiOrbitCamera);
