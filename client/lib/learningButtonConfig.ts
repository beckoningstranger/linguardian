import { LearningMode } from "@/lib/contracts";

const learningButtonConfig: {
  name: LearningMode;
  label: string;
  globalLabel: string;
  overstudyLabel: string;
  color: string;
  hoverColor: string;
  iconPath: string;
}[] = [
  {
    name: "context",
    label: "Words in context",
    globalLabel: "Review all items in context",
    overstudyLabel: "Overstudy with context",
    color: "orange-500",
    hoverColor: "orange-600",
    iconPath: "/icons/ContextMode.svg",
  },
  {
    name: "learn",
    label: "Learn new words",
    globalLabel: "Learn new items from any list",
    overstudyLabel: "",
    color: "green-500",
    hoverColor: "green-600",
    iconPath: "/icons/LearnNewWords.svg",
  },
  {
    name: "dictionary",
    label: "Practice with definitions",
    globalLabel: "Practice all words with definitions",
    overstudyLabel: "Overstudy with definitions",
    color: "brown-500",
    hoverColor: "brown-600",
    iconPath: "/icons/DictionaryMode.svg",
  },
  {
    name: "translation",
    label: "Review with translations",
    globalLabel: "Review all with translations",
    overstudyLabel: "Overstudy with translations",
    color: "blue-500",
    hoverColor: "blue-600",
    iconPath: "/icons/TranslationMode.svg",
  },
  {
    name: "spelling",
    label: "Perfect your spelling",
    globalLabel: "Perfect your spelling of all items",
    overstudyLabel: "Overstudy by spelling",
    color: "magenta-500",
    hoverColor: "magenta-600",
    iconPath: "/icons/SpellingMode.svg",
  },
  {
    name: "visual",
    label: "Practice in visual mode",
    globalLabel: "Practice all in visual mode",
    overstudyLabel: "Overstudy in visual mode",
    color: "pink-500",
    hoverColor: "pink-600",
    iconPath: "/icons/VisualMode.svg",
  },
  {
    name: "overstudy",
    label: "Next reviews due in",
    overstudyLabel: "Your next reviews are",
    globalLabel: "",
    color: "blue-700",
    hoverColor: "blue-700",
    iconPath: "/icons/TranslationMode.svg",
  },
];

export default learningButtonConfig;
