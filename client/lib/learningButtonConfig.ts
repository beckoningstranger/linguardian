import { LearningMode } from "./types";

const learningButtonConfig: {
  name: LearningMode;
  label: string;
  color: string;
  hoverColor: string;
  iconPath: string;
}[] = [
  {
    name: "context",
    label: "Words in Context",
    color: "bg-orange-500",
    hoverColor: "hover:bg-orange-600",
    iconPath: "/icons/ContextMode.svg",
  },
  {
    name: "learn",
    label: "Learn new words",
    color: "bg-green-500",
    hoverColor: "hover:bg-green-600",
    iconPath: "/icons/LearnNewWords.svg",
  },
  {
    name: "dictionary",
    label: "Practice with definitions",
    color: "bg-brown-500",
    hoverColor: "hover:bg-brown-600",
    iconPath: "/icons/DictionaryMode.svg",
  },
  {
    name: "translation",
    label: "Review with translations",
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-600",
    iconPath: "/icons/TranslationMode.svg",
  },
  {
    name: "spellingBee",
    label: "Perfect your spelling",
    color: "bg-magenta-500",
    hoverColor: "hover:bg-magenta-600",
    iconPath: "/icons/SpellingMode.svg",
  },
  {
    name: "visual",
    label: "Practice in Visual Mode",
    color: "bg-pink-500",
    hoverColor: "hover:bg-pink-600",
    iconPath: "/icons/VisualMode.svg",
  },
];

export default learningButtonConfig;
