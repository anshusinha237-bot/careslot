import "./globals.css";
import { AppProvider } from "../context/AppContext";
import LiveTicker from "../components/LiveTicker";
import Footer from "../components/Footer";
import NotificationToast from "../components/NotificationToast";

export const metadata = {
  title: "CareSlot - Real-Time Doctor Availability & OPD Appointment System",
  description: "Full-stack real-time doctor availability tracking, queue status synchronization, and dynamic OPD slot booking system.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
        <AppProvider>
          <LiveTicker />
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
          <NotificationToast />
        </AppProvider>
      </body>
    </html>
  );
}
