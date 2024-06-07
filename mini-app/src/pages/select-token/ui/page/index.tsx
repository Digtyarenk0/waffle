import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { routes } from 'shared/constants/routes';
import { HomeTokenItem } from 'shared/ui/token-item';

import { useTypedSelector } from 'entities/store/model/useStore';

import { IToken } from 'features/tokens/model/store';

export const SelectToken = () => {
  const navigate = useNavigate();
  const prices = useTypedSelector((s) => s.tokens.prices);
  const tokens = useTypedSelector((s) => s.tokens.tokens || []);
  const [filteredTokens, setFilteredTokens] = useState<IToken[]>(tokens);

  const { register, watch } = useForm();
  const searchValue = watch('search', '');

  const toSend = useCallback(
    (address: string) => {
      navigate(`${routes.send_token}/?${routes.send_token}=${address}`);
    },
    [navigate],
  );

  useEffect(() => {
    setFilteredTokens(tokens?.filter((token) => token.name.toLowerCase().includes(searchValue.toLowerCase())));
  }, [searchValue, tokens]);

  return (
    <div className="container mx-auto h-full overflow-y-scroll p-4">
      <p className="text-2xl font-bold mb-4">Token List</p>
      <form>
        <input
          type="text"
          placeholder="Search by Name"
          {...register('search')}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
      </form>
      <ul>
        {filteredTokens.map((token) => (
          <li key={token.address}>
            <button className="text-start w-full" onClick={() => toSend(token.address)}>
              <HomeTokenItem {...token} priceUSD={prices?.[token.address]} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
