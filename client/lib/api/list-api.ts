import { SERVER } from "@/lib/constants";
import {
  AddItemToUnitUpdate,
  AddUnitUpdate,
  ApiResponse,
  CreateListSuccessResponse,
  createListSuccessResponseSchema,
  ListDetailsUpdate,
  MessageResponse,
  messageResponseSchema,
  UnitNameUpdate,
  UnitOrderUpdate,
} from "@/lib/contracts";
import { handleApiCallWithAuth } from "@/lib/utils";

// POST

export async function createList(
  formData: FormData
): Promise<ApiResponse<CreateListSuccessResponse>> {
  const url = `${SERVER}/lists/create`;

  return await handleApiCallWithAuth(
    (headers) =>
      fetch(url, {
        headers,
        method: "POST",
        body: formData,
      }),
    createListSuccessResponseSchema
  );
}

export async function uploadCSVFile(
  formData: FormData,
  listNumber: number
): Promise<ApiResponse<CreateListSuccessResponse>> {
  const url = `${SERVER}/lists/expandWithCSV/${listNumber}`;

  return await handleApiCallWithAuth(
    (headers) =>
      fetch(url, {
        headers,
        method: "POST",
        body: formData,
      }),
    createListSuccessResponseSchema
  );
}

export async function createUnit(
  update: AddUnitUpdate,
  listNumber: number
): Promise<ApiResponse<MessageResponse>> {
  const url = `${SERVER}/lists/${listNumber}/units`;

  return await handleApiCallWithAuth(
    (headers) =>
      fetch(url, {
        headers: { ...headers, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(update),
      }),
    messageResponseSchema
  );
}

// PATCH

export async function updateListDetails(
  update: ListDetailsUpdate,
  listNumber: number
): Promise<ApiResponse<MessageResponse>> {
  const url = `${SERVER}/lists/${listNumber}`;

  return await handleApiCallWithAuth(
    (headers) =>
      fetch(url, {
        method: "PATCH",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(update),
      }),
    messageResponseSchema
  );
}

export async function updateUnitOrder(
  update: UnitOrderUpdate,
  listNumber: number
): Promise<ApiResponse<MessageResponse>> {
  const url = `${SERVER}/lists/${listNumber}/units/order`;

  return await handleApiCallWithAuth(
    (headers) =>
      fetch(url, {
        method: "PATCH",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(update),
      }),
    messageResponseSchema
  );
}

export async function updateUnitName(
  update: UnitNameUpdate,
  listNumber: number
): Promise<ApiResponse<MessageResponse>> {
  const url = `${SERVER}/lists/${listNumber}/units`;

  return await handleApiCallWithAuth(
    (headers) =>
      fetch(url, {
        method: "PATCH",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(update),
      }),
    messageResponseSchema
  );
}

export async function addItemToUnit(
  listNumber: number,
  update: AddItemToUnitUpdate
): Promise<ApiResponse<MessageResponse>> {
  const url = `${SERVER}/lists/${listNumber}/units/items`;

  return await handleApiCallWithAuth(
    (headers) =>
      fetch(url, {
        method: "PATCH",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(update),
      }),
    messageResponseSchema
  );
}

// DELETE

export async function deleteList(
  listNumber: number
): Promise<ApiResponse<MessageResponse>> {
  const url = `${SERVER}/lists/${listNumber}`;

  return await handleApiCallWithAuth(
    (headers) => fetch(url, { headers, method: "DELETE" }),
    messageResponseSchema
  );
}

export async function deleteUnit(
  unitName: string,
  listNumber: number
): Promise<ApiResponse<MessageResponse>> {
  const encodedUnitName = encodeURIComponent(unitName);
  const url = `${SERVER}/lists/${listNumber}/units/${encodedUnitName}`;

  return await handleApiCallWithAuth(
    (headers) => fetch(url, { headers, method: "DELETE" }),
    messageResponseSchema
  );
}

export async function deleteItemFromList(
  itemId: string,
  listNumber: number
): Promise<ApiResponse<MessageResponse>> {
  const url = `${SERVER}/lists/${listNumber}/item/${itemId}`;

  return await handleApiCallWithAuth(
    (headers) => fetch(url, { headers, method: "DELETE" }),
    messageResponseSchema
  );
}
