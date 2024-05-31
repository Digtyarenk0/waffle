import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { Avatar, Input, List, Select } from 'antd';
import React, { memo, useCallback, useMemo, useState } from 'react';

import { weiToAmount } from 'shared/utils/amount';

import { IToken } from 'features/tokens/model/store';

const { Search } = Input;

interface SearchBarProps {
  tokens: IToken[];
  setSelected: (t: IToken) => void;
}

const TokenItem = memo((t: IToken) => {
  const balance = useMemo(() => {
    if (t.balanceWei === '0') return '0';
    return weiToAmount(t.balanceWei || 0, t.decimals || 18).toFixed(7);
  }, [t.balanceWei]);
  return (
    <div className="flex items-center">
      <img className="w-5 h-5 m-1 mr-3" src={t.logo} alt="" />
      <div>
        <p>{t.name}</p>
        <p>{`${balance} ${t.symbol}`}</p>
      </div>
    </div>
  );
});

export const SearchBar: React.FC<SearchBarProps> = ({ tokens, setSelected }) => {
  const [focused, setFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredTokens, setFilteredTokens] = useState<IToken[]>(tokens);

  const onFocus = useCallback((v: boolean) => {
    setFocused(v);
  }, []);

  const handleSearch = useCallback(
    (value: string) => {
      setSearchTerm(value);
      const filtered = tokens.filter(
        (token) =>
          token.name.toLowerCase().includes(value.toLowerCase()) ||
          token.symbol.toLowerCase().includes(value.toLowerCase()),
      );
      setFilteredTokens(filtered);
    },
    [tokens],
  );
  const [data, setData] = useState<IToken[]>([]);
  const [value, setValue] = useState<string>();

  const handleSearch1 = (newValue: string) => {};

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  const items = ['apple', 'King of fruits', 'Orange'];
  const [age, setAge] = React.useState('');

  return (
    <div>
      <FormControl className="!w-80 ">
        <InputLabel>Select token:</InputLabel>
        <Select value={age} onChange={handleChange}>
          {tokens?.map((token) => (
            <MenuItem key={token.address} value={token.address}>
              <TokenItem {...token} key={token.address} />
            </MenuItem>
          ))}
        </Select>
        <FormHelperText className="!text-white-main">With label + helper text</FormHelperText>
      </FormControl>
      {/* <Select
        placeholder="Please select store"
        optionLabelProp="label"
        className="w-64 bg-[#18222d]"
        style={{ backgroundColor: '#18222d' }}
      >
        {tokens?.map((token) => (
          <Select.Option key={token.address} value={token.address} label={token.name}>
            <TokenItem {...token} key={token.address} />
          </Select.Option>
        ))}
      </Select>
      <Search
        placeholder="Search tokens"
        value={searchTerm}
        className="relative"
        onFocus={() => onFocus(true)}
        onBlur={() => onFocus(false)}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 10, width: 300 }}
      />
      {focused && (
        <List
          bordered
          className="max-h-64 overflow-scroll absolute bg-[#18222d] "
          dataSource={filteredTokens}
          renderItem={(token) => (
            <List.Item
              className="hover:bg-[#3e6a97]"
              style={{ paddingInline: '12px' }}
              onClick={() => {
                console.log(token);
                setSelected(token);
              }}
            >
              <TokenItem {...token} />
            </List.Item>
          )}
          style={{ width: 300 }}
        />
      )} */}
    </div>
  );
};
