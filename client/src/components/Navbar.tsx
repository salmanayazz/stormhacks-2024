import { Button } from "@mui/material"

const Navbar = () => {
    const signupHandler = () =>{

    }
    const loginHandler = () =>{
        
    }
    return (
    <div className="flex font-sedan-sc m-2 font-semibold text-2xl h-12 border-grey border-b-2 justify-between">
        <div> InterviewPrep.</div>
        <div>
        <Button variant="contained"  sx={{
        backgroundColor: 'white',
        color: 'black',
        border: "2px solid black",
        marginRight: "8px",
        '&:hover': {
          backgroundColor: 'black',
          color: "white",
        },
      }}>Upload your Resume Here</Button>
        <Button variant="contained"  sx={{
        backgroundColor: 'white',
        color: 'black',
        border: "2px solid black",
        marginRight: "8px",
        '&:hover': {
          backgroundColor: 'black',
          color: "white",
        },
      }}
      onClick={signupHandler}
      >Signup</Button>
        <Button variant="contained"  sx={{
        backgroundColor: 'white',
        color: 'black',
        border: "2px solid black",
        '&:hover': {
          backgroundColor: 'black',
          color: "white",
        },
      }}
      onClick={loginHandler}
      >Login</Button>
      
        </div>
        

    </div>
  )
}

export default Navbar
