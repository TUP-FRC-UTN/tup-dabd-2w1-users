export class UserPut {
    name: string;
    lastName: string;     
    dni: string;   
    phoneNumber: string;
    email: string;                  
    avatar_url: string;   
    datebirth: string;    
    roles: string[];      

    constructor() {
        this.name = '';
        this.lastName = '';
        this.email = '';
        this.dni = '';
        this.avatar_url = '';
        this.datebirth = '';
        this.roles = [];
        this.phoneNumber = ''
    }
}
