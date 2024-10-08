import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserModel } from '../models/User';
import { ApiServiceService } from '../servicies/api-service.service';

@Component({
  selector: 'app-modal-info-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-info-user.component.html',
  styleUrl: './modal-info-user.component.css'
})
export class ModalInfoUserComponent implements OnInit{
  nameInput : string = "";
  lastNameInput : string = "";
  emailInput : string = "";
  dniInput : string = "";
  telefonoInput : string = "";
  birthdateInput : Date = new Date();

  private readonly apiService = inject(ApiServiceService);

  @Input() user: number = 0;

  ngOnInit(): void {
    var user: UserModel = this.apiService.getUser(this.user);
  }


}
