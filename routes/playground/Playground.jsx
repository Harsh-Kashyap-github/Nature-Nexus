import React, { useContext, useState } from "react";
import { UserContext } from "../../src/UserContext";
import LoginPage from "../../component/LoginPage/LoginPage";
import WelcomePage from "../../component/WelcomePage/WelcomePage";
import RoundTwo from "../../component/roundTwo/RoundTwo";
import RoundThree from "../../component/roundThree/roundThree";
import RoundFour from "../../component/roundFour/roundFour";
import RoundFive from "../../component/roundFive/roundFive";
import Loader from "../../component/Loader/Loader";
import ReportPage from "../../component/ReportPage/ReportPage";
import Navbar from "../../component/NavBar/Navbar";

function Playground() {
  const { user, loading } = useContext(UserContext);
  const [startQuiz, setStartQuiz] = useState(false); // State to handle welcome screen

  if (loading)
    return (
      <>
        <Loader />
      </>
    );

  return (
    <>
      {user ? (
        <>
          {!startQuiz ? (
            <WelcomePage userName={user.name} onStart={() => setStartQuiz(true)} />
          ) : (
            <>
              {user.activeRound === 1 && <RoundTwo />}
              {user.activeRound === 2 && <RoundThree />}
              {user.activeRound === 3 && <RoundFour />}
              {user.activeRound === 4 && <RoundFive />}
              {user.activeRound === 5 && <ReportPage/>}
            </>
          )}
        </>
      ) : (
        <LoginPage />
      )}
    </>
  );
}

export default Playground;
