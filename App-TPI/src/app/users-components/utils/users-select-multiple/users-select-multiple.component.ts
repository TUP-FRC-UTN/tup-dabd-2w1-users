import { CommonModule } from '@angular/common';
import { Component,EventEmitter,Input, OnInit, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users-select-multiple',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-select-multiple.component.html',
  styleUrl: './users-select-multiple.component.css',
})
export class UsersSelectMultipleComponent{
  //Título del select ('Seleccione...')
  @Input() titleDefault: string = '';

  //Opciones a seleccionar (lista de objetos)
  @Input() options: any[] = [];

  //Opciones ya seleccionadas
  @Input() selectedOptions?: any[] = [];

  //Opciones seleccionadas
  @Output() valuesEmited = new EventEmitter<any[]>();

  //lista de opciones
  loptions : any[] = [];

  addOption(option : any){
    if(!this.loptions.includes(option)){
      this.loptions.push(option);

    this.valuesEmited.emit(this.loptions)
    }
  }

  removeOption(option : any){
    //Quita la opción que no coincida
    this.loptions = this.loptions.filter(o => o !== option);

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
