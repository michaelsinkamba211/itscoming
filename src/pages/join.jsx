import Head from 'next/head'
import { useState } from 'react'
import emailjs from '@emailjs/browser'

import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import { supabase } from '/lib/supabase.js';


/*
Zamspace.com@@!20
Zamspace.com@@!20
*/
// Icon Components
function UserGroupIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
        clipRule="evenodd"
      />
      <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
    </svg>
  )
}

function BuildingOfficeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M4.5 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5h-.75V3.75a.75.75 0 0 0 0-1.5h-15ZM9 6a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm-.75 3.75A.75.75 0 0 1 9 9h1.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM9 12a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm3.75-5.25A.75.75 0 0 1 13.5 6H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM13.5 9a.75.75 0 0 0 0 1.5H15A.75.75 0 0 0 15 9h-1.5Zm-.75 3.75a.75.75 0 0 1 .75-.75H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM9 19.5v-2.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 9 19.5Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function ShieldCheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function DevicePhoneMobileIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875ZM6.75 15a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75Z"
        clipRule="evenodd"
      />
      <path d="M8.25 19.5a1.5 1.5 0 0 1-1.5-1.5H6A3 3 0 0 0 9 21h3a3 3 0 0 0 3-3h-.75a1.5 1.5 0 0 1-1.5 1.5h-3Z" />
    </svg>
  )
}

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M9.307 12.248a.75.75 0 1 0-1.114 1.004l1.114-1.004ZM11 15.25l-.557.502a.75.75 0 0 0 1.15-.043L11 15.25Zm4.844-5.041a.75.75 0 0 0-1.188-.918l1.188.918Zm-7.651 3.043 2.25 2.5 1.114-1.004-2.25-2.5-1.114 1.004Zm3.364 2.457 4.25-5.5-1.187-.918-4.25 5.5 1.188.918Z"
        fill="currentColor"
      />
      <circle
        cx="12"
        cy="12"
        r="8.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function FormIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z"
        clipRule="evenodd"
      />
      <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
    </svg>
  )
}

function TruckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M1.5 5.25a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25V15a2.25 2.25 0 0 1-2.25 2.25h-13.5A2.25 2.25 0 0 1 1.5 15V5.25Zm2.25-.75a.75.75 0 0 0-.75.75v9.75c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75V5.25a.75.75 0 0 0-.75-.75H3.75Z"
        clipRule="evenodd"
      />
      <path d="M5.25 12a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75Zm0 3a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75Z" />
      <path
        fillRule="evenodd"
        d="M17.625 17.25a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Zm0 1.5a2.625 2.625 0 1 0 0-5.25 2.625 2.625 0 0 0 0 5.25Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function WrenchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M12 6.75a5.25 5.25 0 0 1 6.775-5.025.75.75 0 0 1 .313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 0 1 1.248.313 5.25 5.25 0 0 1-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 1 1 2.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0 1 12 6.75ZM4.117 19.125a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export default function JoinWaitingList() {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    userType: 'individual',
    message: '',
    company: '',
    serviceType: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  // Replace these with your actual EmailJS credentials
  const EMAILJS_SERVICE_ID = 'service_vlyds9h'; // Replace with your service ID
  const EMAILJS_TEMPLATE_ID = 'template_uh6ue7h'; // Replace with your template ID
  const EMAILJS_PUBLIC_KEY = 'YE9AigopY0l4Anjo7';

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

  // from using email js
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);
  //   setSubmitStatus({ type: '', message: '' });

  //   try {
  //     // Validate email
  //     if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
  //       throw new Error('Please enter a valid email address');
  //     }

  //     // Prepare template parameters
  //     const templateParams = {
  //       to_email: 'your-receiving-email@example.com', // Email to receive submissions
  //       from_name: 'ZamSpace Waiting List',
  //       email: formData.email,
  //       phone: formData.phone || 'Not provided',
  //       user_type: getFormattedUserType(formData.userType),
  //       message: formData.message || 'No message provided',
  //       company: formData.company || 'Not provided',
  //       service_type: formData.serviceType || 'Not specified',
  //       page_source: 'Join Waiting List Page',
  //       timestamp: new Date().toLocaleString('en-US', { 
  //         weekday: 'long', 
  //         year: 'numeric', 
  //         month: 'long', 
  //         day: 'numeric',
  //         hour: '2-digit',
  //         minute: '2-digit',
  //         second: '2-digit',
  //         timeZoneName: 'short'
  //       }),
  //     };

  //     // Send email using EmailJS
  //     const response = await emailjs.send(
  //       EMAILJS_SERVICE_ID,
  //       EMAILJS_TEMPLATE_ID,
  //       templateParams,
  //       EMAILJS_PUBLIC_KEY
  //     );

  //     if (response.status === 200) {
  //       // Reset form on success
  //       setFormData({
  //         email: '',
  //         phone: '',
  //         userType: 'individual',
  //         message: '',
  //         company: '',
  //         serviceType: ''
  //       });

  //       setSubmitStatus({
  //         type: 'success',
  //         message: 'Successfully joined the waiting list! We\'ll notify you when we launch.'
  //       });

  //       // Optional: Log submission to console
  //       console.log('Form submitted successfully from waiting list page:', templateParams);
  //     }
  //   } catch (error) {
  //     console.error('EmailJS Error:', error);
  //     setSubmitStatus({
  //       type: 'error',
  //       message: error.text || 'Failed to submit. Please try again or contact support.'
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };



  // Replace your current handleSubmit function with this:

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      // 1. Validate email
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // 2. Import supabase
      // const { supabase } = await import('@/lib/supabase.js');

      // 3. Prepare data for Supabase
      const submissionData = {
        email: formData.email,
        phone: formData.phone || null,
        user_type: formData.userType,
        message: formData.message || null,
        company: formData.company || null,
        service_type: formData.serviceType || null,
        // created_at and status will be set automatically by Supabase
      };

      // 4. Insert into Supabase
      const { data, error } = await supabase
        .from('waiting_list')
        .insert([submissionData])
        .select()
        .single(); // Get the inserted row back

      // 5. Handle errors
      if (error) {
        console.error('Supabase error:', error);

        if (error.code === '23505') {
          throw new Error('This email is already registered. Please use a different email.');
        }

        throw new Error(error.message || 'Failed to save registration. Please try again.');
      }

      console.log('Success! Data saved:', data);


      // 7. Reset form on success
      setFormData({
        email: '',
        phone: '',
        userType: 'individual',
        message: '',
        company: '',
        serviceType: ''
      });

      // 8. Show success message
      setSubmitStatus({
        type: 'success',
        message: ' Successfully joined the waiting list! We\'ll notify you when we launch.'
      });

    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: error.message || ' Failed to submit. Please try again or contact support.'
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

  const waitingListTypes = [
    {
      name: 'Buyers & Tenants',
      description:
        'Find homes you can trust. ZamSpace connects you to verified listings, real landlords, and properties that match what you\'re looking for — without the guesswork.',
      link: {
        href: '#buyer-form',
        label: '',
      },
      type: 'buyer',
      features: [
        'Browse verified property listings',
        'Save searches and favorite properties',
        'Create personalised wishlists',
        'Connect directly with landlords',
      ],
      icon: UserGroupIcon,
    },
    {
      name: 'Sellers & Landlords',
      description:
        'List your property with confidence and reach serious buyers and tenants. ZamSpace helps you showcase your listings and connect with ready-to-move clients.',
      link: {
        href: '#seller-form',
        label: '',
      },
      type: 'seller',
      features: [
        'Create and manage property listings',
        'Build a trusted seller or landlord profile',
        'Highlight property types and specialisation',
        'Earn ratings and reviews to build credibility',
      ],
      icon: BuildingOfficeIcon,
    },
    {
      name: 'Real Estate Agents',
      description:
        'Join as a verified agent and grow your business on a trusted platform. Showcase your agency, expertise, and connect with clients actively searching for property or seeking your services.',
      link: {
        href: '#agent-form',
        label: '',
      },
      type: 'agent',
      features: [
        'Create a professional agency profile',
        'Verify your business',
        'Promote multiple specialisations',
        'Network with clients and partners',
      ],
      icon: ShieldCheckIcon,
    },
    {
      name: 'Property Service Providers',
      description:
        'From architects, legal professionals to surveyors, ZamSpace connects verified service providers with property owners who need skilled, trusted support.',
      link: {
        href: '#provider-form',
        label: '',
      },
      type: 'service_provider',
      features: [
        'Create a verified professional profile',
        'Showcase experience and past work',
        'Get discovered by property owners and customers',
        'Offer services under clear categories',
      ],
      icon: DevicePhoneMobileIcon,
    },
    {
      name: 'Building Material Suppliers',
      description:
        'Promote your construction materials and products to the right audience — contractors, developers, and homeowners ready to build.',
      link: {
        href: '#supplier-form',
        label: '',
      },
      type: 'supplier',
      features: [
        'List products and materials',
        'Verify your business',
        'Offer location-based services',
        'Showcase multiple product lines',
      ],
      icon: TruckIcon,
    },
    {
      name: 'Contractors & Builders',
      description:
        'Win more projects by showcasing your expertise where property owners are already looking.',
      link: {
        href: '#contractor-form',
        label: '',
      },
      type: 'contractor',
      features: [
        'Display your services and specialisation',
        'Share completed projects and galleries',
        'Get client reviews and ratings',
        'Connect with property owners and developers',
      ],
      icon: WrenchIcon,
    },
  ]

  return (
    <>
      <Head>
        <title>Join Waiting List - ZamSpace</title>
        <meta
          name="description"
          content="Join the ZamSpace waiting list for early access to Zambia's trusted property ecosystem. Verified properties, services, and suppliers."
        />
      </Head>
      <SimpleLayout
        title="Join the ZamSpace Waiting List"
        intro="Be among the first to experience Zambia's trusted property ecosystem. Get early access, exclusive offers, and verified status before our public launch."
        titleClassName="!text-green-900"
      >
        {/* Waiting List Options */}
        <ul
          role="list"
          className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 mb-16"
        >
          {waitingListTypes.map((offering) => {
            const IconComponent = offering.icon
            return (
              <Card as="li" key={offering.name}>
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5">
                  <IconComponent className="h-6 w-6" style={{ color: '#0B6B21' }} />
                </div>
                <h2 className="mt-6 text-base font-semibold text-zinc-800">
                  {offering.name}
                </h2>
                <Card.Description>{offering.description}</Card.Description>

                {/* Features List */}
                <ul className="mt-4 space-y-2">
                  {offering.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-zinc-600">
                      <CheckIcon className="h-4 w-4 flex-none mr-2" style={{ color: '#0B6B21' }} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            )
          })}
        </ul>

        {/* Join Waiting List Form */}
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
      </SimpleLayout>
    </>
  )
}