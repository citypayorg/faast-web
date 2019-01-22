import React, { Fragment } from 'react'
import path from 'path'
import axios from 'axios'
import merge from 'webpack-merge'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import { pick, get } from 'lodash'
import urlJoin from 'url-join'

import Wallets from './src/config/walletTypes'

const { isDev, dirs, useHttps, siteRoot } = require('./etc/common.js')
const getBaseConfig = require('./etc/webpack.config.base.js')
const siteConfig = require('./src/site/config.js')

const siteUrlProd = 'https://faa.st'

/**
 * Redirect to site root at runtime. Needs to be included as inline script
 * because assets won't load if viewing from domain other than site root.
 */
const runtimeRedirect = `
window.siteRoot = ${JSON.stringify(process.env.SITE_ROOT)}
if (window.siteRoot
  && window.location.origin !== window.siteRoot
  && !window.location.search.includes('skipSiteRootRedirect')) {
  window.location.replace(window.siteRoot + window.location.pathname + window.location.search)
}
`

const analyticsCode = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'UA-100689193-1');
`

const generateCombinationsFromArray = (array, property) => {
  let results = []
  for (let i = 0; i <= array.length - 1; i++) {
    if (array[i]['receive']) {
      results.push({ name: array[i]['name'], symbol: array[i][property], type: 'buy' })
    }
    if (array[i]['deposit']) {
      results.push({ name: array[i]['name'], symbol: array[i][property], type: 'sell' })
    }
    if (i == array.length - 1) {
      return results
    }
  }
}

const Document = ({ Html, Head, Body, children, siteData, routeInfo }) => {
  return (
    <Html lang='en'>
      <Head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='description' content={get(routeInfo, 'routeData.meta.description', siteData.description)}/>
        <meta name='author' content={siteConfig.author}/>
        <meta name='referrer' content='origin-when-cross-origin'/>
        <link rel="canonical" href={urlJoin(siteUrlProd, routeInfo ? routeInfo.path : '')}/>
        <link href='/static/vendor/ionicons-2.0/css/ionicons.min.css' rel='stylesheet'/>
        <link href='/static/vendor/font-awesome-5.5/css/all.min.css' rel='stylesheet'/>
        <link rel="icon" href="/favicon.png"/>
        <title>{get(routeInfo, 'routeData.meta.title', siteData.title)}</title>
        <script dangerouslySetInnerHTML={{ __html: runtimeRedirect }}/>
        {/* Google analytics */}
        {!isDev && (
          <Fragment>
            <script async src="https://www.googletagmanager.com/gtag/js?id=UA-100689193-1"></script>
            <script dangerouslySetInnerHTML={{ __html: analyticsCode }}/>
          </Fragment>
        )}
      </Head>
      <Body>{children}</Body>
    </Html>
  )
}

export default {
  entry: path.join(dirs.site, 'index.tsx'),
  siteRoot: siteRoot,
  stagingSiteRoot: '',
  getSiteData: () => ({
    title: 'Trade Crypto - Faast',
    lastBuilt: Date.now(),
  }),
  Document,
  getRoutes: async () => {
    const { data: assets } = await axios.get('https://api.faa.st/api/v2/public/currencies')
    const supportedAssets = assets.filter(({ deposit, receive }) => deposit || receive)
      .map((asset) => pick(asset, 'symbol', 'name', 'iconUrl', 'deposit', 'receive'))
    const supportedWallets = Object.values(Wallets)
    return [
      {
        path: '/',
        component: 'src/site/pages/Home',
        getData: () => ({
          supportedAssets
        }),
        children: generateCombinationsFromArray(supportedAssets, 'symbol').map(pair => {
          const symbol = pair.symbol
          const name = pair.name
          const type = pair.type
          return {
            path: `/assets/${symbol}/${type}`,
            component: 'src/site/pages/Pair',
            getData: async () => {
              let descriptions = {}
              const sym = symbol.toLowerCase()
              try {
                const coinInfo = await axios.get(`https://data.messari.io/api/v1/assets/${sym}/profile`)
                descriptions[symbol] = coinInfo.data.data
              } catch (err) {
                // err
              }
              return {
                supportedAssets,
                symbol,
                name,
                type,
                descriptions,
                meta: {
                  title: `Instantly ${type} ${name} (${symbol}) - Faa.st`,
                  description: `Safely trade your ${name} crypto directly from your hardware or software wallet.
                  View ${name} (${symbol}) pricing charts, market cap, daily volume and other coin data.`
                }
              }
            },
          }
        })
      },
      {
        path: '/wallets',
        component: 'src/site/pages/Wallets',
        getData: () => ({
          supportedWallets
        }),
        children: supportedWallets.map(wallet => {
          return {
            path: `/${wallet.name.replace(/\s+/g, '-').toLowerCase()}`,
            component: 'src/site/pages/Wallet',
            getData: () => ({
              wallet
            })
          }
        })
      },
      {
        path: '/terms',
        component: 'src/site/pages/Terms',
      },
      {
        path: '/privacy',
        component: 'src/site/pages/Privacy',
      },
      {
        path: '/pricing',
        component: 'src/site/pages/Pricing',
      },
      {
        is404: true,
        component: 'src/site/pages/404',
      },
    ]
  },
  paths: {
    dist: dirs.buildSite,
  },
  devServer: {
    https: useHttps,
    host: useHttps ? 'https://localhost' : 'http://localhost',
  },
  webpack: (defaultConfig, { stage }) => {
    // Omit old version of UglifyJsPlugin because we use a newer one
    defaultConfig.plugins = defaultConfig.plugins.filter((plugin) =>
      plugin.constructor.name !== 'UglifyJsPlugin')

    const baseConfig = getBaseConfig(stage)

    const config = merge.strategy({
      'module.rules': 'replace',
    })(defaultConfig, baseConfig)
    if (stage === 'node') {
      // Needed for css modules to work. See https://github.com/nozzle/react-static/issues/601#issuecomment-429574588
      config.plugins = [
        ...config.plugins,
        new ExtractTextPlugin({
          filename: '_tmp/static.css',
        }),
      ]
    }
    return config
  },
}
