import {
  AlternativeAnswers,
  SupportedLanguage,
} from "@linguardian/shared/contracts";
import ItemSection from "./ItemSection";
import Flag from "react-world-flags";
import { getFlagCodeFromLangCode } from "@/lib/utils";

type ItemAlternativeAnswersProps = { alternativeAnswers: AlternativeAnswers };

export default function ItemAlternativeAnswers({
    alternativeAnswers,
}: ItemAlternativeAnswersProps) {
    if (!alternativeAnswers) return null;

    const alternativesArray = Object.entries(alternativeAnswers) as [
        SupportedLanguage,
        string[]
    ][];

    return (
        <ItemSection title="Alternative Answers">
            {alternativesArray.map(([lang, altAnswers]) => (
                <div key={lang}>
                    {altAnswers.map((answer) => (
                        <div
                            key={lang + answer}
                            className="flex items-center gap-4"
                        >
                            <Flag
                                code={getFlagCodeFromLangCode(lang)}
                                className="size-10 rounded-full object-cover"
                            />
                            <div>{answer}</div>
                        </div>
                    ))}
                </div>
            ))}
        </ItemSection>
    );
}
