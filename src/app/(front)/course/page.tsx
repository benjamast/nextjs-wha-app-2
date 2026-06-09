import FeaturesCourse from "@/components/features-course";
import { getCourses } from "@/lib/api/course";
import { connection } from "next/server";

// http://localhost:3000/course
export default async function CoursePage() {
  await connection();
  const courses = await getCourses();

  return (
    <main>
      {courses.length > 0 && <FeaturesCourse courses={courses} />}
    </main>
  );
}