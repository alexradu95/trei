import { LitElement } from 'lit';
import * as THREE from 'three';

/**
 * Base class for all Trei components.
 * Manages position, rotation, and scale of Three.js objects.
 */
export class TreiElement extends LitElement {
  static properties = {
    position: { type: Array },
    rotation: { type: Array },
    scale: { type: Array },
  };

  constructor() {
    super();
    this.threeObject = null;
    this.position = [0, 0, 0];
    this.rotation = [0, 0, 0];
    this.scale = [1, 1, 1];
  }

  firstUpdated() {
    this.updateThreeObject();
  }

  updated(changedProperties) {
    if (changedProperties.has('position') || 
        changedProperties.has('rotation') || 
        changedProperties.has('scale')) {
      this.updateThreeObject();
    }
  }

  updateThreeObject() {
    if (this.threeObject) {
      if (Array.isArray(this.position) && this.position.length === 3) {
        this.threeObject.position.set(...this.position);
      }
      if (Array.isArray(this.rotation) && this.rotation.length === 3) {
        this.threeObject.rotation.set(...this.rotation);
      }
      if (Array.isArray(this.scale) && this.scale.length === 3) {
        this.threeObject.scale.set(...this.scale);
      }
    }
  }

  addToParent() {
    const parent = this.closest('trei-scene, trei-group');
    if (parent && this.threeObject) {
      parent.addObject(this.threeObject);
    }
  }

  removeFromParent() {
    const parent = this.closest('trei-scene, trei-group');
    if (parent && this.threeObject) {
      parent.removeObject(this.threeObject);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.addToParent();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeFromParent();
  }
}