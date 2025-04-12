import {cookieStorage, createStorage, http} from '@wagmi/core'
import {WagmiAdapter} from '@reown/appkit-adapter-wagmi'
import {story, storyAeneid} from '@reown/appkit/networks'

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string

export const networks = [story, storyAeneid]

export const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({
        storage: cookieStorage
    }),
    ssr: true,
    transports: {
        [story.id]: http(),
        [storyAeneid.id]: http(),
    },
    projectId,
    networks
})

export const wagmiConfig = wagmiAdapter.wagmiConfig