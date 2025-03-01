import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html>
            <Head>
                <script src="https://checkout.razorpay.com/v1/checkout.js" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
} 