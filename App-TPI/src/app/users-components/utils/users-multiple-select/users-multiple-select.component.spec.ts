import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersMultipleSelectComponent } from './users-multiple-select.component';

describe('UsersMultipleSelectComponent', () => {
  let component: UsersMultipleSelectComponent;
  let fixture: ComponentFixture<UsersMultipleSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersMultipleSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersMultipleSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
