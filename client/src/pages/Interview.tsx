import { useParams } from "react-router";
import { useInterviews } from "../contexts/interviews/InterviewContext";

export default function Interview() {
  const { interviewId } = useParams();
  const { interviews } = useInterviews();
  
  const interview = interviews.find((interview) => interview._id === interviewId);
  
  return(
    <div
      className="flex flex-col"
    >
      <h1>{interview?.position}</h1>
      <h2>{interview?.company}</h2>

      {interview?.info.map((question) => {
        return (
          <div key={question._id}>
            <h3>{question.question}</h3>
            <textarea
              value={question.answer}
            />
            <button>Submit</button>
            {question.feedback || question.feedback !== "" && <p>{question.feedback}</p>}
          </div>
        );
      })}
    </div>
  );
}