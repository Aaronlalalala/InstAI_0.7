import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
const MAX_COUNT = 10;

function Upload() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
	const [uploadedFiles, setUploadedFiles] = useState([])
    const [fileLimit, setFileLimit] = useState(false);


    const handleUploadFiles = files => {
        const uploaded = [...uploadedFiles];
        let limitExceeded = false;
        files.some((file) => {
            if (uploaded.findIndex((f) => f.name === file.name) === -1) {
                uploaded.push(file);
                if (uploaded.length === MAX_COUNT) setFileLimit(true);
                if (uploaded.length > MAX_COUNT) {
                    alert(`You can only add a maximum of ${MAX_COUNT} files`);
                    setFileLimit(false);
                    limitExceeded = true;
                    return true;
                }
            }
        })
        if (!limitExceeded) setUploadedFiles(uploaded)
        
        console.log(files)
        const formData = new FormData();
        for(let i =0;i<uploaded.length;++i){
          formData.append('file', uploaded[i]);
        }
        
        axios.post(`http://localhost:8080/api/upload/upload?username=${id}`, formData)
        .then(response => {
          console.log(response.data);
          // Handle success
          alert('upload success')
        })
        .catch(error => {
          console.error(error);
          // Handle error
        });

    }

    const handleFileEvent =  (e) => {
        const chosenFiles = Array.prototype.slice.call(e.target.files)
        handleUploadFiles(chosenFiles);
    }

    return (
		<div className="App">

			<input id='fileUpload' type='file' multiple
					accept='application/pdf, image/png'
                    onChange={handleFileEvent}
                    disabled={fileLimit}
			/>
      <button><label htmlFor='fileUpload'>
				<a  className={`btn btn-primary ${!fileLimit ? '' : 'disabled' } `}>Upload Files</a>
			</label></button>
			

			<div className="uploaded-files-list">
				{uploadedFiles.map(file => (
                    <div >
                        {file.name}
                    </div>
                ))}
			</div>

		</div>
	);
}

export default Upload;