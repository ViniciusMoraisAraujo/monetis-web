import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryFormDialogComponent } from './category-form-dialog.component';

describe('CategoryFormDialogComponent', () => {
  let component: CategoryFormDialogComponent;
  let fixture: ComponentFixture<CategoryFormDialogComponent>;
  let dialogRefMock: { close: ReturnType<typeof vi.fn> };

  describe('Create Mode', () => {
    beforeEach(async () => {
      dialogRefMock = { close: vi.fn() };

      await TestBed.configureTestingModule({
        imports: [CategoryFormDialogComponent],
        providers: [
          { provide: MatDialogRef, useValue: dialogRefMock },
          { provide: MAT_DIALOG_DATA, useValue: null }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(CategoryFormDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should initialize form for creating category', () => {
      expect(component.isEditMode).toBe(false);
      expect(component.form.valid).toBe(false);
      expect(component.dialogTitle).toBe('Nova Categoria');
    });

    it('should validate name and icon format', () => {
      const name = component.form.controls.name;
      const icon = component.form.controls.icon;

      name.setValue('123!');
      expect(name.valid).toBe(false);

      name.setValue('Alimentação');
      expect(name.valid).toBe(true);

      icon.setValue('');
      expect(icon.valid).toBe(false);

      icon.setValue('🍔');
      expect(icon.valid).toBe(true);

      expect(component.form.valid).toBe(true);
    });

    it('should close dialog with form data on valid submit', () => {
      component.form.setValue({
        name: 'Transporte',
        icon: '🚗'
      });

      component.onSubmit();

      expect(dialogRefMock.close).toHaveBeenCalledWith({
        name: 'Transporte',
        icon: '🚗'
      });
    });

    it('should close dialog on cancel', () => {
      component.onCancel();
      expect(dialogRefMock.close).toHaveBeenCalledWith();
    });
  });

  describe('Edit Mode', () => {
    beforeEach(async () => {
      dialogRefMock = { close: vi.fn() };

      await TestBed.configureTestingModule({
        imports: [CategoryFormDialogComponent],
        providers: [
          { provide: MatDialogRef, useValue: dialogRefMock },
          {
            provide: MAT_DIALOG_DATA,
            useValue: {
              category: {
                id: 'cat-1',
                name: 'Mercado',
                userId: 'user-1',
                icon: '🛒'
              }
            }
          }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(CategoryFormDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should initialize form for editing category', () => {
      expect(component.isEditMode).toBe(true);
      expect(component.dialogTitle).toBe('Editar Categoria');
      expect(component.form.controls.name.value).toBe('Mercado');
      expect(component.form.controls.icon.value).toBe('🛒');
    });
  });
});
