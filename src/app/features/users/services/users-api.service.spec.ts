import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { UpdateUserRequest, UserResponse } from '../models/user.model';
import { UsersApiService } from './users-api.service';

describe('UsersApiService', () => {
  let service: UsersApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsersApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(UsersApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get user by id via GET /api/Users/{id}', () => {
    const mockUser: UserResponse = {
      id: 'user-123',
      firstName: 'Vinicius',
      lastName: 'Araujo',
      email: 'vinicius@monetis.dev',
    };

    service.getById('user-123').subscribe((res) => {
      expect(res).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/Users/user-123`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should update user via PUT /api/Users/{id}', () => {
    const updateDto: UpdateUserRequest = {
      firstName: 'Vinicius',
      lastName: 'Silva',
      email: 'vinicius.silva@monetis.dev',
    };

    service.update('user-123', updateDto).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/api/Users/user-123`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateDto);
    req.flush(null, { status: 204, statusText: 'No Content' });
  });

  it('should get all users via GET /api/Users', () => {
    const mockUsers: UserResponse[] = [
      {
        id: 'user-123',
        firstName: 'Vinicius',
        lastName: 'Araujo',
        email: 'vinicius@monetis.dev',
      },
    ];

    service.getAll().subscribe((res) => {
      expect(res).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/Users`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
});
