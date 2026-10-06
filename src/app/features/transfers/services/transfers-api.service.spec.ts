import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TransfersApiService } from './transfers-api.service';
import { environment } from '../../../../environments/environment';
import { CreateTransferRequest, TransferResponse } from '../models/transfer.model';

describe('TransfersApiService', () => {
  let service: TransfersApiService;
  let httpTesting: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/api/Transfers`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransfersApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(TransfersApiService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should list transfers with query params', () => {
    const mockTransfers: TransferResponse[] = [
      {
        id: 't-1',
        fromAccountId: 'acc-1',
        fromAccountName: 'Nubank',
        toAccountId: 'acc-2',
        toAccountName: 'Inter Poupança',
        amount: 800,
        date: '2026-10-06T12:00:00Z',
        description: 'Reserva de Emergência',
        createdAt: '2026-10-06T12:00:00Z',
      },
    ];

    service.getAll({ accountId: 'acc-1' }).subscribe((res) => {
      expect(res).toEqual(mockTransfers);
    });

    const req = httpTesting.expectOne((r) => r.url === baseUrl && r.params.get('accountId') === 'acc-1');
    expect(req.request.method).toBe('GET');
    req.flush(mockTransfers);
  });

  it('should create transfer via POST /api/Transfers', () => {
    const request: CreateTransferRequest = {
      fromAccountId: 'acc-1',
      toAccountId: 'acc-2',
      amount: 500,
      date: '2026-10-06T12:00:00Z',
      description: 'Transferência Pix',
    };
    const mockResponse: TransferResponse = {
      id: 't-2',
      fromAccountId: 'acc-1',
      fromAccountName: 'Nubank',
      toAccountId: 'acc-2',
      toAccountName: 'Inter',
      amount: 500,
      date: '2026-10-06T12:00:00Z',
      description: 'Transferência Pix',
      createdAt: '2026-10-06T12:00:00Z',
    };

    service.create(request).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpTesting.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(mockResponse);
  });

  it('should delete transfer via DELETE /api/Transfers/{id}', () => {
    service.delete('t-1').subscribe();

    const req = httpTesting.expectOne(`${baseUrl}/t-1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
