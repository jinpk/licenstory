import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [new URL('https://ipfs.io/**')],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    webpack: config => {
        config.externals.push('pino-pretty', 'lokijs', 'encoding')
        return config
    }, eslint: {
        ignoreDuringBuilds: true,
    }
};

export default nextConfig;
