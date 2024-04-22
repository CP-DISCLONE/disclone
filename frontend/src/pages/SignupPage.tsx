import { Link } from "react-router-dom";

const SignupPage = () => {
    return (
        <>
            <section className="px-[5%]">
                <div className="relative flex min-h-svh flex-col items-stretch justify-center overflow-auto py-24 lg:pb-24 lg:pt-16">
                    <div className="absolute bottom-auto left-0 right-0 top-0 flex h-16 w-full items-center justify-between md:h-18">
                        <div>
                            <h1 className='text-xl font-bold'>DISCLONE</h1>
                        </div>
                        <div className="inline-flex gap-x-1">
                            <p className="hidden md:block">Already have an account?</p>
                            <Link to='/' className="underline ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary focus-visible:ring-offset-2">
                                Log In
                            </Link>
                        </div>
                    </div>
                    <div className="container mb-4 max-w-sm">
                        <div className="mb-6 text-center md:mb-8">
                            <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
                                Sign Up
                            </h1>
                            <p className="md:text-md">Lorem ipsum dolor sit amet adipiscing elit.</p>
                        </div>
                        <form className="grid grid-cols-1 gap-6">
                            <div className="grid w-full items-center">
                                <label
                                    className="mb-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    htmlFor="name">
                                    Name*
                                </label>
                                <input
                                    type="text"
                                    className="flex size-full min-h-11 border border-border-primary bg-background-primary px-3 py-2 align-middle file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    id="name"
                                    value=""
                                />
                            </div>
                            <div className="grid w-full items-center">
                                <label
                                    className="mb-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    htmlFor="email">
                                    Email*
                                </label>
                                <input
                                    type="text"
                                    className="flex size-full min-h-11 border border-border-primary bg-background-primary px-3 py-2 align-middle file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    id="email"
                                    value=""
                                />
                            </div>
                            <div className="grid w-full items-center">
                                <label
                                    className="mb-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    htmlFor="password">
                                    Password*
                                </label>
                                <input
                                    type="password"
                                    className="flex size-full min-h-11 border border-border-primary bg-background-primary px-3 py-2 align-middle file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    id="password"
                                    value=""
                                />
                            </div>
                            <div className="grid-col-1 grid gap-4">
                                <button className="inline-flex items-center justify-center gap-3 whitespace-nowrap border border-border-primary bg-background-alternative px-6 py-3 text-text-alternative ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                                    Sign up
                                </button>
                            </div>
                        </form>
                    </div>
                    <footer className="absolute bottom-0 left-0 right-0 top-auto flex h-16 w-full items-center justify-center md:h-18">
                        <p className="text-sm">© DISCLONE</p>
                    </footer>
                </div>
            </section>
        </>
    );
};
export default SignupPage;