import type { Metadata } from 'next';
import './globals.css';
import '../game/game.css';
export const metadata: Metadata = { title: 'MONKE CITY — A RICHMONKE Story', description: 'Start with $7. Enter Monke City. A playable RICHMONKE story.' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
