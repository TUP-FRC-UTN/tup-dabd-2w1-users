import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersModalPlotComponent } from './users-modal-plot.component';

describe('UsersModalPlotComponent', () => {
  let component: UsersModalPlotComponent;
  let fixture: ComponentFixture<UsersModalPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersModalPlotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersModalPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
