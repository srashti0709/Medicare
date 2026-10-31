const axios = require("axios");

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";


const predictDiabetes = async (patientData) => {

  try {

    const response = await axios.post(
      `${AI_SERVICE_URL}/api/diabetes/predict`,
      patientData
    );

    return response.data;

  } catch (error) {

    console.error(
      "AI Service Error:",
      error.response?.data || error.message
    );

    throw new Error("AI prediction service is unavailable");
  }
};
const predictKidneyDisease = async (patientData) => {
  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/api/kidney/predict`,
      patientData
    );

    return response.data;
  } catch (error) {
    console.error(
      "AI Kidney Service Error:",
      error.response?.data || error.message
    );

    throw new Error("AI kidney prediction service is unavailable");
  }
};


module.exports = {
  predictDiabetes,
  predictKidneyDisease
};