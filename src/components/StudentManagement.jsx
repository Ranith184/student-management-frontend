import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ id: "", firstName: "", lastName: "", email: "" });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchId, setSearchId] = useState("");

  const fetchStudents = async () => {
    const res = await axios.get("/api/students");
    setStudents(res.data);
  };

  const getStudentDetails = async (id) => {
    try {
      const res = await axios.get(`/api/students/${id}`);
      setSelectedStudent(res.data);
    } catch (err) {
      alert("Student not found");
      setSelectedStudent(null);
    }
  };

  const deleteStudentById = async (id) => {
    try {
      await axios.delete(`/api/students/${id}`);
      fetchStudents();
      if (selectedStudent && selectedStudent.id === id) setSelectedStudent(null);
    } catch (err) {
      alert("Failed to delete student");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.id) {
      await axios.put(`/api/students/${formData.id}`, formData);
    } else {
      await axios.post("/api/students", formData);
    }
    setFormData({ id: "", firstName: "", lastName: "", email: "" });
    fetchStudents();
    setSelectedStudent(null);
  };

  const handleEdit = (student) => {
    setFormData(student);
    setSelectedStudent(null);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/students/${id}`);
    fetchStudents();
    if (selectedStudent && selectedStudent.id === id) setSelectedStudent(null);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Student Management System</h1>

      <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
        <button onClick={fetchStudents} className="bg-blue-500 text-white px-4 py-2 rounded">Get All Students</button>
        <input
          placeholder="Enter Student ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="border p-2 rounded"
        />
        <button onClick={() => getStudentDetails(searchId)} className="bg-green-500 text-white px-4 py-2 rounded">Get Details</button>
        <button onClick={() => deleteStudentById(searchId)} className="bg-red-500 text-white px-4 py-2 rounded">Delete Student</button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required className="border p-2 rounded" />
        <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required className="border p-2 rounded" />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="border p-2 rounded" />
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">{formData.id ? "Update" : "Add"}</button>
      </form>

      {selectedStudent && (
        <div className="mb-4 bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Student Details</h2>
          <p><strong>ID:</strong> {selectedStudent.id}</p>
          <p><strong>Name:</strong> {selectedStudent.firstName} {selectedStudent.lastName}</p>
          <p><strong>Email:</strong> {selectedStudent.email}</p>
        </div>
      )}

      <div className="grid gap-4">
        {students.map((student) => (
          <div key={student.id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <p><strong>{student.firstName} {student.lastName}</strong></p>
              <p className="text-sm text-gray-500">{student.email}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => getStudentDetails(student.id)} className="bg-gray-200 px-3 py-1 rounded">Details</button>
              <button onClick={() => handleEdit(student)} className="bg-yellow-400 text-white px-3 py-1 rounded">Edit</button>
              <button onClick={() => handleDelete(student.id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}