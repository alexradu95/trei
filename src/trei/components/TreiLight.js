import { TreiElement } from '@/trei/components/base/TreiElement.js';
import { html } from 'lit';
import * as THREE from 'three';

/**
 * @class TreiLight
 * @extends TreiElement
 * @classdesc Represents a light source in the 3D scene.
 */
export class TreiLight extends TreiElement {
  static properties = {
    ...super.properties,
    /**
     * @property {string} color - The color of the light.
     */
    color: { type: String },
    /**
     * @property {number} intensity - The intensity of the light.
     */
    intensity: { type: Number },
    /**
     * @property {number} distance - The distance of the light.
     */
    distance: { type: Number },
    /**
     * @property {number} decay - The decay rate of the light.
     */
    decay: { type: Number },
    /**
     * @property {boolean} debug - Enables or disables debug mode.
     */
    debug: { type: Boolean }
  };

  /**
   * Creates an instance of TreiLight.
   * Initializes the light properties.
   */
  constructor() {
    super();
    this.color = '#ffffff';
    this.intensity = 1;
    this.distance = 0;
    this.decay = 1;
    this.debug = false;
    this.logDebug('TreiLight initialized with properties', {
      color: this.color,
      intensity: this.intensity,
      distance: this.distance,
      decay: this.decay
    });
  }

  /**
   * Lifecycle callback when the element is added to the DOM.
   * Connects the light to the scene.
   */
  connectedCallback() {
    super.connectedCallback();
    this.createLight();
    this.logDebug('TreiLight connected to the DOM');
  }

  /**
   * Creates the Three.js light object.
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
   * Lifecycle callback when the element's properties change.
   * Updates the light properties accordingly.
   * @param {Map} changedProperties - The properties that changed.
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
   * Logs debug information if debug mode is enabled.
   * @param {string} message - The debug message.
   * @param {*} [data] - Additional data to log.
   */
  logDebug(message, data) {
    if (this.debug) {
      console.log(`[TreiLight] ${message}`, data);
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

customElements.define('trei-light', TreiLight);
