
import { TrueApi, testnet } from '@truenetworkio/sdk'
import { TrueConfig } from '@truenetworkio/sdk/dist/utils/cli-config'

// If you are not in a NodeJS environment, please comment the code following code:
import dotenv from 'dotenv'
dotenv.config()

export const getTrueNetworkInstance = async (): Promise<TrueApi> => {
  const trueApi = await TrueApi.create(config.account.secret)

  await trueApi.setIssuer(config.issuer.hash)

  return trueApi;
}

export const config: TrueConfig = {
  network: testnet,
  account: {
    address: 'ms9Ec1G7fwWDSiB5L61fceehD4MBmaCR69kJgfKfbvcof2B',
    secret: process.env.TRUE_NETWORK_SECRET_KEY ?? ''
  },
  issuer: {
    name: 'FunnyOrFud',
    hash: '0x6b28fd14fe4c919bee18bd75b5cd9cd0898168d264a3d4656ce73fd0138ccba1'
  },
  algorithm: {
    id: undefined,
    path: undefined,
    schemas: []
  },
}
  