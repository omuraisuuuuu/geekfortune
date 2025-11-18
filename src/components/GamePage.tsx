import { useState, useEffect } from 'react';

interface GamePageProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: 'videogames' | 'music' | 'movies';
  points: number;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const allQuestions: Question[] = [
  { id: 1, question: "Who directed 'The Matrix' trilogy?", options: ["Spielberg", "The Wachowskis", "Nolan", "Cameron"], correctAnswer: 1, category: 'movies', points: 100 },
  { id: 2, question: "Which movie won the Oscar for Best Picture in 1994?", options: ["Pulp Fiction", "Forrest Gump", "The Shawshank Redemption", "Quiz Show"], correctAnswer: 1, category: 'movies', points: 100 },
  { id: 3, question: "What is the highest-grossing film of all time (unadjusted)?", options: ["Titanic", "Avatar", "Avengers: Endgame", "Star Wars"], correctAnswer: 1, category: 'movies', points: 100 },
  { id: 4, question: "Who played the Joker in 'The Dark Knight'?", options: ["Heath Ledger", "Joaquin Phoenix", "Jack Nicholson", "Jared Leto"], correctAnswer: 0, category: 'movies', points: 100 },
  { id: 5, question: "What is the name of the main character in 'Forrest Gump'?", options: ["Forrest Gump", "Tom Hanks", "Bubba", "Lieutenant Dan"], correctAnswer: 0, category: 'movies', points: 100 },
  { id: 6, question: "Which movie features the quote 'May the Force be with you'?", options: ["Star Trek", "Star Wars", "Guardians of the Galaxy", "Dune"], correctAnswer: 1, category: 'movies', points: 100 },
  { id: 7, question: "Who directed 'Inception'?", options: ["Christopher Nolan", "Steven Spielberg", "Quentin Tarantino", "Martin Scorsese"], correctAnswer: 0, category: 'movies', points: 100 },
  { id: 8, question: "What year was 'The Godfather' released?", options: ["1970", "1971", "1972", "1973"], correctAnswer: 2, category: 'movies', points: 100 },
  { id: 9, question: "Which actor played Iron Man in the MCU?", options: ["Chris Evans", "Robert Downey Jr.", "Chris Hemsworth", "Mark Ruffalo"], correctAnswer: 1, category: 'movies', points: 100 },
  { id: 10, question: "What is the name of the ship in 'Titanic'?", options: ["Titanic", "Olympic", "Britannic", "Lusitania"], correctAnswer: 0, category: 'movies', points: 100 },
  { id: 11, question: "Who directed 'Pulp Fiction'?", options: ["Martin Scorsese", "Quentin Tarantino", "David Fincher", "Coen Brothers"], correctAnswer: 1, category: 'movies', points: 100 },
  { id: 12, question: "Which movie features a character named Jack Sparrow?", options: ["Pirates of the Caribbean", "Master and Commander", "Moby Dick", "Treasure Island"], correctAnswer: 0, category: 'movies', points: 100 },
  { id: 13, question: "What is the name of the main character in 'The Lord of the Rings'?", options: ["Gandalf", "Frodo", "Aragorn", "Legolas"], correctAnswer: 1, category: 'movies', points: 100 },
  { id: 14, question: "Who played Harry Potter in the film series?", options: ["Daniel Radcliffe", "Rupert Grint", "Tom Felton", "Tom Hiddleston"], correctAnswer: 0, category: 'movies', points: 100 },
  { id: 15, question: "Which movie features the quote 'I'll be back'?", options: ["Terminator", "Predator", "Commando", "Total Recall"], correctAnswer: 0, category: 'movies', points: 100 },
  { id: 16, question: "Who directed 'Jurassic Park'?", options: ["George Lucas", "Steven Spielberg", "James Cameron", "Ridley Scott"], correctAnswer: 1, category: 'movies', points: 100 },
  { id: 17, question: "What is the name of the main character in 'The Lion King'?", options: ["Simba", "Mufasa", "Scar", "Timon"], correctAnswer: 0, category: 'movies', points: 100 },
  { id: 18, question: "Which movie won Best Picture in 2020?", options: ["1917", "Parasite", "Joker", "Once Upon a Time in Hollywood"], correctAnswer: 1, category: 'movies', points: 100 },
  { id: 19, question: "Who played the main character in 'The Revenant'?", options: ["Tom Hardy", "Leonardo DiCaprio", "Brad Pitt", "Christian Bale"], correctAnswer: 1, category: 'movies', points: 100 },
  { id: 20, question: "What is the name of the main character in 'Frozen'?", options: ["Elsa", "Anna", "Olaf", "Kristoff"], correctAnswer: 0, category: 'movies', points: 100 },
  { id: 21, question: "Which movie features the quote 'Here's looking at you, kid'?", options: ["Casablanca", "The Maltese Falcon", "Citizen Kane", "Gone with the Wind"], correctAnswer: 0, category: 'movies', points: 100 },
  { id: 22, question: "Who directed 'The Avengers' (2012)?", options: ["Joss Whedon", "Russo Brothers", "James Gunn", "Taika Waititi"], correctAnswer: 0, category: 'movies', points: 100 },
  { id: 23, question: "What is the name of the main character in 'The Matrix'?", options: ["Neo", "Morpheus", "Trinity", "Agent Smith"], correctAnswer: 0, category: 'movies', points: 100 },
  { id: 24, question: "Which movie features a character named Tony Stark?", options: ["Iron Man", "Captain America", "Thor", "Hulk"], correctAnswer: 0, category: 'movies', points: 100 },
  { id: 25, question: "Who played the Joker in 'Joker' (2019)?", options: ["Heath Ledger", "Joaquin Phoenix", "Jack Nicholson", "Jared Leto"], correctAnswer: 1, category: 'movies', points: 100 },
  { id: 26, question: "What is the name of the main character in 'The Hunger Games'?", options: ["Katniss", "Peeta", "Gale", "Prim"], correctAnswer: 0, category: 'movies', points: 100 },
  { id: 27, question: "Which movie features the quote 'You can't handle the truth!'?", options: ["A Few Good Men", "The Departed", "Goodfellas", "The Godfather"], correctAnswer: 0, category: 'movies', points: 100 },
  { id: 28, question: "Who directed 'Interstellar'?", options: ["Christopher Nolan", "Denis Villeneuve", "Ridley Scott", "Danny Boyle"], correctAnswer: 0, category: 'movies', points: 100 },
  { id: 29, question: "What is the name of the main character in 'The Dark Knight'?", options: ["Batman", "Bruce Wayne", "Joker", "Harvey Dent"], correctAnswer: 1, category: 'movies', points: 100 },
  { id: 30, question: "Which movie features a character named Luke Skywalker?", options: ["Star Wars", "Star Trek", "Guardians of the Galaxy", "Dune"], correctAnswer: 0, category: 'movies', points: 100 },
  { id: 31, question: "Which game series features a plumber saving a princess?", options: ["Sonic", "Super Mario", "Mega Man", "Zelda"], correctAnswer: 1, category: 'videogames', points: 100 },
  { id: 32, question: "What is the name of the main character in 'The Legend of Zelda'?", options: ["Zelda", "Link", "Ganon", "Epona"], correctAnswer: 1, category: 'videogames', points: 100 },
  { id: 33, question: "In 'Portal', what is the name of the AI antagonist?", options: ["HAL 9000", "GLaDOS", "SHODAN", "Cortana"], correctAnswer: 1, category: 'videogames', points: 100 },
  { id: 34, question: "Which game features a character named Master Chief?", options: ["Call of Duty", "Halo", "Gears of War", "Destiny"], correctAnswer: 1, category: 'videogames', points: 100 },
  { id: 35, question: "What is the name of the main character in 'Minecraft'?", options: ["Steve", "Alex", "Notch", "Herobrine"], correctAnswer: 0, category: 'videogames', points: 100 },
  { id: 36, question: "Which game series features a character named Kratos?", options: ["God of War", "Devil May Cry", "Bayonetta", "Darksiders"], correctAnswer: 0, category: 'videogames', points: 100 },
  { id: 37, question: "What is the name of the main character in 'Tomb Raider'?", options: ["Lara Croft", "Nathan Drake", "Indiana Jones", "Elena Fisher"], correctAnswer: 0, category: 'videogames', points: 100 },
  { id: 38, question: "Which game features a character named Geralt of Rivia?", options: ["The Witcher", "Skyrim", "Dragon Age", "Dark Souls"], correctAnswer: 0, category: 'videogames', points: 100 },
  { id: 39, question: "What is the name of the main character in 'Assassin's Creed'?", options: ["Ezio", "Altair", "Connor", "Edward"], correctAnswer: 1, category: 'videogames', points: 100 },
  { id: 40, question: "Which game features a character named Solid Snake?", options: ["Metal Gear Solid", "Splinter Cell", "Hitman", "Deus Ex"], correctAnswer: 0, category: 'videogames', points: 100 },
  { id: 41, question: "What is the name of the main character in 'Half-Life'?", options: ["Gordon Freeman", "Alyx Vance", "G-Man", "Barney"], correctAnswer: 0, category: 'videogames', points: 100 },
  { id: 42, question: "Which game features a character named Cloud Strife?", options: ["Final Fantasy VII", "Final Fantasy X", "Kingdom Hearts", "Chrono Trigger"], correctAnswer: 0, category: 'videogames', points: 100 },
  { id: 43, question: "What is the name of the main character in 'Doom'?", options: ["Doomguy", "Doom Slayer", "Marine", "Hell Walker"], correctAnswer: 0, category: 'videogames', points: 100 },
  { id: 44, question: "Which game features a character named Mario?", options: ["Super Mario Bros", "Sonic the Hedgehog", "Crash Bandicoot", "Spyro"], correctAnswer: 0, category: 'videogames', points: 100 },
  { id: 45, question: "What is the name of the main character in 'BioShock'?", options: ["Jack", "Booker", "Elizabeth", "Atlas"], correctAnswer: 0, category: 'videogames', points: 100 },
  { id: 46, question: "Which game features a character named Samus Aran?", options: ["Metroid", "Castlevania", "Contra", "Mega Man"], correctAnswer: 0, category: 'videogames', points: 100 },
  { id: 47, question: "What is the name of the main character in 'The Last of Us'?", options: ["Joel", "Ellie", "Tess", "Tommy"], correctAnswer: 0, category: 'videogames', points: 100 },
  { id: 48, question: "Which game features a character named Commander Shepard?", options: ["Mass Effect", "Star Wars: KOTOR", "Dragon Age", "Fallout"], correctAnswer: 0, category: 'videogames', points: 100 },
  { id: 49, question: "What is the name of the main character in 'Red Dead Redemption'?", options: ["John Marston", "Arthur Morgan", "Dutch", "Micah"], correctAnswer: 0, category: 'videogames', points: 100 },
  { id: 50, question: "Which game features a character named Nathan Drake?", options: ["Uncharted", "Tomb Raider", "Indiana Jones", "Assassin's Creed"], correctAnswer: 0, category: 'videogames', points: 100 },
  { id: 51, question: "What is the name of the main character in 'Fallout'?", options: ["Vault Dweller", "Lone Wanderer", "Sole Survivor", "Courier"], correctAnswer: 0, category: 'videogames', points: 100 },
  { id: 52, question: "Which game features a character named Pikachu?", options: ["Pokémon", "Digimon", "Yokai Watch", "Temtem"], correctAnswer: 0, category: 'videogames', points: 100 },
  { id: 53, question: "What is the name of the main character in 'Sonic the Hedgehog'?", options: ["Sonic", "Tails", "Knuckles", "Shadow"], correctAnswer: 0, category: 'videogames', points: 100 },
  { id: 54, question: "Which game features a character named Crash Bandicoot?", options: ["Crash Bandicoot", "Spyro", "Sonic", "Mario"], correctAnswer: 0, category: 'videogames', points: 100 },
  { id: 55, question: "What is the name of the main character in 'Resident Evil'?", options: ["Chris Redfield", "Jill Valentine", "Leon Kennedy", "Claire Redfield"], correctAnswer: 0, category: 'videogames', points: 100 },
  { id: 56, question: "Which game features a character named Kratos?", options: ["God of War", "Devil May Cry", "Bayonetta", "Darksiders"], correctAnswer: 0, category: 'videogames', points: 100 },
  { id: 57, question: "What is the name of the main character in 'Street Fighter'?", options: ["Ryu", "Ken", "Chun-Li", "Guile"], correctAnswer: 0, category: 'videogames', points: 100 },
  { id: 58, question: "Which game features a character named Pac-Man?", options: ["Pac-Man", "Ms. Pac-Man", "Dig Dug", "Galaga"], correctAnswer: 0, category: 'videogames', points: 100 },
  { id: 59, question: "What is the name of the main character in 'Tetris'?", options: ["No character", "Tetris", "Block", "Square"], correctAnswer: 0, category: 'videogames', points: 100 },
  { id: 60, question: "Which game features a character named Master Chief?", options: ["Halo", "Call of Duty", "Gears of War", "Destiny"], correctAnswer: 0, category: 'videogames', points: 100 },
  { id: 61, question: "What is the name of the main character in 'Grand Theft Auto V'?", options: ["Michael", "Trevor", "Franklin", "All of them"], correctAnswer: 3, category: 'videogames', points: 100 },
  { id: 62, question: "Which game features a character named Ezio Auditore?", options: ["Assassin's Creed", "Prince of Persia", "Tomb Raider", "Uncharted"], correctAnswer: 0, category: 'videogames', points: 100 },
  { id: 63, question: "What is the name of the main character in 'Borderlands'?", options: ["Vault Hunter", "Lilith", "Mordecai", "Roland"], correctAnswer: 0, category: 'videogames', points: 100 },
  { id: 64, question: "Which game features a character named Cortana?", options: ["Halo", "Mass Effect", "Deus Ex", "System Shock"], correctAnswer: 0, category: 'videogames', points: 100 },
  { id: 65, question: "What is the name of the main character in 'Dead Space'?", options: ["Isaac Clarke", "Ellie Langford", "John Carver", "Nicole Brennan"], correctAnswer: 0, category: 'videogames', points: 100 },
  { id: 66, question: "Which game features a character named Aloy?", options: ["Horizon Zero Dawn", "Tomb Raider", "Assassin's Creed", "The Last of Us"], correctAnswer: 0, category: 'videogames', points: 100 },
  { id: 67, question: "What is the name of the main character in 'Dishonored'?", options: ["Corvo Attano", "Emily Kaldwin", "Daud", "The Outsider"], correctAnswer: 0, category: 'videogames', points: 100 },
  { id: 68, question: "Which game features a character named Jin Sakai?", options: ["Ghost of Tsushima", "Sekiro", "Nioh", "Onimusha"], correctAnswer: 0, category: 'videogames', points: 100 },
  { id: 69, question: "What is the name of the main character in 'Control'?", options: ["Jesse Faden", "Dylan Faden", "Dr. Casper Darling", "Ahti"], correctAnswer: 0, category: 'videogames', points: 100 },
  { id: 70, question: "Which game features a character named Bayek?", options: ["Assassin's Creed Origins", "Assassin's Creed Odyssey", "Assassin's Creed Valhalla", "Assassin's Creed Unity"], correctAnswer: 0, category: 'videogames', points: 100 },
  { id: 71, question: "Which band released 'Bohemian Rhapsody'?", options: ["The Beatles", "Led Zeppelin", "Queen", "Pink Floyd"], correctAnswer: 2, category: 'music', points: 100 },
  { id: 72, question: "What was Nirvana's breakthrough album?", options: ["Bleach", "Nevermind", "In Utero", "MTV Unplugged"], correctAnswer: 1, category: 'music', points: 100 },
  { id: 73, question: "Which composer created the 'Star Wars' soundtrack?", options: ["Hans Zimmer", "John Williams", "Ennio Morricone", "Danny Elfman"], correctAnswer: 1, category: 'music', points: 100 },
  { id: 74, question: "Who sang 'Billie Jean'?", options: ["Michael Jackson", "Prince", "Stevie Wonder", "Marvin Gaye"], correctAnswer: 0, category: 'music', points: 100 },
  { id: 75, question: "Which band released 'Stairway to Heaven'?", options: ["The Beatles", "Led Zeppelin", "Pink Floyd", "The Rolling Stones"], correctAnswer: 1, category: 'music', points: 100 },
  { id: 76, question: "What is the name of Taylor Swift's first album?", options: ["Taylor Swift", "Fearless", "Speak Now", "Red"], correctAnswer: 0, category: 'music', points: 100 },
  { id: 77, question: "Which artist released 'Thriller'?", options: ["Michael Jackson", "Prince", "Madonna", "Whitney Houston"], correctAnswer: 0, category: 'music', points: 100 },
  { id: 78, question: "Who sang 'Like a Rolling Stone'?", options: ["Bob Dylan", "The Rolling Stones", "The Beatles", "The Who"], correctAnswer: 0, category: 'music', points: 100 },
  { id: 79, question: "Which band released 'Hotel California'?", options: ["The Eagles", "Fleetwood Mac", "The Doors", "Lynyrd Skynyrd"], correctAnswer: 0, category: 'music', points: 100 },
  { id: 80, question: "What is the name of The Beatles' first album?", options: ["Please Please Me", "With The Beatles", "A Hard Day's Night", "Beatles for Sale"], correctAnswer: 0, category: 'music', points: 100 },
  { id: 81, question: "Which artist released 'Purple Rain'?", options: ["Michael Jackson", "Prince", "David Bowie", "Elton John"], correctAnswer: 1, category: 'music', points: 100 },
  { id: 82, question: "Who sang 'Imagine'?", options: ["John Lennon", "Paul McCartney", "George Harrison", "Ringo Starr"], correctAnswer: 0, category: 'music', points: 100 },
  { id: 83, question: "Which band released 'The Dark Side of the Moon'?", options: ["The Beatles", "Led Zeppelin", "Pink Floyd", "The Rolling Stones"], correctAnswer: 2, category: 'music', points: 100 },
  { id: 84, question: "What is the name of Adele's first album?", options: ["19", "21", "25", "30"], correctAnswer: 0, category: 'music', points: 100 },
  { id: 85, question: "Which artist released 'Bad'?", options: ["Michael Jackson", "Prince", "Madonna", "Whitney Houston"], correctAnswer: 0, category: 'music', points: 100 },
  { id: 86, question: "Who sang 'Sweet Child O' Mine'?", options: ["Guns N' Roses", "Aerosmith", "AC/DC", "Van Halen"], correctAnswer: 0, category: 'music', points: 100 },
  { id: 87, question: "Which band released 'Back in Black'?", options: ["AC/DC", "Led Zeppelin", "Black Sabbath", "Deep Purple"], correctAnswer: 0, category: 'music', points: 100 },
  { id: 88, question: "What is the name of Eminem's first album?", options: ["Infinite", "The Slim Shady LP", "The Marshall Mathers LP", "The Eminem Show"], correctAnswer: 0, category: 'music', points: 100 },
  { id: 89, question: "Which artist released 'Like a Virgin'?", options: ["Madonna", "Cyndi Lauper", "Tina Turner", "Whitney Houston"], correctAnswer: 0, category: 'music', points: 100 },
  { id: 90, question: "Who sang 'Smells Like Teen Spirit'?", options: ["Nirvana", "Pearl Jam", "Soundgarden", "Alice in Chains"], correctAnswer: 0, category: 'music', points: 100 },
  { id: 91, question: "Which band released 'Sgt. Pepper's Lonely Hearts Club Band'?", options: ["The Beatles", "The Rolling Stones", "The Who", "The Kinks"], correctAnswer: 0, category: 'music', points: 100 },
  { id: 92, question: "What is the name of Beyoncé's first solo album?", options: ["Dangerously in Love", "B'Day", "I Am... Sasha Fierce", "4"], correctAnswer: 0, category: 'music', points: 100 },
  { id: 93, question: "Which artist released 'The Wall'?", options: ["Pink Floyd", "Led Zeppelin", "The Beatles", "The Rolling Stones"], correctAnswer: 0, category: 'music', points: 100 },
  { id: 94, question: "Who sang 'Hey Jude'?", options: ["The Beatles", "The Rolling Stones", "The Who", "The Kinks"], correctAnswer: 0, category: 'music', points: 100 },
  { id: 95, question: "Which band released 'Abbey Road'?", options: ["The Beatles", "The Rolling Stones", "The Who", "The Kinks"], correctAnswer: 0, category: 'music', points: 100 },
  { id: 96, question: "What is the name of Drake's first album?", options: ["Thank Me Later", "Take Care", "Nothing Was the Same", "Views"], correctAnswer: 0, category: 'music', points: 100 },
  { id: 97, question: "Which artist released 'Rumours'?", options: ["Fleetwood Mac", "The Eagles", "The Doors", "Lynyrd Skynyrd"], correctAnswer: 0, category: 'music', points: 100 },
  { id: 98, question: "Who sang 'Wonderwall'?", options: ["Oasis", "Blur", "Radiohead", "The Verve"], correctAnswer: 0, category: 'music', points: 100 },
  { id: 99, question: "Which band released 'OK Computer'?", options: ["Radiohead", "Oasis", "Blur", "The Verve"], correctAnswer: 0, category: 'music', points: 100 },
  { id: 100, question: "What is the name of The Weeknd's first album?", options: ["Kiss Land", "Beauty Behind the Madness", "Starboy", "After Hours"], correctAnswer: 0, category: 'music', points: 100 },
];

