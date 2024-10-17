export class UserPost {
    name: string;
    lastname: string;   
    username: string;     
    email: string;        
    dni: string;         
    active: boolean;      
    avatar_url: string;   
    datebirth: string;    
    roles: string[];      
    password: string;
    phone_number: string;
    user_update_id: number;

    constructor() {
        this.name = '';
        this.lastname = '';
        this.username = '';
        this.email = '';
        this.dni = "";
        this.active = true;
        this.avatar_url = '';
        this.datebirth = '';
        this.roles = [];
        this.password = '';
        this.phone_number = '';
        this.user_update_id = 0;
    }
}
