import {
  generateMapPrefCmd,
  getSavedPreferences,
  hasSavedPreferences,
  savePreferences,
  type MapPreference,
} from "@/maps";
import { useState } from "react";
import { ArrowLeftIcon, CheckIcon, CopyIcon } from "@phosphor-icons/react";

export const App = () => {
  const [choices, setChoices] = useState(() => getSavedPreferences());
  const [choiceIdx, setChoiceIdx] = useState(0);
  const [screen, setScreen] = useState<"wizard" | "overview">(
    hasSavedPreferences() ? "overview" : "wizard",
  );
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    setCopied(true);
    const mapPrefCmd = generateMapPrefCmd(choices);
    savePreferences(choices);

    navigator.clipboard.writeText(mapPrefCmd);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const onChoiceMade = (pref: MapPreference) => {
    setChoices((prev) => {
      return prev.map((c, i) => (i === choiceIdx ? { ...c, pref } : c));
    });

    if (choiceIdx === choices.length - 1) {
      setScreen("overview");
      window.localStorage.setItem("has_been_here_before", "LOL YES INFACT");

      copyToClipboard();
      return;
    }

    setChoiceIdx((p) => p + 1);
  };

  const updatePref = (idx: number, pref: MapPreference) => {
    setChoices((prev) => {
      return prev.map((c, i) => (i === idx ? { ...c, pref } : c));
    });
  };

  const backToWizard = () => {
    setChoiceIdx(0);
    setScreen("wizard");
  };

  if (screen === "wizard") {
    return (
      <div>
        <header className="bg-accent text-accent-content p-4 text-center text-2xl">
          RtCW Map prefs
        </header>
        <div className="mt-4 flex flex-col">
          <div className="flex items-center justify-center">
            <img
              className="h-[40vh] object-contain"
              src={choices[choiceIdx].imgUrl}
            />
          </div>
          <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-col items-center">
              <h3 className="text-3xl font-bold">{choices[choiceIdx].name}</h3>
              <p>
                {choiceIdx + 1} / {choices.length}
              </p>
            </div>
            <div className="flex flex-col items-center gap-4">
              {[
                { pref: 1, text: "Always" },
                { pref: 2, text: "Sometimes" },
                { pref: 3, text: "Never" },
                { pref: 4, text: "Don't know" },
              ].map(({ pref, text }) => (
                <button
                  key={pref}
                  onClick={() => onChoiceMade(pref as MapPreference)}
                  className="btn btn-primary btn-xl w-full max-w-2xl rounded-2xl"
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-4">
      <div className="bg-base-100 sticky top-0 z-1">
        <header className="bg-base-300 p-4 text-center text-2xl">
          RtCW Map prefs
        </header>
        <div className="flex items-center justify-center gap-4 p-4">
          <button onClick={backToWizard} className="btn btn-accent">
            <ArrowLeftIcon />
            <span>Back to wizard</span>
          </button>
          <button onClick={copyToClipboard} className="btn btn-accent">
            <CopyIcon />
            <span>Copy to clipboard</span>
          </button>
        </div>
      </div>
      <div className="mt-4 flex flex-col">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center">
            <p className="w-26">Map</p>
            <div className="flex items-center gap-2">
              {["Always", "Sometimes", "Never", "Don't know"].map((text) => (
                <p key={text} className="w-24 text-center">
                  {text}
                </p>
              ))}
            </div>
          </div>
          {choices.map((choice, idx) => (
            <div
              key={idx}
              className="odd:bg-base-300 hover:bg-accent/10 hover:text-primary-content flex items-center p-1"
            >
              <p className="w-26">{choice.name}</p>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((pref) => (
                  <div
                    key={pref}
                    className="flex w-24 items-center justify-center"
                  >
                    <input
                      type="radio"
                      onChange={() => updatePref(idx, pref as MapPreference)}
                      className="radio"
                      checked={choice.pref === pref}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {copied && (
        <div className="toast toast-start">
          <div className="alert alert-success">
            <CheckIcon />
            <span>Copied to clipboard</span>
          </div>
        </div>
      )}
    </div>
  );
};
