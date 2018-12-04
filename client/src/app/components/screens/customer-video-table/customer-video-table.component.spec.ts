import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerVideoTableComponent } from './customer-video-table.component';

describe('CustomerVideoTableComponent', () => {
  let component: CustomerVideoTableComponent;
  let fixture: ComponentFixture<CustomerVideoTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerVideoTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerVideoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
