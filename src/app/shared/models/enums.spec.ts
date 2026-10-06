import {
  AccountType,
  ACCOUNT_TYPE_LABELS,
  Frequency,
  FREQUENCY_LABELS,
  PaymentMethod,
  PAYMENT_METHOD_LABELS,
  TransactionStatus,
  TRANSACTION_STATUS_LABELS
} from './enums';

describe('Shared Enums and Labels', () => {
  it('should map AccountType to pt-BR labels', () => {
    expect(ACCOUNT_TYPE_LABELS[AccountType.Checking]).toBe('Conta Corrente');
    expect(ACCOUNT_TYPE_LABELS[AccountType.Saving]).toBe('Poupança');
    expect(ACCOUNT_TYPE_LABELS[AccountType.CreditCard]).toBe('Cartão de Crédito');
  });

  it('should map PaymentMethod to pt-BR labels', () => {
    expect(PAYMENT_METHOD_LABELS[PaymentMethod.Cash]).toBe('Dinheiro');
    expect(PAYMENT_METHOD_LABELS[PaymentMethod.Pix]).toBe('Pix');
    expect(PAYMENT_METHOD_LABELS[PaymentMethod.CreditCard]).toBe('Cartão de Crédito');
  });

  it('should map Frequency to pt-BR labels', () => {
    expect(FREQUENCY_LABELS[Frequency.Monthly]).toBe('Mensal');
    expect(FREQUENCY_LABELS[Frequency.Yearly]).toBe('Anual');
  });

  it('should map TransactionStatus to pt-BR labels', () => {
    expect(TRANSACTION_STATUS_LABELS[TransactionStatus.Pending]).toBe('Pendente');
    expect(TRANSACTION_STATUS_LABELS[TransactionStatus.Paid]).toBe('Pago');
    expect(TRANSACTION_STATUS_LABELS[TransactionStatus.Cancelled]).toBe('Cancelado');
    expect(TRANSACTION_STATUS_LABELS[TransactionStatus.Overdue]).toBe('Vencido');
  });
});
