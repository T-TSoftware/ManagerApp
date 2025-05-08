import React from "react";
import { useProjectForm } from "./hook";
import { useForm } from "react-hook-form";
import { ProjectFormValues } from "./types";

const ProjectForm: React.FC = () => {
  const { defaultValues, loading, onSubmit, isEdit } = useProjectForm();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    defaultValues,
    mode: "onChange",
  });

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-3xl mx-auto mt-10 p-6 bg-white dark:bg-tertiary rounded-lg shadow-md"
    >
      <h1 className="text-2xl font-bold mb-4">
        {isEdit ? "Proje Detayları" : "Proje Yarat"}
      </h1>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Proje Adı
        </label>
        <input
          {...register("name", { required: "Bu alan zorunludur." })}
          className="mt-1 block w-full p-2 border rounded-md"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Şantiye
        </label>
        <input
          {...register("site", { required: "Bu alan zorunludur." })}
          className="mt-1 block w-full p-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Durum</label>
        <select
          {...register("status")}
          className="mt-1 block w-full p-2 border rounded-md"
        >
          <option value="planned">Planned</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tahmini Başlangıç
          </label>
          <input
            type="date"
            {...register("estimatedStartDate")}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gerçek Başlangıç
          </label>
          <input
            type="date"
            {...register("actualStartDate")}
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tahmini Bitiş
          </label>
          <input
            type="date"
            {...register("estimatedEndDate")}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gerçek Bitiş
          </label>
          <input
            type="date"
            {...register("actualEndDate")}
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        {isEdit ? "Projeyi Güncelle" : "Proje Oluştur"}
      </button>
    </form>
  );
};

export default ProjectForm;
