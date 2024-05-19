import React, { useState } from 'react';
import axios from 'axios';

const ResumeUpload: React.FC = () => {
    const [title, setTitle] = useState<string>("");
    const [file, setFile] = useState<any>("");


    const submitFile = async (e: any) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("file", file);
        console.log(title,file);
        const result = await axios.post("http://localhost:3001/uploadresume", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
            
        });
        console.log(result);

    };

    return <form onSubmit={submitFile}>
        <input
        value={title}
        type='text'
        className="form-control" 
        placeholder="Title"
        required
        onChange={(e) => setTitle (e.target .value)}
        />
        <input
        type='file'
        className='form-control'
        accept='application/pdf'
        required
        onChange={(e) => setFile(e.target.files[0])}
        />
        <button type='submit'>Upload</button>

    </form>
  
};

export default ResumeUpload;
