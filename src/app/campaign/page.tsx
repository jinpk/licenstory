'use client'

import {Button} from "@/components/ui/button"
import {Separator} from "@/components/ui/separator";
import {useCampaignStore} from "@/lib/use-campaign-store";
import {useSearchParams} from "next/navigation";
import {FUNDING_POOL_CONTRACT_ABI} from "@/lib/utils";
import {useContractReads, useReadContract, useReadContracts} from "wagmi";

export default function CampaignPage() {
    const searchParams = useSearchParams();
    const campaignId = searchParams.get("id") as string;

    const readCampaign =useReadContracts({
        contracts: ['ipId','metadataURI', 'priceEth','ratios']
        abi: FUNDING_POOL_CONTRACT_ABI,
        address: campaignId as `0x${string}`,
    })

    const a = FUNDING_POOL_CONTRACT_ABI

    const campaignMetadata = useCampaignStore(s => s.metadata)

    if (!campaignMetadata.productName) return null

    return (
        <main>
            <div
                className="space-y-8 ">
                <div>


                    <img src={campaignMetadata.imageUrl} alt={"I"}
                         sizes={'100vw'}
                         className={"w-full h-auto object-cover rounded-lg"}
                    />

                    <div className={"pt-5 flex flex-col gap-y-1"}>
                        <p className={"font-bold text-xs text-chart-1"}>
                            {campaignMetadata.productType}
                        </p>

                        <h3 className="text-lg font-medium">{campaignMetadata.productName}</h3>

                        <p className="text-sm text-muted-foreground">
                            {campaignMetadata.productIdea}
                        </p>
                    </div>

                </div>

                <Separator/>

                <div className={"flex flex-col gap-y-1"}>
                    {Object.entries(campaignMetadata.productSpec).map(([k, v]) => {
                        return (
                            <div key={k} className={"flex flex-col"}>
                                <span className={"text-neutral-500 text-xs"}>{k}</span>
                                <span className={"text-sm"}>{v as any}</span>
                            </div>
                        )
                    })}
                </div>

                <Separator/>

                <p>{campaignMetadata.message}</p>

                <Button
                    size={"lg"}
                    className={"w-full bg-chart-1"}

                    type="submit">{`Checkout $${campaignMetadata.priceIp} IP`}
                </Button>
            </div>
        </main>
    )
}