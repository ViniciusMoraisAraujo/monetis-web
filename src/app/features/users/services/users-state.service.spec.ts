import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ApiError } from '../../../core/models/api-error.model';
import { UpdateUserRequest, UserResponse } from '../models/user.model';
import { UsersApiService } from './users-api.service';
import { UsersStateService } from './users-state.service';

describe('UsersStateService', () => {
  let state: UsersStateService;
  let apiMock: {
    getById: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };

  const mockUser: UserResponse = {
    id: 'user-1',
    firstName: 'Vinicius',
    lastName: 'Araujo',
    email: 'vinicius@monetis.dev',
  };

  beforeEach(() => {
    apiMock = {
      getById: vi.fn(),
      update: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [UsersStateService, { provide: UsersApiService, useValue: apiMock }],
    });

    state = TestBed.inject(UsersStateService);
  });

  it('should initialize with user null and loading false', () => {
    expect(state.user()).toBeNull();
    expect(state.isLoading()).toBe(false);
    expect(state.errorMessage()).toBeNull();
    expect(state.fullName()).toBe('');
  });

  it('should load user by id and compute fullName and initial', async () => {
    apiMock.getById.mockReturnValue(of(mockUser));

    await state.loadUser('user-1');

    expect(state.user()).toEqual(mockUser);
    expect(state.fullName()).toBe('Vinicius Araujo');
    expect(state.userInitial()).toBe('V');
    expect(state.isLoading()).toBe(false);
    expect(state.errorMessage()).toBeNull();
  });

  it('should handle load error gracefully', async () => {
    const error: ApiError = { statusCode: 404, message: 'Usuário não encontrado' };
    apiMock.getById.mockReturnValue(throwError(() => error));

    await state.loadUser('user-999');

    expect(state.user()).toBeNull();
    expect(state.errorMessage()).toBe('Usuário não encontrado');
    expect(state.isLoading()).toBe(false);
  });

  it('should update user and update state', async () => {
    const updateDto: UpdateUserRequest = {
      firstName: 'Vinicius',
      lastName: 'Silva',
      email: 'vinicius.silva@monetis.dev',
    };
    apiMock.getById.mockReturnValue(of(mockUser));
    apiMock.update.mockReturnValue(of(undefined));

    await state.loadUser('user-1');
    const success = await state.updateUser('user-1', updateDto);

    expect(success).toBe(true);
    expect(state.user()?.lastName).toBe('Silva');
    expect(state.user()?.email).toBe('vinicius.silva@monetis.dev');
    expect(state.fullName()).toBe('Vinicius Silva');
  });
});
