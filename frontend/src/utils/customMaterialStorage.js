const STORAGE_KEY = "eduvault_custom_materials";

export const getCustomMaterials = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error("Error reading custom materials from localStorage:", err);
    return {};
  }
};

export const getCustomMaterial = (subjectCode, resourceType, unitNumber = "") => {
  const materials = getCustomMaterials();
  const key = `${(subjectCode || "").toUpperCase()}_${resourceType}_${unitNumber}`;
  return materials[key] || null;
};

export const saveCustomMaterial = (subjectCode, resourceType, materialData, unitNumber = "") => {
  try {
    const materials = getCustomMaterials();
    const key = `${(subjectCode || "").toUpperCase()}_${resourceType}_${unitNumber}`;
    materials[key] = materialData;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(materials));
    return materialData;
  } catch (err) {
    console.error("Error saving custom material to localStorage:", err);
    return materialData;
  }
};
