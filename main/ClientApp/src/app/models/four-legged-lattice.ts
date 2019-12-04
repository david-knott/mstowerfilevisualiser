import { Section } from "./section";
export class FourLeggedLattice {
    private readonly sections: Array<Section> = new Array();
    private groundHeight: number = 0;
    constructor() {}
    getGroundHeight(): number {
        return this.groundHeight;
    }
    setGroundHeight(g: number) {
        this.groundHeight = g;
    }
    createSection(reference: number) {
        let section = new Section(this, reference);
        this.sections.push(section);
        return section;
    }
    findSection(reference: number): Section {
        let section = this.sections.filter(x => x.reference == reference);
        if (section.length > 1)
            throw Error("More than one section with reference " + reference);
        if (section.length === 0)
            throw Error("Zero sections with reference " + reference);
        return section[0];
    }
    render(callback: (n: any) => any): void {
        this.sections.forEach(section => {
            section.panelAssembly.forEach(panelAssembly => {
                panelAssembly.members.forEach(member => {
                    callback({
                        groundHeight: panelAssembly.getGroundHeight(),
                        member: member,
                        panelAssembly: panelAssembly
                    });
                });
            });
        });
    }
}
