import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrcamentoDetailsComponent } from './orcamento-details.component';

describe('OrcamentoDetailsComponent', () => {
  let component: OrcamentoDetailsComponent;
  let fixture: ComponentFixture<OrcamentoDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrcamentoDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrcamentoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
