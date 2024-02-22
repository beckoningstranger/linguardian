import fs from "fs";
import { parse } from "csv-parse";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import {
  PartOfSpeech,
  SupportedLanguage,
  Case,
  Gender,
  Frequency,
} from "../types.js";
import Items from "./item.schema.js";
import Lemmas from "./lemma.schema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface parsedData {
  name: string;
  language: SupportedLanguage;
  partOfSpeech: PartOfSpeech;
  lemma: string;
  case?: Case;
  gender?: Gender;
  pluralForm?: string;
  collocations?: string;
  frequency?: Frequency;
  tags?: string;
  tDE?: string;
  tEN?: string;
  tCN?: string;
  tFR?: string;
}

interface formattedParsedData {
  name: string;
  language: SupportedLanguage;
  partOfSpeech: PartOfSpeech;
  lemma: string[];
  case?: Case;
  gender?: Gender;
  pluralForm?: string;
  collocations?: string[];
  frequency?: Frequency;
  tags?: string[];
  translation: Partial<Record<SupportedLanguage, string[]>>;
}

export function parseCSV() {
  return new Promise<void>((resolve, reject) => {
    // Parse csv file and create all needed lemmas in MongoDB
    fs.createReadStream(join(__dirname + "../../../data/course_sheet.csv"))
      .pipe(parse({ columns: true, comment: "#" }))
      .on("data", async (data: parsedData) => {
        const formattedData: formattedParsedData = {
          name: data.name,
          language: data.language,
          partOfSpeech: data.partOfSpeech,
          case: data.case,
          gender: data.gender,
          pluralForm: data.pluralForm,
          frequency: data.frequency,
          tags: data.tags?.split(", "),
          lemma: data.lemma.split(", "),
          translation: {
            DE: data.tDE?.split(", "),
            FR: data.tFR?.split(", "),
            EN: data.tEN?.split(", "),
            CN: data.tCN?.split(", "),
          },
          // collocations: data.collocations?.split(", "),
        };

        await upsertLemmas(formattedData);
        await upsertTranslations(formattedData);
        await saveParsedItem(formattedData);
      })
      .on("error", (err) => {
        console.log(err);
      })
      .on("end", () => {
        resolve();
      });
  });
}

async function upsertLemmas(formattedData: formattedParsedData) {
  const lemmaObjectIds: any = [];
  const upsertLemmas = formattedData.lemma.map(async (lemma: string) => {
    try {
      await Lemmas.findOneAndUpdate(
        { name: lemma, language: formattedData.language },
        { $set: { name: lemma, language: formattedData.language } },
        { upsert: true, new: true }
      ).then((response) => {
        lemmaObjectIds.push(response?._id);
      });
    } catch (err) {
      console.error(`Error upserting lemma ${lemma}: ${err}`);
    }
  });
  await Promise.all(upsertLemmas);
  formattedData.lemma = lemmaObjectIds;
}

async function upsertTranslations(formattedData: formattedParsedData) {
  const translationObjectIds: any = { DE: [], EN: [], FR: [], CN: [] };

  interface translationItem {
    name: string;
    language: SupportedLanguage;
    partOfSpeech: PartOfSpeech;
  }

  let translationItems: translationItem[] = [];

  // Format translation as an array of items that we can then iterate over
  Object.entries(formattedData.translation).map((language) => {
    const [lang, items] = language;
    items.map((item) => {
      if (item.length > 0)
        translationItems.push({
          name: item,
          language: lang as SupportedLanguage,
          partOfSpeech: formattedData.partOfSpeech,
        });
    });
  });

  const upsertTranslations = translationItems.map(async (item) => {
    try {
      await Items.findOneAndUpdate(
        {
          name: item.name,
          language: item.language,
          partOfSpeech: item.partOfSpeech,
        },
        {
          $set: {
            name: item.name,
            language: item.language,
            partOfSpeech: item.partOfSpeech,
          },
        },
        { upsert: true, new: true }
      ).then((response) => {
        translationObjectIds[item.language].push(response?._id);
      });
    } catch (err) {
      console.error(`Error upserting ${item.name}: ${err}`);
    }
  });

  await Promise.all(upsertTranslations);
  formattedData.translation = translationObjectIds;
}

async function saveParsedItem(formattedData: formattedParsedData) {
  try {
    await Items.findOneAndUpdate(
      { name: formattedData.name, language: formattedData.language },
      {
        $set: { ...formattedData },
      },

      { upsert: true, new: true }
    ).then((response) => console.log("Uploaded", response.name));
  } catch (err) {
    console.error(`Error upserting ${formattedData.name}: ${err}`);
  }
}
