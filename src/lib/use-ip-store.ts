import {create} from 'zustand'
import {devtools} from 'zustand/middleware'

interface IpState {
    ipId: string;

    setIpId: (
        ipId: string,
    ) => void,

}

export const useIpStore = create<IpState>()(
    devtools(
        (set) => ({
            ipId: "",
            setIpId: (
                ipId: string,
            ) => set({
                ipId,
            })
        }),
    ),
)