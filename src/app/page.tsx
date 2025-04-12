'use client'

import {Button} from "@/components/ui/button";
import {useAppKit, useAppKitNetwork, useDisconnect} from "@reown/appkit/react";
import {useAppKitAccount} from "@reown/appkit/react";
import {useEffect} from "react";
import Link from "next/link";
import {storyAeneid} from "@reown/appkit/networks";


export default function Home() {
    const {open} = useAppKit();
    const {address, isConnected,} =
        useAppKitAccount({namespace: "eip155"});
    const {caipNetwork, switchNetwork} = useAppKitNetwork()
    const {disconnect} = useDisconnect();

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
        <main>
            <div
                className="space-y-8 ">
                <label>User Guide</label>
                <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)] mt-2 block">
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
                    <li>Royalties are auto-settled into the IP holder’s revenue pool via smart contract.
                    </li>
                </ol>

                <div className="flex gap-4 items-start flex-col">
                    {isConnected && (
                        <>
                            <div className={"flex items-center gap-x-5"}>
                                <Link href={"/register"}>
                                    <Button>
                                        Regist Your IP License
                                    </Button>
                                </Link>
                                <span>
                                {address} (Connected)
                            </span>
                            </div>
                            <Button onClick={() => disconnect()} variant={'outline'}>
                                Disconnect
                            </Button>
                        </>

                    )}
                    {!isConnected && (
                        <Button onClick={handleStart}>
                            Connect Wallet to Regist Your IP License
                        </Button>
                    )}
                </div>
            </div>


        </main>
    );
}
