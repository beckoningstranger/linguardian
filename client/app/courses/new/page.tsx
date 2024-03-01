import axios from "axios";

export default function CreateCourse() {
  const uploadFile = async (formData: FormData) => {
    "use server";
    await axios.post("http://localhost:8000/courses/uploadCSV", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  return (
    <div>
      <p>Here, you can upload CSVs to create courses</p>
      <form action={uploadFile}>
        <input type="file" name="csvfile" accept=".csv" />
        <button type="submit">Upload file</button>
      </form>
    </div>
  );
}
