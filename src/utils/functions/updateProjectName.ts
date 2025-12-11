import { UPDATE_PROJECT_NAME_API_PATH } from "@/utils/data/global.constants";

export const updateProjectName = async (
  projectName: string
): Promise<{
  success: boolean;
  projectName?: string;
  error?: string;
}> => {
  try {
    const response = await fetch(UPDATE_PROJECT_NAME_API_PATH, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectName }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to update project name",
      };
    }

    return {
      success: true,
      projectName: data.projectName,
    };
  } catch (error) {
    console.error("Error updating project name:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
