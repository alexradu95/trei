import { TreiElement } from './TreiElement.js';
import { html } from 'lit';
import * as THREE from 'three';

/**
 * Adds a light source to the scene.
 * Supports color and intensity properties.
 */
export class TreiLight extends TreiElement {
  static properties = {
    ...super.properties,
    color: { type: String },
    intensity: { type: Number },
  };

  constructor() {
    super();
    this.color = '#ffffff';
    this.intensity = 1;
    this.threeObject = new THREE.PointLight(this.color, this.intensity);
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('color')) {
      this.threeObject.color.set(this.color);
    }
    if (changedProperties.has('intensity')) {
      this.threeObject.intensity = this.intensity;
    }
  }

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('trei-light', TreiLight);
