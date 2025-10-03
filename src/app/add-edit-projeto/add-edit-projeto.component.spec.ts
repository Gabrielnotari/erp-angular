import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditProjetoComponent } from './add-edit-projeto.component';

describe('AddEditProjetoComponent', () => {
  let component: AddEditProjetoComponent;
  let fixture: ComponentFixture<AddEditProjetoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditProjetoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditProjetoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
