import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { NavLink, useNavigate} from "react-router-dom";
import { Navbar, Nav, Container, Button, Form } from "react-bootstrap";
import InstAI_icon from "../../image/instai_icon.png";
import { FaRegClock } from 'react-icons/fa';
// import Autosuggest from 'react-autosuggest';    之後可以加入一些提示詞語 方便下更好的prompt
import "./PromptInputPage.css";

export default function ImgPrompt() {
  const navigate = useNavigate();
  const id = localStorage.getItem("userId");  // user區分使用的id
  const [positveprompt, setPrompt] = useState(''); // 用來存取使用者的prompt 
  const [negativeprompt, setNegativePrompt] = useState(''); // 用來存取使用者的Negativeprompt
  const [state, setState] = useState(false); //處理頁面渲染 如果提交PROMPT表單則會變成等待Page
  const p = process.env;
  const prompt = p.REACT_APP_PROCESS_PROMPT;   // 提交prompt的api 
  // necessary parameter
  const projectName = localStorage.getItem("traing name");
  const modelTitle = localStorage.getItem(`${projectName} checkPoint`);

  const g_c  = process.env.REACT_APP_GET_IMGCOUNT;
  const [chance, setChance] = useState();

  const m_c = process.env.REACT_APP_MODIFY_IMGCOUNT;
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

      console.log("response data is", response.data); //  response data is {img_generation_remaining_count: 4}
      if (response.data === 'error') {
        throw new Error('Error fetching data');
      }
      console.log(response.data);
      setChance(response.data.img_generation_remaining_count);
      console.log("current remaing count is",response.data.img_generation_remaining_count);
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };
  const modifyCount = async (projectname, count) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const data = { username: id, projectname: projectname, count: count-1 };
      const response = await axios.post(`${m_c}`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log("remaing count is", response.data);
      if (response.data === 'error') {
        throw new Error('Error fetching data');
      }
      console.log(response.data);
      // await getCount(projectname); // 在修改計數後，重新獲取計數
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };
  
  useEffect(() => {
    getCount(projectName);
  }, []);
  
  // console.log("project name is",projectName," model title is",modelTitle);

  const [formData, setFormData] = useState({
    enable_hr: false,
    denoising_strength: 0,
    hr_scale: 2,
    hr_upscaler: "Latent",
    hr_second_pass_steps: 0,
    hr_resize_x: 0,
    hr_resize_y: 0,
    prompt: "A shiba",
    styles: [],
    seed: -1,
    batch_size: 20,
    n_iter: 1,
    steps: 20,
    cfg_scale: 7,
    width: 512,
    height: 512,
    restore_faces: false,
    tiling: false,
    negative_prompt: "",
    eta: 0,
    override_settings: {
      sd_model_checkpoint: "sd-v1-5-inpainting.ckpt [c6bbc15e32]"
    },
    script_args: [],
    sampler_index: "Euler a",
    alwayson_scripts: {}
  });    // initial folder for img generation 

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };   // 對應到formControl 的表單，存取使用者的輸入 

  const handleNegativePromptChange = (event) => {
    setNegativePrompt(event.target.value);
  };   // 對應到formControl 的表單，存取使用者的輸入 

  useEffect(() => {
  }, [formData]); 

  const handleChangeState = () => {
    const confirm = window.confirm("sure to give up?");
    if (confirm) {
      setState(!state);
    }
    else {
      return;
    }
    // 確認是否submit 決定是否要變更狀態
  }


  const handleSubmit = useCallback(async (event) => { // 注意這裡需要添加async關鍵字
    console.log("chance is", chance);
    const confirm = window.confirm("sure to submit prompt ?");
    if (confirm) {
      console.log("chance is", chance, " times");
      const num = Math.abs(5 - chance);
      console.log("number is", num);
      if (chance > 0) {
        event.preventDefault();
        const updatedFormData = { ...formData, prompt: positveprompt, negative_prompt: negativeprompt };
        setFormData(updatedFormData);
        setState(!state);
        const postData = async () => {
          try {
            const token = localStorage.getItem("jwtToken");
            console.log(formData)
            const response = await axios.post(`${prompt}?username=${id}&projectname=${projectName}&count=${num}`, formData, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });
            setState(!state);
            console.log(response.data);
            const promptData = formData;

            localStorage.setItem(`${projectName}prmoptData`, JSON.stringify(promptData));
            await modifyCount(projectName, chance); // 注意這裡需要添加await關鍵字
            await getCount(projectName);
            console.log("chance is", chance-1);
            navigate(`/ImgDisplayPage`);
          } catch (error) {
            console.error("Error sending data to backend:", error);
          }
        }
        postData();
      } else {
        console.log("tan tan tan tan");
      }
    } else {
      return;
    }
  }, [formData, positveprompt, negativeprompt, projectName, prompt, navigate]);
  
  useEffect(() => {
    setFormData(prevState => ({
      ...prevState,
      prompt: positveprompt,
      negative_prompt : negativeprompt,
      override_settings: {
        sd_model_checkpoint: modelTitle,
      }
    }));
    console.log(formData.override_settings.sd_model_checkpoint)
  }, [positveprompt, modelTitle, negativeprompt]);
  
  return (
    <>
      {state ? (
        <>
          <Navbar bg="white" style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
            <Nav className="mr-auto">
              <Nav className="mr-auto" style={{ marginLeft: "10px" }}>
                <div className="col-auto mt-4">
                  <NavLink to={`/Project?&type=1`} className="ModelSelectPageLink">
                    <button className="btn ModelSelectPageButton" style={{ marginLeft: "10px", fontFamily: 'Lato' }}>
                      <h3 style={{ marginLeft: "10px" }}>←Back</h3>
                    </button>
                  </NavLink>
                </div>
                {/* <h3 onClick={handleBack}>←Back</h3> */}
              </Nav>
            </Nav>
            <NavLink to={`/Project?&type=1`} className="mx-auto">
              <img
                src={InstAI_icon}
                width="60"
                height="60"
                className="d-inline-block align-top"
                alt="InstAI logo"
              />
            </NavLink>
          </Navbar>

          <Container className="d-flex flex-column justify-content-center" style={{
            minHeight: '60vh', maxWidth: '50rem', margin: '50px auto', backgroundColor: 'white',
            borderRadius: '15px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', padding: '20px'
          }}>
            <h2 className="text-center mb-4">Generative model is processing your request.</h2>
            <p className="text-center mb-4">Estimated time: </p>
            <h2 className="text-center mb-4">5 minutes</h2>
            <div className="text-center">
              <FaRegClock style={{ animation: 'spin 12s linear infinite' }} size={70} />
            </div>

            <Button variant="primary" style={{ width: '50%', marginLeft: '25%', marginTop: "30px" }} onClick={handleChangeState}>
              Cancel Request
            </Button>
            {/* <Button onClick={testButton}>測試</Button> */}
          </Container>
        </>
      ) : (
        <>
          {/* 這裡是當state為false時顯示的內容 */}
          <div style={{ backgroundColor: 'WHITE' }}>
            <Navbar style={{ backgroundColor: 'WHITE', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
              <Nav className="mr-auto" style={{ marginLeft: "10px" }}>
                <div className="col-auto mt-4">
                  <NavLink to={`/Project?&type=1`} className="ModelSelectPageLink">
                    <button className="btn ModelSelectPageButton" style={{ marginLeft: "10px", fontFamily: 'Lato' }}>
                      <h3 style={{ marginLeft: "10px" }}>←Back</h3>
                    </button>
                  </NavLink>
                </div>
                {/* <h3 onClick={handleBack}>Back</h3> */}
              </Nav>
              <NavLink to={`/Project?&type=1`} className="mx-auto">
              <img
                src={InstAI_icon}
                width="60"
                height="60"
                className="d-inline-block align-top"
                alt="InstAI logo"
              />
            </NavLink>
            </Navbar>
            <Container className="d-flex flex-column justify-content-center" style={{ minHeight: '60vh', maxWidth: '50rem', margin: '50px auto', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', padding: '20px' }}>
              <h2 className="text-center mb-4 fs-3 fw-bold">Describe the details to the image generation model</h2>
              <p className="text-center mb-4">Current generation count: {chance}</p>
              <p className="text-center mb-4" >
                How to write a prompt for generative AI model?
              </p>
              <Form>

                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <h4>Prompt</h4>
                  <Form.Control className="mt-3 mb-3" as="textarea" rows={10} cols={80} placeholder=" Describe the details the image should include" onChange={handlePromptChange} />
                </Form.Group>

                <Form.Group controlId="exampleForm.ControlTextarea2">
                  <h4>Negative Prompt</h4>
                  <Form.Control className="mt-3 mb-3" as="textarea" rows={10} cols={80} placeholder="Describe the details the image should not include" onChange={handleNegativePromptChange} />
                </Form.Group>



                <Button variant="primary" type="submit" style={{ width: '50%', marginLeft: '50%' }}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Form>
            </Container>
          </div>
        </>
      )}
    </>
  );
}