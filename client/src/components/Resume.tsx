import React, { useState } from 'react';

const ResumeParserComponent = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileSubmit = async () => {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await fetch('/parse-resume', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    setResult(data);
  };

  return (
    <div>
      <h1>Resume Parser</h1>
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleFileSubmit}>Parse File</button>
      </div>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
};

export default ResumeParserComponent;
