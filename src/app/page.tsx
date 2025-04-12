'use client'

import {Button} from "@/components/ui/button";
import {useAppKit, useAppKitNetwork} from "@reown/appkit/react";
import {useAppKitAccount} from "@reown/appkit/react";
import {useEffect} from "react";
import Link from "next/link";
import {storyAeneid} from "@reown/appkit/networks";


export default function Home() {
    const {open} = useAppKit();
    const {address, isConnected} =
        useAppKitAccount({namespace: "eip155"});
    const {caipNetwork, switchNetwork} = useAppKitNetwork()

    useEffect(() => {
        if (isConnected && address && caipNetwork) {
            if (caipNetwork.id !== storyAeneid.id) {
                if (confirm("Please change your story network to testnet(aeneid).")) {
                    switchNetwork(storyAeneid)
                }
            }
        }
    }, [isConnected, address, caipNetwork])

    const handleStart = () => {
        open({
            view: "Connect", namespace: 'eip155'
        })
    }


    return (
        <div
            className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <h1 className={"font-bold text-5xl"}>
                    LicenStory
                </h1>
                <div>
                    <h2 className={"text-lg font-medium"}>
                        Where IP License Becomes Business
                    </h2>
                    <h3 className={"text-neutral-500"}>
                        Powered on Story Protocol with AI Agent
                    </h3>
                </div>

                <div>
                    <label>User Guide</label>
                    <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
                        <li>Sign a licensing agreement for a major IP in off-chain.</li>
                        <li>Register the IP overview as an IP Asset on Story Protocol.</li>
                        <li>Request AI to analyze the registered IP Asset.</li>
                        <li>Connect with X (Twitter) API to gather fan trend data.</li>
                        <li>AI analyzes current fan interests and market trends.</li>
                        <li>Generate short-term, high-demand product ideas with AI.</li>
                        <li>Select the best product concept and proceed with design.</li>
                        <li>Submit the design to AI to create a sales page.</li>
                        <li>Launch a product sales link with the AI-generated page.</li>
                        <li>Promote the link via social media and sales channels.</li>
                        <li>Customers make direct purchases using blockchain wallets.</li>
                        <li>IP holders and sellers transparently track transactions.</li>
                        <li>Royalties are auto-settled into the IP holder’s revenue pool via smart contract.</li>

                    </ol>
                </div>

                <div className="flex gap-4 items-center flex-col sm:flex-row">
                    {isConnected && (
                        <div className={"flex items-center gap-x-5"}>
                            <Link href={"/regist"}>
                                <Button>
                                    Regist Your IP License
                                </Button>
                            </Link>
                            <span>
                                {address} (Connected)
                            </span>
                        </div>
                    )}
                    {!isConnected && (
                        <Button onClick={handleStart}>
                            Connect Wallet to Regist Your IP License
                        </Button>
                    )}
                </div>
            </main>
        </div>
    );
}
