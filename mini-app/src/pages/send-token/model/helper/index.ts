import Big from 'big.js';
import { UseFormClearErrors, UseFormSetError } from 'react-hook-form';

import { maxDecimalsInput } from 'shared/ui/input/model/helper/validators/number';

import { isAddress } from 'features/tokens/types/token-from-list';

interface OnChange {
  e: React.ChangeEvent<HTMLInputElement>;
  clearErrors: UseFormClearErrors<any>;
  setError: UseFormSetError<any>;
}
export const onChangeAddress = (props: OnChange) => {
  const { e, clearErrors, setError } = props;
  if (isAddress(e.target.value)) {
    clearErrors('address');
  } else {
    setError('address', { message: 'Invalid address' });
  }
  return e.target.value;
};

interface OnChangeAmount {
  e: React.ChangeEvent<HTMLInputElement>;
  balance: string;
}
export const onChangeAmount = (props: OnChangeAmount) => {
  const { e, balance } = props;
  const v = e.target.value === '' ? '0' : e.target.value;
  if (balance) {
    const isMoreBalance = Big(v).gt(balance) || 0;
    if (isMoreBalance) {
      e.target.value = balance.toString();
      return e;
    }
  }
  const decimal = maxDecimalsInput(e, 6);
  if (decimal) {
    e.target.value = decimal;
  }
  return e;
};
