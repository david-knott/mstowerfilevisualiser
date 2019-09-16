import {OnInit, Component, ViewChild, ElementRef} from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-scratch-pad',
  templateUrl: './scratch-pad.component.html',
  styleUrls: ['./scratch-pad.component.scss']
})
export class ScratchPadComponent {
    @ViewChild('rendererContainer', {static: false}) rendererContainer: ElementRef;

    renderer = new THREE.WebGLRenderer();
    scene = null;
    camera = null;
    mesh = null;

    //note the the vertices are the center distances, not the distance of the actual members
    //the actual distance is -0.5 -> 0.5 ( 2 + thicknes * 2)
    vertices = [
    	[-0.5, 0.5], //top left
    	[-0.5, -0.5], //bottom right
    	[0.5, -0.5], //bottom right
        [0.5, 0.5] //top right
    ];

    edges = [
    	[0, 1],
	    [1, 2],
	    [2, 3],
        [3, 0],
        [3, 1],
        [2, 0]
    ];

    thickness = 0.03;
    material = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
    yaxis = new THREE.Vector3(0, 1, 0);
    xaxis = new THREE.Vector3(1, 0, 0);
    zaxis = new THREE.Vector3(0, 0, 1);

    scaleBy(tw: number, bw: number, h: number){
        let yscaledVertices = this.vertices.map((v) => {
            return [v[0], v[1] * h];
        });
        if(tw - bw == 0){
            return yscaledVertices.map((v) => {
                return [v[0] * bw, v[1]];
            });
        }
        // scale x values based on the y and slope
        let m = h / (tw/2 - bw/2) ;
        let xscaledVertices = yscaledVertices.map((v) => {
            return [v[0] * (v[1] - bw) / m, v[1]];
        });
        return xscaledVertices;
    }

    angle(tw: number, bw: number, h: number){
        let m = h / (tw/2 - bw/2);
        return THREE.Math.degToRad(90) + Math.atan(m);
    }

    build3dFace(tw, bw, vh) {
        //outer group to help with rotating the faces.
        var outer = new THREE.Group();
        var group = new THREE.Group();
        const angle = this.angle(tw, bw, vh);
        const cvertices = this.scaleBy(tw, bw, vh);
        console.log(cvertices);
        //builds a face from vertices
        for(var i = 0; i < this.edges.length; i++){
            var esx = cvertices[this.edges[i][0]][0] - this.thickness / 2;
            var esy = cvertices[this.edges[i][0]][1] - this.thickness / 2;
            var eex = cvertices[this.edges[i][1]][0] - this.thickness / 2;
            var eey = cvertices[this.edges[i][1]][1] - this.thickness / 2;
            var sv = new THREE.Vector3(esx, esy, 0);
            var ev = new THREE.Vector3(eex, eey, 0);
            var edge = new THREE.Vector3().subVectors(ev, sv);
            var length = edge.length();
            var edgeGeometry = new THREE.CylinderBufferGeometry( /*radius top*/ this.thickness, /*radius bottom*/ this.thickness, /*height*/ length + this.thickness, /*radial segments*/ 10, /*height segments*/ 10);
            var edgeMesh = new THREE.Mesh(edgeGeometry, this.material);
            //align the cylinder with the edge
            edgeMesh.quaternion.setFromUnitVectors(this.yaxis, edge.clone().normalize());
            edgeMesh.position.x = (ev.x + sv.x) / 2;
            edgeMesh.position.y = (ev.y + sv.y) / 2;
            group.add(edgeMesh);
        }
        //group.rotateOnAxis(this.xaxis, -angle);
        outer.add(group);
        outer.add( new THREE.AxesHelper( 2 ) );
        return outer;
    }



    build3dPanel(tw, bw, vh, y) {
        var group = new THREE.Group();
        for(var i = 0; i < 4; i++){
            const face = this.build3dFace(tw, bw, vh);
            face.translateOnAxis(this.zaxis, bw / 2);
            face.position.sub(this.yaxis);
            var theta = 90 * i * Math.PI / 180;//rotate by 90
            face.position.applyAxisAngle(this.yaxis, theta);
            face.position.add(this.yaxis);
            face.rotateOnAxis(this.yaxis, theta);
            group.add(face);
        }
        group.position.y = y;
        return group;
    }


    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.z = 10;
        this.camera.position.y = 2;
        var tower = new THREE.Group();
        //notice the faces to not align
        tower.add(this.build3dPanel(1, 2, 2, 0)); //bottom
    //    tower.add(this.build3dPanel(2, 3, 1));
    //    tower.add(this.build3dPanel(1, 2, 2));
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
