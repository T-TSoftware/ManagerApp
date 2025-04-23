
import { API_BASE_URL } from "../../../config/api";
import { Project } from "../../../types/project/Project";

const companyId = "a";

const headers = {
  Authorization:`Bearer ${companyId}`,
  "Content type": "application/json",
};

export const getAllProjects = async (): Promise<Project[]>  => {
 // const res = await fetch(`${API_BASE_URL}`,{headers});
  const res = await fetch(
    `https://68067be2e81df7060eb74dc3.mockapi.io/api/Projects`
  );
  console.log("response:",res.json)
  if(!res.ok) throw new Error("Fetch Error.")
  return res.json();
};
