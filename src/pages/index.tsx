import React, { useState, useEffect, ChangeEvent } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { ChevronRight, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TextItem {
  text: string;
  id: number;
  title?: string;
  faviconUrl?: string;
  createdTime: Date;
}

const dropInAnimation = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

const Home: React.FC = () => {
  const { toast } = useToast();
  const [inputText, setInputText] = useState<string>("");
  const [savedTexts, setSavedTexts] = useState<TextItem[]>([]);
  const [remainingSpace, setRemainingSpace] = useState<number>(0);
  const [remainingStoragePercentage, setRemainingStoragePercentage] =
    useState<number>(100);

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
      {
        text: inputText,
        id: new Date().getTime(),
        title,
        faviconUrl,
        createdTime: new Date(),
      },
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

    toast({
      title: "Attention!",
      description: "Your bookmark has been deleted.",
    });

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

    const percentage = (remainingStorage / totalStorage) * 100;
    setRemainingStoragePercentage(percentage);
  }

  const isValidUrl = (str: string) => {
    const urlRegex =
      /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$|^www\.[^\s/$.?#].[^\s]*$|^[^\s/$.?#].[^\s]*\.[^\s]{2,}$/i;
    return urlRegex.test(str);
  };

  return (
    <div className="bg-white">
      <Navbar />
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {/* {remainingSpace} */}
          <div className="pb-4 sticky top-14 z-50 supports-backdrop-blur:bg-background/60 bg-background/95 backdrop-blur">
            <div className="mb-4">
              <TooltipProvider>
                <div className="mb-4">
                  <Tooltip>
                    <TooltipTrigger className="w-full">
                      <Progress
                        className="w-full"
                        value={remainingStoragePercentage}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Your remaining storage:</p>

                      <p className="text-center">
                        <span className="font-bold">{remainingSpace}</span>{" "}
                        bytes
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>

            <div className="flex justify-between space-x-12 mb-4">
              <Select>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>

              <Input type="text" placeholder="Search" />
            </div>

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
          </div>

          <div className="mt-4 mb-4">
            <Separator />
          </div>

          <ul role="list" className="space-y-2">
            {savedTexts.map((textItem, index) => (
              <motion.li
                key={textItem.id}
                initial="hidden"
                animate="visible"
                variants={dropInAnimation}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <li className="px-2 border hover:bg-gray-100 transition-all duration-200 rounded-md relative flex justify-between gap-x-6 py-2">
                  <div className="flex gap-x-4">
                    {/* <img
                    className="h-12 w-12 flex-none rounded-md bg-gray-50"
                    src={textItem.faviconUrl}
                    alt=""
                  /> */}
                    {isValidUrl(textItem.faviconUrl || "") ? (
                      <img
                        className="h-12 w-12 flex-none rounded-md bg-gray-50"
                        src={textItem.faviconUrl}
                        alt=""
                      />
                    ) : (
                      <div className="bg-gray-200 dark:bg-[#333] w-12 h-12 animate-pulse rounded-md" />
                    )}
                    {/* <div className="bg-gray-200 dark:bg-[#333] w-10 h-10 animate-pulse rounded-md" /> */}
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
                      <div className="flex space-x-2">
                        <Badge variant="default">
                          {isValidUrl(textItem.text) ? "Link" : "Other"}
                        </Badge>
                        <Badge variant="outline">Category</Badge>
                      </div>

                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        Created{" "}
                        <time>
                          {textItem.createdTime
                            ? textItem.createdTime.toLocaleString()
                            : ""}
                        </time>
                      </p>
                    </div>

                    <Trash2
                      className="h-5 w-5 flex-none text-gray-400 cursor-pointer z-50"
                      onClick={() => deleteTextItem(textItem.id)}
                      aria-hidden="true"
                    />
                  </div>
                </li>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
