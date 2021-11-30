import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import TradePage from './pages/TradePage';
import React from 'react';
import BalancesPage from './pages/BalancesPage';
import ConvertPage from './pages/ConvertPage';
import BasicLayout from './components/BasicLayout';
import NewPoolPage from './pages/pools/NewPoolPage';
import PoolPage from './pages/pools/PoolPage';
import PoolListPage from './pages/pools/PoolListPage';
import { getTradePageUrl } from './utils/markets';
import { PracticeProvider } from './utils/practice';
import ExpertPage from "./pages/ExpertPage"

export function Routes() {
  return (
    <>
      <HashRouter basename={'/'}>
        <BasicLayout>
          <Switch>
            <Route exact path="/">
              <Redirect to={getTradePageUrl()} />
            </Route>
            <Route exact path="/market/:marketAddress">
              <TradePage />
            </Route>
            <Route exact path="/expert">
            {Number(localStorage.streak) >= 2? <ExpertPage /> :<Redirect to="/" /> }
            </Route>
          </Switch>
        </BasicLayout>
      </HashRouter>
    </>
  );
}
