import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CardsApiService } from './cards-api.service';
import { environment } from '../../../../environments/environment';
import { CardResponse, CreateCardRequest, UpdateCardRequest } from '../models/card.model';

describe('CardsApiService', () => {
  let service: CardsApiService;
  let httpTesting: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/api/Cards`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CardsApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(CardsApiService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should list all cards via GET /api/Cards', () => {
    const mockCards: CardResponse[] = [
      { id: '1', name: 'Nubank Ultravioleta', userId: 'user-1' },
      { id: '2', name: 'XP Visa Infinite', userId: 'user-1' },
    ];

    service.getAll().subscribe((cards) => {
      expect(cards).toEqual(mockCards);
    });

    const req = httpTesting.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockCards);
  });

  it('should create a card via POST /api/Cards', () => {
    const request: CreateCardRequest = { name: 'Inter Black' };
    const mockResponse: CardResponse = { id: '3', name: 'Inter Black', userId: 'user-1' };

    service.create(request).subscribe((card) => {
      expect(card).toEqual(mockResponse);
    });

    const req = httpTesting.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(mockResponse);
  });

  it('should update a card via PUT /api/Cards/{id}', () => {
    const request: UpdateCardRequest = { name: 'Nubank Gold' };

    service.update('1', request).subscribe();

    const req = httpTesting.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(request);
    req.flush(null);
  });

  it('should delete a card via DELETE /api/Cards/{id}', () => {
    service.delete('1').subscribe();

    const req = httpTesting.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
