import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import "./App.css";

function Dropzone({ userProfileId }) {
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    console.log(acceptedFiles[0]);
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("file", file);

    axios
      .post(
        `http://localhost:8080/api/v1/user-profile/${userProfileId}/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "mulitpart/form-data",
          },
        }
      )
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the image here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
}

const UserProfiles = () => {
  const [userProfiles, setUserProfiles] = useState([]);

  const fetchUserProfiles = () => {
    axios.get("http://localhost:8080/api/v1/user-profile").then((res) => {
      console.log(res);
      setUserProfiles(res.data);
    });
  };
  useEffect(() => {
    fetchUserProfiles();
  }, []);
  // return <></>;
  return userProfiles.map((userProfile, index) => {
    return (
      <div key={index}>
        {userProfile.userProfileId ? (
          <img
            src={`http://localhost:8080/api/v1/user-profile/${userProfile.userProfileId}/image/download`}
          />
        ) : null}
        <br />
        <br />
        <h1>{userProfile.username}</h1>
        <p>{userProfile.userProfileId}</p>
        <Dropzone {...userProfile} />
        <br />
      </div>
    );
  });
};

function App() {
  return (
    <Container fluid>
      <Row className="justify-content-center">
        <Col sm="5">
          <UserProfiles />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
