import { ApiPromise, WsProvider } from '@polkadot/api'

let _alephZero: ApiPromise | undefined
export const getAlephZero = async () => {
  if (_alephZero) return _alephZero
  const provider = new WsProvider('wss://ws.azero.dev/')
  _alephZero = await ApiPromise.create({
    provider,
  })
  return _alephZero
}
