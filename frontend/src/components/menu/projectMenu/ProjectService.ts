import { API_BASE_URL } from "../../../config/api";
import { Project } from "../../../types/project/Project";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3MjkwMWU0ZC02ZTk0LTQxYmUtODM3NC05OWJlNDliMTgxY2IiLCJjb21wYW55SWQiOiIzZTZlZDFhNC1jNWFhLTRjOTctYTYwMy05Yjk4MDZkMzI4N2IiLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc0NTQ0MjI2MywiZXhwIjoxNzQ1NDQ5NDYzfQ.c2KIzrcq1zTdk3rT8LC01TXaLZGSmQOAt_aWfV9hPD4";

const headers = {
  Authorization: `Bearer ${token}`,
};

export const getAllProjects = async (): Promise<Project[]> => {
  const res = await fetch(`${API_BASE_URL}projects`, { headers });
  console.log("response:", res.json);
  if (!res.ok) throw new Error("Fetch Error.");
  return res.json();
};
