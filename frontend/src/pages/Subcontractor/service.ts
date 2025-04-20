import { API_BASE_URL } from "../../config/api";
import { SubcontractorRows } from "./subcontractor.types";

export const getAllSubcontractorByProject = async (companyId:string): Promise<SubcontractorRows[]> => {
  const res = await fetch(
    `${API_BASE_URL}projects/a085fa43-a0cc-4c7b-86b0-e4f332109ba3/subcontractor`,
    {
      headers: {
        Authentication: `Bearer ${companyId}`,
        "Content type": "application/json",
      },
    }
  );
  if (!res.ok) throw new Error("Fetch Error");
  return res.json();
};