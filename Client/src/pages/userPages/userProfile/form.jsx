
import { TEInput, TERipple } from "tw-elements-react";

export function SimpleRegistrationForm() {
    return (
        // <Card color="transparent" shadow={false}>
        //     <Typography variant="h4" color="blue-gray">
        //         Sign Up
        //     </Typography>
        //     <Typography color="gray" className="mt-1 font-normal">
        //         Enter your details to register.
        //     </Typography>
        //     <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
        //         <div className="mb-4 flex flex-col gap-6">
        //             <Input size="lg" label="Name" />
        //             <Input size="lg" label="Email" />
        //             <Input type="password" size="lg" label="Password" />
        //         </div>
        //         <Checkbox
        //             label={
        //                 <Typography
        //                     variant="small"
        //                     color="gray"
        //                     className="flex items-center font-normal"
        //                 >
        //                     I agree the
        //                     <a
        //                         href="#"
        //                         className="font-medium transition-colors hover:text-gray-900"
        //                     >
        //                         &nbsp;Terms and Conditions
        //                     </a>
        //                 </Typography>
        //             }
        //             containerProps={{ className: "-ml-2.5" }}
        //         />
        //         <Button className="mt-6" fullWidth>
        //             Register
        //         </Button>
        //         <Typography color="gray" className="mt-4 text-center font-normal">
        //             Already have an account?{" "}
        //             <a href="#" className="font-medium text-gray-900">
        //                 Sign In
        //             </a>
        //         </Typography>
        //     </form>
        // </Card>
        <div className="block max-w-2xl rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
            <form>
                {/* <!--E-mail input--> */}
                <TEInput
                    type="email"
                    label="Email address"
                    className="xs"
                >
                    <small
                        id="emailHelp"
                        className="absolute w-full text-neutral-500 dark:text-neutral-200"
                    >
                        We'll never share your email with anyone else.
                    </small>
                </TEInput>

                {/* <!--Password input--> */}
                <TEInput
                    type="password"
                    label="Password"
                    className="mt-12 mb-6"
                ></TEInput>

                {/* <!--Checkbox--> */}


                {/* <!--Submit button--> */}
                <TERipple rippleColor="light">
                    <button
                        type="button"
                        className="inline-block rounded bg-green-400 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                    >
                        Submit
                    </button>
                </TERipple>
            </form>
        </div>
    );
}