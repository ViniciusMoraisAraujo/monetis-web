import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { AccountType } from '../../../shared/models/enums';
import { AccountResponse } from '../models/account.model';
import { AccountsApiService } from './accounts-api.service';

describe('AccountsApiService', () => {
  let service: AccountsApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AccountsApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AccountsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get all accounts via GET /api/Accounts', () => {
    const mockAccounts: AccountResponse[] = [
      { id: '1', name: 'Nubank', userId: 'u1', type: AccountType.Checking, balance: 1500.5 }
    ];

    service.getAll().subscribe((accounts) => {
      expect(accounts).toEqual(mockAccounts);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/Accounts`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAccounts);
  });

  it('should get account by id via GET /api/Accounts/{id}', () => {
    const mockAccount: AccountResponse = {
      id: 'acc-1',
      name: 'Nubank',
      userId: 'u1',
      type: AccountType.Checking,
      balance: 1500.5
    };

    service.getById('acc-1').subscribe((acc) => {
      expect(acc).toEqual(mockAccount);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/Accounts/acc-1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAccount);
  });

  it('should create account via POST /api/Accounts', () => {
    const newAccount = { name: 'Nubank', type: AccountType.Checking };
    const mockCreated: AccountResponse = {
      id: 'acc-new',
      name: 'Nubank',
      userId: 'u1',
      type: AccountType.Checking,
      balance: 0
    };

    service.create(newAccount).subscribe((res) => {
      expect(res).toEqual(mockCreated);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/Accounts`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newAccount);
    req.flush(mockCreated);
  });

  it('should update account via PUT /api/Accounts/{id}', () => {
    const updateDto = { name: 'Nubank Atualizado' };

    service.update('acc-1', updateDto).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/api/Accounts/acc-1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateDto);
    req.flush(null, { status: 204, statusText: 'No Content' });
  });

  it('should delete account via DELETE /api/Accounts/{id}', () => {
    service.delete('acc-1').subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/api/Accounts/acc-1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });
});
