export class Owner{

    id: number;
    name: string;
    lastname: string;
    dni: string;
    cuitCuil: string;
    dateBirth: Date;
    businessName: string;
    taxStatus: string;
    active: boolean;
    ownerType: string;
    // files: string[]

    constructor(){
        this.id = 0;
        this.name = "";
        this.lastname = "";
        this.dni = "";
        this.cuitCuil = "";
        this.dateBirth = new Date();
        this.businessName = "";
        this.taxStatus = "";
        this.active = true;
        this.ownerType = "";
        // this.files = []
    }
}