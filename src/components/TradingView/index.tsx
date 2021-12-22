import * as React from 'react';
import './index.css';
import {
  widget,
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
} from '../../charting_library';
import { useMarket } from '../../utils/markets';
import * as saveLoadAdapter from './saveLoadAdapter';
import { flatten } from '../../utils/utils';
import scalping from './api/scalping';
import intra from './api/intra';
import swing from './api/swing';
import position from './api/position';
export interface ChartContainerProps {
  symbol: ChartingLibraryWidgetOptions['symbol'];
  interval: ChartingLibraryWidgetOptions['interval'];
  auto_save_delay: ChartingLibraryWidgetOptions['auto_save_delay'];
  libraryPath: ChartingLibraryWidgetOptions['library_path'];
  chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'];
  clientId: ChartingLibraryWidgetOptions['client_id'];
  userId: ChartingLibraryWidgetOptions['user_id'];
  fullscreen: ChartingLibraryWidgetOptions['fullscreen'];
  autosize: ChartingLibraryWidgetOptions['autosize'];
  studiesOverrides: ChartingLibraryWidgetOptions['studies_overrides'];
  containerId: ChartingLibraryWidgetOptions['container_id'];
  theme: string;
}
export interface ChartContainerState {}

const options = {
  scalping: {
    data: scalping,
    defaultInterval: '5',
  },
  intra: {
    data: intra,
    defaultInterval: '60',
  },
  swing: {
    data: swing,
    defaultInterval: '240',
  },
  position: {
    data: position,
    defaultInterval: '1W',
  },
};

export const TVChartContainer = (props) => {
  let defaultProps: ChartContainerProps = {
    symbol: 'Binance:BTC/USD',
    interval: options[props.info.modality].defaultInterval,
    auto_save_delay: 5,
    theme: 'Dark',
    containerId: 'tv_chart_container',
    libraryPath: '/charting_library/',
    chartsStorageApiVersion: '1.1',
    clientId: 'tradingview.com',
    userId: 'public_user_id',
    fullscreen: false,
    autosize: true,
    studiesOverrides: {},
  };

  const tvWidgetRef = React.useRef<IChartingLibraryWidget | null>(null);
  const { market } = useMarket();
  const chartProperties = JSON.parse(
    localStorage.getItem('chartproperties') || '{}',
  );

  React.useEffect(() => {
    const savedProperties = flatten(chartProperties, {
      restrictTo: ['scalesProperties', 'paneProperties', 'tradingProperties'],
    });
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: props.info.symbol,
      datafeed: options[props.info.modality].data,
      interval: defaultProps.interval as ChartingLibraryWidgetOptions['interval'],
      container_id: defaultProps.containerId as ChartingLibraryWidgetOptions['container_id'],
      library_path: defaultProps.libraryPath as string,
      auto_save_delay: 5,
      locale: 'en',
      disabled_features: [
        'use_localstorage_for_settings',
        'timeframes_toolbar',
        'go_to_date',
        'header_symbol_search',
      ],
      enabled_features: ['study_templates'],
      load_last_chart: true,
      client_id: defaultProps.clientId,
      user_id: defaultProps.userId,
      fullscreen: defaultProps.fullscreen,
      autosize: defaultProps.autosize,
      studies_overrides: defaultProps.studiesOverrides,
      theme: defaultProps.theme === 'Dark' ? 'Dark' : 'Light',
      overrides: {
        ...savedProperties,
        'mainSeriesProperties.candleStyle.upColor': '#41C77A',
        'mainSeriesProperties.candleStyle.downColor': '#F23B69',
        'mainSeriesProperties.candleStyle.borderUpColor': '#41C77A',
        'mainSeriesProperties.candleStyle.borderDownColor': '#F23B69',
        'mainSeriesProperties.candleStyle.wickUpColor': '#41C77A',
        'mainSeriesProperties.candleStyle.wickDownColor': '#F23B69',
      },
      // @ts-ignore
      save_load_adapter: saveLoadAdapter,
      settings_adapter: {
        initialSettings: {
          'trading.orderPanelSettingsBroker': JSON.stringify({
            showRelativePriceControl: false,
            showCurrencyRiskInQty: false,
            showPercentRiskInQty: false,
            showBracketsInCurrency: false,
            showBracketsInPercent: false,
          }),
          // "proterty"
          'trading.chart.proterty':
            localStorage.getItem('trading.chart.proterty') ||
            JSON.stringify({
              hideFloatingPanel: 1,
            }),
          'chart.favoriteDrawings':
            localStorage.getItem('chart.favoriteDrawings') ||
            JSON.stringify([]),
          'chart.favoriteDrawingsPosition':
            localStorage.getItem('chart.favoriteDrawingsPosition') ||
            JSON.stringify({}),
        },
        setValue: (key, value) => {
          localStorage.setItem(key, value);
        },
        removeValue: (key) => {
          localStorage.removeItem(key);
        },
      },
    };
    const tvWidget = new widget(widgetOptions);

    tvWidget.onChartReady(() => {
      tvWidgetRef.current = tvWidget;
      tvWidget.subscribe('onAutoSaveNeeded', () =>
        tvWidget.saveChartToServer(),
      );
      console.log(tvWidget.chart());

      const priceScale = 10000;
      const position = {
        direction: 'long_position',
        takeProfit: 0.03,
        stopLoss: 0.015,
        bars: 10,
      };

      // get last bar information
      // @ts-ignore
      const bars = tvWidget.chart().getSeries().data().m_bars,
        lastBar = bars._items[bars._end - 1],
        lastBarData = {
          time: lastBar.exTime,
          open: lastBar.value[1],
          close: lastBar.value[4],
          percent: lastBar.value[1] * priceScale,
          distance: lastBar.exTime - bars._items[bars._end - 2].exTime,
        };

      // position shape
      tvWidget.chart().createMultipointShape(
        [
          { time: lastBarData.time, price: lastBarData.close },
          {
            time: lastBarData.time + lastBarData.distance * position.bars,
            price: lastBarData.close,
          },
        ],
        {
          // @ts-ignore
          shape: position.direction,
          lock: true,
          overrides: {
            profitLevel: lastBarData.percent * position.takeProfit,
            stopLevel: lastBarData.percent * position.stopLoss,
          },
        },
      );

      // prediction line
      tvWidget
        .chart()
        .createOrderLine()
        .onMove(function () {
          // @ts-ignore
          console.log(this);
          // @ts-ignore
          const actualPrice = this.getPrice();
          const takeProfitPrice = lastBarData.close * (1 + position.takeProfit);
          const stopLossPrice = lastBarData.close * (1 - position.stopLoss);
          let newPrice = actualPrice;

          if (actualPrice > takeProfitPrice) newPrice = takeProfitPrice;
          else if (actualPrice < stopLossPrice) newPrice = stopLossPrice;

          const takeProfitProximity =
            (newPrice >= lastBarData.close
              ? (newPrice - lastBarData.close) /
                (takeProfitPrice - lastBarData.close)
              : (lastBarData.close - newPrice) /
                (stopLossPrice - lastBarData.close)) * 100;

          // @ts-ignore
          if (newPrice !== actualPrice) this.setPrice(newPrice);
          // @ts-ignore
          this.setQuantity(Math.round(takeProfitProximity) + '%');
        })
        .setText('Prediction')
        .setQuantity('0%');
    });
  }, [market, tvWidgetRef.current]);

  return <div id={defaultProps.containerId} className={'TVChartContainer'} />;
};
