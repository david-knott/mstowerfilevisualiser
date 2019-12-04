import * as THREE from "three";
import {
    FaceBracingPattern,
    TestFaceBracingPattern} from "./face-bracing-pattern";
import { PanelAssembly } from './panel-assembly';
import { FourLeggedLattice } from './four-legged-lattice';

/**
 * A section is a collection of panels that all
 * share common legs. Panels are grouped into panel
 * groups
 */
export class Section {
    public readonly panelAssembly: Array<PanelAssembly> = new Array();
    public readonly reference: number;
    private readonly tower: FourLeggedLattice;

    constructor(tower: FourLeggedLattice, reference: number) {
        this.reference = reference;
        this.tower = tower;
    }

    /**
     * Creates a new panel group
     */
    createPanelAssembly(
        reference: number,
        bottomWidth: number,
        bottomDepth: number,
        topWidth: number,
        topDepth: number,
        height: number
    ): PanelAssembly {
        let groundHeight = this.tower.getGroundHeight();
        let panelAssembly = new PanelAssembly(
            reference,
            bottomWidth,
            bottomDepth,
            topWidth,
            topDepth,
            height,
            groundHeight
        );
        this.tower.setGroundHeight(groundHeight + height);
        this.panelAssembly.push(panelAssembly);
        return panelAssembly;
    }

    findPanelAssembly(reference: number): PanelAssembly{
        let panelAssembly = this.panelAssembly.filter(x => x.reference == reference);
        if (panelAssembly.length > 1)
            throw Error("More than one panelAssembly with reference " + reference);
        if (panelAssembly.length === 0)
            throw Error("Zero sections with reference " + reference);
        return panelAssembly[0];
    }
}


