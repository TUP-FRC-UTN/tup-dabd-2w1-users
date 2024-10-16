import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users-select-multiple',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-select-multiple.component.html',
  styleUrl: './users-select-multiple.component.css'
})
export class UsersSelectMultipleComponent {
  //pasar los roles desde el padre
  // @Input() roles = [];

  //enviar los roles seleccionados
  @Input() rolesSelected : string[] = [];

  title : string = "Seleccione un rol..."

  roles = ["SuperAdmin", "Admin", "Security", "Owner"]

  setTitle(){
    this.title = ""

    if(this.rolesSelected.length > 0){
      this.rolesSelected.forEach( r => {
        this.title += r + ", ";
      })
      
    }
    else{
        this.title = "Seleccione un rol...";
    }
  }

  addRole(role: string) {
    if (!this.rolesSelected.includes(role)) {
      this.rolesSelected.push(role);
      this.setTitle();
    }
  }

  removeRole(role: string) {
    this.rolesSelected = this.rolesSelected.filter(r => r !== role);
    this.setTitle(); 
  }

  onCheckboxChange(event: any) {
    //si está chequeado
    const isChecked = event.target.checked;
    //traer el valor
    const value = event.target.value;

    //agregar o quitar roles
    if(isChecked){
      this.addRole(value);
    }
    else{ this.removeRole(value)}
  }

}
