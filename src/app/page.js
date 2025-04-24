"use client";

import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    degree: "",
    field: "",
    school: "",
    year: "",
    skills: "",
    experience: "",
    careerGoal: "",
  });

  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const requiredFields = [
      "name",
      "email",
      "degree",
      "field",
      "school",
      "year",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return false;
    }
    return true;
  };

  const generateResume = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate resume");
      }

      const data = await response.json();
      setResumeText(data.resume);
      alert("Resume generated successfully!");
    } catch (error) {
      alert("Error generating resume. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${formData.name.replace(/\s+/g, "_")}_resume.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      alert("PDF downloaded successfully!");
    } catch (error) {
      alert("Error downloading PDF. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
      <h1
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}
      >
        Auto Resume Generator
      </h1>

      <div
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          padding: "24px",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <input
            name="name"
            placeholder="Full Name *"
            onChange={handleChange}
            required
            style={{
              padding: "8px",
              border: "1px solid #e2e8f0",
              borderRadius: "4px",
            }}
          />
          <input
            name="email"
            placeholder="Email *"
            type="email"
            onChange={handleChange}
            required
            style={{
              padding: "8px",
              border: "1px solid #e2e8f0",
              borderRadius: "4px",
            }}
          />
          <input
            name="phone"
            placeholder="Phone Number"
            type="tel"
            onChange={handleChange}
            style={{
              padding: "8px",
              border: "1px solid #e2e8f0",
              borderRadius: "4px",
            }}
          />
          <input
            name="linkedin"
            placeholder="LinkedIn URL"
            type="url"
            onChange={handleChange}
            style={{
              padding: "8px",
              border: "1px solid #e2e8f0",
              borderRadius: "4px",
            }}
          />
          <input
            name="github"
            placeholder="GitHub URL"
            type="url"
            onChange={handleChange}
            style={{
              padding: "8px",
              border: "1px solid #e2e8f0",
              borderRadius: "4px",
            }}
          />
          <input
            name="degree"
            placeholder="Degree *"
            onChange={handleChange}
            required
            style={{
              padding: "8px",
              border: "1px solid #e2e8f0",
              borderRadius: "4px",
            }}
          />
          <input
            name="field"
            placeholder="Field of Study *"
            onChange={handleChange}
            required
            style={{
              padding: "8px",
              border: "1px solid #e2e8f0",
              borderRadius: "4px",
            }}
          />
          <input
            name="school"
            placeholder="University / School *"
            onChange={handleChange}
            required
            style={{
              padding: "8px",
              border: "1px solid #e2e8f0",
              borderRadius: "4px",
            }}
          />
          <input
            name="year"
            placeholder="Graduation Year *"
            type="number"
            onChange={handleChange}
            required
            style={{
              padding: "8px",
              border: "1px solid #e2e8f0",
              borderRadius: "4px",
            }}
          />
          <textarea
            name="skills"
            placeholder="Skills (comma separated)"
            onChange={handleChange}
            style={{
              padding: "8px",
              border: "1px solid #e2e8f0",
              borderRadius: "4px",
              minHeight: "100px",
            }}
          />
          <textarea
            name="experience"
            placeholder="Work Experience (short summary)"
            onChange={handleChange}
            style={{
              padding: "8px",
              border: "1px solid #e2e8f0",
              borderRadius: "4px",
              minHeight: "100px",
            }}
          />
          <textarea
            name="careerGoal"
            placeholder="Career Goal"
            onChange={handleChange}
            style={{
              padding: "8px",
              border: "1px solid #e2e8f0",
              borderRadius: "4px",
              minHeight: "100px",
            }}
          />
          <button
            onClick={generateResume}
            disabled={loading}
            style={{
              padding: "8px 16px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Generating..." : "Generate Resume"}
          </button>
        </div>
      </div>

      {resumeText && (
        <div
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "24px",
            marginTop: "24px",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              marginBottom: "16px",
            }}
          >
            Generated Resume:
          </h2>
          <pre
            style={{
              backgroundColor: "#f8fafc",
              padding: "16px",
              borderRadius: "4px",
              whiteSpace: "pre-wrap",
            }}
          >
            {resumeText}
          </pre>
          <button
            onClick={downloadPDF}
            style={{
              padding: "8px 16px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              marginTop: "16px",
              cursor: "pointer",
            }}
          >
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
}
