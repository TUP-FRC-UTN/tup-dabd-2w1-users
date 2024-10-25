import { FileDto } from "./FileDto";

export class Owner{

    id: number;
    name: string;
    lastname: string;
    dni: string;
    cuitCuil: string;
    dateBirth: string;
    bussinesName: string;
    taxStatus: string;
    active: boolean;
    ownerType: string;
    files: FileDto[];
    // files: string[]

    constructor(){
        this.id = 0;
        this.name = "";
        this.lastname = "";
        this.dni = "";
        this.cuitCuil = "";
        this.dateBirth = "";
        this.bussinesName = "";
        this.taxStatus = "";
        this.active = true;
        this.ownerType = "";
        this.files = []
    }
}