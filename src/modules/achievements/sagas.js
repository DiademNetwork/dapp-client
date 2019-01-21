import { all, call, fork, put, select, take, takeLatest } from 'redux-saga/effects'
import ownT from './types'
import ownA from './actions'
import api from 'services/api'
import stream from 'services/stream'
import S from 'modules/selectors'
import T from 'modules/types'
import { eventChannel } from 'redux-saga'
import blockchains from 'configurables/blockchains'

const create = function * ({ link, title }) {
  try {
    const primaryBlockchainKey = blockchains.primary.key
    const userAddress = yield select(S.wallets.primaryAddress)
    yield call(api.createAchievement(primaryBlockchainKey), {
      address: userAddress,
      link,
      name: yield select(S.login.userName),
      title,
      token: yield select(S.login.userAccessToken),
      user: yield select(S.login.userID)
    })
    yield put(ownA.create.succeeded())
    // GETSTREAM SERVICE
    yield call(stream.createAchievement, {
      link,
      title,
      userAddress
    })
  } catch (error) {
    yield put(ownA.create.errored({ error }))
  }
}

const confirm = function * (payload) {
  try {
    yield call(api.confirmAchievement, payload)
    yield put(ownA.confirm.succeeded())
    // GETSTREAM SERVICE
    yield call(stream.confirmAchievement, {
      link: payload.link,
      userAddress: payload.userAddress,
      creatorAddress: payload.creatorAddress
    })
  } catch (error) {
    yield put(ownA.confirm.errored({ error }))
  }
}

const fetch = function * ({ page }) {
  try {
    const { results: items, hasMore } = yield call(stream.fetchData, 'achievement_aggregated', 'common', page)
    yield put(ownA.fetch.succeeded({ list: items, hasMore }))
  } catch (error) {
    yield put(ownA.fetch.errored({ error }))
  }
}

const suscribe = function * () {
  let callbackObj = {}
  const channel = eventChannel(emitter => {
    callbackObj.call = emitter
    return () => {}
  })
  try {
    yield call(stream.suscribeWithCallBacks, 'achievement_aggregated', 'common', callbackObj.call)
    yield put(ownA.suscribe.succeeded())
    while (true) {
      yield take(channel)
      yield call(fetch)
      yield put(ownA.received())
    }
  } catch (error) {
    yield put(ownA.suscribe.errored({ error }))
  }
}

const fetchUserAchievements = function * ({ page }) {
  try {
    const userAddress = yield select(S.wallets.primaryAddress)
    const { results: items, hasMore } = yield call(stream.fetchData, 'achievement_aggregated', userAddress, page)
    yield put(ownA.fetchUser.succeeded({ list: items, hasMore }))
  } catch (error) {
    console
    yield put(ownA.fetchUser.errored({ error }))
  }
}

const suscribeUserAchievements = function * ({ userAddress }) {
  let callbackObj = {}
  const channel = eventChannel(emitter => {
    callbackObj.call = emitter
    return () => {}
  })
  try {
    yield call(stream.suscribeWithCallBacks, 'achievement_aggregated', userAddress, callbackObj.call)
    yield put(ownA.suscribe.succeeded())
    while (true) {
      yield take(channel)
      yield call(fetchUserAchievements, { userAddress })
      yield put(ownA.receivedUser())
    }
  } catch (error) {
    yield put(ownA.suscribe.errored({ error }))
  }
}

const support = function * ({ amount, blockchainKey, creatorAddress, fees, link }) {
  try {
    const { address, encodedData } = yield call(api.encodeSupport(blockchainKey), { link })
    const rawTx = blockchains.get(blockchainKey).generateContractSendTx({
      address,
      encodedData,
      amount,
      feeRate: fees
    })
    yield call(api.supportAchievement(blockchainKey), {
      address: yield select(S.wallets.primaryAddress),
      link,
      rawTx,
      token: yield select(S.login.userAccessToken),
      user: yield select(S.login.userID)
    })
    yield put(ownA.support.succeeded())
    // GETSTREAM SERVICE
    const userAddress = yield select(S.wallets.primaryAddress)
    yield call(stream.supportAchievement, {
      link,
      userAddress,
      blockchain: blockchainKey,
      creatorAddress,
      amount
    })
  } catch (error) {
    yield put(ownA.support.errored({ error }))
  }
}

export default function * () {
  yield all([
    fork(fetch, {}),
    fork(suscribe),
    takeLatest(T.wallets.CONNECT.succeeded, fetchUserAchievements),
    takeLatest(T.wallets.CONNECT.succeeded, fetch),
    takeLatest(T.wallets.GET_GETSTREAM_TOKEN.succeeded, fetchUserAchievements),
    takeLatest(T.wallets.GET_GETSTREAM_TOKEN.succeeded, suscribeUserAchievements),
    takeLatest(ownT.CREATE.requested, create),
    takeLatest(ownT.FETCH.requested, fetch),
    takeLatest(ownT.FETCH_USER.requested, fetchUserAchievements),
    takeLatest(ownT.CONFIRM.requested, confirm),
    takeLatest(ownT.SUPPORT.requested, support)
  ])
}
