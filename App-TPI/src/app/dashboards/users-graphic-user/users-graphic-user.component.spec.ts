import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersGraphicUserComponent } from './users-graphic-user.component';

describe('UsersGraphicUserComponent', () => {
  let component: UsersGraphicUserComponent;
  let fixture: ComponentFixture<UsersGraphicUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersGraphicUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersGraphicUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
