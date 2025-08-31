'use client'

import * as Clerk from '@clerk/elements/common'
import * as SignIn from '@clerk/elements/sign-in'

export default function SignInPage() {
  const arr = [
    'https://images.pexels.com/photos/1943411/pexels-photo-1943411.jpeg',
    'https://images.pexels.com/photos/1317365/pexels-photo-1317365.jpeg',
    'https://images.pexels.com/photos/450301/pexels-photo-450301.jpeg',
    'https://images.pexels.com/photos/1943411/pexels-photo-1943411.jpeg',
    'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg',
  ]

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <SignIn.Root>
        <SignIn.Step name="start" className="w-full">
          <div className="flex">
            <div className="hidden h-screen overflow-hidden md:block md:w-2/5 lg:w-3/5 ">
              <img
                src={arr[Math.floor(Math.random() * arr.length)]}
                alt="Description"
                className="h-full w-full object-cover"
              />
            </div>
            <div
              className="w-full flex items-center justify-center overflow-hidden bg-white p-8 md:w-3/5 lg:w-2/5 sm:p-16"
            >
              <div className="space-y-4 pb-8">
                <header className="text-center">
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
                  <h1 className="text-2xl font-bold text-gray-800">Sign In to <span className="text-cyan-700">InTheLoop</span></h1>
                </header>

                <Clerk.GlobalError className="block text-center text-sm text-red-500" />

                <Clerk.Field name="identifier">
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

                <SignIn.Action
                  submit
                  className="relative w-full rounded-xl py-3 font-medium text-white transition-all duration-200 hover:-translate-x-[2px] hover:-translate-y-[2px]"
                  style={{
                    border: '0.5px solid #2a2a2a',
                    background: '#2aaa2a',
                    boxShadow: '2px 2px 1px rgb(0, 0, 0)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = '8px 8px 2px rgb(0, 0, 0)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = '2px 2px 1px rgb(0, 0, 0)'
                  }}
                >
                  Sign In
                </SignIn.Action>

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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        className="h-4 w-4"
                        aria-hidden
                      >
                        <path
                          fill="#4285F4"
                          d="M8.32 7.28v2.187h5.227c-.16 1.226-.57 2.124-1.192 2.755-.764.765-1.955 1.6-4.035 1.6-3.218 0-5.733-2.595-5.733-5.813 0-3.218 2.515-5.814 5.733-5.814 1.733 0 3.005.685 3.938 1.565l1.538-1.538C12.498.96 10.756 0 8.32 0 3.91 0 .205 3.591.205 8s3.706 8 8.115 8c2.382 0 4.178-.782 5.582-2.24 1.44-1.44 1.893-3.475 1.893-5.111 0-.507-.035-.978-.115-1.369H8.32Z"
                        />
                      </svg>
                      Login with Google
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4"
                        aria-hidden
                      >
                        <path d="M11.306 8.25c-.01-1.093.482-1.924 1.465-2.534-.552-.8-1.39-1.25-2.51-1.36-1.052-.106-2.202.614-2.617.614-.432 0-1.425-.584-2.2-.584C3.715 4.366 2 5.75 2 8.2c0 1.177.44 2.366 1.32 3.567.737 1.027 1.478 1.544 2.22 1.544.693 0 .986-.438 1.98-.438.975 0 1.246.438 1.982.438.757 0 1.537-.546 2.273-1.6.565-.8.883-1.6.89-1.6-.02-.008-1.36-.535-1.36-2.862zM9.89 2.36c.502-.61.74-1.36.66-2.16-.74.05-1.64.52-2.16 1.14-.47.53-.78 1.24-.72 1.96.77.06 1.55-.39 2.22-.94z" />
                      </svg>
                      Login with Apple
                    </Clerk.Connection>
                  </div>

                  {/* Link to Sign Up */}
                  <p className="text-center text-sm text-gray-600">
                    Don&apos;t have an account?{' '}
                    <Clerk.Link
                      navigate="sign-up"
                      className="font-semibold text-purple-600 transition-colors hover:text-purple-700"
                    >
                      Sign up
                    </Clerk.Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SignIn.Step>

        <SignIn.Step
          name="verifications"
          className="w-full space-y-6 rounded-2xl bg-white px-4 py-10 sm:w-96 sm:px-8"
          style={{
            border: '1px solid #000000',
            boxShadow: '4px 4px 1px rgb(0, 0, 0)',
          }}
        >
          <SignIn.Strategy name="email_code">
            <header className="text-center">
              <h1 className="mt-4 text-xl font-medium tracking-tight text-black">
                Verify email code
              </h1>
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
            <SignIn.Action
              submit
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#2aaa2a] py-2.5 px-4 font-medium text-white transition-all duration-200 hover:-translate-x-[2px] hover:-translate-y-[2px]"
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
              Continue
            </SignIn.Action>
          </SignIn.Strategy>

          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Clerk.Link navigate="sign-up" className="rounded px-1 py-0.5 text-gray-800">
              Sign up
            </Clerk.Link>
          </p>
        </SignIn.Step>
      </SignIn.Root>
    </div>
  )
}