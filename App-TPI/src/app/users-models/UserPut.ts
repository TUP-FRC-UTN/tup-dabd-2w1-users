export class UserPut {
    name: string;
    lastName: string;     
    dni: string;   
    phoneNumber: string;
    email: string;                  
    avatar_url: string;   
    datebirth: string;    
    roles: string[];      
    user_update_id: number;

    constructor() {
        this.name = '';
        this.lastName = '';
        this.email = '';
        this.dni = '';
        this.avatar_url = '';
        this.datebirth = '';
        this.roles = [];
        this.phoneNumber = '';
        this.user_update_id= 0;
    }
}
