import { SERVER } from "@/lib/constants";
import {
  ApiResponse,
  CreateItemParams,
  FetchItemIdBySlugParams,
  ItemData,
  itemDataSchema,
  itemIdResponseSchema,
  ItemWithPopulatedTranslations,
  MessageWithItemInfoResponse,
  messageWithItemInfoResponseSchema,
  MessageWithSlugResponse,
  messageWithSlugResponseSchema,
} from "@/lib/contracts";
import { itemTag } from "@/lib/utils";
import { handleApiCall, handleApiCallWithAuth } from "@/lib/utils/api";
import z from "zod";

// GET

export async function fetchItemBySlug({
  itemSlug,
}: FetchItemIdBySlugParams): Promise<ApiResponse<ItemData>> {
  const response = await handleApiCall(
    () => fetch(`${SERVER}/items/id/${itemSlug}`),
    itemIdResponseSchema
  );
  if (!response.success) return response;

  const itemId = response.data;
  return fetchItemById(itemId);
}

export async function fetchMultipleItemsBySlug(
  slugs: string[]
): Promise<ItemWithPopulatedTranslations[]> {
  const itemPromises = slugs.map(
    async (itemSlug) => await fetchItemBySlug({ itemSlug })
  );

  const itemResponses = await Promise.all(itemPromises);
  const items: ItemWithPopulatedTranslations[] = [];

  itemResponses.forEach((response) => {
    if (response.success) items.push(response.data);
  });

  return items;
}

export async function fetchItemById(itemId: string) {
  return handleApiCall(
    () =>
      fetch(`${SERVER}/items/${itemId}`, {
        next: {
          tags: [itemTag(itemId)],
        },
      }),
    itemDataSchema
  );
}

export async function fetchMultipleItemsById(
  ids: string[]
): Promise<ItemWithPopulatedTranslations[]> {
  const itemPromises = ids.map(async (id) => await fetchItemById(id));

  const response = await Promise.all(itemPromises);
  const items: ItemWithPopulatedTranslations[] = [];

  response.forEach((response) => {
    if (response.success) items.push(response.data);
  });

  return items;
}

// POST

export async function createItem(
  params: CreateItemParams
): Promise<ApiResponse<MessageWithItemInfoResponse | MessageWithSlugResponse>> {
  const url = `${SERVER}/items/create`;

  const response = await handleApiCallWithAuth(
    (headers) =>
      fetch(url, {
        headers: { ...headers, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(params),
      }),
    z.union([messageWithItemInfoResponseSchema, messageWithSlugResponseSchema])
  );

  return response;
}

// PATCH

export async function updateItem(
  item: ItemWithPopulatedTranslations
): Promise<ApiResponse<MessageWithItemInfoResponse | MessageWithSlugResponse>> {
  const url = `${SERVER}/items/${item.id}`;

  return await handleApiCallWithAuth(
    (headers) =>
      fetch(url, {
        headers: { ...headers, "Content-Type": "application/json" },
        method: "PATCH",
        body: JSON.stringify(item),
      }),
    z.union([messageWithItemInfoResponseSchema, messageWithSlugResponseSchema])
  );
}
