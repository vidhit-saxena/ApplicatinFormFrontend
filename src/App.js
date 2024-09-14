import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function ApplicationForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    dob: '',
    qualification: '',
    collegeName: '',
    email: '',
    phone: '',
    pinCode: '',
    fatherName: '',
    fatherPhone: '',
    careerGoal: '',
    registrationProof: null,
    teamMembersCount: 0,
    teamMembers: [],
  });

  // Handle changes in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle team members' input changes
  const handleTeamMemberChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMembers = [...formData.teamMembers];
    updatedMembers[index] = { ...updatedMembers[index], [name]: value };
    setFormData({ ...formData, teamMembers: updatedMembers });
  };

  // Handle number of team members selected
  const handleTeamMembersCountChange = (e) => {
    const count = parseInt(e.target.value);
    setFormData({
      ...formData,
      teamMembersCount: count,
      teamMembers: Array(count).fill({
        name: '',
        gender: '',
        dob: '',
        email: '',
        address: '',
        pinCode: '',
      }),
    });
  };

  

  // Function to handle file upload to Cloudinary
  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('upload_preset', 'ApplicationForm'); // Replace with your Cloudinary upload preset
      uploadData.append('cloud_name', 'dexvwh9rm'); // Replace with your Cloudinary cloud name

      try {
        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/dexvwh9rm/image/upload',
          uploadData
        );
        const imageUrl = response.data.secure_url;

        // Update form data with Cloudinary URL
        setFormData((prevState) => ({
          ...prevState,
          cloudinaryUrl: imageUrl
        }));

        console.log('Image uploaded successfully: ', imageUrl);
      } catch (error) {
        if (error.response) {
          // The request was made, but the server responded with a status code that falls out of the range of 2xx
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          console.error('Error response headers:', error.response.headers);
        } else if (error.request) {
          // The request was made, but no response was received
          console.error('Error request data:', error.request);
        } else {
          // Something happened in setting up the request that triggered an error
          console.error('Error message:', error.message);
        }
        console.error('Error config:', error.config);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('fullName', formData.fullName);
    formDataToSend.append('gender', formData.gender);
    formDataToSend.append('dob', formData.dob);
    formDataToSend.append('qualification', formData.qualification);
    formDataToSend.append('collegeName', formData.collegeName);
    formDataToSend.append('email', formData.email.toString);
    formDataToSend.append('phone', formData.phone.toString);
    formDataToSend.append('pinCode', formData.pinCode);
    formDataToSend.append('fatherName', formData.fatherName);
    formDataToSend.append('fatherPhone', formData.fatherPhone);
    formDataToSend.append('careerGoal', formData.careerGoal);
    formDataToSend.append('teamMembersCount', formData.teamMembersCount);
    formDataToSend.append('registrationProof', formData.registrationProof);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/applications/submit',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      alert('Application submitted successfully!');

      // Reset form fields after successful submission
      setFormData({
        fullName: '',
        gender: '',
        dob: '',
        qualification: '',
        collegeName: '',
        email: '',
        phone: '',
        pinCode: '',
        fatherName: '',
        fatherPhone: '',
        careerGoal: '',
        registrationProof: null,
        teamMembersCount: 0,
        teamMembers: [],
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="form-container">
      <h2>Application Form</h2>
      <form onSubmit={handleSubmit} className="application-form">
        {/* Main Application Form Fields */}
        <label>Full Name:</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Enter full name"
          required
        />

        <label>Gender:</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Female">Other</option>
        </select>

        <label>Date of Birth:</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
        />
        <label>Current Education Qualification:</label>
        <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} placeholder="Enter Qualification" required />

        <label>College Name:</label>
        <input type="text" name="collegeName" value={formData.collegeName} onChange={handleChange} placeholder="Enter College Name" required />

        <label>Email Address:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter Email" required />

        <label>Phone Number:</label>
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter Phone Number" required />

        <label>Pin Code:</label>
        <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} placeholder="Enter Pin Code" required />

        <label>Father's Name:</label>
        <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="Enter Father's Name" required />

        <label>Father's Phone Number:</label>
        <input type="tel" name="fatherPhone" value={formData.fatherPhone} onChange={handleChange} placeholder="Enter Father's Phone" required />

        <label>What are your career goals?</label>
        <textarea name="careerGoal" value={formData.careerGoal} onChange={handleChange} placeholder="Describe your career goals" required />

        <label>Number of Team Members (Max 7):</label>
        <select name="teamMembersCount" value={formData.teamMembersCount} onChange={handleTeamMembersCountChange}>
          <option value="">Select Number of Members</option>
          {[...Array(7)].map((_, index) => (
            <option key={index} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>

        {formData.teamMembersCount > 0 &&
          formData.teamMembers.map((member, index) => (
            <div key={index} className="team-member-section">
              <h3>Team Member {index + 1}</h3>
              <label>Name:</label>
              <input type="text" name="name" value={member.name} onChange={(e) => handleTeamMemberChange(index, e)} placeholder="Enter Name" required />

              <label>Gender:</label>
              <select name="gender" value={member.gender} onChange={(e) => handleTeamMemberChange(index, e)} required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <label>Date of Birth:</label>
              <input type="date" name="dob" value={member.dob} onChange={(e) => handleTeamMemberChange(index, e)} required />

              <label>Email:</label>
              <input type="email" name="email" value={member.email} onChange={(e) => handleTeamMemberChange(index, e)} placeholder="Enter Email" required />

              <label>Address:</label>
              <input type="text" name="address" value={member.address} onChange={(e) => handleTeamMemberChange(index, e)} placeholder="Enter Address" required />

              <label>Pin Code:</label>
              <input type="text" name="pinCode" value={member.pinCode} onChange={(e) => handleTeamMemberChange(index, e)} placeholder="Enter Pin Code" required />
            </div>
          ))}


        {/* QR Image and Paragraph */}
        <label >Scan QR to Pay Registration Fee:    </label>
        <img src="/qr.png" alt="QR Code" className="qr-code" />
        <p className="qr-info">
          Note: Regiatration fee is Rs 49 each
        </p>


        <label>Upload screenshot of registration fee payment:</label>
        <input
          type="file"
          name="registrationProof"
          onChange={handleFileChange}
          accept="image/*"
          required
        />



        <div className="submitButton flex justify-center">
          <button type="submit" className="next-button text-center">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default ApplicationForm;




// Handle file upload for registration proof (Cloudinary)
  // const handleFileChange = async (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const uploadData = new FormData();
  //     uploadData.append('file', file);
  //     uploadData.append('upload_preset', 'ApplicationForm'); // Replace with your Cloudinary upload preset
  //     uploadData.append('cloud_name', 'dexvwh9rm'); // Replace with your Cloudinary cloud name

  //     try {
  //       const response = await axios.post(
  //         'https://api.cloudinary.com/v1_1/dexvwh9rm/image/upload',
  //         uploadData
  //       );
  //       const imageUrl = response.data.secure_url;
  //       // Update form data with Cloudinary URL
  //       setFormData((prevState) => ({
  //         ...prevState,
  //         cloudinaryUrl: imageUrl
  //       }));
  //       console.log('Image uploaded successfully: ', imageUrl);
  //       // Set the image URL in the formData if necessary
  //       setFormData({ ...formData, registrationProof: imageUrl });
  //     } catch (error) {
  //       console.error('Error uploading image:', error);
  //     }
  //   }
  // };