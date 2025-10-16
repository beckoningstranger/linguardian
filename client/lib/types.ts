import { ApiResponse } from "@/lib/contracts";

export type StringOrPickOne = string | "Pick one...";
export type Label = { singular: string; plural: string };
export type SearchMode =
  | "searchResultIsLinkToItemPage"
  | "searchResultIsTranslation"
  | "searchResultWillBeAddedToList";

/** List Actions */
export type ApiCall<T> = () => Promise<ApiResponse<T>>;
export type OnSuccessfulApiCall<T> = (data: T) => void | Promise<void>;
export type executeActionParams<T> = {
  apiCall: ApiCall<T>;
  onSuccess?: OnSuccessfulApiCall<T>;
};

/** ------------------------- Miscellaneous -------------------------*/
/** Remember that types.ts on backend and frontend are de-coupled */
