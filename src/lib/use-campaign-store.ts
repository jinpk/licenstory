import {create} from 'zustand'
import {devtools} from 'zustand/middleware'
import {CampaignMetadata} from "@/lib/types";

interface CampaignState {
    metadata: CampaignMetadata;
    setMetadata: (m: CampaignMetadata) => void;
}

export const useCampaignStore = create<CampaignState>()(
    devtools(
        (set, get) => ({
            metadata: {},
            setMetadata: (metadata: CampaignMetadata) => set({metadata}),
        }),
    ),
)