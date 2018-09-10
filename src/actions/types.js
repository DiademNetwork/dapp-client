const createAsyncTypes = (base) => ({
  requested: `${base}_REQUESTED`,
  failed: `${base}_FAILED`,
  succeeded: `${base}_SUCCEEDED`
})

const types = {
  WALLET_UPDATE_DATA: 'WALLET_UPDATE_DATA',
  WALLET_UPDATE_META: 'WALLET_UPDATE_META',
  WALLET_UPDATE_STATUS: 'WALLET_UPDATE_STATUS',
  FACEBOOK_UPDATE_DATA: 'FACEBOOK_UPDATE_DATA',
  FACEBOOK_UPDATE_AUTHENTICATION_STATUS: 'FACEBOOK_UPDATE_AUTHENTICATION_STATUS',
  ASYNC_ACHIEVEMENT_SUPPORT: createAsyncTypes('ASYNC_ACHIEVEMENT_SUPPORT'),
  ASYNC_ACHIEVEMENT_CONFIRM: createAsyncTypes('ACHIEVEMENT_CONFIRM'),
  ASYNC_ACHIEVEMENT_CREATE: createAsyncTypes('ACHIEVEMENT_CREATE'),
  ASYNC_ACHIEVEMENT_UPDATE: createAsyncTypes('ACHIEVEMENT_UPDATE'),
  ASYNC_STREAM_FETCH_ACHIEVEMENTS: createAsyncTypes('STREAM_FETCH_ACHIEVEMENTS'),
  ASYNC_STREAM_FETCH_TRANSACTIONS: createAsyncTypes('STREAM_FETCH_USER_TRANSACTIONS')
}

export default types
