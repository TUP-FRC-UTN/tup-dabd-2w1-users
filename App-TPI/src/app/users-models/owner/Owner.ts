import { OwnerType } from "./OwnerType";
import { TaxStatus } from "./TaxStatus";

export class Owner{
    id : number;
    name : string;
    lastname : string;
    dni : string;
    cuitCuil : string;
    email : string;
    phoneNumber : string;
    dateBirth : Date; //cambiar el nombre acá y en el back
    ownerType : OwnerType;
    taxStatus : TaxStatus;
    businessName : string;
    active : boolean;

    constructor(){
        this.id = 0;
        this.name = "";
        this.lastname = "";
        this.dni = "";
        this.cuitCuil = "";
        this.email = "";
        this.phoneNumber = "";
        this.dateBirth = new Date();
        this.ownerType = new OwnerType();
        this.taxStatus = new TaxStatus();
        this.businessName = "";
        this.active = false;
    }
}