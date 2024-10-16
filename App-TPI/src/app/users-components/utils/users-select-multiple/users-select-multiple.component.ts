import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiServiceService } from '../../../users-servicies/api-service.service';
import { RolModel } from '../../../users-models/Rol';

@Component({
  selector: 'app-users-select-multiple',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-select-multiple.component.html',
  styleUrl: './users-select-multiple.component.css'
})
export class UsersSelectMultipleComponent implements OnInit, OnChanges {
  //pasar los roles desde el padre
  // @Input() roles = [];

  //enviar los roles seleccionados
  @Input() rolesSelected : string[] = [];
  roles: RolModel[] = [];

  title : string = "Seleccione un rol..."


  private readonly apiService = inject(ApiServiceService);

  ngOnInit(): void {
    this.apiService.getAllRoles().subscribe({
      next: (data) => {
        this.roles = data;
        
      },
      error: (error) => {
        console.error(error);
      }
    });
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.rolesSelected);
    this.roles.forEach( r => {
      if(this.rolesSelected.includes(r.description)){
        $("#"+r.id).prop('checked', true);
      }
    })

    this.setTitle();
  }


  setTitle(){
    this.title = ""

    if(this.rolesSelected.length > 0){
      this.rolesSelected.forEach( r => {
        this.title += r + ", ";
      })

      this.title = this.title.slice(0, -2);
      
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
