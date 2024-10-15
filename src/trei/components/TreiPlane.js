import { TreiElement } from '@/trei/components/base/TreiElement.js';
import { html } from 'lit';
import * as THREE from 'three';

/**
 * @class TreiPlane
 * @extends TreiElement
 * @classdesc Represents a plane in the 3D scene. Automatically connects to the nearest TreiScene.
 */
export class TreiPlane extends TreiElement {
  static properties = {
    ...super.properties,
    /**
     * @property {string} color - The color of the plane.
     */
    color: { type: String },
  };

  /**
   * Creates an instance of TreiPlane.
   * Initializes the plane properties and creates the Three.js object.
   */
  constructor() {
    super();
    this.color = '#00ff00';
    this.position = [0, 0, 0];
    this.rotation = [0, 0, 0];
    this.scale = [1, 1, 1];
    this.createThreeObject();
    console.debug('TreiPlane initialized with color:', this.color);
  }

  /**
   * Creates the Three.js Mesh for the plane.
   */
  createThreeObject() {
    const geometry = new THREE.PlaneGeometry(5, 5);
    const material = new THREE.MeshStandardMaterial({ 
      color: this.color, 
      side: THREE.DoubleSide 
    });
    this.threeObject = new THREE.Mesh(geometry, material);
    console.debug('TreiPlane Three.js object created', this.threeObject);
  }

  /**
   * Lifecycle callback when the element's properties change.
   * Updates the plane's color if the color property changes.
   * @param {Map} changedProperties - The properties that changed.
   */
  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('color') && this.threeObject) {
      this.threeObject.material.color.set(this.color);
      console.debug('TreiPlane color updated to:', this.color);
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

customElements.define('trei-plane', TreiPlane);
