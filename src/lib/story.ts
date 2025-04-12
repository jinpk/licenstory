import {custom} from 'viem';
import {StoryClient, StoryConfig} from "@story-protocol/core-sdk";
import {useWalletClient} from "wagmi";

const {data: wallet} = useWalletClient();

async function setupStoryClient(wallet: any): Promise<StoryClient> {
    const config: StoryConfig = {
        wallet: wallet,
        transport: custom(wallet!.transport),
        chainId: "aeneid",
    };
    const client = StoryClient.newClient(config);
    return client;
}