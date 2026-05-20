import { Suspense } from "react";
import LoginForm from "./LoginForm";

const LoginPage = () => {
    return (
        <Suspense
            fallback={
                <section className="flex min-h-screen items-center justify-center bg-base-100">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </section>
            }
        >
            <LoginForm />
        </Suspense>
    );
};

export default LoginPage;