import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GlobalStateProvider } from "./providers/GlobalStateProvider";
import { TanstackQueryClientProvider } from "./providers/TanstackQueryClientProvider";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Calorie Tracker",
	description: "Track daily calories for Filip and Klara",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" style={{ background: 'transparent' }}>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				style={{ background: 'transparent' }}
			>
				<TanstackQueryClientProvider>
					<GlobalStateProvider>{children}</GlobalStateProvider>
				</TanstackQueryClientProvider>
			</body>
		</html>
	);
}
