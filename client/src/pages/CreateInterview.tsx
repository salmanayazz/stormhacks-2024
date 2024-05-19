import { useState } from "react";
import { useInterviews } from "../contexts/interviews/InterviewContext";

export default function CreateInterview() {
  const [formData, setFormData] = useState({
    position: "",
    company: "",
    jobPosting: "",
  });

  const { createInterview } = useInterviews();

  return (
    <div
      className="flex flex-col items-center justify-center"
    >
      <input 
        placeholder="Position"
        value={formData.position}
        onChange={(event) =>
          setFormData({ ...formData, position: event.target.value })
        }
      />

      <input 
        placeholder="Company"
        value={formData.company}
        onChange={(event) =>
          setFormData({ ...formData, company: event.target.value })
        }
      />

      <textarea
        placeholder="Job Posting"
        value={formData.jobPosting}
        onChange={(event) =>
          setFormData({ ...formData, jobPosting: event.target.value })
        }
      />

      <button
        onClick={() => createInterview(
          formData.position,
          formData.company,
          formData.jobPosting
        )}
      >Submit</button>
    </div>
  );
}