import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [savedTexts, setSavedTexts] = useState([]);

  useEffect(() => {
    const storedTexts = localStorage.getItem("texts");
    if (storedTexts) {
      setSavedTexts(JSON.parse(storedTexts));
    }
  }, []);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const saveToLocalStorage = () => {
    const newTexts = [...savedTexts, inputText];
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
            {savedTexts.map((text, index) => (
              <li key={index}>{text}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
