import './globals.css';
import { Nunito, Montserrat } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script';
import * as fbq from '../lib/fpixel';

const nunito = Nunito({
  subsets: [],
  variable: '--font-nunito',
});

const montserrat = Montserrat({
  subsets: [],
  variable: '--font-montserrat',
});

export const metadata = {
  title: 'Advisorsavvy',
  description: 'Retirement Calculator',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main
          className={`min-h-screen flex flex-col items-center bg-white text-gray-600 pt-4 w-full ${
            nunito.variable + '  ' + montserrat.variable
          }`}
        >
          {children}
          <Script
            id="fb-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', ${fbq.FB_PIXEL_ID});
          `,
            }}
          />
          <Analytics />
        </main>
      </body>
    </html>
  );
}
