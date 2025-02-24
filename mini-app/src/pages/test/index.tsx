/* eslint-disable @typescript-eslint/no-unused-vars */
import { JsonRpcProvider } from '@ethersproject/providers';
import {
  useCloudStorage,
  useExpand,
  useInitData,
  useThemeParams,
  WebAppProvider,
} from '@vkruglikov/react-telegram-web-app';
import { ConfigProvider, theme } from 'antd';
import { ethers, Wallet, Contract } from 'ethers';
import React, { DispatchWithoutAction, FC, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import 'antd/dist/reset.css';

import './index.css';
import useBetaVersion from '../../entities/telegram/model/hooks/useBetaVersion';
import BackButtonDemo from '../../entities/telegram/ui/BackButtonDemo';
import ExpandDemo from '../../entities/telegram/ui/ExpandDemo';
import HapticFeedbackDemo from '../../entities/telegram/ui/HapticFeedbackDemo';
import MainButtonDemo from '../../entities/telegram/ui/MainButtonDemo';
import ScanQrPopupDemo from '../../entities/telegram/ui/ScanQrPopupDemo';
import ShowPopupDemo from '../../entities/telegram/ui/ShowPopupDemo';

import logo from './logo.svg';

const rpcURL = 'https://polygon-amoy.drpc.org';
const rpc = new JsonRpcProvider(rpcURL);
const walletKeyCloud = 'wallet_backup';

export const TestPage: FC<{
  onChangeTransition: DispatchWithoutAction;
}> = ({ onChangeTransition }) => {
  const [colorScheme, themeParams] = useThemeParams();
  const [isBetaVersion, handleRequestBeta] = useBetaVersion(false);
  const [activeBtn, setActiveBtn] = useState(true);
  const [expand] = useExpand();
  const cloud = useCloudStorage();
  const [cloudData, setCloud] = useState<any>();

  const initData = useInitData();
  const [userData, setUserData] = useState<any>();

  const [wallet, setWallet] = useState<ethers.Wallet>();

  // const wallet = Wallet.createRandom(new JsonRpcProvider(rpcURL));

  const backUPWallet = async () => {
    const walletbackup = await cloud.getItem(walletKeyCloud);
    if (walletbackup) {
      const walletInit = new ethers.Wallet(walletbackup, rpc);
      return setWallet(walletInit);
    } else {
      const walletInit = Wallet.createRandom(new JsonRpcProvider(rpcURL));
      await cloud.setItem(walletKeyCloud, walletInit.privateKey);
      return setWallet(walletInit as unknown as ethers.Wallet);
    }
  };

  useEffect(() => {
    backUPWallet();
    cloud.getKeys().then((i) => {
      const save = i[1];
      setCloud(save);
    });
  }, []);

  useEffect(() => {
    if (initData[0]) {
      const unsave = JSON.stringify(initData[0]);
      setUserData(unsave);
    }
  }, [initData]);

  return (
    <div>
      <ConfigProvider
        theme={
          themeParams.text_color
            ? {
                algorithm: colorScheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                  colorText: themeParams.text_color,
                  colorPrimary: themeParams.button_color,
                  colorBgBase: themeParams.bg_color,
                },
              }
            : undefined
        }
      >
        <header className="App-header">
          <img onClick={handleRequestBeta} src={logo} className="App-logo" alt="logo" />
        </header>
        <div>
          <p className="white">{wallet?.address}</p>
          <p className="white">expand</p>
          <p className="white">{expand}</p>
          <p className="white">cloudData</p>
          <p className="white">{cloudData}</p>
          <p className="white">userData</p>
          <p className="white">{userData}</p>
        </div>
        <div className="contentWrapper">
          {isBetaVersion && (
            <div className="betaVersion">
              <h3>WARNING: BETA VERSION</h3>
              <button onClick={() => setActiveBtn((state) => !state)}>change button</button>
              <button onClick={onChangeTransition}>change </button>
            </div>
          )}
          <ExpandDemo />
          {!activeBtn ? (
            <MainButtonDemo
              initialValues={{
                show: isBetaVersion,
                text: 'SECOND BUTTON',
                progress: true,
              }}
              key="1"
            />
          ) : (
            <MainButtonDemo
              key="2"
              initialValues={{
                show: isBetaVersion,
              }}
            />
          )}
          <BackButtonDemo />
          <ShowPopupDemo />
          <HapticFeedbackDemo />
          <ScanQrPopupDemo />
        </div>
      </ConfigProvider>
    </div>
  );
};
