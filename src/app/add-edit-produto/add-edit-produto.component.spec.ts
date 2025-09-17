import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditProdutoComponent } from './add-edit-produto.component';

describe('AddEditProdutoComponent', () => {
  let component: AddEditProdutoComponent;
  let fixture: ComponentFixture<AddEditProdutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditProdutoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
