/* eslint-disable new-cap */

import React from 'react'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import { Provider } from 'react-redux'
import { throttle, pick } from 'lodash'
import createHistory from 'history/createBrowserHistory'
import { ConnectedRouter, routerMiddleware } from 'react-router-redux'
import ReduxToastr from 'react-redux-toastr'
import App from 'Components/App'
import reducers from './reducers'
import { saveToAddress } from 'Utilities/storage'
import { getDefaultPortfolio, isAppReady } from 'Selectors'
import config from 'Config'
import { getLatestSwundleId, getSwundleState, getSwapState, getAssetState, getTxState } from 'Selectors'

const history = createHistory({ basename: process.env.ROUTER_BASE_NAME })
const middleware = [
  thunk,
  routerMiddleware(history)
]

// Redirect legacy hash routes
if ((window.location.hash || '').startsWith('#/')) {
  history.replace(window.location.hash.slice(1))
}

if (!window.faast) window.faast = {}
if (config.isDev && !window.__REDUX_DEVTOOLS_EXTENSION__) middleware.push(logger)
window.faast.intervals = {
  orderStatus: [],
  txReceipt: []
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(reducers, composeEnhancers(applyMiddleware(...middleware)))

let cachedAssets

store.subscribe(throttle(() => {
  const state = store.getState()
  const appReady = isAppReady(state)
  if (appReady) {
    const wallet = getDefaultPortfolio(state)
    if (wallet) {
      const { settings } = state
      const allSwundles = getSwundleState(state)
      const allSwaps = getSwapState(state)
      const allTxs = getTxState(state)
      const latestSwundleId = getLatestSwundleId(state)
      const latestSwapIds = (allSwundles[latestSwundleId] || {}).swaps || []
      const latestSwaps = pick(allSwaps, latestSwapIds)
      const latestTxIds = Object.values(latestSwaps)
        .map(({ txId }) => txId)
      saveToAddress(wallet.id, {
        swundle: pick(allSwundles, latestSwundleId),
        swap: latestSwaps,
        tx: pick(allTxs, latestTxIds),
        settings: settings
      })
      const assets = getAssetState(state)
      if (assets !== cachedAssets) {
        saveToAddress('cache:asset', assets)
        cachedAssets = assets
      }
    }
  }
}, 1000))

const Portfolio = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <div>
          <App/>
          <ReduxToastr
            timeOut={4000}
            newestOnTop={false}
            preventDuplicates
            position='top-right'
          />
        </div>
      </ConnectedRouter>
    </Provider>
  )
}

export default Portfolio