const categoryColors = {
  videogames: '#a855f7',
  music: '#c084fc',
  movies: '#e9d5ff',
};

export function GamePage({ onComplete, onBack }: GamePageProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const movies = allQuestions.filter(q => q.category === 'movies');
    const videogames = allQuestions.filter(q => q.category === 'videogames');
    const music = allQuestions.filter(q => q.category === 'music');

    const shuffledMovies = shuffleArray(movies);
    const shuffledVideogames = shuffleArray(videogames);
    const shuffledMusic = shuffleArray(music);

    const selectedMovies = shuffledMovies.slice(0, 3);
    const selectedVideogames = shuffledVideogames.slice(0, 4);
    const selectedMusic = shuffledMusic.slice(0, 3);

    const selectedQuestions = shuffleArray([
      ...selectedMovies,
      ...selectedVideogames,
      ...selectedMusic
    ]);

    setQuestions(selectedQuestions);
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null && !showResult) {
      setShowResult(true);
      if (selectedAnswer === currentQuestion.correctAnswer) {
        setScore(score + currentQuestion.points);
      }
      return;
    }

    if (showResult) {
      if (isLastQuestion) {
        const finalScore = selectedAnswer === currentQuestion.correctAnswer 
          ? score + currentQuestion.points 
          : score;
        onComplete(finalScore);
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      }
    } else {
      setShowResult(true);
      if (selectedAnswer === currentQuestion.correctAnswer) {
        setScore(score + currentQuestion.points);
      }
    }
  };

  const getButtonStyle = (index: number) => {
    if (!showResult) {
      if (selectedAnswer === index) {
        return {
          background: 'linear-gradient(to bottom, #7c3aed, #6b21a8)',
          borderColor: '#a855f7',
          color: '#e9d5ff'
        };
      }
      return {
        background: 'linear-gradient(to bottom, #1e1b4b, #110f2d)',
        borderColor: '#6b21a8',
        color: '#c084fc'
      };
    }
    
    if (index === currentQuestion.correctAnswer) {
      return {
        background: 'linear-gradient(to bottom, #22c55e, #16a34a)',
        borderColor: '#4ade80',
        color: '#ffffff'
      };
    }
    
    if (selectedAnswer === index && selectedAnswer !== currentQuestion.correctAnswer) {
      return {
        background: 'linear-gradient(to bottom, #ef4444, #dc2626)',
        borderColor: '#f87171',
        color: '#ffffff'
      };
    }
    
    return {
      background: 'linear-gradient(to bottom, #1e1b4b, #110f2d)',
      borderColor: '#4c1d95',
      color: '#7c3aed',
      opacity: 0.6
    };
  };

  const getButtonClass = (index: number) => {
    if (!showResult) {
      return selectedAnswer === index 
        ? 'answer-selected' 
        : 'hover:border-[#7c3aed] hover:text-[#e9d5ff]';
    }
    
    if (index === currentQuestion.correctAnswer) {
      return 'answer-correct';
    }
    
    if (selectedAnswer === index && selectedAnswer !== currentQuestion.correctAnswer) {
      return 'answer-incorrect';
    }
    
    return '';
  };
  if (questions.length === 0) {
    return (
      <div className="pixel-container max-w-3xl w-full">
        <div className="text-center p-12">
          <p className="text-[#c084fc]">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pixel-container max-w-3xl w-full">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="pixel-button px-4 py-2 bg-gradient-to-b from-[#4c1d95] to-[#3b0764] border-[#6b21a8] text-[#c084fc] hover:from-[#581c87] hover:to-[#4c1d95]">
          ← BACK
        </button>
        <div className="px-6 py-2 text-[#e9d5ff]">
          SCORE: {score}
        </div>
      </div>

      <div className="text-center mb-6">
        <p className="text-[#c084fc] mb-2 text-xs">QUESTION {currentQuestionIndex + 1} / {questions.length}</p>
        <div className="h-3 bg-[#1e1b4b] rounded-none overflow-hidden border-2 border-[#6b21a8]">
          <div 
            className="h-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] transition-all duration-300"
            style={{ 
              width: `${questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0}%`,
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.6)'
            }}
          />
        </div>
      </div>

      <div className="text-center mb-6">
        <span 
          className="inline-block px-6 py-3 border-3 border-[#a855f7] text-xs font-bold"
          style={{ 
            backgroundColor: categoryColors[currentQuestion.category],
            color: '#ffffff',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            pointerEvents: 'none',
            cursor: 'default'
          }}
        >
          ★ {currentQuestion.category.toUpperCase()} ★
        </span>
      </div>

      <div className="mb-8 p-6 bg-gradient-to-b from-[#1e1b4b] to-[#110f2d] border-4 border-[#7c3aed] relative">
        <div className="absolute top-2 left-2 right-2 bottom-2 border border-[#6b21a8] pointer-events-none opacity-50"></div>
        <p className="text-[#e9d5ff] text-center leading-relaxed relative z-10">{currentQuestion.question}</p>
        <div className="mt-4 pt-4 border-t-2 border-[#6b21a8]">
          <p className="text-[#c084fc] text-center">💎 {currentQuestion.points} POINTS</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-8">
        {currentQuestion.options.map((option, index) => {
          const buttonStyle = getButtonStyle(index);
          const isCorrect = showResult && index === currentQuestion.correctAnswer;
          const isIncorrect = showResult && selectedAnswer === index && selectedAnswer !== currentQuestion.correctAnswer;
          
          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult}
              className={`pixel-button p-4 text-left transition-all ${getButtonClass(index)}`}
              style={{
                ...(showResult ? {} : {
                  background: buttonStyle.background,
                  borderColor: buttonStyle.borderColor,
                  color: buttonStyle.color
                }),
                ...(showResult && !isCorrect && !isIncorrect && buttonStyle.opacity !== undefined ? { opacity: buttonStyle.opacity } : {}),
                borderWidth: '3px',
                borderStyle: 'solid'
              }}
            >
              <span 
                className="mr-3"
                style={{
                  color: isCorrect || isIncorrect ? '#ffffff' : '#a855f7'
                }}
              >
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
            </button>
          );
        })}
      </div>

      <button
        onClick={handleNext}
        disabled={selectedAnswer === null && !showResult}
        className={`pixel-button w-full p-4 transition-all ${
          selectedAnswer === null && !showResult
            ? 'bg-[#1e1b4b] text-[#6b21a8] cursor-not-allowed border-[#4c1d95]'
            : 'bg-gradient-to-b from-[#7c3aed] to-[#6b21a8] hover:from-[#8b5cf6] hover:to-[#7c3aed] border-[#a855f7] text-[#e9d5ff]'
        }`}
      >
        {showResult ? (isLastQuestion ? '★ FINISH ★' : 'NEXT QUESTION →') : 'SUBMIT ANSWER'}
      </button>

      {showResult && (
        <div className="mt-6 text-center p-4 border-3 border-[#7c3aed] bg-[#1e1b4b]/50">
          {selectedAnswer === currentQuestion.correctAnswer ? (
            <p className="text-[#a855f7]">✓ CORRECT! +{currentQuestion.points} points</p>
          ) : (
            <p className="text-[#c084fc]">✗ WRONG! Correct answer: {String.fromCharCode(65 + currentQuestion.correctAnswer)}</p>
          )}
        </div>
      )}
    </div>
  );
}