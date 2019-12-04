import { BracingPattern } from "./bracing-pattern";
import { Panel } from "./panel";
import { Member, Point2d, BracingPatternMember } from "./face-bracing-pattern";
import * as THREE from "three";
import { ProjectiveTransform } from "./projective-transform";

export class PlanBracingPanel extends Panel {
    private readonly width: number;
    private readonly depth: number;
    private readonly vertices: Array<Member>;

    constructor(width: number, depth: number, bracingPattern: BracingPattern) {
        super(bracingPattern);
        this.width = width;
        this.depth = depth;
        this.vertices = this.scaleBy(
            bracingPattern.getVertices(),
            this.width,
            this.depth
        );
    }

    getPositionedMembers(): Array<Member> {
        return this.vertices;
    }

    private scaleBy(
        vertices: Array<Member>,
        w: number,
        d: number
    ): Array<Member> {
        var srcCorners = this.bracingPattern.quad;
        var dstCorners = [
            -w / 2,
            -d / 2,
            w / 2,
            -d / 2,
            w / 2,
            d / 2,
            -w / 2,
            d / 2
        ];
        console.log(dstCorners);
        let pt = new ProjectiveTransform(srcCorners, dstCorners);
        let scaled = vertices.map(v => {
            let ts = pt.transform(v.start.x, v.start.y);
            let te = pt.transform(v.end.x, v.end.y);
            v.start.x = ts[0];
            v.start.y = ts[1];
            v.end.x = te[0];
            v.end.y = te[1];
            return v;
        });
        return scaled;
    }
}
/**
 * A face panel with a bottom and top width. This class
 * represents the scaled version of the panel bracing pattern
 * It scales the bracing pattern using a perspective transformation
 * Note that at this stage the face panel is still a 2 dimensional object
 */
export class FacePanel extends Panel {
    private readonly bottomWidth: number;
    private readonly height: number;
    private readonly topWidth: number;
    private readonly vertices: Array<Member>;

    constructor(
        bottomWidth: number,
        topWidth: number,
        height: number,
        bracingPattern: BracingPattern
    ) {
        super(bracingPattern);
        this.topWidth = topWidth;
        this.height = height;
        this.topWidth = topWidth;
        this.bottomWidth = bottomWidth;
        this.vertices = this.scaleBy(
            bracingPattern.getVertices(),
            this.height,
            this.bottomWidth,
            this.topWidth
        );
    }

    findMember(code: string): BracingPatternMember {
        let member = this.vertices.filter(
            f => f.bracingPatternMember.referenceCode === code
        );
        if (member.length > 1)
            throw Error("More than one member with reference " + code);
        if (member.length === 0)
            throw Error("Zero sections with reference " + code);
        return member[0].bracingPatternMember;
    }

    getPositionedMembers(): Array<Member> {
        return this.vertices;
    }

    private scaleBy(
        vertices: Array<Member>,
        h: number,
        bw: number,
        tw: number
    ): Array<Member> {
        //var srcCorners = [-0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5];
        var srcCorners = this.bracingPattern.quad;
        var dstCorners = [
            -bw / 2,
            -h / 2,
            bw / 2,
            -h / 2,
            tw / 2,
            h / 2,
            -tw / 2,
            h / 2
        ];
        let pt = new ProjectiveTransform(srcCorners, dstCorners);
        let scaled = vertices.map(v => {
            let ts = pt.transform(v.start.x, v.start.y);
            let te = pt.transform(v.end.x, v.end.y);
            v.start.x = ts[0];
            v.start.y = ts[1];
            v.end.x = te[0];
            v.end.y = te[1];
            return v;
        });
        return scaled;
    }
}
