import logo from './logo.jpg'
import faker from 'faker'
import mocksController from '../../../mocks/controller'
import * as R from 'ramda'
import axios from 'axios'

export default (function fakeChain () {
  const symbol = 'FKC'

  const balance = (function () {
    const initial = {
      balance: faker.random.number(),
      balanceSat: faker.random.number(),
      totalReceived: faker.random.number(),
      totalReceivedSat: faker.random.number(),
      totalSent: faker.random.number(),
      totalSentSat: faker.random.number(),
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0
    }

    const get = () => initial
    const set = (name) => (value) => { initial[name] = value }

    return { get, set }
  })()

  const transactions = (function () {
    const initial = {
      unconfirmedTxApperances: 0,
      txApperances: 2,
      transactions: [
        faker.random.uuid(),
        faker.random.uuid()
      ]
    }
    const get = () => initial
    const set = (name) => (value) => { initial[name] = value }

    return { get, set }
  })()

  const base = Object.freeze({ addrStr: faker.random.uuid() })

  const generateWallet = () => {
    const mnemonic = 'Here is a mnemonic for Fakechain ... What did you expect?'
    const privateKey = 'PrIv4t3K3yF0rF4K3ch4In'
    return { mnemonic, privateKey }
  }

  const registerWallet = () => {
    return new Promise(resolve => setTimeout(() => {
      resolve({ ok: true })
    }, 5000))
  }

  const getWalletData = async () => {
    const { pendingTxID } = mocksController.get()
    if (pendingTxID !== '') {
      transactions.set('transactions', [
        transactions.get()[0],
        pendingTxID
      ])
    }
    return {
      ...base,
      ...balance.get(),
      ...transactions.get()
    }
  }

  const initFromPrivateKey = () => {
    console.log('Fakechain initialized')
  }

  const initFromMnemonic = () => {
    console.log('Fakechain initialized')
  }

  const getPrivateKey = () => 'PrIv4t3K3yF0rF4K3ch4In'

  const withdraw = ({ amount }) => {
    console.log(`${amount} ${symbol} tokens withdrawn`)
    const balanceData = balance.get()
    balance.set('balance', balanceData.balance - amount)
  }

  const generateContractSendTx = () => 'raxTxString'

  // For fakechains, no blockchain exist, so createAchievement is a call to API (sandboxed with sandboxAPI)
  const createAchievement = async (payload) => {
    const { data } = await axios.post(`${process.env.BACKEND_URL}/achievements/create`, payload)
    return data
  }

  return Object.freeze({
    createAchievement,
    initFromMnemonic,
    initFromPrivateKey,
    key: 'fakechain',
    logo,
    name: 'Fakechain',
    generateContractSendTx,
    getWalletData,
    generateWallet,
    registerWallet,
    getPrivateKey,
    symbol,
    withdraw,
    fees: {
      convert: R.identity,
      initial: 0.001,
      max: 0.1,
      min: 0.004
    }
  })
})()
