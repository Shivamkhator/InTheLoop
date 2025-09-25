'use client'

import { Icon } from '@iconify/react'
import * as Clerk from '@clerk/elements/common'
import * as SignUp from '@clerk/elements/sign-up'
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect'
import { Compare } from '@/components/ui/compare'

export default function SignUpPage() {
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
          <div className="flex">
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

                {/* First Name & Last Name Fields */}
                <div className="flex gap-4">
                  <Clerk.Field name="firstName" className="w-full">
                    <Clerk.Label className="sr-only">First Name</Clerk.Label>
                    <Clerk.Input
                      type="text"
                      required
                      placeholder="First Name"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 placeholder-gray-400 transition-all duration-200 focus:border-purple-400 focus:bg-white focus:outline-none"
                      style={{
                        border: '1px solid #2aaa2a',
                        boxShadow: '2px 2px 1px rgb(0, 0, 0)',
                      }}
                    />
                    <Clerk.FieldError className="mt-2 block text-xs text-red-500" />
                  </Clerk.Field>

                  <Clerk.Field name="lastName" className="w-full">
                    <Clerk.Label className="sr-only">Last Name</Clerk.Label>
                    <Clerk.Input
                      type="text"
                      required
                      placeholder="Last Name"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 placeholder-gray-400 transition-all duration-200 focus:border-purple-400 focus:bg-white focus:outline-none"
                      style={{
                        border: '1px solid #2aaa2a',
                        boxShadow: '2px 2px 1px rgb(0, 0, 0)',
                      }}
                    />
                    <Clerk.FieldError className="mt-2 block text-xs text-red-500" />
                  </Clerk.Field>
                </div>

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
                  Create Account
                </SignUp.Action>

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