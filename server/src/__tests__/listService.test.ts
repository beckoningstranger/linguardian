import * as listsService from "@/services/lists";

// Service-layer modules that expose findUser, findAuthors, findPopulatedListByListNumber

import * as userRepo from "@/repositories/user.repo";
import * as listRepo from "@/repositories/list.repo";

// Tell Jest to mock those modules
jest.mock("@/repositories/user.repo");
jest.mock("@/repositories/list.repo");

describe("ListOverviewDataService", () => {
  const mockUser = {
    id: "user123",
    native: { code: "EN" },
    learnedLists: { EN: [42] },
    learnedLanguages: [{ code: "EN" }],
    learnedItems: {
      EN: [{ id: "item1", level: 8, nextReview: Date.now() - 1000 }],
    },
    ignoredItems: { EN: ["item2"] },
  };

  const mockList = {
    listNumber: 42,
    language: { code: "EN", flag: "EN", name: "English" },
    authors: ["user123"],
    units: [
      { item: { id: "item1", translations: { EN: ["Glass"] } } },
      { item: { id: "item2", translations: { EN: ["Horse"] } } },
    ],
    unitOrder: ["Unit 1", "Unit 2"],
  };

  const mockAuthorData = [{ username: "jan", usernameSlug: "jan-eisen" }];

  it("returns correct list overview data", async () => {
    (userRepo.findUser as jest.Mock).mockResolvedValue({
      success: true,
      data: mockUser,
    });

    (listRepo.findPopulatedListByListNumber as jest.Mock).mockResolvedValue({
      success: true,
      data: mockList,
    });

    (userRepo.findAuthors as jest.Mock).mockResolvedValue({
      success: true,
      data: mockAuthorData,
    });

    const result = await listsService.ListOverviewDataService(
      { listNumber: 42 },
      "user123"
    );

    expect(result.userIsAuthor).toBe(true);
    expect(result.userIsLearningThisList).toBe(true);
    expect(result.userIsLearningListLanguage).toBe(true);
    expect(result.learnedItemIds).toEqual(["item1"]);
    expect(result.ignoredItemIds).toEqual(["item2"]);
    expect(result.authorData).toEqual(mockAuthorData);

    expect(result.learningStats).toMatchObject({
      readyToLearn: 0,
      readyForReview: 1,
      availableModesWithInfo: [
        {
          info: "1",
          mode: "translation",
          number: 1,
          overstudy: false,
        },
      ],
      learned: 0,
      learning: 0,
      ignored: 1,
      recommendedModeWithInfo: {},
      nextReviewDueMessage: "",
    });
  });
});
