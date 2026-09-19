import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata:Metadata={
 metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000"),
 title:{default:"श्री कुशेश्वर बाबा कृषि सहकारी संस्था लिमिटेड",template:"%s | श्री कुशेश्वर बाबा कृषि सहकारी संस्था"},
 description:"विश्वास, बचत र समृद्धिको आधार — करैयामाई, बारा।",
 openGraph:{type:"website",locale:"ne_NP",siteName:"श्री कुशेश्वर बाबा कृषि सहकारी संस्था लिमिटेड"},
 robots:{index:true,follow:true}
};
export default function RootLayout({children}:{children:ReactNode}){return <html lang="ne"><body>{children}</body></html>}
