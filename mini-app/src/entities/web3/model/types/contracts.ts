import { BigNumber, Contract, ContractReceipt, PayableOverrides } from 'ethers';

// Return the names of supported methods
// Ex: ContractMethodsType<ERC20> -> "symbol" | "balanceOf" | "decimals" ...
export type ContractMethodsType<C extends Contract> = Extract<keyof C['callStatic'], string>;

//Return the type of parameters for the specified method "M"
// Ex: MethodParametersType<ERC20, "approve"> -> [spender: string, amount: BigNumberish, (overrides: CallOverrides | undefined)]
export type MethodParametersType<C extends Contract, M extends ContractMethodsType<C>> = Parameters<C['callStatic'][M]>;

// Returns the return type of method, removing the promise
// Ex: MethodReturnType<ERC20, "balanceOf"> -> BigNumber
export type MethodReturnType<C extends Contract, M extends keyof C['callStatic']> = Awaited<
  ReturnType<C['callStatic'][M]>
>;

export type EventReturnType<C extends Contract, M extends keyof C['callStatic']> = Awaited<
  ReturnType<C['callStatic'][M]>
>;

export interface TransactionState {
  send: ContractReceipt | null;
  error: any;
}

// Overrides from typechain
export type Overrides = PayableOverrides & { from?: string | Promise<string> };

export interface MulticallCallData {
  target: string;
  callData: string;
  gasLimit: number;
}

export interface MulticallBalancesResult {
  blockNumber: BigNumber;
  returnData: { returnData: string }[];
}
