'use client'

import {Button} from "@/components/ui/button"
import {Separator} from "@/components/ui/separator";
import {useProductStore} from "@/lib/use-product-store";
import {clsx} from "clsx";
import {Label} from "@/components/ui/label";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {LoaderCircleIcon} from "lucide-react";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useCampaignStore} from "@/lib/use-campaign-store";

interface ProductFormData {
    royaltyPercent: number;
    priceIp: number;
    goalAmountIp: number
    message: string
}

export default function ProductPage() {
    const {items, selectedIndex, select, setImageUrl} = useProductStore(s => s)
    const router = useRouter();

    const form = useForm<ProductFormData>({
        defaultValues: {
            royaltyPercent: 0,
            priceIp: 0
        }
    })

    useEffect(() => {
        form.reset()
    }, [selectedIndex]);

    useEffect(() => {
        items.forEach((item, index) => {
            fetch(`/api/design`, {
                method: "POST", body: JSON.stringify({
                    prompt: item.imageRequestPrompt
                })
            }).then(res => res.json()).then(data => {
                setImageUrl(data.url, index)
            }).catch(e => {
                console.log(e)
            })
        })
    }, [])


    const setCampaignMetadata = useCampaignStore(s => s.setMetadata)
    const campaignMetadata = useCampaignStore(s => s.metadata)

    useEffect(() => {
        if (campaignMetadata.goalAmountIp) {
            router.push("/campaign")
        }
    }, [campaignMetadata])

    const handleSelling = (data: ProductFormData) => {
        if (!data.priceIp || !data.royaltyPercent) return alert("Please enter require input.")
        if (selectedIndex === null) return alert("Please select item first.")

        const item = items[selectedIndex];

        // TODO: Smart contract deploy
        setCampaignMetadata({
            goalAmountIp: data.goalAmountIp,
            royaltyPercent: data.royaltyPercent,
            message: data.message,
            priceIp: data.priceIp,
            imageUrl: item.imgeUrl,
            productIdea: item.productIdea,
            productName: item.productName,
            productSpec: item.productSpec,
            productType: item.productType
        })

    }

    return (
        <main>
            <Form {...form} >

                <form onSubmit={form.handleSubmit(handleSelling)}
                      className="space-y-8 ">
                    <div>
                        <p className={"font-bold text-xs text-chart-1"}>
                            STEP 3
                        </p>

                        <h3 className="text-lg font-medium">Launch Your Campaign</h3>
                        <p className="text-sm text-muted-foreground">
                            Choose the best merchandise item and enter your sales information and Sale right now !
                        </p>
                    </div>

                    <Separator/>

                    <div className={"flex flex-col gap-y-3 text-sm"}>
                        <Label>Reason for recommendations</Label>
                        <div className={"flex flex-col gap-y-2"}>
                            {items.map((item, index) => (
                                <p key={item.productName}>
                                    <span className={"font-medium"}>{index + 1}. </span>
                                    <span className={"font-medium"}>{item.productName}</span><br/>
                                    <span className={"text-neutral-600"}>
                                    {item.recommendationReason}
                                    </span>
                                </p>
                            ))}
                        </div>

                    </div>

                    <div className={"grid grid-cols-3 gap-3"}>
                        {items.map((item, index) => {
                            return (
                                <div key={item.productName}
                                     onClick={() => [select(index)]}
                                     className={
                                         clsx(
                                             "border rounded-lg p-4 flex flex-col gap-y-4 hover:scale-105 transition cursor-pointer hover:bg-neutral-100",
                                             index === selectedIndex && "!border-chart-1"
                                         )
                                     }>
                                    <div className={"rounded-lg w-full h-auto aspect-square bg-border relative flex"}>
                                        {item.imgeUrl && (
                                            <img src={item.imgeUrl}
                                                 className={"w-full h-full object-cover rounded-lg border-none"}/>
                                        )}
                                        {!item.imgeUrl && (
                                            <LoaderCircleIcon className={"m-auto"}/>
                                        )}
                                    </div>

                                    <div>
                                        <p className={"text-sm"}>
                                            {item.productType}
                                        </p>
                                        <p className={"font-medium"}>
                                            {item.productName}
                                        </p>
                                    </div>

                                    <Separator/>
                                    <p className={"text-sm"}>
                                        {item.productIdea}
                                    </p>
                                    <Separator className={"mt-auto"}/>
                                    <div className={"flex flex-col gap-y-1"}>
                                        {Object.entries(item.productSpec).map(([k, v]) => {
                                            return (
                                                <div key={k} className={"flex flex-col"}>
                                                    <span className={"text-neutral-500 text-xs"}>{k}</span>
                                                    <span className={"text-sm"}>{v}</span>
                                                </div>
                                            )
                                        })}
                                    </div>

                                </div>

                            )
                        })}
                    </div>

                    <div className={"grid grid-cols-3 gap-5"}>
                        <FormField
                            control={form.control}
                            name='priceIp'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Price (IP Coin - Story Protocol)</FormLabel>
                                    <FormControl>
                                        <Input  {...field} type={"number"} disabled={selectedIndex === null}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='goalAmountIp'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Funding Goal Amount</FormLabel>
                                    <FormControl>
                                        <Input  {...field} type={"number"} disabled={selectedIndex === null}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name='royaltyPercent'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Royalty Percent to IP Holder</FormLabel>
                                    <FormControl>
                                        <Input  {...field} type={"number"} disabled={selectedIndex === null}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name='message'
                            render={({field}) => (
                                <FormItem className={"col-span-3"}>
                                    <FormLabel>Message</FormLabel>
                                    <FormControl>
                                        <Input  {...field} disabled={selectedIndex === null}
                                                placeholder={"More story about this product"}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                    </div>


                    <Button disabled={selectedIndex === null}
                            type="submit">{"Launch"}
                    </Button>
                </form>
            </Form>
        </main>
    )
}