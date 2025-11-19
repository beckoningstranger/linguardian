import { PartOfSpeech, SupportedLanguage } from "@/lib/contracts";
import { generateLearningStats } from "@/lib/utils/lists";

describe("generateLearningStats", () => {
  const mockItems = [
    {
      id: "item1",
      name: "Glas",
      normalizedName: "Glas",
      language: "DE" as SupportedLanguage,
      languageName: "German",
      flagCode: "DE",
      partOfSpeech: "noun" as PartOfSpeech,
      flags: [],
      slug: "DE-glas-noun",
      translations: { FR: ["verre"] },
    },
    {
      id: "item2",
      name: "Pferd",
      normalizedName: "Pferd",
      language: "DE" as SupportedLanguage,
      languageName: "German",
      flagCode: "DE",
      partOfSpeech: "noun" as PartOfSpeech,
      flags: [],
      slug: "DE-Pferd-noun",
      translations: { FR: ["cheval"] },
    },
    {
      id: "item3",
      name: "Maus",
      normalizedName: "Maus",
      language: "DE" as SupportedLanguage,
      languageName: "German",
      flagCode: "DE",
      partOfSpeech: "noun" as PartOfSpeech,
      flags: [],
      slug: "DE-maus-noun",
      translations: { FR: ["souris"] },
    },
    {
      id: "item4",
      name: "Katze",
      normalizedName: "Katze",
      language: "DE" as SupportedLanguage,
      languageName: "German",
      flagCode: "DE",
      partOfSpeech: "noun" as PartOfSpeech,
      flags: [],
      slug: "DE-katze-noun",
      translations: {},
    },
  ];

  const mockLearnedItems: { id: string; level: number; nextReview: number }[] =
    [];
  const ignoredItemIds: string[] = [];
  const userNativeCode: SupportedLanguage = "FR";

  it("counts all items as unlearned when user has no learned/ignored", () => {
    const result = generateLearningStats(
      mockItems,
      mockLearnedItems,
      ignoredItemIds,
      userNativeCode
    );
    expect(result).toEqual({
      readyToLearn: 3,
      readyForReview: 0,
      availableModesWithInfo: [
        { info: "3", mode: "learn", number: 3, overstudy: false },
      ],
      learned: 0,
      learning: 0,
      ignored: 0,
      recommendedModeWithInfo: {
        mode: "learn",
        number: 3,
        info: "3",
        overstudy: false,
      },
      nextReviewDueMessage: "",
    });
  });

  it("counts ignored items correctly", () => {
    const result = generateLearningStats(
      mockItems,
      [],
      ["item1", "item3"],
      userNativeCode
    );
    expect(result.ignored).toBe(2);
    expect(result.readyToLearn).toBe(1); // one item2 as item4 has no translations
  });

  it("counts readyForReview correctly", () => {
    const now = Date.now();
    const result = generateLearningStats(
      mockItems,
      [{ id: "item1", level: 4, nextReview: now - 1000 }],
      [],
      userNativeCode
    );
    expect(result.readyForReview).toBe(1);
    expect(result.readyToLearn).toBe(2); // items 2 + 3 (item4 excluded)
  });

  it("counts learned correctly (level >= 8, not ready)", () => {
    const now = Date.now();
    const result = generateLearningStats(
      mockItems,
      [{ id: "item1", level: 8, nextReview: now + 10000 }],
      [],
      userNativeCode
    );
    expect(result.learned).toBe(1);
    expect(result.readyToLearn).toBe(2); // items 2 + 3 (item4 excluded)
  });

  it("counts learning correctly (level < 8, not ready)", () => {
    const now = Date.now();
    const result = generateLearningStats(
      mockItems,
      [{ id: "item2", level: 5, nextReview: now + 10000 }],
      [],
      userNativeCode
    );
    expect(result.learning).toBe(1);
    expect(result.readyToLearn).toBe(2); // items 1 + 3 (item4 excluded)
  });
});
