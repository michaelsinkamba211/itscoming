import Image from 'next/future/image'
import Head from 'next/head'
import Link from 'next/link'
import clsx from 'clsx'
import { Popover } from '@headlessui/react'

import { Card } from '@/components/Card'
import { Container } from '@/components/Container'
import { FaFacebookF } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";

// import image1 from '@/images/photos/image1.jpg'
// import image2 from '@/images/photos/image2.jpg'
// import image3 from '@/images/photos/image5.jpg'
// import image4 from '@/images/photos/image4.jpg'
// import image5 from '@/images/photos/image6.jpg'

import { generateRssFeed } from '@/lib/generateRssFeed'
import { getAllArticles } from '@/lib/getAllArticles'
import { formatDate } from '@/lib/formatDate'

function MailIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M2.75 7.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
        className="fill-zinc-100 stroke-zinc-400"
      />
      <path
        d="m4 6 6.024 5.479a2.915 2.915 0 0 0 3.952 0L20 6"
        className="stroke-zinc-400"
      />
    </svg>
  )
}

const images = [
  '/images/photos/image1.jpg',
  '/images/photos/image2.jpg',
  '/images/photos/image3.jpg',
  '/images/photos/image4.jpg',
  '/images/photos/image5.jpg',
]

function BriefcaseIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M2.75 9.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
        className="fill-zinc-100 stroke-zinc-400"
      />
      <path
        d="M3 14.25h6.249c.484 0 .952-.002 1.316.319l.777.682a.996.996 0 0 0 1.316 0l.777-.682c.364-.32.832-.319 1.316-.319H21M8.75 6.5V4.75a2 2 0 0 1 2-2h2.5a2 2 0 0 1 2 2V6.5"
        className="stroke-zinc-400"
      />
    </svg>
  )
}

function ArrowDownIcon(props) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4.75 8.75 8 12.25m0 0 3.25-3.5M8 12.25v-8.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Article({ article }) {
  return (
    <Card as="article">
      <Card.Title href={`/articles/${article.slug}`}>
        {article.title}
      </Card.Title>
      <Card.Eyebrow as="time" dateTime={article.date} decorate>
        {formatDate(article.date)}
      </Card.Eyebrow>
      <Card.Description>{article.description}</Card.Description>
      <Card.Cta>Read article</Card.Cta>
    </Card>
  )
}

function SocialLink({ icon: Icon, ...props }) {
  return (
    <Link className="group -m-1 p-1" {...props}>
      <Icon className="h-8 w-8 fill-zinc-500 transition border p-2 rounded-full group-hover:fill-zinc-600" />
    </Link>
  )
}

function Resume() {
  return (
    <div className="rounded-2xl border border-zinc-100 p-6">
      <h2 className="flex text-sm font-semibold text-zinc-900">
        <BriefcaseIcon className="h-6 w-6 flex-none" />
        <span className="ml-3">Join the Waiting List</span>
      </h2>

      {/* Waiting List Form */}
      <div className="mt-6">
        <form className="space-y-4">
          <div className='flex w-full gap-3'>
            {/* Email Field */}
            <div className='w-full'>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm placeholder-zinc-400 shadow-sm focus:border-green-800 focus:outline-none focus:ring-1 focus:ring-green-800"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Phone Field */}
            <div className='w-full'>
              <label htmlFor="phone" className="block text-sm font-medium text-zinc-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm placeholder-zinc-400 shadow-sm focus:border-green-800 focus:outline-none focus:ring-1 focus:ring-green-800"
                placeholder="+260 XXX XXX XXX"
              />
            </div>
          </div>

          {/* User Type Selection */}
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              I am a *
            </label>
            <div className="mt-2 space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="userType"
                  value="individual"
                  className="h-4 w-4 border-zinc-300 text-green-900 focus:ring-green-800"
                  defaultChecked
                />
                <span className="ml-2 text-sm text-zinc-700">
                  🏠 Tenant/Buyer/Property Seeker
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="userType"
                  value="professional"
                  className="h-4 w-4 border-zinc-300 text-green-900 focus:ring-green-800"
                />
                <span className="ml-2 text-sm text-zinc-700">
                  💼 Landlord/Agent/Service Provider
                </span>
              </label>
            </div>
          </div>

          {/* Message Field */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-zinc-700">
              What are you looking for?
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm placeholder-zinc-400 shadow-sm focus:border-green-800 focus:outline-none focus:ring-1 focus:ring-green-800"
              placeholder="Tell us about your property needs, services required, or what you're offering..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-md bg-green-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-800 focus:ring-offset-2"
          >
            Join Waiting List
          </button>

          {/* Privacy Note */}
          <p className="text-xs text-zinc-500">
            By joining, you agree to be notified when ZamSpace launches. We respect your privacy and will not share your information.
          </p>
        </form>
      </div>
    </div>
  )
}

function Photos() {
  let rotations = ['rotate-2', '-rotate-2', 'rotate-2', 'rotate-2', '-rotate-2']

  return (
    <div className="mt-16 sm:mt-20">
      <div className="-my-4 flex justify-center gap-5 overflow-hidden py-4 sm:gap-8">
        {images.map((src, index) => (
          <div
            key={src}
            className={clsx(
              'relative aspect-[9/10] w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 sm:w-72 sm:rounded-2xl',
              rotations[index % rotations.length]
            )}
          >
            <Image
              src={src}
              fill
              alt=""
              sizes="(min-width: 840px) 20rem, 13rem"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function MobileNavItem({ href, children }) {
  return (
    <li>
      <Popover.Button as={Link} href={href} className="block py-2">
        {children}
      </Popover.Button>
    </li>
  )
}

export default function Home({ articles }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>ZamSpace - Property, Services, and Suppliers</title>
        <meta
          name="description"
          content="I'm ZamSpace. A leader, artist, and frontend enthusiast"
        />
      </Head>
      <Container className="mt-9">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl">
            Your Trusted Property Ecosystem. <span className="text-green-900">— Verified..</span>
          </h1>
          <p className="mt-6 text-base text-zinc-600">
            ZamSpace is Zambia&apos;s  modern property ecosystem, bringing together tenants, buyers, landlords, sellers, and verified professionals on one trusted platform.. We&apos;re building a seamless way to rent, buy, sell, and build making property transactions simpler, safer, and more transparent across Zambia.
          </p>
          <div className="mt-6 mb-10 flex gap-6">
            <SocialLink
              href="https://www.tiktok.com/@zam_space?_r=1&_t=ZM-91rSzWQaTnc"
              aria-label="Follow on TikTok"
              icon={FaTiktok}
              className="h-8 w-8"
            />
            <SocialLink
              href="https://www.facebook.com/share/17EERnwRpC/?mibextid=wwXIfr"
              aria-label="Follow on Facebook"
              icon={FaFacebookF}
              className="h-8 w-8"
            />
          </div>

          <div className="mt-6 flex gap-6">
            <Link
              href="/join"
              className="rounded-lg bg-zinc-900 px-6 py-2 text-sm font-semibold text-white hover:bg-zinc-700 transition"
            >
              Join the Waiting List
            </Link>
          </div>
        </div>
      </Container>
      <Photos />
      <Container className="mt-24 md:mt-28">
        <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none">
          <div className="space-y-10 lg:pl-16 xl:pl-24">
            <Resume />
          </div>
        </div>
      </Container>
    </>
  )
}

export async function getStaticProps() {
  if (process.env.NODE_ENV === 'production') {
    await generateRssFeed()
  }

  return {
    props: {
      articles: (await getAllArticles())
        .slice(0, 4)
        .map(({ component, ...meta }) => meta),
    },
  }
}