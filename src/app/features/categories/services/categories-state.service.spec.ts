import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ApiError } from '../../../core/models/api-error.model';
import { CategoryResponse, CreateCategoryRequest, UpdateCategoryRequest } from '../models/category.model';
import { CategoriesApiService } from './categories-api.service';
import { CategoriesStateService } from './categories-state.service';

describe('CategoriesStateService', () => {
  let service: CategoriesStateService;
  let apiMock: {
    getAll: ReturnType<typeof vi.fn>;
    getById: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  const mockCategories: CategoryResponse[] = [
    { id: '1', name: 'Alimentação', userId: '', icon: '🍔' },
    { id: '2', name: 'Transporte', userId: 'user-1', icon: '🚗' }
  ];

  beforeEach(() => {
    apiMock = {
      getAll: vi.fn(),
      getById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        CategoriesStateService,
        provideRouter([]),
        { provide: CategoriesApiService, useValue: apiMock }
      ]
    });

    service = TestBed.inject(CategoriesStateService);
  });

  it('should initialize with empty categories and no error', () => {
    expect(service.categories()).toEqual([]);
    expect(service.errorMessage()).toBeNull();
    expect(service.isLoading()).toBe(false);
  });

  it('should load categories successfully', async () => {
    apiMock.getAll.mockReturnValue(of(mockCategories));

    await service.loadCategories();

    expect(service.categories()).toEqual(mockCategories);
    expect(service.errorMessage()).toBeNull();
    expect(service.isLoading()).toBe(false);
  });

  it('should handle error when loading categories fails', async () => {
    const apiError: ApiError = { statusCode: 500, message: 'Erro interno' };
    apiMock.getAll.mockReturnValue(throwError(() => apiError));

    await service.loadCategories();

    expect(service.categories()).toEqual([]);
    expect(service.errorMessage()).toBe('Erro interno');
    expect(service.isLoading()).toBe(false);
  });

  it('should create category successfully', async () => {
    const newCategory: CreateCategoryRequest = { name: 'Saúde', icon: '💊' };
    const created: CategoryResponse = { id: 'cat-new', name: 'Saúde', userId: 'user-1', icon: '💊' };
    apiMock.create.mockReturnValue(of(created));

    const result = await service.createCategory(newCategory);

    expect(result).toBe(true);
    expect(service.categories()).toContainEqual(created);
    expect(service.errorMessage()).toBeNull();
  });

  it('should handle error when creating category fails', async () => {
    const newCategory: CreateCategoryRequest = { name: 'Saúde', icon: '💊' };
    const apiError: ApiError = { statusCode: 400, message: 'Nome inválido' };
    apiMock.create.mockReturnValue(throwError(() => apiError));

    const result = await service.createCategory(newCategory);

    expect(result).toBe(false);
    expect(service.errorMessage()).toBe('Nome inválido');
  });

  it('should update category successfully', async () => {
    const updateDto: UpdateCategoryRequest = { name: 'Saúde e Bem-estar', icon: '💊' };
    const updated: CategoryResponse = { id: '1', name: 'Saúde e Bem-estar', userId: 'user-1', icon: '💊' };
    apiMock.getAll.mockReturnValue(of(mockCategories));
    apiMock.update.mockReturnValue(of(undefined));
    apiMock.getById.mockReturnValue(of(updated));

    await service.loadCategories();
    const result = await service.updateCategory('1', updateDto);

    expect(result).toBe(true);
    expect(service.errorMessage()).toBeNull();
    const found = service.categories().find((c) => c.id === '1');
    expect(found?.name).toBe('Saúde e Bem-estar');
  });

  it('should handle error when updating category fails', async () => {
    const updateDto: UpdateCategoryRequest = { name: 'Saúde e Bem-estar', icon: '💊' };
    const apiError: ApiError = { statusCode: 404, message: 'Categoria não encontrada' };
    apiMock.update.mockReturnValue(throwError(() => apiError));

    const result = await service.updateCategory('1', updateDto);

    expect(result).toBe(false);
    expect(service.errorMessage()).toBe('Categoria não encontrada');
  });

  it('should delete category successfully', async () => {
    apiMock.getAll.mockReturnValue(of(mockCategories));
    apiMock.delete.mockReturnValue(of(undefined));

    await service.loadCategories();
    const result = await service.deleteCategory('1');

    expect(result).toBe(true);
    expect(service.errorMessage()).toBeNull();
    expect(service.categories().length).toBe(1);
  });

  it('should handle error when deleting category fails', async () => {
    const apiError: ApiError = { statusCode: 404, message: 'Categoria não encontrada' };
    apiMock.delete.mockReturnValue(throwError(() => apiError));

    const result = await service.deleteCategory('1');

    expect(result).toBe(false);
    expect(service.errorMessage()).toBe('Categoria não encontrada');
  });

  it('should clear error message', () => {
    service.errorMessage.set('Some error');
    service.clearError();
    expect(service.errorMessage()).toBeNull();
  });
});
