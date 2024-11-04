import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersListPlotsComponent } from './users-list-plots.component';

describe('UsersListPlotsComponent', () => {
  let component: UsersListPlotsComponent;
  let fixture: ComponentFixture<UsersListPlotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersListPlotsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersListPlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
