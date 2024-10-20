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
    userUpdateId: number;
    telegram_id: number;
    plot_id: number;

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
        this.userUpdateId = 0;
        this.telegram_id = 0;
        this.plot_id = 0;
    }
}
