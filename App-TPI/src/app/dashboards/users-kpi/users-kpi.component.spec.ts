import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersKpiComponent } from './users-kpi.component';

describe('UsersKpiComponent', () => {
  let component: UsersKpiComponent;
  let fixture: ComponentFixture<UsersKpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersKpiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
