import React, { useState, useEffect, ChangeEvent, MouseEvent } from "react";
import Navbar from "@/components/navbar";

interface TextItem {
  text: string;
  id: number;
}

const Home: React.FC = () => {
  const [inputText, setInputText] = useState<string>("");
  const [savedTexts, setSavedTexts] = useState<TextItem[]>([]);

  useEffect(() => {
    const storedTexts = localStorage.getItem("texts");
    if (storedTexts) {
      setSavedTexts(JSON.parse(storedTexts));
    }
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const saveToLocalStorage = (event: MouseEvent<HTMLButtonElement>) => {
    const newTexts: TextItem[] = [
      ...savedTexts,
      { text: inputText, id: new Date().getTime() },
    ];
    localStorage.setItem("texts", JSON.stringify(newTexts));
    setSavedTexts(newTexts);
    setInputText("");
  };

  return (
    <div>
      <Navbar />

      <div>
        <h2>Save text to local storage</h2>
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Enter some text here"
        />
        <button onClick={saveToLocalStorage}>Save to Local Storage</button>
      </div>
      {savedTexts.length > 0 && (
        <div>
          <h3>Saved texts:</h3>
          <ul>
            {savedTexts.map((textItem) => (
              <li key={textItem.id}>{textItem.text}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Home;
