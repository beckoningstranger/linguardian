interface ShowCourseProps {
  params: {
    courseId: string;
  };
}

export default function ShowCourse({ params: { courseId } }: ShowCourseProps) {
  return `You are looking for course ${courseId}`;
}
