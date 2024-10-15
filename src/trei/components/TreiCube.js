import { TreiElement } from './base/TreiElement.js';
import { html } from 'lit';
import * as THREE from 'three';

/**
 * Creates a cube in the scene.
 * Supports color property.
 */
export class TreiCube extends TreiElement {
  static properties = {
    ...super.properties,
    color: { type: String },
  };

  constructor() {
    super();
    this.color = '#ff0000';
  }

  firstUpdated() {
    super.firstUpdated();
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: this.color });
    this.threeObject = new THREE.Mesh(geometry, material);
    this.addToParent();
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('color') && this.threeObject) {
      this.threeObject.material.color.set(this.color);
    }
  }

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('trei-cube', TreiCube);
