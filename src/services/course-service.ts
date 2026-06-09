export type Course = {
  id: number;
  title: string;
  detail: string;
  date: string;
  view: number;
  picture: string;
};

type CourseResponse = {
  data: Course[];
};

export async function getCourses(): Promise<Course[]> {
  const response = await fetch("https://api.codingthailand.com/api/course");
  const json: CourseResponse = await response.json();
  return json.data;
}
