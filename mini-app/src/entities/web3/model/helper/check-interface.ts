import { Overrides } from '../types/contracts';

export function isOverrides(value: any): value is Overrides {
  // Keys that can be in the Overrides object
  const overridesKeys: (keyof Overrides)[] = [
    'from',
    'gasLimit',
    'gasPrice',
    'maxFeePerGas',
    'maxPriorityFeePerGas',
    'nonce',
    'type',
    'accessList',
    'customData',
    'value',
  ];
  return (
    typeof value === 'object' &&
    !Array.isArray(value) &&
    (Object.keys(value).length > 0
      ? !Object.keys(value).some((key) => !overridesKeys.includes(key as keyof Overrides))
      : true)
  );
}
