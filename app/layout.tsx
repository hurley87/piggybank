import './globals.css';
import { Nunito, Montserrat } from 'next/font/google';

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
        </main>
      </body>
    </html>
  );
}
