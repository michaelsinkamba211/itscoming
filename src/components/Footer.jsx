import Link from 'next/link'
import { Container } from '@/components/Container'
import Image from "next/image";
// import avatarImage from '@/images/zamspacelogo.png'

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="transition hover:text-teal-500 "
    >
      {children}
    </Link>
  )
}

export function Footer() {
  return (
    <footer className="mt-10">
      <Container.Outer>
        <div className="border-t border-zinc-100 pt-10 pb-10 ">
          <Container.Inner>
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row max-w-5xl mx-auto">

              {/* Navigation Links */}
              <div className="flex items-center gap-3">
                <NavLink href="/">
                  <Image
                    src="/images/zamspacelogo.png" 
                    alt="ZamSpace Logo"
                    
                    width={120}     
                    height={40}       
                    className="object-contain"
                    priority
                  />
                </NavLink>
              </div>

              {/* Copyright */}
              <p className="text-sm text-zinc-400 ">
                &copy; {new Date().getFullYear()} ZamSpace. All rights reserved.
              </p>

            </div>
          </Container.Inner>
        </div>
      </Container.Outer>
    </footer>
  )
}
