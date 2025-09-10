import React, { use, useState } from "react";
import Navbar from "~/Components/Navbar";
import FileUploader from "~/Components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/formatSize";
import { prepareInstructions, AIResponseFormat } from "~/Constants";

const Upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("Uploading...");
  const [file, setFile] = useState<File | null>(null);

  React.useEffect(() => {
    if (auth && !auth.isAuthenticated) {
      navigate("/auth?next=/upload");
    }
  }, [auth, navigate]);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    setIsProcessing(true);
    setStatusText("Analyzing...");
    const uploadedFile = await fs.upload([file]);
    if (!uploadedFile) return setStatusText("File upload failed.");
    setStatusText("Converting to image...");
    const imageFile = await convertPdfToImage(file);
    console.log("Image File:", imageFile);
    if (!imageFile.file)
      return setStatusText("PDF to image conversion failed.");
    setStatusText("Uploading image...");
    const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage) return setStatusText("Image upload failed.");
    setStatusText("preparing Data...");
    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName: companyName || "",
      jobTitle: jobTitle || "",
      jobDescription: jobDescription || "",
      feedback: "",
    };
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText("analysis in progress...");
    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobTitle, jobDescription, AIResponseFormat })
    );
    if (!feedback) return setStatusText("Error: AI analysis failed.");
    const feedbackText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0];
    data.feedback = feedbackText
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText("Analysis complete! and navigating to results...");
    console.log("Feedback:", data);
    setIsProcessing(false);
    navigate(`/result/${uuid}`);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);
    const companyName = formData.get("companyName") as string;
    const jobTitle = formData.get("jobTitle") as string;
    const jobDescription = formData.get("jobDescription") as string;
    if (!file) return;
    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1> Smart feedback for your resume</h1>
          {isProcessing ? (
            <>
              <h2> {statusText} </h2>
              <img
                src="/images/resume-scan.gif"
                alt="Processing"
                className="w-full"
              />
            </>
          ) : (
            <h2> Upload your resume and get instant feedback!</h2>
          )}
          {!isProcessing && (
            <form
              id="upload-form"
              className="flex flex-col gap-4 mt-8"
              onSubmit={handleSubmit}
            >
              <div className="form-div">
                <label htmlFor="Company-name">Company Name</label>
                <input
                  type="text"
                  id="Company-name"
                  placeholder="Enter company name"
                  name="companyName"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input
                  type="text"
                  id="job-title"
                  placeholder="Enter job title"
                  name="jobTitle"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea
                  id="job-description"
                  placeholder="Enter job description"
                  name="jobDescription"
                />
              </div>
              <div className="form-div">
                <label htmlFor="resume">Upload Resume</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>
              <button type="submit" className="primary-button">
                {" "}
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;
