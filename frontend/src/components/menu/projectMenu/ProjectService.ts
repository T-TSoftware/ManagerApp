import axios from "../../../utils/axios";
import { Project } from "../../../types/project/Project";

export const getAllProjects = async (token: string): Promise<Project[]> => {
const res = await axios.get(`projects`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
return res.data;
};
