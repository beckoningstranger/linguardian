import { LearningMode } from "./types";

const learningButtonConfig: {
  name: LearningMode;
  label: string;
  globalLabel: string;
  color: string;
  hoverColor: string;
  iconPath: string;
}[] = [
  {
    name: "context",
    label: "Words in context",
    globalLabel: "Review all items in context",
    color: "orange-500",
    hoverColor: "orange-600",
    iconPath: "/icons/ContextMode.svg",
  },
  {
    name: "learn",
    label: "Learn new words",
    globalLabel: "Learn new items from any list",
    color: "green-500",
    hoverColor: "green-600",
    iconPath: "/icons/LearnNewWords.svg",
  },
  {
    name: "dictionary",
    label: "Practice with definitions",
    globalLabel: "Practice all words with definitions",
    color: "brown-500",
    hoverColor: "brown-600",
    iconPath: "/icons/DictionaryMode.svg",
  },
  {
    name: "translation",
    label: "Review with translations",
    globalLabel: "Review all with translations",
    color: "blue-500",
    hoverColor: "blue-600",
    iconPath: "/icons/TranslationMode.svg",
  },
  {
    name: "spellingBee",
    label: "Perfect your spelling",
    globalLabel: "Perfect your spelling of all items",
    color: "magenta-500",
    hoverColor: "magenta-600",
    iconPath: "/icons/SpellingMode.svg",
  },
  {
    name: "visual",
    label: "Practice in visual mode",
    globalLabel: "Practice all in visual mode",
    color: "pink-500",
    hoverColor: "pink-600",
    iconPath: "/icons/VisualMode.svg",
  },
];

export default learningButtonConfig;
