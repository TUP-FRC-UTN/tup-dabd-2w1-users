import { Component, EventEmitter, Output } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Output() logOut = new EventEmitter<void>();

  expand : boolean = false;

  changeState(){
    this.expand = !this.expand;
  }

  exit(){
    this.logOut.emit();
  }
}
