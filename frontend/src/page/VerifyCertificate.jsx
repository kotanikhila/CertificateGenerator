import { useState } from "react";
import axios from "axios";

function VerifyCertificate() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);

  const verify = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/verify/${code}`);
      setResult(res.data);
    } catch (err) {
      alert("Invalid certificate code");
      setResult(null);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Verify Certificate</h1>

        <input
          placeholder="Enter Verification Code"
          onChange={(e) => setCode(e.target.value)}
        />

        <button onClick={verify}>Verify</button>
        <button onClick={() => (window.location.href = "/dashboard")}>Back</button>

        {result && (
          <div className="result">
            <h2>{result.status}</h2>
            <p><b>Name:</b> {result.student_name}</p>
            <p><b>Email:</b> {result.student_email}</p>
            <p><b>Achievement:</b> {result.achievement}</p>
            <p><b>Event:</b> {result.event_name}</p>
            <p><b>Organization:</b> {result.organization_name}</p>
            <p><b>Details:</b> {result.course_details}</p>
            <p><b>Expiry:</b> {result.expiry_date}</p>

            <a href={result.download_url} target="_blank">
              Download Certificate
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyCertificate;