import './globals.css';

export const metadata = {
  title: 'Advisorsavvy',
  description: 'Retirement Calculator',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen flex flex-col items-center bg-white text-gray-600 pt-4 w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
