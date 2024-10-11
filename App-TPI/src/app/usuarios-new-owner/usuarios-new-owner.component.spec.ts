import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosNewOwnerComponent } from './usuarios-new-owner.component';

describe('UsuariosNewOwnerComponent', () => {
  let component: UsuariosNewOwnerComponent;
  let fixture: ComponentFixture<UsuariosNewOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosNewOwnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosNewOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
