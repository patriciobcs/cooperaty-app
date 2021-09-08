import { Button, Col, Divider, Popover, Row, Tooltip } from 'antd';
import React, { useState, useEffect } from 'react';
import FloatingElement from './layout/FloatingElement';
import styled from 'styled-components';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, SyncOutlined } from '@ant-design/icons';
import {
  useBalances,
  useMarket,
  useSelectedBaseCurrencyAccount,
  useSelectedOpenOrdersAccount,
  useSelectedQuoteCurrencyAccount,
  useTokenAccounts,
} from '../utils/markets';
import DepositDialog from './DepositDialog';
import { useWallet } from '../utils/wallet';
import Link from './Link';
import { settleFunds } from '../utils/send';
import { useSendConnection } from '../utils/connection';
import { notify } from '../utils/notifications';
import { Balances } from '../utils/types';
import StandaloneTokenAccountsSelect from './StandaloneTokenAccountSelect';
import LinkAddress from './LinkAddress';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useInterval } from '../utils/useInterval';
import { useLocalStorageState } from '../utils/utils';
import { AUTO_SETTLE_DISABLED_OVERRIDE } from '../utils/preferences';
import { useReferrer } from '../utils/referrer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

const RowBox = styled(Row)`
  padding-bottom: 20px;
`;

const ColError = styled(Col)`
  align-self: center;
  text-align: center
`;

const Tip = styled.p`
  font-size: 12px;
  padding-top: 6px;
`;

const ActionButton = styled(Button)`
  color: #2abdd2;
  background-color: #212734;
  border-width: 0px;
`;
let conected_api = 'init'

