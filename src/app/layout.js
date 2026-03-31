import { Outfit, Playfair_Display } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata = {
  title: "Fairway Philanthropy | Elite Golf Charity Platform",
  description: "A premium platform where your love for the game fuels global change. Join the elite club of charitable golfers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable}`}>
      <body>
        <header>
          <div className="nav-container">
            <Link href="/" className="logo">
              Fairway <span style={{ color: 'var(--primary)' }}>Philanthropy</span>
            </Link>
            <nav>
              <ul className="nav-links">
                <li><Link href="/">Overview</Link></li>
                <li><Link href="/charities">Philanthropy</Link></li>
                <li><Link href="/dashboard">Member Portal</Link></li>
                <li><Link href="/login" className="btn btn-primary">Join Club</Link></li>
              </ul>
            </nav>
          </div>
        </header>
        <main>
          {children}
        </main>
        <footer style={{ padding: '4rem 2rem', borderTop: '1px solid var(--glass-border)', marginTop: '4rem' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="logo" style={{ fontSize: '1.2rem' }}>Fairway Philanthropy</div>
            <p style={{ opacity: 0.5, fontSize: '0.875rem' }}>&copy; {new Date().getFullYear()} Elite Golfing Circle. All Rights Reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
