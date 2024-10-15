import { TreiElement } from './TreiElement.js';
import { html } from 'lit';
import * as THREE from 'three';

/**
 * Represents a plane in the 3D scene.
 * Automatically connects to the nearest TreiScene.
 */
export class TreiPlane extends TreiElement {
  static properties = {
    ...super.properties,
    color: { type: String },
  };

  constructor() {
    super();
    this.color = '#00ff00';
    this.position = [0, 0, 0];
    this.rotation = [0, 0, 0];
    this.scale = [1, 1, 1];
    this.createThreeObject();
  }

  createThreeObject() {
    const geometry = new THREE.PlaneGeometry(5, 5);
    const material = new THREE.MeshStandardMaterial({ 
      color: this.color, 
      side: THREE.DoubleSide 
    });
    this.threeObject = new THREE.Mesh(geometry, material);
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

customElements.define('trei-plane', TreiPlane);