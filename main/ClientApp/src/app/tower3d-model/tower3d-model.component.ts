import { OnInit, Component, ViewChild, ElementRef } from "@angular/core";
import * as THREE from "three";
import { TowerBuilder } from "../models/tower-builder";
import {
    TestFaceBracingPattern,
    Member3d,
    TestTwoFaceBracingPattern,
    BracingPatternFactory
} from "../models/face-bracing-pattern";
import { FourLeggedLattice } from "../models/four-legged-lattice";
import { MeshToonMaterial } from "three";

@Component({
    selector: "app-tower3d-model",
    templateUrl: "./tower3d-model.component.html",
    styleUrls: ["./tower3d-model.component.scss"]
})
export class Tower3dModelComponent implements OnInit {
    @ViewChild("rendererContainer", { static: false })
    rendererContainer: ElementRef;
    renderer = new THREE.WebGLRenderer();
    scene = null;
    camera = null;
    mesh = null;
    material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true
    });
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
        this.camera.position.z = 40;
        this.camera.position.y = 9;
        let tower = new FourLeggedLattice();
        let section1 = tower.createSection(1);
        section1
            .createPanelAssembly(1, 5, 5, 4, 4, 6)
            .setFrontAndBackFacePanels(
                BracingPatternFactory.getFaceBracingPattern("XO")
            )
            .setLeftAndRightFacePanels(
                BracingPatternFactory.getFaceBracingPattern("XM2A")
            );
        let section2 = tower.createSection(2);
        section2
            .createPanelAssembly(1, 4, 4, 3, 3, 4)
            .setFacePanels(BracingPatternFactory.getFaceBracingPattern("XM1"))
            .setPlanBracing(BracingPatternFactory.getPlanBracingPattern("XML1"));
        let section3 = tower.createSection(3);
        section3
            .createPanelAssembly(1, 3, 3, 2, 2, 4)
            .setFacePanels(BracingPatternFactory.getFaceBracingPattern("XH1"));
        let section4 = tower.createSection(4);
        section4
            .createPanelAssembly(1, 2, 2, 1, 1, 4)
            .setFacePanels(BracingPatternFactory.getFaceBracingPattern("XM3A"));
        let section5 = tower.createSection(4);
        section5
            .createPanelAssembly(1, 1, 1, 0.5, 0.5, 4)
            .setFacePanels(BracingPatternFactory.getFaceBracingPattern("XM3A"));
        //set a member as overstressed
        tower
            .findSection(1)
            .findPanelAssembly(1)
            .setFaceMembersOverStressed(1, "BR1");
        let memberThreeGroup = new THREE.Group();
        var towerGroup = new THREE.Group();
        let material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true
        });
        let stressedMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true
        });
        //adds all the members to the 3d model
        tower.render((o: any) => {
            let member: Member3d = o.member;
            let thickness = member.bracingPatternMember.thickness;
            var esx = member.start.x;
            var esy = member.start.y;
            var esz = member.start.z;
            var eex = member.end.x;
            var eey = member.end.y;
            var eez = member.end.z;
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
            let mat = member.overstressed ? stressedMaterial : material;
            var edgeMesh = new THREE.Mesh(edgeGeometry, mat);
            //align the cylinder with the edge
            edgeMesh.quaternion.setFromUnitVectors(
                this.yaxis,
                edge.clone().normalize()
            );
            edgeMesh.position.x = (ev.x + sv.x) / 2;
            edgeMesh.position.y = (ev.y + sv.y) / 2;
            edgeMesh.position.z = (ev.z + sv.z) / 2;
            edgeMesh.position.y += o.groundHeight + o.panelAssembly.height / 2;
            memberThreeGroup.add(edgeMesh);
        });
        var axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);
        towerGroup.add(memberThreeGroup);
        this.scene.add(towerGroup);
    }

    ngAfterViewInit() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.rendererContainer.nativeElement.appendChild(
            this.renderer.domElement
        );
        this.animate();
    }

    animate() {
        window.requestAnimationFrame(() => this.animate());
        this.scene.rotation.y += 0.005;
        this.renderer.render(this.scene, this.camera);
    }

    ngOnInit() {}
}
