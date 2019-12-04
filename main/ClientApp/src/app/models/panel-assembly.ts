import { FacePanel, PlanBracingPanel } from "./face-panel";
import { BracingPattern } from "./bracing-pattern";
import { Member, Member3d } from "./face-bracing-pattern";
/**
 * An assembly of different types of panels at a
 * particular height. This can contain face, plan
 * hip and cross arm assemblies, all positioned
 * relative to height
 */
export class PanelAssembly {
    private readonly thickness: number = 0.001;
    public readonly reference: number;
    private readonly height: number;
    private groundHeight: number;
    private bottomWidth: number;
    private bottomDepth: number;
    private topWidth: number;
    private topDepth: number;
    private readonly hipPanel: Array<any>; //generally one
    public readonly facePanels: Array<FacePanel> = new Array(); //one for each face, 3 or 4 depending on type of tower
    private readonly bracingPanels: Array<PlanBracingPanel> = new Array(); //generally one
    private readonly crossArmPanels: Array<any>; //generally one, used for guyed masts
    public members: Array<Member3d> = new Array();
    constructor(
        reference: number,
        bottomWidth: number,
        bottomDepth: number,
        topWidth: number,
        topDepth: number,
        height: number,
        groundHeight: number
    ) {
        if (undefined === reference || Number.isNaN(reference))
            throw Error("reference parameter is required");
        if (undefined === bottomWidth || Number.isNaN(bottomWidth))
            throw Error("bottomWidth parameter is required");
        if (undefined === bottomDepth || Number.isNaN(bottomDepth))
            throw Error("bottomDepth parameter is required");
        if (undefined === topWidth || Number.isNaN(topWidth))
            throw Error("topWidth parameter is required");
        if (undefined === topDepth || Number.isNaN(topDepth))
            throw Error("topDepth parameter is required");
        if (undefined === height || Number.isNaN(height))
            throw Error("height parameter is required");
        if (undefined === groundHeight || Number.isNaN(groundHeight))
            throw Error("groundHeight parameter is required");
        this.reference = reference;
        this.height = height;
        this.bottomDepth = bottomDepth;
        this.bottomWidth = bottomWidth;
        this.topDepth = topDepth;
        this.topWidth = topWidth;
        this.groundHeight = groundHeight;
    }
    getHeight(): number {
        return this.height;
    }
    getBottomWidth(): number {
        return this.bottomWidth;
    }
    getBottomDepth(): number {
        return this.bottomDepth;
    }
    setGroundHeight(groundHeight: number): void {
        this.groundHeight = groundHeight;
    }
    getGroundHeight(): number {
        return this.groundHeight;
    }
    setPlanBracing(bracingPattern: BracingPattern): PanelAssembly {
        let planBracingPanel = new PlanBracingPanel(20, 20, bracingPattern);
        this.bracingPanels.push(planBracingPanel);
        this.members = this.members.concat(
            this.positionPlanBracing(planBracingPanel.getPositionedMembers())
        )
        return this;
    }
    setLeftAndRightFacePanels(bracingPattern: BracingPattern): PanelAssembly {
        let facePanelLeft = new FacePanel(
            this.bottomDepth,
            this.topDepth,
            this.height,
            bracingPattern
        );
        this.facePanels.push(facePanelLeft);
        let ml = this.getSlope(this.height, this.bottomDepth, this.topDepth);
        this.members = this.members.concat(
            this.translateAndRotate(
                2,
                facePanelLeft.getPositionedMembers(),
                this.bottomDepth / 2,
                (90 * Math.PI) / 180,
                ml
            )
        );
        let facePanelRight = new FacePanel(
            this.bottomDepth,
            this.topDepth,
            this.height,
            bracingPattern
        );
        this.facePanels.push(facePanelRight);
        let mr = this.getSlope(this.height, this.bottomWidth, this.topWidth);
        this.members = this.members.concat(
            this.translateAndRotate(
                4,
                facePanelRight.getPositionedMembers(),
                this.bottomWidth / 2,
                (3 * Math.PI) / 2,
                mr
            )
        );
        return this;
    }
    setFrontAndBackFacePanels(bracingPattern: BracingPattern): PanelAssembly {
        let facePanelFront = new FacePanel(
            this.bottomWidth,
            this.topWidth,
            this.height,
            bracingPattern
        );
        this.facePanels.push(facePanelFront);
        let m = this.getSlope(this.height, this.bottomWidth, this.topWidth);
        this.members = this.members.concat(
            this.translateAndRotate(
                1,
                facePanelFront.getPositionedMembers(),
                this.bottomDepth / 2,
                0,
                m
            )
        );
        let facePanelBack = new FacePanel(
            this.bottomWidth,
            this.topWidth,
            this.height,
            bracingPattern
        );
        this.facePanels.push(facePanelBack);
        let mb = this.getSlope(this.height, this.bottomDepth, this.topDepth);
        this.members = this.members.concat(
            this.translateAndRotate(
                3,
                facePanelBack.getPositionedMembers(),
                this.bottomDepth / 2,
                Math.PI,
                mb
            )
        );
        return this;
    }
    setFacePanels(bracingPattern: BracingPattern): PanelAssembly {
        this.setFrontAndBackFacePanels(bracingPattern);
        this.setLeftAndRightFacePanels(bracingPattern);
        return this;
    }
    private getSlope(h: number, bw: number, tw: number): number {
        if (h === undefined || Number.isNaN(h))
            throw Error("h parameter is not defined");
        if (bw === undefined || Number.isNaN(bw))
            throw Error("bw parameter is not defined");
        if (tw === undefined || Number.isNaN(tw))
            throw Error("tw parameter is not defined");
        //take into account the thickness of the members
        var newTw = tw - this.thickness * 2;
        var newBw = bw - this.thickness * 2;
        //infinite slope, just scale up x without factoring in slope
        if (newTw - newBw == 0) {
            return null;
        }
        let m = h / (newTw / 2 - newBw / 2);
        return m;
    }
    private positionPlanBracing(point: Array<Member>): Array<Member3d> {
        let extendedMembers = point.map(p => {
            return new Member3d(
                p.bracingPatternMember,
                p.start.extendTo3d(0),
                p.end.extendTo3d(0),
                /* overstressed */ false,
                0
            );
        });

        return extendedMembers;
    }
    private translateAndRotate(
        face: number,
        point: Array<Member>,
        z: number,
        rads: number,
        faceSlope: number
    ): Array<Member3d> {
        if (faceSlope === undefined || Number.isNaN(faceSlope))
            throw Error("faceSlope parameter is not defined");
        if (z === undefined || Number.isNaN(z))
            throw Error("z parameter is not defined");
        if (rads === undefined || Number.isNaN(rads))
            throw Error("rads parameter is not defined");
        let extendedMembers = point.map(p => {
            return new Member3d(
                p.bracingPatternMember,
                p.start.extendTo3d(z),
                p.end.extendTo3d(z),
                /* overstressed */ false,
                face
            );
        });
        if (faceSlope !== null) {
            let fs = Math.atan(faceSlope);
            var h1 = this.height / Math.cos(fs + Math.PI / 2);
            for (let i = 0; i < extendedMembers.length; i++) {
                extendedMembers[i].start.transY(h1 / 2);
                extendedMembers[i].start.transZ(-z);
                extendedMembers[i].end.transY(h1 / 2);
                extendedMembers[i].end.transZ(-z);
                extendedMembers[i].start.rotateX(fs);
                extendedMembers[i].end.rotateX(fs);
                extendedMembers[i].start.z *= -1;
                extendedMembers[i].end.z *= -1;
                extendedMembers[i].start.transY(-h1 / 2);
                extendedMembers[i].start.transZ(z);
                extendedMembers[i].end.transY(-h1 / 2);
                extendedMembers[i].end.transZ(z);
                let xs1 = extendedMembers[i].start.x;
                let zs1 = extendedMembers[i].start.z;
                let xe1 = extendedMembers[i].end.x;
                let ze1 = extendedMembers[i].end.z;
                extendedMembers[i].start.x =
                    xs1 * Math.cos(rads) - zs1 * Math.sin(rads);
                extendedMembers[i].start.z =
                    zs1 * Math.cos(rads) + xs1 * Math.sin(rads);
                extendedMembers[i].end.x =
                    xe1 * Math.cos(rads) - ze1 * Math.sin(rads);
                extendedMembers[i].end.z =
                    ze1 * Math.cos(rads) + xe1 * Math.sin(rads);
            }
        }
        return extendedMembers;
    }
    setFaceMembersOverStressed(face: number, referenceCode: string): void {
        let member = this.members.filter(
            f =>
                f.bracingPatternMember.referenceCode === referenceCode &&
                f.face === face
        );
        if (member.length === 0) throw Error("Zero face members ");
        member.forEach(e => (e.overstressed = true));
    }
}
