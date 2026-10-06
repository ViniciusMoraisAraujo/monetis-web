import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { AccountType } from '../../../../shared/models/enums';
import { AccountResponse } from '../../models/account.model';
import { AccountsStateService } from '../../services/accounts-state.service';
import { AccountListComponent } from './account-list.component';

describe('AccountListComponent', () => {
  let component: AccountListComponent;
  let fixture: ComponentFixture<AccountListComponent>;
  let accountsStateMock: {
    accounts: ReturnType<typeof signal<AccountResponse[]>>;
    isLoading: ReturnType<typeof signal<boolean>>;
    errorMessage: ReturnType<typeof signal<string | null>>;
    totalBalance: ReturnType<typeof signal<number>>;
    loadAccounts: ReturnType<typeof vi.fn>;
    createAccount: ReturnType<typeof vi.fn>;
    updateAccount: ReturnType<typeof vi.fn>;
    deleteAccount: ReturnType<typeof vi.fn>;
  };
  let dialogMock: { open: ReturnType<typeof vi.fn> };

  const mockAccounts: AccountResponse[] = [
    { id: '1', name: 'Nubank', userId: 'u1', type: AccountType.Checking, balance: 1500 },
    { id: '2', name: 'Inter', userId: 'u1', type: AccountType.Saving, balance: -200 }
  ];

  beforeEach(async () => {
    accountsStateMock = {
      accounts: signal(mockAccounts),
      isLoading: signal(false),
      errorMessage: signal(null),
      totalBalance: signal(1300),
      loadAccounts: vi.fn(),
      createAccount: vi.fn(),
      updateAccount: vi.fn(),
      deleteAccount: vi.fn()
    };

    dialogMock = {
      open: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [AccountListComponent],
      providers: [
        { provide: AccountsStateService, useValue: accountsStateMock },
        { provide: MatDialog, useValue: dialogMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create account list component and load accounts', () => {
    expect(component).toBeTruthy();
    expect(accountsStateMock.loadAccounts).toHaveBeenCalled();
  });

  it('should render accounts list cards with formatted balances', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('.account-card');
    expect(cards.length).toBe(2);
    expect(cards[0].textContent).toContain('Nubank');
    expect(cards[1].textContent).toContain('Inter');
  });

  it('should open dialog and create account when user confirms', async () => {
    const newAccData = { name: 'Itaú', type: AccountType.Checking };
    dialogMock.open.mockReturnValue({
      afterClosed: () => of(newAccData)
    });

    component.openCreateDialog();

    expect(dialogMock.open).toHaveBeenCalled();
    expect(accountsStateMock.createAccount).toHaveBeenCalledWith(newAccData);
  });

  it('should open dialog and update account when user confirms', async () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () => of({ name: 'Nubank Atualizado' })
    });

    component.openEditDialog(mockAccounts[0]);

    expect(dialogMock.open).toHaveBeenCalled();
    expect(accountsStateMock.updateAccount).toHaveBeenCalledWith('1', { name: 'Nubank Atualizado' });
  });

  it('should call deleteAccount when user confirms deletion', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    component.onDelete(mockAccounts[0]);

    expect(accountsStateMock.deleteAccount).toHaveBeenCalledWith('1');
  });
});
