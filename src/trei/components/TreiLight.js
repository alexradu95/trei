import { TreiElement } from './base/TreiElement.js';
import { html } from 'lit';
import * as THREE from 'three';

/**
 * TreiLight component
 * Represents a light source in the 3D scene
 * @extends TreiElement
 */
export class TreiLight extends TreiElement {
  static properties = {
    ...super.properties,
    color: { type: String },
    intensity: { type: Number },
    distance: { type: Number },
    decay: { type: Number },
    debug: { type: Boolean }
  };

  /**
   * @constructor
   */
  constructor() {
    super();
    this.color = '#ffffff';
    this.intensity = 1;
    this.distance = 0;
    this.decay = 1;
    this.debug = false;
  }

  /**
   * Lifecycle callback when the element is added to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.createLight();
    this.logDebug('TreiLight connected to the DOM');
  }

  /**
   * Create the Three.js light object
   */
  createLight() {
    this.threeObject = new THREE.PointLight(
      this.color,
      this.intensity,
      this.distance,
      this.decay
    );
    this.logDebug('Light created', this.threeObject);
  }

  /**
   * Lifecycle callback when the element's properties change
   * @param {Map} changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('color')) {
      this.threeObject.color.set(this.color);
      this.logDebug('Light color updated', this.color);
    }
    if (changedProperties.has('intensity')) {
      this.threeObject.intensity = this.intensity;
      this.logDebug('Light intensity updated', this.intensity);
    }
    if (changedProperties.has('distance')) {
      this.threeObject.distance = this.distance;
      this.logDebug('Light distance updated', this.distance);
    }
    if (changedProperties.has('decay')) {
      this.threeObject.decay = this.decay;
      this.logDebug('Light decay updated', this.decay);
    }
    if (changedProperties.has('debug')) {
      this.logDebug(`Debug mode ${this.debug ? 'enabled' : 'disabled'}`);
    }
  }

  /**
   * Log debug information if debug mode is enabled
   * @param {string} message - The debug message
   * @param {*} [data] - Additional data to log
   */
  logDebug(message, data) {
    if (this.debug) {
      console.log(`[TreiLight] ${message}`, data);
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

customElements.define('trei-light', TreiLight);