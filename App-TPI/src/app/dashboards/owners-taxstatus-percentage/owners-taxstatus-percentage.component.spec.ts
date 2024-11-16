import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnersTaxstatusPercentageComponent } from './owners-taxstatus-percentage.component';

describe('OwnersTaxstatusPercentageComponent', () => {
  let component: OwnersTaxstatusPercentageComponent;
  let fixture: ComponentFixture<OwnersTaxstatusPercentageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnersTaxstatusPercentageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnersTaxstatusPercentageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
