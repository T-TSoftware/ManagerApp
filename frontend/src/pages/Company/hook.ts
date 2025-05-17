import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCompanyById, createCompany, updateCompany } from "./service";
import { CompanyFormValues } from "./types";
import { getToken } from "../../utils/token";

export const useCompanyForm = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(companyId);
  const token = getToken();

  const [defaultValues, setDefaultValues] = useState<CompanyFormValues>({
    name: "",
    site: "",
    status: "planned",
    estimatedStartDate: "",
    actualStartDate: "",
    estimatedEndDate: "",
    actualEndDate: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isEdit && companyId ) {
      getCompanyById(companyId)
        .then(setDefaultValues)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isEdit, companyId]);

  const onSubmit = async (data: CompanyFormValues) => {
    if (!token) return;
    if (isEdit && companyId) {
      await updateCompany(companyId, data);
    } else  {
      await createCompany(data, token);
    }
    navigate("/admin-dashboard");
  };

  return { defaultValues, loading, onSubmit, isEdit };
};
