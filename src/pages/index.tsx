import React, { useState, useEffect, ChangeEvent, MouseEvent } from "react";
import Navbar from "@/components/navbar";
import { Separator } from "@/components/ui/separator";

import { ChevronRight, Plus } from "lucide-react";

interface TextItem {
  text: string;
  id: number;
  title?: string;
  faviconUrl?: string;
}

const Home: React.FC = () => {
  const [inputText, setInputText] = useState<string>("");
  const [savedTexts, setSavedTexts] = useState<TextItem[]>([]);
  const [remainingSpace, setRemainingSpace] = useState<number>(0);

  useEffect(() => {
    const storedTexts = localStorage.getItem("texts");
    if (storedTexts) {
      setSavedTexts(JSON.parse(storedTexts));
    }
    logRemainingLocalStorageSpace();
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const fetchUrlData = async (url: string) => {
    try {
      const response = await fetch(
        `https://api.linkpreview.net/?key=995f40c79303388b4491aa10df075734&q=${encodeURIComponent(
          url
        )}`
      );
      const data = await response.json();
      console.log("URL data:", data);
      return { title: data.title, faviconUrl: data.image }; // Change this line
    } catch (error) {
      console.error("Error fetching URL data:", error);
      return { title: "", faviconUrl: "" };
    }
  };

  const saveToLocalStorage = async (event: React.SyntheticEvent) => {
    if (inputText === "") return;

    const { title, faviconUrl } = await fetchUrlData(inputText);

    const newTexts: TextItem[] = [
      ...savedTexts,
      { text: inputText, id: new Date().getTime(), title, faviconUrl },
    ];
    localStorage.setItem("texts", JSON.stringify(newTexts));
    setSavedTexts(newTexts);
    setInputText("");

    logRemainingLocalStorageSpace();
  };

  const deleteTextItem = (id: number) => {
    const filteredTexts = savedTexts.filter((textItem) => textItem.id !== id);
    localStorage.setItem("texts", JSON.stringify(filteredTexts));
    setSavedTexts(filteredTexts);

    logRemainingLocalStorageSpace();
  };

  function logRemainingLocalStorageSpace() {
    const totalStorage = 5 * 1024 * 1024;
    let usedStorage = 0;

    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const item = localStorage.getItem(key);
        if (item) {
          usedStorage += item.length * 2;
        }
      }
    }

    const remainingStorage = totalStorage - usedStorage;
    console.log(`Remaining local storage space: ${remainingStorage} bytes`);
    setRemainingSpace(remainingStorage);
  }

  return (
    <div className="bg-white">
      <Navbar />
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          {remainingSpace}
          <div className="relative mt-2 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Plus className="h-5 w-5 text-zinc-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  saveToLocalStorage(e);
                }
              }}
              name="text"
              id="text"
              autoComplete="off"
              className="block w-full rounded-md border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-neutral-200 focus:ring-2 focus:ring-inset focus:ring-neutral-400 sm:text-sm sm:leading-6 placeholder:text-zinc-400 transition-all duration-200"
              placeholder="Insert a link, image, or just plain text..."
            />
          </div>

          <div className="mt-4 mb-2">
            <Separator />
          </div>

          <ul role="list" className="divide-y divide-gray-100">
            {savedTexts.map((textItem) => (
              <li
                key={textItem.id}
                onClick={() => deleteTextItem(textItem.id)}
                className="relative flex justify-between gap-x-6 py-2"
              >
                <div className="flex gap-x-4">
                  <img
                    className="h-12 w-12 flex-none rounded-md bg-gray-50"
                    src={textItem.faviconUrl}
                    alt=""
                  />
                  <div className="min-w-0 flex-auto">
                    <div className="text-sm font-semibold leading-6 text-gray-900">
                      <p>
                        <span className="absolute inset-x-0 -top-px bottom-0" />
                        {textItem.title}
                      </p>
                    </div>
                    <p className="mt-1 flex text-xs leading-5 text-gray-500">
                      <span className="relative truncate max-w-sm hover:underline">
                        {textItem.text}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-x-4">
                  <div className="hidden sm:flex sm:flex-col sm:items-end">
                    <p className="text-sm leading-6 text-gray-900">yo</p>
                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Created <time>May 3, 2023</time>
                    </p>
                  </div>
                  <ChevronRight
                    className="h-5 w-5 flex-none text-gray-400"
                    aria-hidden="true"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
