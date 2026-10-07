import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { CategoryResponse } from '../../models/category.model';
import { CategoriesStateService } from '../../services/categories-state.service';
import { CategoryListComponent } from './category-list.component';

describe('CategoryListComponent', () => {
  let component: CategoryListComponent;
  let fixture: ComponentFixture<CategoryListComponent>;
  let categoriesStateMock: {
    categories: ReturnType<typeof signal<CategoryResponse[]>>;
    isLoading: ReturnType<typeof signal<boolean>>;
    errorMessage: ReturnType<typeof signal<string | null>>;
    loadCategories: ReturnType<typeof vi.fn>;
    createCategory: ReturnType<typeof vi.fn>;
    updateCategory: ReturnType<typeof vi.fn>;
    deleteCategory: ReturnType<typeof vi.fn>;
  };
  let dialogMock: { open: ReturnType<typeof vi.fn> };

  const mockCategories: CategoryResponse[] = [
    { id: '1', name: 'Alimentação', userId: '', icon: '🍔' },
    { id: '2', name: 'Transporte', userId: 'user-1', icon: '🚗' },
  ];

  beforeEach(async () => {
    categoriesStateMock = {
      categories: signal(mockCategories),
      isLoading: signal(false),
      errorMessage: signal(null),
      loadCategories: vi.fn(),
      createCategory: vi.fn(),
      updateCategory: vi.fn(),
      deleteCategory: vi.fn(),
    };

    dialogMock = {
      open: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CategoryListComponent],
      providers: [
        { provide: CategoriesStateService, useValue: categoriesStateMock },
        { provide: MatDialog, useValue: dialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create category list component and load categories', () => {
    expect(component).toBeTruthy();
    expect(categoriesStateMock.loadCategories).toHaveBeenCalled();
  });

  it('should display categories', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Alimentação');
    expect(compiled.textContent).toContain('Transporte');
  });

  it('should show loading spinner when loading', () => {
    TestBed.resetTestingModule();

    const loadingStateMock = {
      categories: signal([]),
      isLoading: signal(true),
      errorMessage: signal(null),
      loadCategories: vi.fn(),
      createCategory: vi.fn(),
      updateCategory: vi.fn(),
      deleteCategory: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [CategoryListComponent],
      providers: [
        { provide: CategoriesStateService, useValue: loadingStateMock },
        { provide: MatDialog, useValue: dialogMock },
      ],
    });

    const loadingFixture = TestBed.createComponent(CategoryListComponent);
    loadingFixture.detectChanges();

    const compiled = loadingFixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-spinner')).toBeTruthy();
  });

  it('should show error message when error occurs', () => {
    TestBed.resetTestingModule();

    const errorStateMock = {
      categories: signal([]),
      isLoading: signal(false),
      errorMessage: signal('Erro ao carregar categorias'),
      loadCategories: vi.fn(),
      createCategory: vi.fn(),
      updateCategory: vi.fn(),
      deleteCategory: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [CategoryListComponent],
      providers: [
        { provide: CategoriesStateService, useValue: errorStateMock },
        { provide: MatDialog, useValue: dialogMock },
      ],
    });

    const errorFixture = TestBed.createComponent(CategoryListComponent);
    errorFixture.detectChanges();

    const compiled = errorFixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Erro ao carregar categorias');
  });

  it('should show empty state when no categories', () => {
    TestBed.resetTestingModule();

    const emptyStateMock = {
      categories: signal([]),
      isLoading: signal(false),
      errorMessage: signal(null),
      loadCategories: vi.fn(),
      createCategory: vi.fn(),
      updateCategory: vi.fn(),
      deleteCategory: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [CategoryListComponent],
      providers: [
        { provide: CategoriesStateService, useValue: emptyStateMock },
        { provide: MatDialog, useValue: dialogMock },
      ],
    });

    const emptyFixture = TestBed.createComponent(CategoryListComponent);
    emptyFixture.detectChanges();

    const compiled = emptyFixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Nenhuma categoria cadastrada');
  });
});
