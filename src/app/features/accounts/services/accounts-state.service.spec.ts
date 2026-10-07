import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ApiError } from '../../../core/models/api-error.model';
import { AccountType } from '../../../shared/models/enums';
import { AccountResponse } from '../models/account.model';
import { AccountsApiService } from './accounts-api.service';
import { AccountsStateService } from './accounts-state.service';

describe('AccountsStateService', () => {
  let state: AccountsStateService;
  let apiMock: {
    getAll: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  const mockAccounts: AccountResponse[] = [
    { id: '1', name: 'Nubank', userId: 'u1', type: AccountType.Checking, balance: 1000 },
    { id: '2', name: 'Inter', userId: 'u1', type: AccountType.Saving, balance: 500 },
  ];

  beforeEach(() => {
    apiMock = {
      getAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [AccountsStateService, { provide: AccountsApiService, useValue: apiMock }],
    });

    state = TestBed.inject(AccountsStateService);
  });

  it('should initialize with empty accounts, loading false and totalBalance 0', () => {
    expect(state.accounts()).toEqual([]);
    expect(state.isLoading()).toBe(false);
    expect(state.totalBalance()).toBe(0);
    expect(state.errorMessage()).toBeNull();
  });

  it('should load accounts and compute totalBalance correctly', async () => {
    apiMock.getAll.mockReturnValue(of(mockAccounts));

    await state.loadAccounts();

    expect(state.accounts()).toEqual(mockAccounts);
    expect(state.totalBalance()).toBe(1500);
    expect(state.isLoading()).toBe(false);
    expect(state.errorMessage()).toBeNull();
  });

  it('should handle load error gracefully', async () => {
    const error: ApiError = { statusCode: 500, message: 'Erro ao carregar contas' };
    apiMock.getAll.mockReturnValue(throwError(() => error));

    await state.loadAccounts();

    expect(state.errorMessage()).toBe('Erro ao carregar contas');
    expect(state.isLoading()).toBe(false);
  });

  it('should create account and append to state', async () => {
    const newAcc: AccountResponse = {
      id: '3',
      name: 'Itaú',
      userId: 'u1',
      type: AccountType.Checking,
      balance: 200,
    };
    apiMock.getAll.mockReturnValue(of(mockAccounts));
    apiMock.create.mockReturnValue(of(newAcc));

    await state.loadAccounts();
    const success = await state.createAccount({ name: 'Itaú', type: AccountType.Checking });

    expect(success).toBe(true);
    expect(state.accounts().length).toBe(3);
    expect(state.totalBalance()).toBe(1700);
  });

  it('should update account name in state', async () => {
    apiMock.getAll.mockReturnValue(of(mockAccounts));
    apiMock.update.mockReturnValue(of(undefined));

    await state.loadAccounts();
    const success = await state.updateAccount('1', { name: 'Nubank Atualizado' });

    expect(success).toBe(true);
    const updated = state.accounts().find((a) => a.id === '1');
    expect(updated?.name).toBe('Nubank Atualizado');
  });

  it('should delete account and remove from state', async () => {
    apiMock.getAll.mockReturnValue(of(mockAccounts));
    apiMock.delete.mockReturnValue(of(undefined));

    await state.loadAccounts();
    const success = await state.deleteAccount('1');

    expect(success).toBe(true);
    expect(state.accounts().length).toBe(1);
    expect(state.totalBalance()).toBe(500);
  });
});
