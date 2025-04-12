import {create} from 'zustand'
import {devtools} from 'zustand/middleware'
import {ProductItem} from "@/lib/types";

interface ProductState {
    items: ProductItem[];
    setItems: (items: ProductItem[]) => void;
    selectedIndex: number | null;
    select: (index: number) => void;
    setImageUrl: (url: string, index: number) => void
}

export const useProductStore = create<ProductState>()(
    devtools(
        (set, get) => ({
            selectedIndex: null,
            select: (selectedIndex: number | null) => set({selectedIndex}),
            items: [],
            setImageUrl: (url, index) => set({
                items: get().items.map(((x, i) => {
                    if (i === index) {
                        x.imgeUrl = url;
                    }

                    return x
                }))
            }),
            setItems: (
                items: ProductItem[]
            ) => set({
                items,
            })
        }),
    ),
)