import { useState } from "react";
import axios from "axios";

function GenerateCertificate() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    student_name: "",
    student_email: "",
    achievement: "",
    event_name: "",
    organization_name: "",
    course_details: "",
    template_name: "Template 1",
    font_size: 20,
    font_style: "Helvetica",
    expiry_date: "",
  });

  const [result, setResult] = useState(null);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generate = async () => {
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/generate-certificate/${user.user_id}`,
        form
      );
      setResult(res.data);
      alert("Certificate generated successfully");
    } catch (err) {
      alert(err.response?.data?.detail || "Certificate generation failed");
      console.log(err);
    }
  };

  return (
    <div className="page">
      <div className="card large-card">
        <h1>Generate Certificate</h1>

        <input name="student_name" placeholder="Student Name" onChange={change} />
        <input name="student_email" placeholder="Student Email" onChange={change} />
        <input name="achievement" placeholder="Achievement" onChange={change} />
        <input name="event_name" placeholder="Event / Course Name" onChange={change} />
        <input name="organization_name" placeholder="Organization Name" onChange={change} />
        <textarea name="course_details" placeholder="Course / Event Details" onChange={change} />

        <select name="template_name" onChange={change}>
          <option value="Template 1">Blue Border Template</option>
          <option value="Template 2">Green Border Template</option>
          <option value="Template 3">Red Border Template</option>
        </select>

        <input name="font_size" type="number" value={form.font_size} onChange={change} />

        <select name="font_style" onChange={change}>
          <option value="Helvetica">Helvetica</option>
          <option value="Times-Roman">Times Roman</option>
          <option value="Courier">Courier</option>
        </select>

        <input name="expiry_date" placeholder="Expiry Date YYYY-MM-DD" onChange={change} />

        <button onClick={generate}>Generate & Email</button>
        <button onClick={() => (window.location.href = "/dashboard")}>Back</button>

        {result && (
          <div className="result">
            <h2>Certificate Created</h2>
            <p><b>Code:</b> {result.certificate_code}</p>
            <p><b>Email Sent:</b> {String(result.email_sent)}</p>

            <a href={`http://127.0.0.1:8000/files/${result.pdf_file}`} target="_blank">
              Download Certificate PDF
            </a>

            <br /><br />

            <a href={`http://127.0.0.1:8000/files/${result.qr_file}`} target="_blank">
              Open QR Code
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default GenerateCertificate;