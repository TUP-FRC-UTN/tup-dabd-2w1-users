import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RolModel } from '../models/Rol';

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.css'
})
export class NewUserComponent  implements OnInit{

  roles : RolModel[] = [];

  constructor(private http: HttpClient) {
    this.http.get<RolModel[]>("http://localhost:8080/roles").subscribe((data: any) => {
      this.roles = data.map((user: any) => {
        const rolModel = new RolModel();
        rolModel.id = user.id;
        rolModel.description = user.description;
        console.log(rolModel);
        
        return rolModel;
      });
    });
  }

  nameInput : string = "";
  lastNameInput : string = "";
  emailInput : string = "";
  dniInput : string = "";
  telefonoInput : string = "";
  birthdateInput : Date = new Date();
  select : string = "";

  ngOnInit(): void {
    
  }

  fillSelect(){}

  

  createUser(form : any) {
  console.log(form.value);
    var username : string = this.nameInput + this.lastNameInput;
    var password : string = this.dniInput;
    var contact_id : number = 2;
    var active : boolean = true;
    var name : string = form.value.nameInp;
    var lastname : string = form.value.lastNameImp;
    var email : string = form.value.emailInp;
    var dni : string = form.value.dniInp;
    var datebirth : Date = form.value.birthdateInp;
    var roles : string[] = [form.value.selectRol];

    const userData = {
      username: username,
      password: password,
      contact_id: contact_id,
      active: active,
      name: name,
      lastname: lastname,
      email: email,
      dni: dni,
      datebirth: datebirth,
      roles: roles
    };

    console.log(userData);
    

    this.http.post("http://localhost:8080/users", userData).subscribe({
      next: (response) => {
        console.log('Usuario creado exitosamente:', response);
        // Aquí puedes manejar el éxito (mostrar notificación, limpiar el formulario, etc.)
      },
      error: (error) => {
        console.error('Error al crear el usuario:', error);
        // Manejo del error
      }
    });
    
  }
}