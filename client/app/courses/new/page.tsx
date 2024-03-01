import axios from "axios";

export default function CreateCourse() {
  const uploadFile = async (formData: FormData) => {
    "use server";
    await axios.post("http://localhost:8000/lists/uploadCSV", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl text-center font-bold m-4">
        Here, you can upload CSVs to create courses
      </h1>
      <form
        action={uploadFile}
        className="flex flex-col text-center gap-3 bg-slate-300"
      >
        <label htmlFor="csvfile">Upload a CSV file</label>
        <input
          type="file"
          name="csvfile"
          id="csvfile"
          accept=".csv"
          className="p-3"
          required
        />
        <label htmlFor="listName">Enter a list name</label>
        <input
          type="text"
          id="listName"
          name="listName"
          placeholder="List Name"
          className="text-center"
          required
        />
        <label htmlFor="language">What language are you trying to learn?</label>
        <select id="language" name="language" required className="text-center">
          <option value="DE">German</option>
          <option value="EN">English</option>
          <option value="FR">French</option>
          <option value="CN">Mandarin Chinese</option>
        </select>
        {/* need to pass relevant information about author so the backend can identify user*/}
        <input type="hidden" name="author" value="Joe" />
        <button
          type="submit"
          className="border-2 border-black rounded p-3 m-2 hover:bg-slate-500 hover:text-white"
        >
          Create new course
        </button>
      </form>
    </div>
  );
}
