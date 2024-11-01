import { CommonModule } from '@angular/common';
import { Component,EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../users-servicies/user.service';
import { RolModel } from '../../../users-models/users/Rol';
import { AuthService } from '../../../users-servicies/auth.service';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-users-select-multiple',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './users-select-multiple.component.html',
  styleUrl: './users-select-multiple.component.css',
})
export class UsersSelectMultipleComponent{
  //Título del select ('Seleccione...')
  @Input() subTitleLabel: string = '';

  //Opciones a seleccionar
  @Input() options: string[] = [];

  //Opciones seleccionadas
  @Output() valuesEmited = new EventEmitter<string[]>();

  //lista de opciones
  loptions : string[] = [];

  addOption(option : string){
    if(!this.loptions.includes(option)){
      this.loptions.push(option);

      this.valuesEmited.emit(this.loptions)
    }
  }

  removeOption(option : string){
    //Quita la opción que no coincida
    this.loptions = this.loptions.filter( o => o !== option);

    //Emite la lista
     this.valuesEmited.emit(this.loptions)
  }

  onChange(event: any) {
    //si está chequeado    
    const isChecked = event.target.checked;

    //traer el valor
    const value = event.target.value;
    
    //agregar o quitar roles
    if (isChecked) {
      this.addOption(value);
    } 
    else {
      this.removeOption(value);
    }
  }

  emptyList(){
    this.loptions = [];
  }
}
