import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { routes } from 'shared/constants/routes';

import { useTypedSelector } from 'entities/store/model/useStore';

import { IToken } from 'features/tokens/model/store';

import { TokenList } from 'widgets/token-list/ui';

export const SelectToken = () => {
  const navigate = useNavigate();
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
      <p className="text-2xl mb-4">Token List</p>
      <form>
        <input
          type="text"
          placeholder="Search by Name"
          {...register('search')}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
      </form>
      <TokenList tokens={filteredTokens} tokenOnClick={toSend} />
    </div>
  );
};
