export class UserModel {
    id: number;
    name: string;
    lastname: string;   
    username: string;     
    email: string;        
    dni: number;        
    contact_id: number;   
    active: boolean;      
    avatar_url: string;   
    datebirth: string;    
    roles: string[];      

    constructor() {
        this.id = 0;
        this.name = '';
        this.lastname = '';
        this.username = '';
        this.email = '';
        this.dni = 0;
        this.contact_id = 0;
        this.active = true;
        this.avatar_url = '';
        this.datebirth = '';
        this.roles = [];
    }
}
