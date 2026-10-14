export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export type Currency = {
  code: CurrencyCode;
  name: string;
  symbol: string;
  locale: string;
};

export const currencies: Record<CurrencyCode, Currency> = {
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', locale: 'en-IN' },
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', locale: 'en-US' },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', locale: 'en-GB' },
  GBP: { code: 'GBP', name: 'Pound Sterling', symbol: '£', locale: 'en-GB' },
};

export const currencyList: Currency[] = Object.values(currencies);
