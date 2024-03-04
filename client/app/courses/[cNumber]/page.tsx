import DashboardContainer from "@/components/DashboardContainer";
import TopMenu from "@/components/Menus/TopMenu/TopMenu";
import { PopulatedList } from "@/types";
import axios from "axios";
import Link from "next/link";

interface ShowCourseProps {
  params: {
    cNumber: string;
  };
}

export default async function ShowCoursePage({
  params: { cNumber },
}: ShowCourseProps) {
  const courseNumber = parseInt(cNumber);

  async function getCourseData(courseNumber: number) {
    "use server";
    try {
      return await axios.get<PopulatedList>(
        `http://localhost:8000/lists/get/${courseNumber}`
      );
    } catch (err) {
      console.error(`Error fetching course number ${courseNumber}: ${err}`);
    }
  }

  const courseData = await getCourseData(courseNumber);
  if (courseData) {
    const { name, listNumber, description, authors, units } = courseData.data;
    const renderedItems = units?.map((item) => (
      <div key={item.language + item.name}>{item.name}</div>
    ));
    return (
      <>
        <TopMenu />
        <div className="mt-24 mx-10">
          <h1>{name}</h1>
          <h5>by {authors}</h5>
          <h3>{description}</h3>
          <div>{renderedItems}</div>
        </div>
      </>
    );
  }

  return (
    <div>
      <TopMenu />
      <DashboardContainer>
        <h1>Course not found</h1>
        <p>This course does not exist yet. </p>
        <div>
          <Link href="/">Back to Dashboard</Link>{" "}
          <Link href="/courses">Course Store</Link>
        </div>
      </DashboardContainer>
    </div>
  );
}
