import { TreiElement } from '@/trei/components/base/TreiElement.js';
import { html } from 'lit';
import * as THREE from 'three';

/**
 * @class TreiCube
 * @extends TreiElement
 * @classdesc Creates a cube in the scene. Supports color property.
 */
export class TreiCube extends TreiElement {
  static properties = {
    ...super.properties,
    /**
     * @property {string} color - The color of the cube.
     */
    color: { type: String },
  };

  /**
   * Creates an instance of TreiCube.
   * Initializes the color property.
   */
  constructor() {
    super();
    this.color = '#ff0000';
    console.debug('TreiCube initialized with color:', this.color);
  }

  /**
   * Called after the element's DOM has been updated the first time.
   * Initializes the Three.js Mesh for the cube.
   */
  firstUpdated() {
    super.firstUpdated();
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: this.color });
    this.threeObject = new THREE.Mesh(geometry, material);
    this.addToParent();
    console.debug('TreiCube added to parent with geometry and material:', geometry, material);
  }

  /**
   * Called when the element's properties change.
   * Updates the cube's color if the color property changes.
   * @param {Map} changedProperties - The properties that changed.
   */
  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('color') && this.threeObject) {
      this.threeObject.material.color.set(this.color);
      console.debug('TreiCube color updated to:', this.color);
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

customElements.define('trei-cube', TreiCube);
