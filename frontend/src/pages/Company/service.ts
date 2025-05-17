import { BoldIcon } from "@heroicons/react/24/outline";
import { API_BASE_URL } from "../../config/api";
import { CompanyFormValues } from "./types";

export const getCompanyById = async (
  id: string
): Promise<CompanyFormValues> => {
  const res = await fetch(`${API_BASE_URL}company/${id}`);
  if (!res.ok) throw new Error("Proje alınamadı.");
  return res.json();
};

export const createCompany = async (company: CompanyFormValues, token: string) => {
  const res = await fetch(`${API_BASE_URL}company`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(company),
  });
  console.log("body", JSON.stringify(company));
  if (!res.ok) throw new Error("Proje oluşturulamadı.");
  return res.json();
};

export const updateCompany = async (id: string, company: CompanyFormValues) => {
  const res = await fetch(`${API_BASE_URL}company/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(company),
  });
  if (!res.ok) throw new Error("Proje güncellenemedi.");
  return res.json();
};
