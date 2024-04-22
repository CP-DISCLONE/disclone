


const LandingPage = () => {
  return (
    <>
    <section className="px-[5%]">
  <div
    className="relative flex min-h-svh flex-col items-stretch justify-center overflow-auto py-24 lg:py-20"
  >
    <div
      className="absolute bottom-auto left-0 right-0 top-0 flex h-16 w-full items-center justify-between md:h-18"
    >
      <div>
        <img
          src="https://relume-assets.s3.amazonaws.com/logo-image.svg"
          alt="Logo text"
        />
      </div>
      <div className="inline-flex gap-x-1">
        <p className="hidden md:block">Don&#x27;t have an account?</p>
        <a
          href="#"
          className="underline ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary focus-visible:ring-offset-2"
          >Sign up</a
        >
      </div>
    </div>
    <div className="container max-w-sm">
      <div className="mb-6 text-center md:mb-8">
        <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
          Log In
        </h1>
        <p className="md:text-md">Lorem ipsum dolor sit amet adipiscing elit.</p>
      </div>
      <form className="grid grid-cols-1 gap-6">
        <div className="grid w-full items-center">
          <label
            className="mb-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="email"
            >Email*</label
          ><input
            type="text"
            className="flex size-full min-h-11 border border-border-primary bg-background-primary px-3 py-2 align-middle file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            id="email"
            value=""
          />
        </div>
        <div className="grid w-full items-center">
          <label
            className="mb-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="password" // Change 'for' to 'htmlFor'
          >Password*</label
          ><input
            type="password"
            className="flex size-full min-h-11 border border-border-primary bg-background-primary px-3 py-2 align-middle file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            id="password"
            value=""
          />
        </div>
        <div className="grid-col-1 grid gap-4">
          <button
            className="inline-flex items-center justify-center gap-3 whitespace-nowrap border border-border-primary bg-background-alternative px-6 py-3 text-text-alternative ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            Log in</button
          ><button
            className="inline-flex items-center justify-center gap-3 gap-x-3 whitespace-nowrap border border-border-primary px-6 py-3 text-text-primary ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="size-6"
            >
              <path
                d="M21.5 11.79C21.5 15.94 19.29 21 12.63 21C7.62461 21.0332 3.53852 17.0053 3.5 12C3.53852 6.99461 7.62461 2.9667 12.63 2.99996C14.7007 3.00764 16.7085 3.71213 18.33 4.99996C18.442 5.09149 18.5109 5.22557 18.52 5.36996C18.5206 5.51605 18.463 5.65637 18.36 5.75996C17.709 6.35516 17.0882 6.98261 16.5 7.63996C16.3289 7.82826 16.0422 7.85432 15.84 7.69996C14.9161 7.01624 13.7888 6.66394 12.64 6.69996C9.68528 6.69996 7.29 9.09524 7.29 12.05C7.29 15.0047 9.68528 17.4 12.64 17.4C15.64 17.4 16.91 16.12 17.57 13.85H13C12.7239 13.85 12.5 13.6261 12.5 13.35V10.7C12.5 10.4238 12.7239 10.2 13 10.2H21C21.2302 10.1985 21.4244 10.3711 21.45 10.6C21.4871 10.9955 21.5038 11.3927 21.5 11.79Z"
                fill="currentColor"
              ></path></svg
            >Log in with Google
          </button>
        </div>
      </form>
      <div className="mt-5 w-full text-center md:mt-6">
        <a
          href="#"
          className="underline ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary focus-visible:ring-offset-2"
          >Forgot your password?</a
        >
      </div>
    </div>
    <footer
      className="absolute bottom-0 left-0 right-0 top-auto flex h-16 w-full items-center justify-center md:h-18"
    >
      <p className="text-sm">© 2024 Relume</p>
    </footer>
  </div>
</section>

    
    
    </>
    
  );
}
export default LandingPage;