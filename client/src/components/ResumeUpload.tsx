import React, { useState } from 'react';
import { axiosInstance } from '../contexts/AxiosInstance';
import { Button, Input } from '@chakra-ui/react';
import { FaFileAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResumeUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files ? e.target.files[0] : null;
        if (selectedFile) {
            setFile(selectedFile);
            await uploadFile(selectedFile);
        }
    };

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const result = await axiosInstance.post("/uploadresume", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            console.log(result);

            toast.success("Resume uploaded successfully", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                progress: undefined,
                theme: "light",
            });

        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    return (
        <form>
            <ToastContainer />
            <Input
                type='file'
                accept='application/pdf'
                onChange={handleFileChange}
                display="none"
                id="file-upload"
            />
            <Button as="label" htmlFor="file-upload" leftIcon={<FaFileAlt />}>
                Resume
            </Button>
        </form>
    );
};

export default ResumeUpload;