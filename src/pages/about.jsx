import Image from 'next/future/image'
import Head from 'next/head'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import {
  TwitterIcon,
  InstagramIcon,
  GitHubIcon,
  LinkedInIcon,
} from '@/components/SocialIcons'

import { FaTwitter, FaLinkedinIn, FaInstagram, FaFacebookF } from "react-icons/fa";

function SocialLink({ className, href, children, icon: Icon }) {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        href={href}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-blue-500"
      >
        <Icon className="h-7 w-7 flex-none fill-zinc-500 transition group-hover:fill-blue-500 rounded-full border p-1.5" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  )
}



function PhoneIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21 11.36 11.36 0 003.54.57 1 1 0 011 1v3.61a1 1 0 01-1 1A16 16 0 014 5a1 1 0 011-1h3.61a1 1 0 011 1c0 1.25.2 2.48.57 3.54a1 1 0 01-.21 1.11l-2.35 2.14z"
      />
    </svg>
  )
}

export function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        d="M3 6.75h18M3 6.75v10.5c0 .414.336.75.75.75h16.5a.75.75 0 0 0 .75-.75V6.75M3 6.75l9 6 9-6"
      />
    </svg>
  )
}


export default function About() {
  return (
    <>
      <Head>
        <title>About - ZamSpace</title>
        <meta
          name="description"
          content="Meet the founders of ZamSpace - Barbara Chanakira and Tinga Koloko. Creating Zambia&apos;s trusted property ecosystem."
        />
      </Head>
      <Container className="mt-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl">
            Meet the Founders
          </h1>
          <p className="mt-6 text-lg text-zinc-600 max-w-2xl mx-auto">
            Bringing together decades of international real estate expertise and local Zambian market knowledge to create a trusted property ecosystem for Zambia.
          </p>
        </div>

        {/* Barbara Chanakira - Now First */}
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12 mb-24">
          <div className="lg:pl-20">
            <div className="max-w-xs px-2.5 lg:max-w-none mx-auto">
              <Image
                src="/images/barbara.jpg"
                width={400}
                height={450}
                alt="Barbara Chanakira"
                sizes="(min-width: 1024px) 32rem, 20rem"
                className="aspect-square rotate-2 rounded-2xl bg-zinc-100 object-cover"
              />
            </div>
          </div>
          <div className="lg:order-first lg:row-span-2">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-800 sm:text-4xl">
              Barbara Chanakira
            </h2>
            <p className="mt-4 text-lg text-zinc-600 font-medium">
              Co-Founder, ZamSpace | Founder & Director, Eaton Premier
            </p>
            <div className="mt-6 space-y-5 text-base text-zinc-600">
              <p>
                Barbara Chanakira is a Zambian entrepreneur and the founder and director of Eaton Premier,
                www.eatonpremier.com a luxury property company based in Mayfair, London, established in 2011.
                With nearly two decades of experience in the international real estate industry, Barbara has
                advised clients on multi-million-pound property transactions across London, Dubai, Switzerland,
                Monaco, and the United States.
              </p>
              <p>
                Her deep expertise in high-end real estate, coupled with a passion for excellence in client service,
                brings a wealth of knowledge and vision to ZamSpace. Barbara&apos;s global perspective and proven track
                record in luxury property development position her as a driving force behind the platform&apos;s success
                and growth in the Zambian and international markets.
              </p>
              <p>
                Barbara&apos;s international experience combined with her Zambian heritage provides unique insights
                into creating a platform that meets global standards while understanding local market dynamics.
              </p>
            </div>
          </div>
          <div className="lg:pl-20">
            <ul role="list">
              {/* <SocialLink
                href="https://facebook.com/in/barbara-chanakira"
                icon={FaFacebookF}
                className="mt-4"
              >
                Follow on Facebook
              </SocialLink>
              <SocialLink
                href="https://twitter.com/barbarachanakira"
                icon={TwitterIcon}
                className="mt-4"
              >
                Follow on Twitter
              </SocialLink> */}
             <SocialLink href="mailto:barbara@zamspace.com" icon={MailIcon} className="mt-4">
                barbara@zamspace.com
              </SocialLink>

            </ul>
          </div>
        </div>

        {/* Tinga Koloko - Now Second */}
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
          <div className="lg:pr-20">
            <div className="max-w-xs px-2.5 lg:max-w-none mx-auto">
              <Image
                src="/images/tinga.jpg"
                alt="Tinga Koloko"
                sizes="(min-width: 1024px) 32rem, 20rem"
                width={400}
                height={450}
                className="aspect-square -rotate-1 rounded-2xl bg-zinc-100 object-cover"
              />
            </div>
          </div>
          <div className="lg:row-span-2">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-800 sm:text-4xl">
              Tinga Koloko
            </h2>
            <p className="mt-4 text-lg text-zinc-600 font-medium">
              Managing Director, Urban Nest Properties Limited
            </p>
            <div className="mt-6 space-y-5 text-base text-zinc-600">
              <p>
                Tinga Koloko is a Zambian entrepreneur and Managing Director of Urban Nest Properties Limited,
                a fast-growing real estate and investment company headquartered in Lusaka. With a forward-looking
                vision and a passion for innovation, he has led Urban Nest in redefining property management and
                development standards across Zambia — blending local insight with global best practices.
              </p>
              <p>
                Under his leadership, Urban Nest has expanded into diverse sectors including construction, logistics,
                automotive services, and food production, reflecting a strategic approach to building a resilient,
                multi-sector business ecosystem. Tinga&apos;s entrepreneurial philosophy is rooted in sustainable growth,
                quality service delivery, and empowering teams to create long-term value for clients and stakeholders.
              </p>
              <p>
                Recognised for his dynamic leadership and cross-sector perspective, Tinga Koloko represents a new wave
                of African business leaders driving transformation through integrity, adaptability, and strategic foresight.
                His commitment to excellence continues to position Urban Nest Properties as a trusted and forward-thinking
                player in Zambia&apos;s real estate and investment landscape.
              </p>
            </div>
          </div>
          <div className="lg:pr-20">
            <ul role="list">
              {/* <SocialLink
                href="https://facebook.com/in/tinga-koloko"
                icon={FaFacebookF}
                className="mt-4"
              >
                Follow on Facebook
              </SocialLink>
              <SocialLink
                href="https://twitter.com/tingakoloko"
                icon={TwitterIcon}
                className="mt-4"
              >
                Follow on Twitter
              </SocialLink> */}
              <SocialLink href="mailto:tinga@zamspace.com" icon={MailIcon} className="mt-4">
                tinga@zamspace.com
              </SocialLink>
            </ul>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 pt-16 border-t border-zinc-100">
          <div className="text-center">
            <h3 className="text-2xl font-bold tracking-tight text-zinc-800 sm:text-3xl">
              Get in Touch
            </h3>
            <p className="mt-4 text-zinc-600">
              Interested in partnering with ZamSpace or learning more about our platform?
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="mailto:enquiries@zamspace.com"
                className="inline-flex items-center text-sm font-medium text-zinc-800 transition hover:text-blue-500"
              >
                <MailIcon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-blue-500" />
                <span className="ml-4">enquiries@zamspace.com</span>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}