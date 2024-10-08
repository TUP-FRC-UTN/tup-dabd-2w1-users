export class UserPost {
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
    password: string;

    constructor() {
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
        this.password = ''; 
    }
}
