"use server";

import axios, { AxiosError } from "axios";
import { redirect } from "next/navigation";

export async function uploadCSV(
  formState: { message: string },
  formData: FormData
) {
  let newListNumber = 0;
  try {
    const { data } = await axios.post(
      "http://localhost:8000/lists/uploadCSV",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    newListNumber = data.message as number;
  } catch (err) {
    if (err instanceof AxiosError) {
      return { message: err.response?.data.message };
    } else return { message: "Something went wrong" };
  }
  redirect(`/lists/${newListNumber}`);
}
