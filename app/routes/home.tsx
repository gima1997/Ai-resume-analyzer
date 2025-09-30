import Navbar from "~/Components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/Components/ResumeCard";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
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
  
    const {auth,kv} = usePuterStore();
    const navigate = useNavigate();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if(!auth.isAuthenticated) navigate('/auth?next=/');
    }, [auth.isAuthenticated]);

    useEffect(() => {
        const loadResumes = async () => {
            setIsLoading(true);

            const resumes = (await kv.list('resume:*',true)) as KVItem[];

            const parsedResumes = resumes?.map((resume) => {
              return JSON.parse(resume.value as string) as Resume
            });

            console.log(parsedResumes);

            setResumes(parsedResumes || []);
            setIsLoading(false);
        };

        loadResumes();
    }, []);

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-container">
          <h1> Track your application and Resume Ratings</h1>
          {!isLoading && resumes?.length === 0 ? (
            <h2>
              You have not uploaded any resumes yet. Start by uploading one!
            </h2>
          ) : (
            <h2>
              Get insights and improve your chances of landing your dream job!
            </h2>
          )}
        </div>
        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-4">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" />
          </div>
        )}
        
        { !isLoading && resumes.length > 0 && (
        <div className="resumes-section">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}

      {!isLoading && resumes.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-10 gap-4">
          <Link to="/upload" className="primary-button w-fit text-xl font-semibold">Upload a Resume</Link>
        </div>
        )}
      </section>
    </main>
  );
}
