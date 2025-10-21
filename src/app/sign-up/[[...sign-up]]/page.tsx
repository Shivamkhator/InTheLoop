'use client'

import { Icon } from '@iconify/react'
import * as Clerk from '@clerk/elements/common'
import * as SignUp from '@clerk/elements/sign-up'
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect'
import { Compare } from '@/components/ui/compare'
import { useState } from 'react'

export default function SignUpPage() {
  const [isEventCreator, setIsEventCreator] = useState(false)

  const words = [
    {
      text: "InTheLoop",
      className: "text-cyan-700 text-5xl",
    }
  ]

  const arr = [
    'https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg',
    'https://images.pexels.com/photos/1317365/pexels-photo-1317365.jpeg',
    'https://images.pexels.com/photos/698907/pexels-photo-698907.jpeg',
    'https://images.pexels.com/photos/1035841/pexels-photo-1035841.jpeg',
    'https://images.pexels.com/photos/1186116/pexels-photo-1186116.jpeg',
    'https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg',
    'https://images.pexels.com/photos/1317365/pexels-photo-1317365.jpeg',
    'https://images.pexels.com/photos/698907/pexels-photo-698907.jpeg',
    'https://images.pexels.com/photos/1035841/pexels-photo-1035841.jpeg',
    'https://images.pexels.com/photos/1186116/pexels-photo-1186116.jpeg',
  ]

  let rand = Math.floor(Math.random() * arr.length)

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <SignUp.Root> 
        <SignUp.Step name="start" className="w-full">
          <div className="flex h-screen">
            <div className="hidden h-screen overflow-hidden md:block md:w-2/5 lg:w-3/5 ">
              <Compare
                firstImage={arr[rand]}
                secondImage={arr[rand]}
                firstImageClassName="object-cover object-left-top"
                secondImageClassname="object-cover object-left-top grayscale"
                className="h-full w-full object-cover"
                slideMode="hover"
              />
            </div>
            <div className="flex w-full items-center justify-center overflow-hidden bg-white p-8 md:w-3/5 lg:w-2/5 sm:p-16">
              <div className="space-y-4 pb-8">
                <header className="text-center">
                  <a href="/">
                    <div
                      className="mb-6 inline-flex h-18 w-18 items-center justify-center rounded-xl"
                      style={{
                        background: '#ffffff',
                        border: '1px solid #2a2a2a',
                        boxShadow: '4px 4px 1px rgb(0, 0, 0)',
                      }}
                    >
                      <img src="https://skybee.vercel.app/InTheLoop.svg" alt="InTheLoop Logo" className="h-28 w-28" />
                    </div>
                  </a>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Register an account in
                  </h1>
                  <TypewriterEffectSmooth words={words} className='justify-center' />
                </header>

                <Clerk.GlobalError className="block text-center text-sm text-red-500" />


                {/* Email Field */}
                <Clerk.Field name="emailAddress">
                  <Clerk.Label className="sr-only">Email</Clerk.Label>
                  <Clerk.Input
                    type="email"
                    required
                    placeholder="Enter Email ID"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 placeholder-gray-400 transition-all duration-200 focus:border-purple-400 focus:bg-white focus:outline-none"
                    style={{
                      border: '1px solid #2aaa2a',
                      boxShadow: '2px 2px 1px rgb(0, 0, 0)',
                    }}
                  />
                  <Clerk.FieldError className="mt-2 block text-xs text-red-500" />
                </Clerk.Field>

                <div className='flex gap-4'>
                  <Clerk.Field name="username">
                    <Clerk.Label className="sr-only">Username</Clerk.Label>
                    <Clerk.Input
                      type="text"
                      autoComplete="username"
                      required
                      placeholder="Username"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 placeholder-gray-400 transition-all duration-200 focus:border-purple-400 focus:bg-white focus:outline-none"
                      style={{
                        border: '1px solid #2aaa2a',
                        boxShadow: '2px 2px 1px rgb(0, 0, 0)',
                      }}
                    />
                    <Clerk.FieldError className="mt-2 block text-xs text-red-500" />
                  </Clerk.Field>

                  <Clerk.Field name="password">
                    <Clerk.Label className="sr-only">Password</Clerk.Label>
                    <Clerk.Input
                      type="password"
                      autoComplete="new-password"
                      required
                      placeholder="Enter Password"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 placeholder-gray-400 transition-all duration-200 focus:border-purple-400 focus:bg-white focus:outline-none"
                      style={{
                        border: '1px solid #2aaa2a',
                        boxShadow: '2px 2px 1px rgb(0, 0, 0)',
                      }}
                    />
                    <Clerk.FieldError className="mt-2 block text-xs text-red-500" />
                  </Clerk.Field>
                </div>

                {/* Event Creator Toggle */}
                <div 
                  className="flex items-center justify-between rounded-xl border bg-gray-50 px-4 py-2 transition-all duration-200"
                  style={{
                    border: '1px solid #2aaa2a',
                    boxShadow: '2px 2px 1px rgb(0, 0, 0)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                      <Icon icon="mdi:calendar-star" className="h-6 w-6 text-purple-700" />
                    </div>
                    <div>
                      <label htmlFor="event-creator-toggle" className="block text-sm font-semibold text-gray-800 cursor-pointer">
                        Register as Event Creator
                      </label>
                      <p className="text-xs text-gray-600">Create and manage your own events</p>
                    </div>
                  </div>
                  
                  <button
                    id="event-creator-toggle"
                    type="button"
                    role="switch"
                    aria-checked={isEventCreator}
                    onClick={() => setIsEventCreator(!isEventCreator)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                      isEventCreator ? 'bg-[#2aaa2a]' : 'bg-gray-300'
                    }`}
                    style={{
                      boxShadow: '2px 2px 1px rgb(0, 0, 0)',
                    }}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
                        isEventCreator ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Hidden input to store event creator status in Clerk metadata */}
                <input 
                  type="hidden" 
                  name="unsafeMetadata[isEventCreator]" 
                  value={isEventCreator.toString()} 
                />

                <SignUp.Action
                  submit
                  className="relative w-full rounded-xl py-3 font-medium text-white transition-all duration-200 hover:-translate-x-[2px] hover:-translate-y-[2px]"
                  style={{
                    border: '0.5px solid #2a2a2a',
                    background: '#2aaa2a',
                    boxShadow: '2px 2px 1px rgb(0, 0, 0)',
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.currentTarget.style.boxShadow = '8px 8px 2px rgb(0, 0, 0)'
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.currentTarget.style.boxShadow = '2px 2px 1px rgb(0, 0, 0)'
                  }}
                >
                  Create {isEventCreator && 'Creator'} Account
                </SignUp.Action>

                {/* Social Login Section - Hidden when Event Creator is enabled */}
                <div 
                  className={`transition-all duration-500 ease-in-out ${
                    isEventCreator 
                      ? 'opacity-0 max-h-0 overflow-hidden pointer-events-none' 
                      : 'opacity-100 max-h-[500px]'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <h2 className="text-lg font-bold text-gray-800">Or continue with</h2>
                    </div>

                    <div className="space-y-4">
                      {/* Google */}
                      <Clerk.Connection
                        name="google"
                        className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-2.5 px-4 font-medium text-gray-700 transition-all duration-200 hover:-translate-x-[2px] hover:-translate-y-[2px]"
                        style={{
                          border: '0.5px solid #2aaa2a',
                          boxShadow: '4px 4px 2px rgb(0, 0, 0)',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.boxShadow = '8px 8px 2px rgb(0, 0, 0)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.boxShadow = '4px 4px 2px rgb(0, 0, 0)'
                        }}
                      >
                        <Icon icon="flat-color-icons:google" className='h-5 w-5' />
                        Register with Google
                      </Clerk.Connection>

                      {/* Apple */}
                      <Clerk.Connection
                        name="apple"
                        className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#2a2a2a] py-2.5 px-4 font-medium text-white transition-all duration-200 hover:-translate-x-[2px] hover:-translate-y-[2px]"
                        style={{
                          boxShadow: '4px 4px 2px rgb(0, 0, 0)',
                          border: '1px solid #2a2a2a',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.boxShadow = '8px 8px 2px rgb(0, 0, 0)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.boxShadow = '4px 4px 2px rgb(0, 0, 0)'
                        }}
                      >
                        <Icon icon="ant-design:apple-filled" className='h-5 w-5' />
                        Register with Apple
                      </Clerk.Connection>
                    </div>
                  </div>

                  <div 
                  className={`transition-all duration-500 ease-in-out ${
                    isEventCreator 
                      ? 'opacity-100 max-h-[200px]' 
                      : 'opacity-0 max-h-0 overflow-hidden'
                  }`}
                >
                  <div 
                    className="flex items-start gap-3 rounded-xl border bg-blue-50 px-4 py-3"
                    style={{
                      border: '1px solid #3b82f6',
                      boxShadow: '2px 2px 1px rgb(59, 130, 246, 0.3)',
                    }}
                  >
                    <Icon icon="mdi:information" className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900">Event Creator Registration</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Event creators must register with email for verification purposes. Social login is available after account creation.
                      </p>
                    </div>
                  </div>
                </div>
                </div>

                

                {/* Link to Sign In */}
                <p className="text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <Clerk.Link
                    navigate="sign-in"
                    className="font-semibold text-purple-600 transition-colors hover:text-purple-700"
                  >
                    Login
                  </Clerk.Link>
                </p>
              </div>
            </div>
          </div>
        </SignUp.Step>

        {/* Sign-Up Step 2: Email Verification */}
        <SignUp.Step
          name="verifications"
          className="w-full space-y-6 rounded-2xl bg-white px-4 py-10 sm:w-96 sm:px-8"
          style={{
            border: '1px solid #000000',
            boxShadow: '4px 4px 1px rgb(0, 0, 0)',
          }}
        >
          <SignUp.Strategy name="email_code">
            <header className="text-center">
              <h1 className="mt-4 text-xl font-medium tracking-tight text-black">Verify your email</h1>
              <p className="mt-2 text-sm text-neutral-500">
                Please enter the 6-digit code sent to your email address to continue.
              </p>
            </header>
            <Clerk.GlobalError className="block text-sm text-red-500" />
            <Clerk.Field name="code">
              <Clerk.Label className="sr-only">Email code</Clerk.Label>
              <Clerk.Input
                type="otp"
                required
                placeholder="Email code"
                className="w-full border-b border-neutral-700 bg-transparent pb-2 text-sm/6 text-black outline-none placeholder:text-neutral-400 hover:border-neutral-500 focus:border-neutral-300 data-[invalid]:border-red-600 data-[invalid]:text-red-500"
              />
              <Clerk.FieldError className="mt-2 block text-xs text-red-500" />
            </Clerk.Field>
            <SignUp.Action
              submit
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#2aaa2a] py-2.5 px-4 font-medium text-white transition-all duration-200 hover:-translate-x-[2px] hover:-translate-y-[2px]"
              style={{
                boxShadow: '4px 4px 2px rgb(0, 0, 0)',
                border: '1px solid #2a2a2a',
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.boxShadow = '8px 8px 2px rgb(0, 0, 0)'
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.boxShadow = '4px 4px 2px rgb(0, 0, 0)'
              }}
            >
              Verify
            </SignUp.Action>
          </SignUp.Strategy>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Clerk.Link navigate="sign-in" className="rounded px-1 py-0.5 text-gray-800">
              Login
            </Clerk.Link>
          </p>
        </SignUp.Step>
      </SignUp.Root>
    </div>
  )
}