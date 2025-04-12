export interface CampaignMetadata {
    "message": string;
    "productType": string;
    "productName": string;
    "productSpec": any;
    "productIdea": string;
    "imageUrl": string;
    royaltyPercent: number;
    priceIp: number;
    goalAmountIp: number
}

export interface IPMetadata {
    title: string
    description: string;
    image: string;
    mediaUrl: string
    mediaType: string
    creators: {
        name: string
        address: string
        description: string
        contributionPercent: number
    }[]
}

export interface ProductItem {
    "productType": string;
    "productName": string;
    "productSpec": string;
    imageRequestPrompt: string
    "productIdea": string;
    "recommendationReason": string;
    imgeUrl: string
}