export class UserPut {
    name: string;
    lastname: string;     
    dni: string;   
    phone_number: string;
    email: string;                  
    avatar_url: string;   
    datebirth: string;    
    roles: string[];      

    constructor() {
        this.name = '';
        this.lastname = '';
        this.email = '';
        this.dni = '';
        this.avatar_url = '';
        this.datebirth = '';
        this.roles = [];
        this.phone_number = ''
    }
}