export default function StandaloneBalancesDisplay() {
  const [data, setData] = useState({"historial": [
   
    {
        "date": "2021-07-20T16:34:22.138967",
        "exercise_id": "SOLUSDT0101202004002M5H",
        "pair": "SOL-USD",
        "resp": true
    },
], 
"stats": {
    "correct_answers": 3,
    "last_attemp_date": "2021-07-20T16:34:23.137740",
    "performance": 75.0,
    "total_attemps": 4
}});

  const { baseCurrency, quoteCurrency, market } = useMarket();
  const balances = useBalances();
  const openOrdersAccount = useSelectedOpenOrdersAccount(true);
  const connection = useSendConnection();
  const { providerUrl, providerName, wallet, connected } = useWallet();
  const [baseOrQuote, setBaseOrQuote] = useState('');
  const baseCurrencyAccount = useSelectedBaseCurrencyAccount();
  const quoteCurrencyAccount = useSelectedQuoteCurrencyAccount();
  const [tokenAccounts] = useTokenAccounts();
  const baseCurrencyBalances =
    balances && balances.find((b) => b.coin === baseCurrency);
  const quoteCurrencyBalances =
    balances && balances.find((b) => b.coin === quoteCurrency);
  const [autoSettleEnabled] = useLocalStorageState('autoSettleEnabled', true);
  const [lastSettledAt, setLastSettledAt] = useState<number>(0);
  const { usdcRef, usdtRef } = useReferrer();
  async function onSettleFunds() {
    if (!wallet) {
      notify({
        message: 'Wallet not connected',
        description: 'wallet is undefined',
        type: 'error',
      });
      return;
    }

    if (!market) {
      notify({
        message: 'Error settling funds',
        description: 'market is undefined',
        type: 'error',
      });
      return;
    }
    if (!openOrdersAccount) {
      notify({
        message: 'Error settling funds',
        description: 'Open orders account is undefined',
        type: 'error',
      });
      return;
    }
    if (!baseCurrencyAccount) {
      notify({
        message: 'Error settling funds',
        description: 'Open orders account is undefined',
        type: 'error',
      });
      return;
    }
    if (!quoteCurrencyAccount) {
      notify({
        message: 'Error settling funds',
        description: 'Open orders account is undefined',
        type: 'error',
      });
      return;
    }

    try {
      await settleFunds({
        market,
        openOrders: openOrdersAccount,
        connection,
        wallet,
        baseCurrencyAccount,
        quoteCurrencyAccount,
        usdcRef,
        usdtRef,
      });
    } catch (e) {
      notify({
        message: 'Error settling funds',
        description: e.message,
        type: 'error',
      });
    }
  }

  useInterval(() => {
    const autoSettle = async () => {
      if (
        AUTO_SETTLE_DISABLED_OVERRIDE ||
        !wallet ||
        !market ||
        !openOrdersAccount ||
        !baseCurrencyAccount ||
        !quoteCurrencyAccount ||
        !autoSettleEnabled
      ) {
        return;
      }
      if (
        !baseCurrencyBalances?.unsettled &&
        !quoteCurrencyBalances?.unsettled
      ) {
        return;
      }
      if (Date.now() - lastSettledAt < 15000) {
        return;
      }
      try {
        console.log('Settling funds...');
        setLastSettledAt(Date.now());
        await settleFunds({
          market,
          openOrders: openOrdersAccount,
          connection,
          wallet,
          baseCurrencyAccount,
          quoteCurrencyAccount,
          usdcRef,
          usdtRef,
        });
      } catch (e) {
        console.log('Error auto settling funds: ' + e.message);
        return;
      }
      console.log('Finished settling funds.');
    };
    connected && wallet?.autoApprove && autoSettleEnabled && autoSettle();
  }, 1000);

  const formattedBalances: [
    string | undefined,
    Balances | undefined,
    string,
    string | undefined,
  ][] = [
      [
        baseCurrency,
        baseCurrencyBalances,
        'base',
        market?.baseMintAddress.toBase58(),
      ],
      [
        quoteCurrency,
        quoteCurrencyBalances,
        'quote',
        market?.quoteMintAddress.toBase58(),
      ],
    ];


  const wal = "wallet1"
  const API_URL = "http://localhost:4000/wallet?wallet=wallet1"
  function getHistory(){
    async function History() {
      try {
        let response = await fetch(API_URL)
        let resp = await response.json()
        setData(resp);
        console.log("RESPUESTA", resp)
        conected_api = 'ok'
        }
      catch(error) {
        console.log(error)
        conected_api = 'fail'
    }
      
      
      
    }
    History()
  }

  useEffect(() => {
    getHistory()
  }, []);

  if (conected_api === 'ok'){
    const date2 = new Date(data.stats.last_attemp_date)
    const dformat2 =
        ("00" + date2.getDate()).slice(-2) + "/" +
        ("00" + (date2.getMonth() + 1)).slice(-2) + "/" +
        date2.getFullYear() + " " +
        ("00" + date2.getHours()).slice(-2) + ":" +
        ("00" + date2.getMinutes()).slice(-2) + ":" +
        ("00" + date2.getSeconds()).slice(-2);
  return (
    <FloatingElement style={{ flex: 1, paddingTop: 10 }}>
      <RowBox  justify="space-between">
        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
          <h1>Historial</h1>
        </div>
        <div style={{display: 'flex',  justifyContent:'flex-end', alignItems:'center'}}>
          <Tooltip 
          placement="bottomLeft"
          title="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.">
              <span style={{color: "#1ce6d2"}}>
                <FontAwesomeIcon size='lg' icon={faInfoCircle} />
              </span>
          </Tooltip>
        </div>
      </RowBox>
      
      <Row > <p> Total intentos: {data.stats.total_attemps}</p> </Row>
      <Row > <p> Respuestas correctas: {data.stats.correct_answers}</p> </Row>
      <Row > <p> Desempeño: {data.stats.performance} % </p> </Row>
      <Row > <p> Ultimo intento: {dformat2}  </p> </Row>

      {data.historial.map((e) => {

        const date = new Date(e.date)
        const dformat =
          ("00" + date.getDate()).slice(-2) + "/" +
          ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
          date.getFullYear() + " " +
          ("00" + date.getHours()).slice(-2) + ":" +
          ("00" + date.getMinutes()).slice(-2) + ":" +
          ("00" + date.getSeconds()).slice(-2);
        return (
          <Row>
            <Col flex={0.5}>{e.resp == true ? <CheckCircleOutlined style={{ color: '#02bf76' }} /> :
              <CloseCircleOutlined style={{ color: '#f23b69' }} />}</Col>
            <Col flex={0.5}> <p>{e.pair}</p> </Col>
            <Col flex={4}> <p>Fecha: {dformat}</p></Col>
          </Row>
        )
      })}

    </FloatingElement>
  );
  }else if (conected_api === 'fail'){
    return (
      <FloatingElement style={{ flex: 1, paddingTop: 10 }}>
        <RowBox  justify="space-between">
        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
          <h1>Historial</h1>
        </div>
        <div style={{display: 'flex',  justifyContent:'flex-end', alignItems:'center'}}>
          <Tooltip 
          placement="bottomLeft"
          title="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.">
              <span style={{color: "#1ce6d2"}}>
                <FontAwesomeIcon size='lg' icon={faInfoCircle} />
              </span>
          </Tooltip>
        </div>

        <Row justify="end" >
          <Col span={18} push={6}>
            <h3>Error: Problemas de conexión con la API</h3>
          </Col>
          <ColError  span={6} pull={18}>
            <ExclamationCircleOutlined style={{ color: '#f23b69', fontSize: '250%', textAlign: 'center' }}/>
          </ColError>
        </Row>      
      </RowBox>
      </FloatingElement>

    )
  }else{
    return (
      <FloatingElement style={{ flex: 1, paddingTop: 10 }}>
        <RowBox  justify="space-between">
        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
          <h1>Historial</h1>
        </div>
        <div style={{display: 'flex',  justifyContent:'flex-end', alignItems:'center'}}>
          <Tooltip 
          placement="bottomLeft"
          title="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.">
              <span style={{color: "#1ce6d2"}}>
                <FontAwesomeIcon size='lg' icon={faInfoCircle} />
              </span>
          </Tooltip>
        </div>

        <Row justify="end" >
          <Col span={18} push={6}>
            <h3>Estableciendo conexión con API</h3>
          </Col>
          <ColError span={6} pull={18}>
            <SyncOutlined spin style={{ fontSize: '250%', textAlign: 'center' }}/>
          </ColError>
        </Row>      
      </RowBox>
      </FloatingElement>

    )
    
  }
    
}
