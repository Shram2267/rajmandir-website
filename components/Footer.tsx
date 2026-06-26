"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-[#1C1814] text-[#FBF9F6] border-t-[6px] border-brand relative overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      
      <div className="mx-auto w-full max-w-[1180px] px-4 lg:px-6 pt-16 lg:pt-20 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-8 border-b border-white/10 pb-16">
          
          {/* Brand Column */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col items-start">
            <Logo variant="footer" />
            <p className="text-[15px] text-[#A89F93] mt-5 leading-[1.7] pr-4">
              Delhi&apos;s leading food &amp; grocery store. Wholesale rate ka hypermarket — sab kuch, ek chhat ke neeche.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-4 mt-8">
              <a href="https://www.instagram.com/rajmandir.hypermarket" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand hover:text-white transition-all hover:-translate-y-1" aria-label="Instagram">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://www.facebook.com/rajmandirhm/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand hover:text-white transition-all hover:-translate-y-1" aria-label="Facebook">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://www.youtube.com/@rajmandir_vlogs" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand hover:text-white transition-all hover:-translate-y-1" aria-label="YouTube">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-7 lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="flex flex-col">
              <h3 className="font-extrabold text-white text-[15px] mb-5 uppercase tracking-wider">Browse</h3>
              <div className="flex flex-col gap-3 text-[14px] text-[#A89F93] font-medium">
                <Link href="/offers" className="hover:text-brand transition-colors inline-block w-fit">Today&apos;s Offers</Link>
                <Link href="/offers" className="hover:text-brand transition-colors inline-block w-fit">Fresh Produce</Link>
                <Link href="/offers" className="hover:text-brand transition-colors inline-block w-fit">Groceries</Link>
                <Link href="/offers" className="hover:text-brand transition-colors inline-block w-fit">Household</Link>
              </div>
            </div>
            <div className="flex flex-col">
              <h3 className="font-extrabold text-white text-[15px] mb-5 uppercase tracking-wider">Company</h3>
              <div className="flex flex-col gap-3 text-[14px] text-[#A89F93] font-medium">
                <Link href="/about" className="hover:text-brand transition-colors inline-block w-fit">About Us</Link>
                <Link href="/stores" className="hover:text-brand transition-colors inline-block w-fit">Store Locator</Link>
                <Link href="/careers" className="hover:text-brand transition-colors inline-block w-fit">Careers</Link>
                <Link href="/contact" className="hover:text-brand transition-colors inline-block w-fit">Contact Us</Link>
              </div>
            </div>
            <div className="flex flex-col col-span-2 sm:col-span-1">
              <h3 className="font-extrabold text-white text-[15px] mb-5 uppercase tracking-wider">Legal</h3>
              <div className="flex flex-col gap-3 text-[14px] text-[#A89F93] font-medium">
                <Link href="/terms" className="hover:text-brand transition-colors inline-block w-fit">Terms of Service</Link>
                <Link href="/privacy" className="hover:text-brand transition-colors inline-block w-fit">Privacy Policy</Link>
                <Link href="/returns" className="hover:text-brand transition-colors inline-block w-fit">Return Policy</Link>
              </div>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-12 lg:col-span-3 flex flex-col">
            <h3 className="font-extrabold text-white text-[15px] mb-4 uppercase tracking-wider">Never Miss an Offer</h3>
            <p className="text-[14px] text-[#A89F93] mb-4">Subscribe to our newsletter for the latest deals and store updates.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-[14px] text-white placeholder:text-white/40 focus:outline-none focus:border-brand w-full transition-colors"
                required
              />
              <button 
                type="submit" 
                className="bg-brand text-white px-4 py-2.5 rounded-lg text-[14px] font-bold hover:bg-brand-deep transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
          
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[13px] text-[#A89F93] font-medium">
          <p>© {new Date().getFullYear()} Rajmandir Hypermarket. All rights reserved.</p>
          <div className="flex gap-6 items-center">
            <span>Offers updated daily</span>
            <span className="w-1 h-1 rounded-full bg-brand/50"></span>
            <span>Prices vary by store</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
