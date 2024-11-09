import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerStatusCountComponent } from './owner-status-count.component';

describe('OwnerStatusCountComponent', () => {
  let component: OwnerStatusCountComponent;
  let fixture: ComponentFixture<OwnerStatusCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerStatusCountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerStatusCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
