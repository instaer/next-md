import '@/styles/globals.css';
import Head from "next/head";
import nextConfig from 'next.config';
import {createContext} from "react";
import {useRouter} from "next/router";

export const RouterContext = createContext(null);

export default function App({Component, pageProps}) {
    const router = useRouter();
    return (
        <RouterContext.Provider value={router}>
            <Head>
                <title>{nextConfig?.env?.title || 'My Document'}</title>
                <link rel="icon" href={`${nextConfig?.basePath || ''}/favicon.ico`}/>
            </Head>
            <Component {...pageProps} />
        </RouterContext.Provider>);
}
