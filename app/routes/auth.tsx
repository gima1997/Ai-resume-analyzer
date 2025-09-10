import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

export const meta = () => ([
    {title: "Resume Analyzer - Auth"},
    {name: "description", content: "Authenticate to access your resume analyzer dashboard."}
])


const Auth = () => {
    const {isLoading, auth} = usePuterStore();
    const location = useLocation();
    const next = location.search.split('next=')[1];
    const navigate = useNavigate();

    useEffect(() => {
        if(auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated,next]);


    return(
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex items-center justify-center">
            <div className="gradient-border shadow-lg">
                <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1>
                            Welcome to the Resume Analyzer
                        </h1>
                        <h2>Authenticate to access your dashboard</h2>
                    </div>
                    <div>
                        {isLoading ? (
                            <button className="auth-button animate-pulse">
                                <p> Signing in...</p>
                            </button>
                        ) : (
                            <>
                                {auth.isAuthenticated ? (
                                    <button className="auth-button" onClick={() => auth.signOut()}>
                                        <p> Sign Out</p>
                                    </button>
                                ) : (
                                    <button className="auth-button" onClick={() => auth.signIn()}>
                                        <p> Login</p>
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        </main>
    )
}

export default Auth;