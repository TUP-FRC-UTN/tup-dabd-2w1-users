import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-info-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-info-user.component.html',
  styleUrl: './modal-info-user.component.css'
})
export class ModalInfoUserComponent{
  nameInput : string = "";
  lastNameInput : string = "";
  emailInput : string = "";
  dniInput : string = "";
  telefonoInput : string = "";
  birthdateInput : Date = new Date();

}
