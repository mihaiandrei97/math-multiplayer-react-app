import React, { useState, useEffect } from "react";
import io from "socket.io-client";


let socket;
const ENDPOINT = 'https://far-empty-brisket.glitch.me/';

function App() {
  const [ name, setName ] = useState('');
  const [ response, setResponse ] = useState('');
  const [ isSubmited, setIsSubmited ] = useState(false);
  const [ question, setQuestion ] = useState('');
  const [ leaderboard, setLeaderboard ] = useState([]);

  useEffect(() => {
    if(name !== '') {
      socket = io(ENDPOINT);
      socket.emit('user_joined', name);
      socket.on('question', (new_question) => {
        setQuestion(new_question);
        setResponse('');
      });

      socket.on('leaderboard', (new_leaderboard) => {
        setLeaderboard(new_leaderboard);
      })
    }
  }, [isSubmited])

  const buildContainerIntro = () => {
    return (<div
			className="container flex flex-col justify-center items-center h-screen m-auto"
			id="intro"
		>
			<h1 className="text-4xl font-bold text-white text-center">
				Welcome to the
				<span className="text-purple-800"> Math Geniuses </span>
				Game!
			</h1>

			<form
				className="bg-white w-1/2 rounded p-6 shadow-md mt-6 text-center"
				onSubmit={(e) => {
          e.preventDefault();
          setIsSubmited(true);
          console.log(name, 'submited');
        }}
			>
				<h2 className="text-xl mb-4">
					Enter your name to join:
				</h2>
				<input
          value={ name }
					className="d-block rounded w-full border border-gray-500 shadow p-4"
          placeholder="Enter your name..."
          onChange={ (e) => setName( e.target.value ) }
				/>
			</form>
		</div>);
  }

  const buildContainerGame = () => {
    return (
      <div
        className="container flex flex-col justify-center items-center h-screen m-auto"
        id="game"
		  >
        <div
          className="fixed top-0 right-0 bg-white rounded p-6 shadow-md mt-2 mr-2 text-center"
        >
          <h3 className="text-2xl font-bold border-b border-gray-500 pb-4 mb-4">
            Leaderboard
          </h3>
          {
            leaderboard.length > 0 ? <ul id="leaderboard">
              {
                leaderboard.map((player, index) => <li className="flex justify-between" key={ index }><strong>{player.name}</strong> {player.points}</li> )
              }
            </ul> : <p>Loading Leaderboard...</p>
          }
			  </div>

        <h1 className="text-4xl font-bold text-white text-center">
          Answer following the question:
        </h1>

        <form
          className="bg-white w-1/2 rounded p-6 shadow-md mt-6 text-center"
          onSubmit={(e) => {
            e.preventDefault();
            socket.emit('response', response);
          }}
        >
          <h1 className="text-4xl mb-4" id="question">
            { question !== '' ? `${question} = ?` : 'Loading Question...' } 
          </h1>
          <input
            id="response"
            value={ response || '' }
            className="d-block rounded w-full border border-gray-500 shadow p-4"
            placeholder="Enter the response..."
            onChange={ (e) => setResponse(e.target.value) }
          />
        </form>
		  </div>
    );
  }

  return (
    <div className="bg-purple-500 m-0 h-screen">
      { !isSubmited ? buildContainerIntro() : buildContainerGame() }
    </div>
  );
}

export default App;
