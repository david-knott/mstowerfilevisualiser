import { Member, Point2d, BracingPatternMember } from "./face-bracing-pattern";

export abstract class BracingPattern {
    abstract getMembers(): Array<BracingPatternMember>;

    public quad: Array<number>;

    public getVertices(): Array<Member> {
        var res = Array<Member>();
        this.getMembers().forEach(member => {
            var startPoint = new Point2d(member.edge[0], member.edge[1]);
            var endPoint = new Point2d(member.edge[2], member.edge[3]);
            let mem = new Member(member, startPoint, endPoint);
            res.push(mem);
        });
        return res;
    }
}
