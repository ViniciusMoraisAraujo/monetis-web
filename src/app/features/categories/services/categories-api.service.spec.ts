import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { CategoryResponse } from '../models/category.model';
import { CategoriesApiService } from './categories-api.service';

describe('CategoriesApiService', () => {
  let service: CategoriesApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoriesApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(CategoriesApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get all categories via GET /api/Categories', () => {
    const mockCategories: CategoryResponse[] = [
      { id: '1', name: 'Alimentação', userId: '', icon: '🍔' },
      { id: '2', name: 'Transporte', userId: 'user-1', icon: '🚗' },
    ];

    service.getAll().subscribe((categories) => {
      expect(categories).toEqual(mockCategories);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/Categories`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
  });

  it('should get category by id via GET /api/Categories/{id}', () => {
    const mockCategory: CategoryResponse = {
      id: 'cat-1',
      name: 'Alimentação',
      userId: '',
      icon: '🍔',
    };

    service.getById('cat-1').subscribe((cat) => {
      expect(cat).toEqual(mockCategory);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/Categories/cat-1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategory);
  });

  it('should create category via POST /api/Categories', () => {
    const newCategory = { name: 'Saúde', icon: '💊' };
    const mockCreated: CategoryResponse = {
      id: 'cat-new',
      name: 'Saúde',
      userId: 'user-1',
      icon: '💊',
    };

    service.create(newCategory).subscribe((res) => {
      expect(res).toEqual(mockCreated);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/Categories`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newCategory);
    req.flush(mockCreated);
  });

  it('should update category via PUT /api/Categories/{id}', () => {
    const updateDto = { name: 'Saúde e Bem-estar', icon: '💊' };

    service.update('cat-1', updateDto).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/api/Categories/cat-1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateDto);
    req.flush(null, { status: 204, statusText: 'No Content' });
  });

  it('should delete category via DELETE /api/Categories/{id}', () => {
    service.delete('cat-1').subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/api/Categories/cat-1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });
});
