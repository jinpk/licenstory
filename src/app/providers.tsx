'use client'

import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {createAppKit} from '@reown/appkit/react'
import {AppKitNetwork, storyAeneid} from '@reown/appkit/networks'
import React, {type ReactNode} from 'react'
import {cookieToInitialState, WagmiProvider, type Config} from 'wagmi'
import {networks, projectId, wagmiAdapter} from "@/lib/wagmi";

// Set up queryClient
const queryClient = new QueryClient()

// Set up metadata
const metadata = {
    name: 'appkit-example',
    description: 'AppKit Example',
    url: 'https://appkitexampleapp.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/179229932']
}

createAppKit({
    adapters: [wagmiAdapter],
    projectId: projectId,
    networks: networks as any as [AppKitNetwork, ...AppKitNetwork[]],
    defaultNetwork: storyAeneid,
    metadata: metadata,
    features: {
        analytics: true // Optional - defaults to your Cloud configuration
    }
})


export default function RootProviders({children, cookies}: { children: ReactNode; cookies: string | null }) {
    const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)


    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    )
}