import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const apiURL = "https://random-word-api.herokuapp.com/word?length=5";
  // Default for now: JAMES
  const [hiddenWord, setHiddenWord] = useState("JAMES");
  const [rowToCheck, setRowToCheck] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState<string[]>([]);
  const [isPerfect, setIsPerfect] = useState(false);
  // const [currentStatus, setCurrentStatus] = useState<string[]>([]);

  const [boxes, setBoxes] = useState<string[][]>([
    ["empty", "empty", "empty", "empty", "empty", "open"],
    ["empty", "empty", "empty", "empty", "empty", "unchecked"],
    ["empty", "empty", "empty", "empty", "empty", "unchecked"],
    ["empty", "empty", "empty", "empty", "empty", "unchecked"],
    ["empty", "empty", "empty", "empty", "empty", "unchecked"],
  ]);

  useEffect(() => {
    try {
      const fetchWord = async () => {
        const response = await fetch(apiURL);
        const wordLists = await response.json();
        const randomWord = wordLists[Math.floor(Math.random() * wordLists.length)];
        setHiddenWord(randomWord.toUpperCase());
      };

      fetchWord();
    } catch (err) {
      console.log(`Fetch error: ${err}`);
    }
  }, []);

  const checkAnswer = () => {
    const newBoxes = [...boxes];
    const updateRow = [...newBoxes[rowToCheck]];
    let count = 0;

    boxes[rowToCheck]
      .filter((w) => w !== "open" && w !== "checked" && w !== "unchecked")
      .forEach((_, idx) => {
        if (hiddenWord[idx] === currentAnswer[idx]) {
          updateRow[idx] = "correct";
          count++;
        } else if (hiddenWord.includes(currentAnswer[idx])) {
          updateRow[idx] = "misplaced";
        } else {
          updateRow[idx] = "incorrect";
        }
      });

    if (count === 5) {
      setIsPerfect(true);
    }
    console.log(`Early count: ${count}`);

    if (!isPerfect) {
      updateRow[5] = "checked";
      newBoxes[rowToCheck] = updateRow;
      const updateSecondRow = [...newBoxes[1]];
      updateSecondRow[5] = "open";
      newBoxes[1] = updateSecondRow;

      count = 0;
      setRowToCheck((c) => c + 1);
      setCurrentAnswer([]);
      setBoxes(newBoxes);
    }

    console.log(`End count: ${count}`);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-blue-500">WORDLE</h1>
        {/* <h2>Hidden Word: {hiddenWord}</h2> */}
      </div>
      <div className="flex flex-col gap-[4px]">
        {boxes.map((_, idx) => (
          <div className="flex gap-[4px]" key={idx}>
            {boxes[idx]
              .filter((w) => w !== "open" && w !== "checked" && w !== "unchecked")
              .map((_, checkerIdx) => (
                <input
                  maxLength={1}
                  key={checkerIdx}
                  className={`h-[50px] w-[50px] p-2 text-center text-2xl ${
                    boxes[idx][checkerIdx] === "misplaced"
                      ? "bg-[#f3c237]"
                      : boxes[idx][checkerIdx] === "correct"
                        ? "bg-[#79b851]"
                        : ""
                  }`}
                  disabled={boxes[idx][5] === "unchecked" || boxes[idx][5] === "checked"}
                  onChange={(e) => {
                    /* const newCurrentAnswer = [...currentAnswer];
                    newCurrentAnswer[idx] = e.target.value;
                    setCurrentAnswer(newCurrentAnswer); */
                    setCurrentAnswer((prev) => [...prev, e.target.value]);
                  }}
                />
              ))}
          </div>
        ))}
      </div>
      {isPerfect && <h2>YOU WIN!</h2>}
      <button className="mt-[10px]" onClick={checkAnswer}>
        Enter
      </button>
    </div>
  );
}

export default App;
