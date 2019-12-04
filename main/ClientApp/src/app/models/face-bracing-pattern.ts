import { BracingPattern } from "./bracing-pattern";
import data from "./bracing-pattern-library.json";

export class BracingPatternFactory {
    static getFaceBracingPattern(reference: string): BracingPattern {
        let bp = new GenericBracingPattern2(
            data.faceBracingPatterns[reference]
        );
        return bp;
    }

    static getPlanBracingPattern(reference: string): BracingPattern {
        return new TestPlanBracingPattern();
    }
}

export class TestPlanBracingPattern extends BracingPattern {
    thickness: number = 0.09;
    members: Array<BracingPatternMember>;
    public quad: Array<number>;

    constructor() {
        super();
        this.members = new Array();
        this.quad =  [1, 209, 269, 209, 240, 1, 30, 1];
    }
    getMembers(): BracingPatternMember[] {
        return [
            new BracingPatternMember("B1", [0, -0.5, -0.5, 0], this.thickness),
            new BracingPatternMember("B2", [-0.5, 0, 0, 0.5], this.thickness),
            new BracingPatternMember("B3", [0, 0.5, 0.5, 0], this.thickness),
            new BracingPatternMember("B4", [0.5, 0, 0.5, 0], this.thickness)
        ];
    }
}

export class GenericBracingPattern2 extends BracingPattern {
    thickness: number = 0.19;
    members: Array<BracingPatternMember>;
    public quad: Array<number>;

    constructor(obj: any) {
        super();
        this.members = new Array();
        this.quad = obj.quad;
        obj.members.forEach(element => {
            this.members.push(
                new BracingPatternMember(
                    element.code,
                    element.path,
                    this.thickness
                )
            );
        });
    }
    getMembers(): BracingPatternMember[] {
        return this.members;
    }
}

export class TestTwoFaceBracingPattern extends BracingPattern {
    getMembers(): BracingPatternMember[] {
        throw new Error("Method not implemented.");
    }
    thickness: number = 0.06;
    constructor() {
        super();
    }

    private vertices: Array<Vertice2D> = [
        new Vertice2D(0.5, 0.5),
        new Vertice2D(0.5, -0.5),
        new Vertice2D(-0.5, -0.5),
        new Vertice2D(-0.5, 0.5),
        new Vertice2D(-0.5, 0)
    ];

    private members: Array<BracingPatternMember> = [];
}
export class TestFaceBracingPattern extends BracingPattern {
    getMembers(): BracingPatternMember[] {
        throw new Error("Method not implemented.");
    }
    thickness: number = 0.06;
    constructor() {
        super();
    }

    private vertices: Array<Vertice2D> = [];

    private members: Array<BracingPatternMember> = [];
}

export class FaceBracingPattern extends BracingPattern {
    getMembers(): BracingPatternMember[] {
        throw new Error("Method not implemented.");
    }
    constructor() {
        super();
    }
}

export class Member {
    constructor(
        public bracingPatternMember: BracingPatternMember,
        public start: Point2d,
        public end: Point2d
    ) {}
}

export class Member3d {
    constructor(
        public bracingPatternMember: BracingPatternMember,
        public start: Point3d,
        public end: Point3d,
        public overstressed: boolean,
        public face: number
    ) {}
}

export class BracingPatternMember {
    constructor(
        public readonly referenceCode: String,
        //public readonly edge: Edge,
        public readonly edge: Array<number>,
        public readonly thickness: number
    ) {}
}

class Vertice2D {
    constructor(public x: number, public y: number) {}
}

export class Point2d {
    constructor(public x: number, public y: number) {}

    scaleX(s: number): void {
        this.x *= s;
    }

    scaleY(s: number): void {
        this.y *= s;
    }

    extendTo3d(z: number): Point3d {
        return new Point3d(this.x, this.y, z);
    }
}

class Point3d {
    constructor(public x: number, public y: number, public z: number) {}

    scaleX(s: number): void {
        if (Number.isNaN(s)) throw Error("s parameter is not a number");
        this.x *= s;
    }

    scaleY(s: number): void {
        if (Number.isNaN(s)) throw Error("s parameter is not a number");
        this.y *= s;
    }

    scaleZ(s: number): void {
        if (Number.isNaN(s)) throw Error("s parameter is not a number");
        this.z *= s;
    }

    transX(s: number): void {
        if (Number.isNaN(s)) throw Error("s parameter is not a number");
        this.x += s;
    }

    transY(s: number): void {
        if (Number.isNaN(s)) throw Error("s parameter is not a number");
        this.y += s;
    }

    transZ(s: number): void {
        if (Number.isNaN(s)) throw Error("s parameter is not a number");
        this.z += s;
    }

    rotateX(rads: number): void {
        if (Number.isNaN(rads)) throw Error("rad parameter is not a number");
        //  res[i][1] = ys * Math.cos(fs) - zs * Math.sin(fs);
        //  res[i][2] = zs * Math.cos(fs) + ys * Math.sin(fs);
        this.y = this.z * Math.cos(rads) - this.y * Math.sin(rads);
        this.z = this.y * Math.cos(rads) - this.z * Math.sin(rads);
    }

    rotateY(rads: number): void {
        if (Number.isNaN(rads)) throw Error("rad parameter is not a number");
        this.x = this.x * Math.cos(rads) - this.z * Math.sin(rads);
        this.z = this.z * Math.cos(rads) + this.x * Math.sin(rads);
    }
}
