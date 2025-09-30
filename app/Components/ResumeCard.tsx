import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import ScoreCircle from "./ScoreCircle";
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({ resume }: { resume: Resume }) => {
    const {auth,fs} = usePuterStore();
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState('');
        
    useEffect(() => {
            if(!auth.isAuthenticated) navigate('/auth?next=/');
        }, [auth.isAuthenticated]);
    
        useEffect(() => {
          const loadResume:() => void = async () => {
            const blob = await fs.read(resume.imagePath);
            if(!blob) return;
            const imageUrl = URL.createObjectURL(blob);
            setImageUrl(imageUrl);
          }
          loadResume();
        },[resume.imagePath]);
        
  return (
    <Link to={`/resume/${resume.id}`} className="resume-card animate-in fade-in duration-1000">
        <div className="resume-card-header">
            <div className="flex flex-col gap-2">
            <h2 className="!text-black font-bold break-words">{resume.companyName}</h2></div>
            <div className="text-lg break-words text-gray-500">{resume.jobTitle}</div>
            <div className="flex-shrink-0">
                <ScoreCircle score={resume.feedback.overallScore} />
            </div>
        </div>
        <div className="gradient-border animate-in fade-in duration-1000">
            <div className="w-full h-full">
                <img src={imageUrl} alt="Resume Preview" className="w-full h-full object-cover object-top" />
            </div>
        </div>
    </Link>
  );
};

export default ResumeCard;
