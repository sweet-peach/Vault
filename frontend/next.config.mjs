import path from 'path';


let images = {};
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
let [protocol, hostname, port] = backendUrl.split(":");
hostname = hostname.replace(/\//g, '');
hostname = hostname.replace(/\\/g, '');
if(process.env.NEXT_PUBLIC_NODE_ENV === 'development'){
    images = {
        remotePatterns: [
            {
                protocol: protocol,
                hostname: hostname,
                port: port ? port : "",
                pathname: '/avatar/**',
            },
        ],
    }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: images,
    sassOptions: {
        silenceDeprecations: ['legacy-js-api'],
    },
    // This is a workaround to avoid being forced to use camelCase in React modules
    // Source - https://stackoverflow.com/questions/74038400/convert-css-module-kebab-case-class-names-to-camelcase-in-next-js
    webpack: (config) => {
        const rules = config.module.rules
            .find((rule) => typeof rule.oneOf === 'object').oneOf.filter((rule) => Array.isArray(rule.use));
        rules.forEach((rule) => {
            rule.use.forEach((moduleLoader) => {
                if (
                    moduleLoader.loader !== undefined
                    && moduleLoader.loader.includes('css-loader')
                    && typeof moduleLoader.options.modules === 'object'
                ) {
                    moduleLoader.options = {
                        ...moduleLoader.options,
                        modules: {
                            ...moduleLoader.options.modules,
                            // This is where we allow camelCase class names
                            exportLocalsConvention: 'camelCase'
                        }
                    };
                }
            });
        });

        return config;
    }
};

export default nextConfig;
