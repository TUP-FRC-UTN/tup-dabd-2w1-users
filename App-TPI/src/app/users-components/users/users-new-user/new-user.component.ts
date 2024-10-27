import { CommonModule, formatDate } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RolModel } from '../../../users-models/users/Rol';
import { UserService } from '../../../users-servicies/user.service';
import { UserGet } from '../../../users-models/users/UserGet';
import { UserPost } from '../../../users-models/users/UserPost';
import { Router, RouterModule } from '@angular/router';
import { UsersSelectMultipleComponent } from "../../utils/users-select-multiple/users-select-multiple.component";
import { DateService } from '../../../users-servicies/date.service';
import { AuthService } from '../../../users-servicies/auth.service';
import Swal from 'sweetalert2';
import { PlotService } from '../../../users-servicies/plot.service';
import { GetPlotDto } from '../../../users-models/plot/GetPlotDto';

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule, UsersSelectMultipleComponent],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.css'
})
export class NewUserComponent implements OnInit {

  constructor(private router:Router){
    
  }

  private readonly apiService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly plotService = inject(PlotService);

  rolesSelected : string[] = [];
  roles: RolModel[] = [];
  rolesHtmlString: string = '';  //
  rolesString: string = "Roles añadidos:";
  rolesInput: string[] = [];
  select: string = "";
  checkRole: boolean = false;
  lotes: GetPlotDto[] = [];
  

  ngOnInit() {
    this.loadRoles();

     //SOLO MUESTRA LOS LOTES DISPONIBLES
     this.plotService.getAllPlotsAvailables().subscribe({
      next: (data: GetPlotDto[]) => {
        console.log(data);
        
          if(this.authService.getActualRole() == "Owner"){
              this.lotes = data.filter(lote => lote.id == this.authService.getUser().plotId);
              this.formReactivo.get('plot')?.setValue(this.authService.getUser().plotId.toString());
              this.formReactivo.get('plot')?.disable();

          }else{
            this.lotes = data;
          }
      },
      error: (err) => {
        console.error('Error al cargar los tipos de lote:', err);
      }
    });
  }


  formReactivo = new FormGroup({
    name: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50)
    ]),
    lastname: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50)
    ]),
    username: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(30)
  ]),
    email: new FormControl('', [
        Validators.required,
        Validators.email
    ]),
    phone_number: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.minLength(10),
        Validators.maxLength(20)
    ]),
    dniType: new FormControl('', [
      Validators.required
      
    ]),
    dni: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.minLength(1),
        Validators.maxLength(11)
    ]),
    telegram_id: new FormControl(0,[
        Validators.required,
        Validators.min(0),
        Validators.minLength(1)
    ]),
    active: new FormControl(true), 
    datebirth: new FormControl(DateService.formatDate(new Date("2000-01-02")), [Validators.required]),
    roles: new FormControl(''),
    plot: new FormControl(''),
    userUpdateId: new FormControl(this.authService.getUser().id)
  });
  
  //Carga los roles
  loadRoles() {
    this.apiService.getAllRoles().subscribe({
      next: (data: RolModel[]) => {

        this.roles = data;
      },
      error: (error) => {
        console.error('Error al cargar los roles:', error);
        
      }
    });
  }
  
  //Redirige a la ruta especificada 
  redirect(path:string){
    this.router.navigate([path]);
  }

  //Resetear formularios
  resetForm() {
    this.formReactivo.reset();
    this.rolesInput = [];
  }

  //Añade los roles seleccionados por users-select-multiple
  fillRolesSelected(roles: any) {
    this.rolesSelected = roles;  // Asignamos directamente los roles emitidos
  }

  verifyRole() {
    if(this.rolesSelected.length === 0){  
      this.checkRole = false;
    }
    else{
      this.checkRole = true;
    }
  }
  

  //Se crea el usuario
  createUser() {
    
    const fechaValue = this.formReactivo.get('datebirth')?.value;
    
    const userData : UserPost = {
      name: this.formReactivo.get('name')?.value || '',
      lastname: this.formReactivo.get('lastname')?.value || '',
      username: this.formReactivo.get('username')?.value || '',
      password: this.formReactivo.get('password')?.value?.toString() || '',
      email: this.formReactivo.get('email')?.value || '',
      dni_type_id: Number(this.formReactivo.get('dniType')?.value) || 0,
      dni: this.formReactivo.get('dni')?.value?.toString() || "",
      active: true,
      avatar_url: "asd",
      datebirth: fechaValue ? new Date(fechaValue).toISOString().split('T')[0] : '',
      roles: this.rolesSelected,
      phone_number: this.formReactivo.get('phone_number')?.value?.toString() || '',
      userUpdateId: this.formReactivo.get('userUpdateId')?.value || 0,
      telegram_id: this.formReactivo.get('telegram_id')?.value || 0
    
    };

    //Si el usuario es de tipo owner se setea el plotId
    if(this.authService.hasRole('Owner')){
      userData.plot_id = this.authService.getUser().plotId;
    }else{
      userData.plot_id = 0;
    }


    console.log(userData);
    

    this.apiService.postUser(userData).subscribe({
      next: (response) => {
        //Mostramos que la operación fue exitosa
        Swal.fire({
          title: 'Usuario creado',
          text: 'El usuario se ha creado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        if(this.authService.getActualRole() == "Owner"){
          this.router.navigate(['/home/family']);
        }
        //Reseteamos el formulario
        this.resetForm();
      },
      error: (error) => {
        //Mostramos que hubo un error
        Swal.fire({
          title: 'Error',
          text: 'El usuario no se pudo crear',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        
      },
    });
  }
}