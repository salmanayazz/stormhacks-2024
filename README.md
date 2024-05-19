## Welcome to InterviewPrep

### What inspired us to create InterviewPrep

The inspiration for creating InterviewPrep came from a common struggle of nervousness and anxiety experienced by job seekers while answering a question during an interview. As 3rd/ 4th year CS students, we've personally encountered the pressure of showcasing our technical skills and problem-solving abilities during interviews. 
InterviewPrep was created to provide a solution that simulates real interview scenarios and offers comprehensive, AI-driven constructive feedback to help candidates improve with each practice session. InterviewPrep is our solution to bridge the gap between academic knowledge and practical interview success, empowering students and professionals to excel in their careers.

### What it does

InterviewPrep is designed to be every job seeker's friendly and easy-to-use helping hand. Users input key details such as the company they are applying to, the position they are targeting, and the specific job posting description. Based on this information and optionally, a resume, InterviewPrep with the help of OpenAI prompt engineering, generates a series of tailored technical and behavioral questions relevant to the user's target role and company. Users can practice answering these questions either verbally or in written format within the platform. 
After answering, the user's responses are sent to an OpenAI model for analysis, providing constructive feedback on strengths and areas for improvement. InterviewPrep also allows users to review their past interview questions and responses, enabling continuous learning and refinement of interview skills over time. 

### How we built it

InterviewPrep's development process involved building the backend infrastructure to handle user inputs, question generation, user responses, and feedback analysis. We implemented AI algorithms to generate tailored interview questions based on user inputs and to analyze user responses for feedback.

We designed a user-friendly interface that allows users to input their interview details, practice answering questions, and view feedback. The interface was designed to be intuitive and responsive across different devices.

Finally, the tech stack we used is as follows:
1. Frontend - Typescript, React, Tailwind CSS, Chakra UI
2. Backend - Javascript, Node.js, Express.js
3. Database - MongoDB (with mongoose)
3. Services - OpenAI API (gpt-4o model)

### Challenges we ran into

1. Incorporating speech-to-text functionality for users to verbally answer the questions which will further be converted to text and stored on our database for future review.
2. Parsing resume to be used as a prompt to OpenAI API request. 
3. Lack of sleep.
4. Hunger.

### Accomplishments that we're proud of

1. Completing what we started.
2. With much perseverance, we overcame all our challenges.
3. Developing something we're going to use for the rest of our job hunting.

### What we learned

The team gained skills in both full-stack web development and integrating an AI model to our project. While we divided the workload evenly amongst ourselves, we were also able to learn from one another's wisdom and mistakes.

### What's next for InterviewPrep

Our future project aims to revolutionize job searching and career development by leveraging advanced web scraping and data analysis techniques. We plan to aggregate the latest job listings from major platforms such as LinkedIn, Indeed, and Glassdoor, providing users with a comprehensive, up-to-date job database all in one place. This will streamline the job search process, making it easier for users to find relevant opportunities quickly.

In addition to consolidating job listings, we are developing a sophisticated feature that analyzes users' resumes to determine how well they match specific job requirements. This tool will offer personalized feedback, highlighting strengths and identifying areas for improvement. By providing actionable insights, users will be able to enhance their profiles and skill sets, increasing their chances of standing out for desired job titles at targeted companies.

Our goal is to create a seamless, intelligent job search and career enhancement platform that empowers users to navigate the job market more effectively and achieve their career aspirations.

### Installation

To run the server, click [here](https://github.com/salmanayazz/stormhacks-2024/tree/main/server)

To run the client, click [here](https://github.com/salmanayazz/stormhacks-2024/tree/main/client)

### Meet our Team

[Barun Gambhir](https://github.com/barunGambhir), [Salman Ayaz](https://github.com/salmanayazz), [Gurkirat Singh](https://github.com/GurkiratSingh111)

