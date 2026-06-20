import { useState } from "react";
import axios from "axios";

function BulkUpload() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const upload = async () => {
    if (!file) {
      alert("Please select CSV file");
      return;
    }

    const data = new FormData();
    data.append("file", file);

    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/bulk-generate/${user.user_id}`,
        data
      );

      setResult(res.data);
      alert("Bulk certificates generated");
    } catch (err) {
      alert(err.response?.data?.detail || "Bulk upload failed");
      console.log(err);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Bulk Upload Students</h1>

        <p>Upload CSV file with student details.</p>

        <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />

        <button onClick={upload}>Upload & Generate</button>
        <button onClick={() => (window.location.href = "/dashboard")}>Back</button>

        {result && (
          <div className="result">
            <h2>{result.message}</h2>
            <p><b>Total:</b> {result.total}</p>

            {result.certificates.map((c, i) => (
              <div key={i} className="mini-card">
                <p>{c.student_email}</p>
                <p>Code: {c.certificate_code}</p>
                <a href={`http://127.0.0.1:8000/files/${c.pdf_file}`} target="_blank">
                  PDF
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BulkUpload;