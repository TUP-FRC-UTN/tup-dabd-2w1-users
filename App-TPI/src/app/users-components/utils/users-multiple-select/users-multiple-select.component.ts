import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgLabelTemplateDirective, NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-users-multiple-select',
  standalone: true,
  imports: [NgSelectModule, FormsModule, JsonPipe, NgLabelTemplateDirective],
  templateUrl: './users-multiple-select.component.html',
  styleUrl: './users-multiple-select.component.css'
})
export class UsersMultipleSelectComponent{
   //Lista de opciones (Requiere un objeto {value: , name: })
   @Input() options: any[] = []

   //Permite seleccionar varios objetos
   @Input() multiple: boolean = true;

   @Input() placeholder: string = "Seleccione..."
 
   //Lista con los VALUES de los objetos que ya tienen que venir seleccionados (Ej: [1, 2] o ["Persona Física"])
   @Input() selectedOptions: any[] = [];
 
   //Listado de ids de los objetos seleccionados (el value del select)
   @Output() selectedOptionsChange = new EventEmitter<any[]>();
 
 
   ngOnInit(): void {
     if (!this.selectedOptions) {
       this.selectedOptions = [];
     }
   }
 
   update() {
     console.log("Options:" + this.selectedOptions);
     this.selectedOptionsChange.emit(this.selectedOptions);
   }
}
