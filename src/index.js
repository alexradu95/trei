import { LitElement, html, css } from 'lit';
import './trei/core.js';
import './trei/components/TreiSphere.js';
import './trei/components/TreiPlane.js';
import './trei/components/TreiAmbientLight.js';
import './trei/components/cameras/TreiOrbitCamera.js';

export class PortfolioApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100vw;
      height: 100vh;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
    trei-scene {
      width: 100%;
      height: 100%;
    }
  `;

  firstUpdated() {
    super.firstUpdated();
    console.log('PortfolioApp first updated');
    this.setupScene();
  }

  setupScene() {
    const scene = this.shadowRoot.querySelector('trei-scene');
    if (scene) {
      console.log('Scene found');
      // Force a re-render of the scene
      scene.requestUpdate();
    } else {
      console.error('Scene not found');
    }
  }

  render() {
    console.log('PortfolioApp rendering');
    return html`
      <trei-scene>
        <trei-orbit-camera .position=${[0, 0, 5]}></trei-orbit-camera>
        <trei-light .position=${[5, 5, 5]} color="#00ffff" intensity="4.5" .debug=${true}></trei-light>
        <trei-cube .position=${[0, 0, 0]} color="#ff0000"></trei-cube>
        <trei-sphere .position=${[2, 0, 0]} color="#00ff00"></trei-sphere>
        <trei-plane .position=${[0, -1, 0]} rotation=${[-Math.PI / 2, 0, 0]} color="#0000ff"></trei-plane>
        <trei-ambient-light></trei-ambient-light>
      </trei-scene>
    `;
  }
}

customElements.define('portfolio-app', PortfolioApp);
