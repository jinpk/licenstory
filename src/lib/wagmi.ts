import {cookieStorage, createStorage} from '@wagmi/core'
import {WagmiAdapter} from '@reown/appkit-adapter-wagmi'
import {story, storyTestnet, storyOdyssey, storyAeneid} from '@reown/appkit/networks'

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string

export const networks = [story, storyOdyssey, storyAeneid, storyTestnet]

export const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({
        storage: cookieStorage
    }),
    ssr: true,
    projectId,
    networks
})

export const wagmiConfig = wagmiAdapter.wagmiConfig