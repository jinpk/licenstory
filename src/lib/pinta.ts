import {PinataSDK} from "pinata-web3";

const pinata = new PinataSDK({
    pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
    pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`

});

export async function uploadJSONToIPFS(jsonMetadata: any): Promise<string> {
    const {IpfsHash} = await pinata.upload.json(jsonMetadata);
    return IpfsHash;
}

export async function uploadJSONToFile(file: File): Promise<string> {
    const {IpfsHash} = await pinata.upload.file(file);
    return IpfsHash;
}
