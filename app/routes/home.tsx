import Navbar from "~/Components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "~/Constants";
import ResumeCard from "~/Components/ResumeCard";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resume Analyzer" },
    {
      name: "description",
      content: "Analyze your resume with our AI-powered tool!",
    },
  ];
}

export default function Home() {
  
    const {auth} = usePuterStore();
    const navigate = useNavigate();

    useEffect(() => {
        if(!auth.isAuthenticated) navigate('/auth?next=/');
    }, [auth.isAuthenticated]);
    
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-container">
          <h1> Track your application and Resume Ratings</h1>
          <h2>
            {" "}
            Get insights and improve your chances of landing your dream job!
          </h2>
        </div>
        {resumes.length > 0 && (
        <div className="resumes-section">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}
      </section>
    </main>
  );
}
