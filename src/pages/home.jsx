import Image from 'next/future/image'
import Head from 'next/head'
import Link from 'next/link'
import clsx from 'clsx'
import { Popover } from '@headlessui/react'
import { useState } from 'react'
import emailjs from '@emailjs/browser'

import { Card } from '@/components/Card'
import { Container } from '@/components/Container'
import { FaFacebookF } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";
import { CiLinkedin } from "react-icons/ci";
import { FiInstagram } from "react-icons/fi";

import { supabase } from '/lib/supabase.js';
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

function FormIcon(props) {
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

function WaitingListForm() {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    userType: 'individual',
    message: '',
    company: '',
    serviceType: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'radio') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      // Validate email
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }


      // Prepare data for Supabase
      const submissionData = {
        email: formData.email,
        phone: formData.phone || null,
        user_type: formData.userType,
        message: formData.message || null,
        company: formData.company || null,
        service_type: formData.serviceType || null,
      };

      console.log('Submitting to Supabase from home page:', submissionData);

      // Insert into Supabase
      const { data, error } = await supabase
        .from('waiting_list')
        .insert([submissionData])
        .select()
        .single();

      // Handle errors
      if (error) {
        console.error('Supabase error:', error);

        if (error.code === '23505') {
          throw new Error('This email is already registered. Please use a different email.');
        }

        throw new Error(error.message || 'Failed to save registration. Please try again.');
      }

      console.log('Success! Data saved from home page:', data);

      // Reset form on success
      setFormData({
        email: '',
        phone: '',
        userType: 'individual',
        message: '',
        company: '',
        serviceType: ''
      });

      // Show success message
      setSubmitStatus({
        type: 'success',
        message: 'Successfully joined the waiting list! We\'ll notify you when we launch.'
      });

    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Failed to submit. Please try again or contact support.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFormattedUserType = (type) => {
    switch (type) {
      case 'individual':
        return 'Tenant/Buyer/Property Seeker';
      case 'professional':
        return 'Landlord/Agent/Service Provider';
      case 'provider':
        return 'Contractor/Supplier/Professional Service';
      default:
        return type;
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-100 p-6">
      <h2 className="flex text-sm font-semibold text-zinc-900">
        <FormIcon className="h-6 w-6 flex-none" />
        <span className="ml-3">Join Our Exclusive Waiting List</span>
      </h2>

      {/* Status Message */}
      {submitStatus.message && (
        <div className={`mt-4 p-3 rounded-md text-sm ${submitStatus.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm placeholder-zinc-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="your.email@example.com"
            disabled={isSubmitting}
          />
        </div>

        {/* Phone Field */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-zinc-700">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm placeholder-zinc-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="+260 XXX XXX XXX"
            disabled={isSubmitting}
          />
        </div>

        {/* Company/Organization Field (Optional) */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-zinc-700">
            Company/Organization (Optional)
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm placeholder-zinc-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="Your company name"
            disabled={isSubmitting}
          />
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
                checked={formData.userType === 'individual'}
                onChange={handleChange}
                className="h-4 w-4 border-zinc-300 text-green-600 focus:ring-green-500"
                disabled={isSubmitting}
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
                checked={formData.userType === 'professional'}
                onChange={handleChange}
                className="h-4 w-4 border-zinc-300 text-green-600 focus:ring-green-500"
                disabled={isSubmitting}
              />
              <span className="ml-2 text-sm text-zinc-700">
                💼 Landlord/Agent/Service Provider
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="userType"
                value="provider"
                checked={formData.userType === 'provider'}
                onChange={handleChange}
                className="h-4 w-4 border-zinc-300 text-green-600 focus:ring-green-500"
                disabled={isSubmitting}
              />
              <span className="ml-2 text-sm text-zinc-700">
                🔨 Contractor/Supplier/Professional Service
              </span>
            </label>
          </div>
        </div>

        {/* Service Type Selection (Conditional) */}
        {(formData.userType === 'professional' || formData.userType === 'provider') && (
          <div>
            <label htmlFor="serviceType" className="block text-sm font-medium text-zinc-700">
              Primary Service/Category *
            </label>
            <select
              id="serviceType"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              disabled={isSubmitting}
              required
            >
              <option value="">Select your profession/category</option>

              {/* Property Professionals */}
              <optgroup label="Property Professionals">
                <option value="landlord">Landlord</option>
                <option value="tenant">Tenant</option>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                <option value="estate_agent">Estate Agent</option>
                <option value="corporate_relocation">Corporate Relocation / Removals</option>
              </optgroup>

              {/* Property Services & Construction */}
              <optgroup label="Property Services & Construction">
                <option value="surveyor">Surveyor</option>
                <option value="architect">Architect</option>
                <option value="structural_engineer">Structural Engineer</option>
                <option value="interior_designer">Interior Designer</option>
                <option value="builder">Builder</option>
                <option value="bricklayer">Bricklayer</option>
                <option value="plumber_electrician">Plumber / Electrician</option>
                <option value="carpenter_joiner">Carpenter / Joiner</option>
                <option value="tiler">Tiler</option>
                <option value="landscaper">Landscaper</option>
              </optgroup>

              {/* Professional Services */}
              <optgroup label="Professional Services">
                <option value="lawyer">Lawyer</option>
                <option value="bank_financial">Bank / Financial Lender</option>
                <option value="accountant_bookkeeping">Accountant / Bookkeeping</option>
                <option value="insurance">Insurance</option>
              </optgroup>

              {/* Security & Technology */}
              <optgroup label="Security & Technology">
                <option value="smart_systems_cctv">Smart Systems / CCTV</option>
                <option value="security_company">Security Company</option>
              </optgroup>

              <option value="other">Other (Please specify in message)</option>
            </select>
            <p className="mt-1 text-xs text-zinc-500">
              Select the category that best describes your role or service
            </p>
          </div>
        )}

        {/* Message Field */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-zinc-700">
            What are you looking for or offering?
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            value={formData.message}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm placeholder-zinc-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="Tell us about your property needs, services required, or what you're offering..."
            disabled={isSubmitting}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : (
            'Join Waiting List'
          )}
        </button>

        {/* Privacy Note */}
        <p className="text-xs text-zinc-500 text-center">
          By joining, you agree to be notified when ZamSpace launches. We respect your privacy and will not share your information.
        </p>
      </form>
    </div>
  );
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
              href="https://www.instagram.com/zam.space_?igsh=MTRyNGs1N3dpODEwNA=="
              icon={FiInstagram}
              className="h-8 w-8"
            >
              Instagram
            </SocialLink>

            <SocialLink
              href="https://www.linkedin.com/in/zamspace-zamspace-84a299397?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
              icon={CiLinkedin}
              className="h-8 w-8"
            >
              LinkedIn
            </SocialLink>

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
            <WaitingListForm />
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