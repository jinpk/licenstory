'use client'

import {useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button"
import {
    Form,
    FormControl, FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {useIpStore} from "@/lib/use-ip-store";
import {useRouter} from "next/navigation";
import {IPMetadata} from "@/lib/types";
import {Separator} from "@/components/ui/separator";
import Image from "next/image";
import {getExplorerUrl} from "@/lib/utils";
import {useProductStore} from "@/lib/use-product-store";
import {useReadContract} from "wagmi";
import {CORE_METADATA_VIEW_MODULE_ABI} from "@/lib/story";

interface RegistFormData {
    ideas: string
}

export default function IpPage() {
    const ipId = useIpStore(s => s.ipId)
    useEffect(() => {
        if (!ipId) {
            router.replace("/register")
        }
    }, [ipId])

    const readContract = useReadContract({
        address: "0xB3F88038A983CeA5753E11D144228Ebb5eACdE20",
        abi: CORE_METADATA_VIEW_MODULE_ABI,
        functionName: "getCoreMetadata",
        args: [ipId]
    })

    const [metadata, setMetadata] = useState<IPMetadata>({
        creators: [], description: "", image: "", mediaType: "", mediaUrl: "", title: ""

    })

    useEffect(() => {
        const data = readContract.data as any
        if (data?.metadataURI) {
            fetch(data.metadataURI).then(res => res.json()).then(setMetadata).catch(e => {
                alert("Failed to fetch IPFS.")
            })
        }
    }, [readContract.data])


    const form = useForm<RegistFormData>({
        defaultValues: {
            ideas: ""
        }
    })

    const router = useRouter()

    const {items, setItems} = useProductStore(s => s)
    const [registState, setRegistState] = useState("");

    const planed = useRef(false)
    useEffect(() => {
        if (items.length >= 1) {
            if (planed.current) {
                planed.current = false
                router.push("/product")
            }
        }
    }, [items]);

    const handleRegister = async (data: RegistFormData) => {
        try {
            setRegistState("Planning by AI Agent...")

            const res = await fetch(`/api/planning`, {
                method: "POST", body: JSON.stringify({
                    metadata,
                    ideas: data.ideas
                })
            })

            if (res.status >= 400) {
                alert("Failed to planning")
                console.error(res.status, res.statusText, await res.json())
                return;
            }

            const result = await res.json();

            setItems(JSON.parse(result))
            setRegistState("")
            planed.current = true
        } catch (e: unknown) {
            setRegistState("")
            alert("Failed. please try again.")
        }

    }


    function Row({label, value}: { label: string; value: React.ReactNode }) {
        return (
            <div className="flex justify-between border-b border-dashed pb-1 last-of-type:!border-none">
                <span className="font-medium text-gray-600">{label}</span>
                <span className="text-gray-800 text-right">{value}</span>
            </div>
        );
    }


    return (
        <main>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(handleRegister)}
                      className="space-y-8 ">
                    <div>
                        <p className={"font-bold text-xs text-chart-1"}>
                            STEP 2
                        </p>

                        <h3 className="text-lg font-medium">Request IP Analysis and Research</h3>
                        <p className="text-sm text-muted-foreground">
                            Based on the information below, ask <strong>LicenStory AI Agent</strong> to planning the
                            best-selling Goods products right now !
                        </p>


                    </div>

                    <Separator/>

                    <FormLabel>About IP</FormLabel>

                    <div className="space-y-3 text-sm">
                        <Row label="IP ID" value={
                            <a href={getExplorerUrl(ipId)} target="_blank"
                               className="text-blue-600 underline"
                            >
                                {(ipId)}
                            </a>

                        }/>
                        <Row label="Title" value={metadata.title}/>
                        <Row label="Description" value={metadata.description}/>
                        <Row
                            label="Image"
                            value={
                                <a href={metadata.image} target="_blank">
                                    {!!metadata.image && (
                                        <Image src={metadata.image} alt="IP Image"
                                               width={0}
                                               height={0}
                                               sizes={'100vw'}
                                               className="w-[250px] h-auto rounded-lg shadow-sm"/>
                                    )}
                                </a>
                            }
                        />
                        <Row
                            label="Media"
                            value={<a href={metadata.mediaUrl} target="_blank" className="text-blue-600 underline">View
                                Media ({metadata.mediaType})</a>}
                        />
                    </div>

                    <Separator/>

                    <FormLabel>About Creators</FormLabel>
                    {metadata.creators?.[0] && (
                        <div className="space-y-3 text-sm">
                            <Row label="Creator Name" value={metadata.creators[0].name}/>
                            <Row label="Creator Description" value={metadata.creators[0].description}/>
                            <Row label="Creator Address" value={
                                <a href={getExplorerUrl(metadata.creators[0].address, 'address')} target="_blank"
                                   className="text-blue-600 underline"
                                >
                                    {(metadata.creators[0].address)}
                                </a>
                            }/>
                            <Row label="Contribution %" value={`${metadata.creators[0].contributionPercent}%`}/>
                        </div>
                    )}


                    <Separator/>

                    <FormField
                        control={form.control}
                        name='ideas'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>More Ideas</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                    If you have any ideas for planning goods products, please let me know!
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />


                    <div className={"flex flex-col gap-y-2"}>
                        <div className={"flex items-center gap-x-2"}>
                            <Button disabled={form.formState.isSubmitting}
                                    type="submit">{registState ? registState : "Start Planning"}</Button>

                            <span
                                className={"text-sm text-muted-foreground"}>Research from <strong>X</strong>, <strong>Reddit</strong></span>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            To find out the current fan trends, I will conduct a research on SNS
                        </p>
                    </div>

                </form>
            </Form>

        </main>
    )
}