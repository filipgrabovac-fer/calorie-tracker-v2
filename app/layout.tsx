import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GlobalStateProvider } from "./providers/GlobalStateProvider";
import { TanstackQueryClientProvider } from "./providers/TanstackQueryClientProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
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
		<html lang="en" suppressHydrationWarning style={{ background: "transparent" }}>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				style={{ background: "transparent" }}
			>
				<ThemeProvider>
					<TanstackQueryClientProvider>
						<GlobalStateProvider>{children}</GlobalStateProvider>
					</TanstackQueryClientProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
