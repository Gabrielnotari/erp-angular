import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditFornecedorComponent } from './add-edit-fornecedor.component';

describe('AddEditFornecedorComponent', () => {
  let component: AddEditFornecedorComponent;
  let fixture: ComponentFixture<AddEditFornecedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditFornecedorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
