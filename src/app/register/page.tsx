'use client'

import {uploadJSONToFile, uploadJSONToIPFS} from "@/lib/pinta";
import {createHash} from "node:crypto";
import {useWalletClient} from "wagmi";
import {useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {setupStoryClient} from '@/lib/story'
import {Button} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {ImageIcon} from "lucide-react";
import Image from "next/image";
import {useIpStore} from "@/lib/use-ip-store";
import {useRouter} from "next/navigation";
import {IPMetadata} from "@/lib/types";
import {Separator} from "@/components/ui/separator";

interface RegistFormData {
    title: string
    description: string;
    image: File
    media: File
    creators: {
        name: string
        address: string
        description: string
        contributionPercent: number
    }[]
}


export default function RegisterPage() {
    const {data: wallet} = useWalletClient();

    const prepareIpData = async (ipMetadata: IPMetadata) => {
        const ipIpfsHash = await uploadJSONToIPFS(ipMetadata);
        const ipHash = createHash("sha256")
            .update(JSON.stringify(ipMetadata))
            .digest("hex");

        const nftMetadata = {
            name: `${ipMetadata.title}: NFT Ownership`,
            description: `${ipMetadata.description}: NFT Ownership`,
            image: ipMetadata.image
        }
        const nftIpfsHash = await uploadJSONToIPFS(nftMetadata);

        const nftHash = createHash("sha256")
            .update(JSON.stringify(nftMetadata))
            .digest("hex");

        return {
            ipIpfsHash, ipHash, nftIpfsHash, nftHash
        }

    }

    const form = useForm<RegistFormData>({
        defaultValues: {
            title: '',
            description: '',
            image: undefined,
            media: undefined,
            creators: [{name: "", contributionPercent: 0, description: "", address: ""}]
        }
    })

    const [registState, setRegistState] = useState("");

    const setIpId = useIpStore(s => s.setIpId)
    const ipId = useIpStore(s => s.ipId)


    const router = useRouter();

    const registered = useRef(false);
    useEffect(() => {
        if (ipId) {
            if (registered.current) {
                registered.current = false
                router.push("/ip")
            }
        }
    }, [ipId])


    const handleRegister = async (data: RegistFormData) => {
        const client = await setupStoryClient(wallet);

        try {
            setRegistState("Upload image, media to IPFS...")
            const imageIpfsHash: string = await uploadJSONToFile(data.image)
            const mediaIpfsHash: string = await uploadJSONToFile(data.media)

            const mediaType: string = data.media.type;

            const ipMetadata: IPMetadata = {
                title: data.title, description: data.description,
                image: `https://ipfs.io/ipfs/${imageIpfsHash}`,
                mediaUrl: `https://ipfs.io/ipfs/${mediaIpfsHash}`,
                mediaType, creators: data.creators
            }

            setRegistState("Upload metadata to IPFS...")
            const {ipHash, ipIpfsHash, nftIpfsHash, nftHash} = await prepareIpData(ipMetadata)

            setRegistState("Mint And Register IP to Story Protocol...")
            const response = await client.ipAsset.mintAndRegisterIp({
                spgNftContract: "0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc",
                ipMetadata: {
                    ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
                    ipMetadataHash: `0x${ipHash}`,
                    nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
                    nftMetadataHash: `0x${nftHash}`,
                },
                txOptions: {waitForTransaction: true},
            });

            setIpId(
                response.ipId as string,
            )
            registered.current = true;
        } catch (e: unknown) {
            alert("Failed :(")
            console.error(e)
            setRegistState("")
        }
    }

    const imageRef = useRef<HTMLInputElement>(null)
    const mediaRef = useRef<HTMLInputElement>(null)


    return (
        <main>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(handleRegister)}
                      className="space-y-8">
                    <div>
                        <p className={"font-bold  text-xs text-chart-1"}>
                            STEP 1
                        </p>


                        <h3 className="text-lg font-medium">Register Your IP License</h3>
                        <p className="text-sm text-muted-foreground">
                            Please enter your IP license information
                        </p>
                    </div>

                    <Separator/>

                    <FormField
                        control={form.control}
                        name='title'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='description'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input  {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <div className={"grid grid-cols-2 gap-x-5"}>

                        <FormField
                            control={form.control}
                            name='image'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Image</FormLabel>
                                    <FormControl>
                                        <div>
                                            <button type={'button'}
                                                    className={"w-full h-[160px] border rounded cursor-pointer relative"}
                                                    onClick={() => {
                                                        imageRef.current?.click()
                                                    }}>
                                                {field.value && (
                                                    <Image src={URL.createObjectURL(field.value)} fill alt={'Image'}
                                                           className={'rounded object-cover'}/>
                                                )}
                                                {!field.value && (
                                                    <ImageIcon className={"m-auto"}/>
                                                )}
                                                <input
                                                    onChange={e => {
                                                        if (e.target.files) {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                field.onChange(file)
                                                            }
                                                        }
                                                        e.target.value = ''
                                                    }}
                                                    ref={imageRef} className={"hidden"} type={'file'} accept={'image/*'}
                                                />
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='media'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Media</FormLabel>
                                    <FormControl>
                                        <div>
                                            <button type={'button'}
                                                    className={"w-full h-[160px] border rounded cursor-pointer relative"}
                                                    onClick={() => {
                                                        mediaRef.current?.click()
                                                    }}>
                                                {field.value && (
                                                    <Image src={URL.createObjectURL(field.value)} fill alt={'Image'}
                                                           className={'rounded object-cover'}/>
                                                )}
                                                {!field.value && (
                                                    <ImageIcon className={"m-auto"}/>
                                                )}
                                                <input
                                                    onChange={e => {
                                                        if (e.target.files) {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                field.onChange(file)
                                                            }
                                                        }
                                                        e.target.value = ''
                                                    }}
                                                    ref={mediaRef} className={"hidden"} type={'file'} accept={'image/*'}
                                                />
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                    </div>

                    <FormField
                        control={form.control}
                        name='creators.0.name'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Creator Name</FormLabel>
                                <FormControl>
                                    <Input  {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='creators.0.address'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Creator Address</FormLabel>
                                <FormControl>
                                    <Input  {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='creators.0.description'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Creator Description</FormLabel>
                                <FormControl>
                                    <Input  {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='creators.0.contributionPercent'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Creator Contribution Percent</FormLabel>
                                <FormControl>
                                    <Input  {...field} type={'number'}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <Button disabled={form.formState.isSubmitting} type="submit">Register</Button>
                    {
                        !!registState && <p>{registState}</p>
                    }
                </form>
            </Form>
        </main>

    )
}