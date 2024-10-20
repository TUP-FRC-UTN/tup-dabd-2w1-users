import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../users-servicies/user.service';
import { RolModel } from '../../../users-models/users/Rol';

@Component({
  selector: 'app-users-select-multiple',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-select-multiple.component.html',
  styleUrl: './users-select-multiple.component.css'
})
export class UsersSelectMultipleComponent implements OnInit, OnChanges {
  @Input() rolesSelected : string[] = [];
  @Input() rolChanger: string = '';

  listRolesForOwner: string[] = ['User'];

  roles: RolModel[] = [];

  title : string = "Seleccione un rol..."


  private readonly apiService = inject(UserService);

  ngOnInit(): void {
    this.apiService.getAllRoles().subscribe({
      next: (data) => {

          this.roles = data;
        if(this.rolChanger == "Owner"){
          this.roles = data.filter( r => this.listRolesForOwner.includes(r.description));
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
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

    console.log("Roles cuando se agrega o quita un rol:" + this.rolesSelected);
    
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
