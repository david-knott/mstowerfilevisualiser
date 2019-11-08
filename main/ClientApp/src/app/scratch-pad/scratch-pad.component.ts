import { OnInit, Component, ViewChild, ElementRef } from "@angular/core";
import * as THREE from "three";
import { PanelBuilder, TowerBuilder } from "../models/four-legged-lattice";

@Component({
  selector: "app-scratch-pad",
  templateUrl: "./scratch-pad.component.html",
  styleUrls: ["./scratch-pad.component.scss"]
})
export class ScratchPadComponent {
  @ViewChild("rendererContainer", { static: false })
  rendererContainer: ElementRef;

  renderer = new THREE.WebGLRenderer();
  scene = null;
  camera = null;
  mesh = null;

  material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
  yaxis = new THREE.Vector3(0, 1, 0);
  xaxis = new THREE.Vector3(1, 0, 0);
  zaxis = new THREE.Vector3(0, 0, 1);

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.z = 10;
    this.camera.position.y = 0;
    var tower = new THREE.Group();

    let towerBuilder = new TowerBuilder();
    let thickness = 0.00;
    let vertices = towerBuilder.buildTower(100);

    //create the tower geometry
    var group = new THREE.Group();
    for (let i = 0; i < vertices.length; i++) {
      var esx = vertices[i][0];
      var esy = vertices[i][1];
      var esz = vertices[i][2];
      var eex = vertices[i][3];
      var eey = vertices[i][4];
      var eez = vertices[i][5];
      var sv = new THREE.Vector3(esx, esy, esz);
      var ev = new THREE.Vector3(eex, eey, eez);
      var edge = new THREE.Vector3().subVectors(ev, sv);
      var length = edge.length();
      var edgeGeometry = new THREE.CylinderBufferGeometry(
        /*radius top*/ thickness,
        /*radius bottom*/ thickness,
        /*height*/ length + 2 * thickness,
        /*radial segments*/ 10,
        /*height segments*/ 10
      );
      var edgeMesh = new THREE.Mesh(edgeGeometry, this.material);
      //align the cylinder with the edge
      edgeMesh.quaternion.setFromUnitVectors(
        this.yaxis,
        edge.clone().normalize()
      );
      edgeMesh.position.x = (ev.x + sv.x) / 2;
      edgeMesh.position.y = (ev.y + sv.y) / 2;
      edgeMesh.position.z = (ev.z + sv.z) / 2;
      group.add(edgeMesh);
    }
    tower.add(group);
    var axesHelper = new THREE.AxesHelper(5);

var geometry = new THREE.BoxGeometry(2, 2, 2, 1, 1, 1);
    var material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true
    });
    var cube = new THREE.Mesh(geometry, material);
//    this.scene.add(cube);

    var geometry1 = new THREE.BoxGeometry(4, 4, 4, 1, 1, 1);
    var cube2 = new THREE.Mesh(geometry1, material);
  //  this.scene.add(cube2);
    this.scene.add(axesHelper);
    this.scene.add(tower);
  }

  ngAfterViewInit() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
    this.animate();
  }

  animate() {
    window.requestAnimationFrame(() => this.animate());
    this.scene.rotation.y += 0.015;
    this.renderer.render(this.scene, this.camera);
  }
}
