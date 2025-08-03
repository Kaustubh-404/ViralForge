
import { TrueApi, testnet } from '@truenetworkio/sdk'
import { TrueConfig } from '@truenetworkio/sdk/dist/utils/cli-config'

// If you are not in a NodeJS environment, please comment the code following code:
// import dotenv from 'dotenv'
// dotenv.config()

export const getTrueNetworkInstance = async (): Promise<TrueApi> => {
  const trueApi = await TrueApi.create(config.account.secret)

  await trueApi.setIssuer(config.issuer.hash)

  return trueApi;
}

export const config: TrueConfig = {
  network: testnet,
  account: {
    address: 'j95hjBHU1d27463JEWZdi2kjcJDFH2WZdjXePe6CNtpHkw9',
    secret: process.env.NEXT_PUBLIC_TRUE_NETWORK_SECRET_KEY ?? ''
  },
  issuer: {
    name: 'FunnyOrFud',
    hash: '0xfd316c937b924547625d7131099f463e4f19f6f6f87a6f4ffa1e6570139b5d26'
  },
  algorithm: {
    id: undefined,
    path: undefined,
    schemas: []
  },
}
  