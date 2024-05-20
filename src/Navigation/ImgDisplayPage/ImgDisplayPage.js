import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Navbar, Nav, Card, Container, Row, Col, Button, Form } from "react-bootstrap";
import InstAI_icon from "../../image/instai_icon.png";
import axios from "axios";
import { FaRegClock } from "react-icons/fa";
import './ImgDisplayPage.css'
import AWS from 'aws-sdk';

export default function ImgDisplayPage() {
  const p = process.env; 
  const u = p.REACT_APP_UPLOAD; //最後傳送要用到的api
  const g_s = p.REACT_APP_GET_STEP; // 獲取狀態
  const c_s = p.REACT_APP_CONFIRM_STEP; // 修改狀態
  const promptapi = p.REACT_APP_PROCESS_PROMPT; // 傳送prompt進行生圖
  const g_c = p.REACT_APP_GET_IMGCOUNT; // 獲取count 
  const m_c = p.REACT_APP_MODIFY_IMGCOUNT; // 修改count 
  const accessKey = p.REACT_APP_AWS_ACCESS_KEY_ID;
  const secretAccessKey = p.REACT_APP_AWS_SECRET_ACCESS_KEY;
  const region = p.REACT_APP_AWS_REGION;
  // 1. 先確認抓得到狀態
  // 2. 並確認目前的count 
  // 3. 確認抓得到資料

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [status, setStatus] = useState();
  const [selectImg, setSelectImg] = useState([]);
  const [chance, setChance] = useState();
  const [base64Data, setBase64Data] = useState([]);

  const [num, setNum] = useState(1);

  const id = localStorage.getItem("userId");
  const [promptData, setPromptData] = useState({});
  const projectName = localStorage.getItem("traing name");
  // 確認promptData
  useEffect(() => { 
    const storedData = localStorage.getItem(`${projectName}prmoptData`);
    if (storedData) {
      setPromptData(JSON.parse(storedData));
    }
  }, [projectName]);

  // 抓取step
  const fetchStep = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get(
        `${g_s}/?username=${id}&projectname=${projectName}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      setStatus(response.data);
      console.log("response data is", response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchStep();
  }, [g_s, id, projectName]);
  // 修改狀態
  const changeStep = async (status_now) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const formData = { step: status_now, projectname: projectName, username: id };
      const response = await axios.post(`${c_s}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      // console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  // 獲取count 
  const getCount = async (projectname) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get(`${g_c}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        params: { projectname: projectname, username: id }
      });
      // console.log("response data is", response.data);
      if (response.data === 'error') {
        throw new Error('Error fetching data');
      }
      setChance(response.data.img_generation_remaining_count);
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };
  
  useEffect(() => {
    getCount(projectName);
  }, [projectName]);

  // 修改count 送出後chance-1 
  const modifyCount = async (projectname, count) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const data = { username: id, projectname: projectname, count: count - 1 }; //count-1 很重要
      const response = await axios.post(`${m_c}`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      // console.log("Response data is", response.data);
      if (response.data === 'error') {
        throw new Error('Error fetching data');
      }
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

  // 傳送prompt進行生圖
  const postSDimg = async (promptData) => {
    // console.log("current chance is", chance);
    // console.log(`currnet num is ${num}`)
    if (chance > 0) {
      setLoading(true);
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.post(`${promptapi}?username=${id}&projectname=${projectName}&count=${5-chance}`, promptData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        // console.log(response.data);
        await modifyCount(projectName, chance); // 送出的同時修改count 
        await getCount(projectName); // 修改後重新裝取新的count value 

        setLoading(false);
      } catch (error) {
        console.error("Error sending data to backend:", error);
        setLoading(false);
      }
    } else {
      console.log("你已經沒有機會了 快去跟天俊大人求情");
    }
  };

  const resendPromptData = (event) => {
    if (chance > 0) {
      event.preventDefault();
      const confirmed = window.confirm("Do you need to rewrite the prompt?");
      if (!confirmed) {
        postSDimg(promptData);
        return;
      } else {
        const newPrompt = prompt("enter new prompt:");
        if (newPrompt) {
          const newNegativePrompt = prompt("enter new Negative prompt:");
          if (newNegativePrompt) {
            const updatedPromptData = { ...promptData, prompt: newPrompt, negative_prompt: newNegativePrompt };
            setPromptData(updatedPromptData);
            localStorage.setItem(`${projectName}prmoptData`, JSON.stringify(updatedPromptData));
            postSDimg(updatedPromptData);
          }
        }
      }
    } else {
      alert("Your remaing count is zero");
      console.log("你已經沒機會了 快去跟天俊大人求情!");
    }
  };

  const downloadSingleImage = (base64, index) => {
    const link = document.createElement('a');
    link.href = 'data:application/octet-stream;base64,' + base64;
    link.download = `image_${index + 1}.jpg`;
    link.click();
  };

  const handleChangeState = () => {
    const confirm = window.confirm("Sure to give up?");
    if (confirm) {
      setLoading(!loading);
    }
  };
  
  const submitBatch = () => {
    // console.log(selectImg)
    const confirm = window.confirm("Sure to go to next step for model traing");
    if (!confirm) {
      return;
    } else {
      // console.log(selectImg);
      const token = localStorage.getItem('jwtToken');
  
      // 建立一個新的FormData物件
      let formData = new FormData();
  
      // 將每個選擇的圖片轉換為Blob物件，然後添加到FormData物件中
      selectImg.forEach((img, index) => {
        function base64ToBlob(base64) {
          const byteCharacters = atob(base64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          return new Blob([byteArray]);
        }
        
            let blob = base64ToBlob(img);
            formData.append('file', blob, `image${index}.jpg`);
        
    });
  
      // 添加其他需要的資訊
      formData.append('username', id);
      formData.append('projectname', projectName);
  
      axios.post(`${u}?username=${id}&projectname=${projectName}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      }).then(response => {
        // console.log(response.data);
        if (response.data.message === 'Image uploaded successfully!') {
          setLoading(true);
          changeStep("Image upload");
          alert("Image uploaded successfully!")
          navigate(`/Step?project=${projectName}`);
        } else {
          console.log("fail");
        }
      }).catch(error => {
        console.error('Error submitting data:', error);
      });
    }
  };
  
  // // 將base64字串轉換為Blob物件的函數
  // function dataURLtoBlob(dataurl) {
  //   let arr = dataurl.split(',');
  //   if (arr.length < 2) {
  //     throw new Error('Invalid data URL');
  //   }
  //   let mimeMatch = arr[0].match(/:(.*?);/);
  //   if (!mimeMatch || mimeMatch.length < 2) {
  //     throw new Error('Invalid data URL');
  //   }
  //   let mime = mimeMatch[1],
  //       bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  //   while(n--){
  //       u8arr[n] = bstr.charCodeAt(n);
  //   }
  //   return new Blob([u8arr], {type:mime});
  // }

  // function isValidDataURL(s) {
  //   const regex = /^data:image\/([a-zA-Z]*);base64,([^\"]*)$/;
  //   return !!s.match(regex);
  // }
  // let formData = new FormData();
  // // 在迭代 selectImg 之前，先檢查每個元素
  // selectImg.forEach((img, index) => {
  //   if (!isValidDataURL(img)) {
  //     console.error(`Image ${index} is not a valid data URL`);
  //   } else {
  //     // 如果是有效的，則繼續處理...
  //     let blob = dataURLtoBlob(img);
  //     formData.append('file', blob, `image${index}.jpg`);
  //   }
  // });
  
  
  
  

  useEffect(() => {
    const url = `https://instaiweb-bucket.s3.amazonaws.com/uploads/${id}/${projectName}/SDImages/SDImages${num}.json`;
  
    AWS.config.update({
      accessKeyId: accessKey,
      secretAccessKey: secretAccessKey,
      region: region
    });

    const s3 = new AWS.S3();
    const params = {
      Bucket: 'instaiweb-bucket',
      Key: `uploads/${id}/${projectName}/SDImages/SDImages${num}.json`
    };

   

    const checkFileExistence = async () => {
      try {
        await s3.headObject(params).promise();
        return true;
      } catch (err) {
        if (err.code === 'NotFound') {
          return false;
        }
        throw err;
      }
    };

    const fetchData = async () => {
      setLoading(true); 
      try {
        await checkFileExistence();
        const response = await fetch(url);
        // console.log( `fetching ${url}`)
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const json = await response.json();
        // console.log("抓到這些資料",json);
        setBase64Data(Object.values(json)); // 將所有的base64字串存入base64Data
      } catch (error) {
        alert("data is empty");
        console.log("error fetching");
        console.log(error)
      } finally {
        setLoading(false); 
      }

    };
  
    const pollForFile = async () => {
      setLoading(true);
      const interval = setInterval(async () => {
        const fileExists = await checkFileExistence();
        if (fileExists) {
          clearInterval(interval);
          fetchData();
        }
      }, 5000); 
    };

    pollForFile();

    // console.log(`current num = ${num}`)

    
  }, [num]);
  
  const handleButtonClick = (num) => {
    setNum(num); // 更新num的值，這將觸發useEffect
  };

  const handleCheck = (e, base64) => {
    if (e.target.checked) {
      setSelectImg(prevSelectImg => [...prevSelectImg, base64]);
    } else {
      setSelectImg(prevSelectImg => prevSelectImg.filter(img => img !== base64));
    }
  };
  
  useEffect(()=>{
    // console.log("選了這些",selectImg);
  },[handleCheck])
  

  const LoadingCard = () => (
    <div className="spinner"></div>
  );


  const NavBarCard = () => {
    return (
      <Navbar style={{ backgroundColor: 'WHITE', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
        <Nav className="mr-auto" style={{ marginLeft: "10px" }}>
          <div className="col-auto mt-4">
          <NavLink to={`/Project?&type=1`} className="mx-auto">
              <img
                src={InstAI_icon}
                width="60"
                height="60"
                className="d-inline-block align-top"
                alt="InstAI logo"
              />
            </NavLink>
          </div>
        </Nav>
        <Nav className="ms-auto">
          <div className="d-flex align-items-center mt-2">
            <Button
              variant="outline-primary"
              onClick={resendPromptData}
              className="me-2"
              style={{ fontSize: "20px", height: "50px" }}
            >
              <FaRegClock /> Retry Prompt
            </Button>
          </div>
        </Nav>
      </Navbar>
    );
  };
  return (
    <>
      <NavBarCard />
      <Container>
      <Row className="my-3 align-items-center">
          <Col md={6}>
            <h2>Project Name: {projectName}</h2>
          </Col>
          <Col md={6} className="text-md-end">
            <h4>count left: {chance}</h4>
          </Col>
        </Row>
        {loading ? (
       <LoadingCard/>
      ) : (<>
        <Row className="mb-3">
         
            <Col key={1}>
              <Button
                variant="outline-primary"
                onClick={() => handleButtonClick(1)}
                style={{ fontSize: "20px", height: "50px" }}
              
              >
                Batch 1
              </Button>
            </Col>

            <Col key={2}>
              <Button
                variant="outline-primary"
                onClick={() => handleButtonClick(2)}
                style={{ fontSize: "20px", height: "50px" }}
                disabled={chance >= 3 ? true : false}
              >
                Batch 2
              </Button>
            </Col>

            <Col key={3}>
              <Button
                variant="outline-primary"
                onClick={() => handleButtonClick(3)}
                style={{ fontSize: "20px", height: "50px" }}
                disabled={chance >= 2 ? true : false}
              >
                Batch 3
              </Button>
            </Col>

            <Col key={4}>
              <Button
                variant="outline-primary"
                onClick={() => handleButtonClick(4)}
                style={{ fontSize: "20px", height: "50px" }}
                disabled={chance >= 1 ? true : false}
              >
                Batch 4
              </Button>
            </Col>
         
        </Row>
          <Row className="mb-3">
           {base64Data.map((base64, index) => (
             <Col key={index} xs={12} md={6} lg={4} className="mb-3">
             <Card>
             <Card.Img variant="top" src={`data:image/jpeg;base64,${base64}`} /> {/* 使用base64字串來顯示圖片 */}
             <Card.Body>
             <Card.Text>Image {index + 1}</Card.Text>
             <Button
              variant="primary"
              onClick={() => downloadSingleImage(base64, index)}
             >
             Download
            </Button>
            <Form.Check
             type="checkbox"
             label="Select"
             onChange={(e) => handleCheck(e, base64)}
             className="mt-2"
             checked={selectImg.includes(base64)} // 新增此行
            />

           </Card.Body>
           </Card>
           </Col>
          ))}
         </Row>
          </>
        )}
        {selectImg.length > 0 && (
          <Row className="mt-3 justify-content-center"> {/* 新增 justify-content-center */}
          <Col md="auto"> {/* 修改為 md="auto" */}
          <Button
             variant="primary"
             onClick={submitBatch}
             style={{ fontSize: "20px", height: "50px" }}
           >
          Submit Batch
          </Button>
          </Col>
          </Row>
        )}

      </Container>
    </>
  );
}


