import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Col, Row, Select, Tabs, Button } from 'antd';
import styled from 'styled-components';
import UserInfoTable from '../components/UserInfoTable';
import StandaloneBalancesDisplay from '../components/StandaloneBalancesDisplay';
import {
  getMarketInfos,
  getTradePageUrl,
  MarketProvider,
  useMarket,
  useMarketsList,
  useUnmigratedDeprecatedMarkets,
} from '../utils/markets';
import TradeForm from '../components/TradeForm';
import LinkAddress from '../components/LinkAddress';
import DeprecatedMarketsInstructions from '../components/DeprecatedMarketsInstructions';
import {
  DeleteOutlined,
  InfoCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import CustomMarketDialog from '../components/CustomMarketDialog';
import { notify } from '../utils/notifications';
import { useHistory, useParams } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { TVChartContainer } from '../components/TradingView';
import { TVChartContainer as TVChartContainer2} from '../components/TradingView';


const { TabPane } = Tabs;

//const [type, setType] = useState('Bitfinex:BTC/USD')




export let type2= "Bitfinex:BTC/USD";




const { Option, OptGroup } = Select;

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px 16px;
  .borderNone .ant-select-selector {
    border: none !important;
  }
`;

export default function TradePage() {
  const { marketAddress } = useParams();
  useEffect(() => {
    if (marketAddress) {
      localStorage.setItem('marketAddress', JSON.stringify(marketAddress));
    }
  }, [marketAddress]);
  const history = useHistory();
  function setMarketAddress(address) {
    history.push(getTradePageUrl(address));
  }

  return (
    <MarketProvider
      marketAddress={marketAddress}
      setMarketAddress={setMarketAddress}
    >
      <TradePageInner />
    </MarketProvider>
  );
}

function TradePageInner() {

  const [handleDeprecated, setHandleDeprecated] = useState(false);
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  const changeOrderRef = useRef<
    ({ size, price }: { size?: number; price?: number }) => void
  >();

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const width = dimensions?.width;
  const componentProps = {
    onChangeOrderRef: (ref) => (changeOrderRef.current = ref),
    onPrice: useCallback(
      (price) => changeOrderRef.current && changeOrderRef.current({ price }),
      [],
    ),
    onSize: useCallback(
      (size) => changeOrderRef.current && changeOrderRef.current({ size }),
      [],
    ),
  };
  const component = (() => {
    if (handleDeprecated) {
      return (
        <DeprecatedMarketsPage
          switchToLiveMarkets={() => setHandleDeprecated(false)}
        />
      );
    } else if (width < 1000) {
      return <RenderSmaller {...componentProps} />;
    } else if (width < 1450) {
      return <RenderSmall {...componentProps} />;
    } else {
      return <RenderNormal {...componentProps} />;
    }
  })();

  return (
    <>
      <Wrapper>
        {component}
      </Wrapper>
    </>
  );
}

const DeprecatedMarketsPage = ({ switchToLiveMarkets }) => {
  return (
    <>
      <Row>
        <Col flex="auto">
          <DeprecatedMarketsInstructions
            switchToLiveMarkets={switchToLiveMarkets}
          />
        </Col>
      </Row>
    </>
  );
};

const RenderNormal = ({ onChangeOrderRef, onPrice, onSize }) => {
  
    const [chart, setChart] = useState('Bitfinex:BTC/USD')
  
    const typechart = (value) => {
      callback(value)
      setChart(value)
    }

    const grafico = (grafico) => {
      return <TVChartContainer type={grafico}></TVChartContainer>
    }
  

  function callback(key) {
    console.log(key);

    switch(key){
      case '1':
        type2 = "Bitfinex:BTC/USD"
        typechart('1')
        console.log("valor hook: ", chart)
      case '2':
        type2 = "Bitfinex:ETH/USD"
        typechart('2')
        console.log("valor hook: ", chart)
      case '3':
        type2 = "Bitfinex:ETH/USD"
        typechart('3')
        console.log("valor hook: ", chart)
    }
  }

  return (
    <Row
      style={{
        minHeight: '620px',
        flexWrap: 'nowrap',
      }}
    >
      <Col flex="auto" style={{ width: '100%' }}>
        <Row >
          <Button type="primary" onClick={() => setChart('Bitfinex:BTC/USD')}>Tipo1</Button>
          <Button type="primary" onClick={() => setChart('Bitfinex:ETH/USD')}>Tipo2</Button>
          <Button type="primary" onClick={() => setChart('Bitfinex:SOL/USD')}>Tipo3</Button>
        </Row>
        {grafico(chart)}
      </Col>
      <Col
        flex="400px"
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <TradeForm setChangeOrderRef={onChangeOrderRef} />
        <StandaloneBalancesDisplay />
      </Col>
    </Row>
  );
};

const RenderSmall = ({ onChangeOrderRef, onPrice, onSize }) => {
  function callback(key) {
    console.log(key);
  
    switch(key){
      case 1:
        type2 = "Bitfinex:BTC/USD"
      case 2:
        type2 = "Bitfinex:ETH/USD"
      case 3:
        type2 = "Bitfinex:ETH/USD"
    }
  }
  return (
    <>
      <Col flex="auto" style={{ width: '100%' }}>
        <Tabs onChange={callback}>
          <TabPane tab="Tab 1" key="1">
          <Row style={{ height: '80vh' }}>
            <TVChartContainer />
          </Row>
          </TabPane>
          <TabPane tab="Tab 2" key="2">
            <Row style={{ height: '80vh' }}>
              <TVChartContainer2 />
            </Row>
          </TabPane>
          <TabPane tab="Tab 3" key="3">
            Content of Tab Pane 3
          </TabPane>
        </Tabs>
      </Col>
    </>
  );
};

const RenderSmaller = ({ onChangeOrderRef, onPrice, onSize }) => {
  function callback(key) {
    console.log(key);
  
    switch(key){
      case 1:
        type2 = "Bitfinex:BTC/USD"
      case 2:
        type2 = "Bitfinex:ETH/USD"
      case 3:
        type2 = "Bitfinex:ETH/USD"
    }
  }
  return (
    <>
      <Col flex="auto" style={{ width: '100%' }}>
        <Tabs onChange={callback}>
          <TabPane tab="Tab 1" key="1" >
          <Row style={{ height: '80vh' }}>
            <TVChartContainer />
          </Row>
          </TabPane>
          <TabPane tab="Tab 2" key="2">
            <Row style={{ height: '80vh' }}>
              <TVChartContainer />
            </Row>
          </TabPane>
          <TabPane tab="Tab 3" key="3">
            Content of Tab Pane 3
          </TabPane>
        </Tabs>
      </Col>
      <Row>
        <Col xs={24} sm={12} style={{ height: '100%', display: 'flex' }}>
          <TradeForm style={{ flex: 1 }} setChangeOrderRef={onChangeOrderRef} />
        </Col>
        <Col xs={24} sm={12}>
          <StandaloneBalancesDisplay />
        </Col>
      </Row>
    </>
  );
};
