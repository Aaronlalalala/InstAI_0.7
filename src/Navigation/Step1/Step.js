import React, { useState, useEffect } from 'react';
import './Step.css';
import axios from 'axios';
import InstAI_icon from "../../image/instai_icon.png";
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';
function Step() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userid = localStorage.getItem("userId");
  const projectname = searchParams.get('project');
  const g_s = process.env.REACT_APP_GET_STEP;
  const c_s = process.env.REACT_APP_CONFIRM_STEP;
  const download_model = process.env.REACT_APP_DOWNLOAD_MODEL;
  const get_model = process.env.REACT_APP_GET_SINGLEMODEL;
  const projectType = localStorage.getItem(`${projectname}type`);
  const navigate = useNavigate();
  const [step, setStep] = useState();
  const [status, setStatus] = useState();
  const [model, setModel] = useState();
  console.log("project type is", projectType);
  // 映射表
  // 後端回傳status 則使用映射表修改step 到對應的數字
  const statusToStep = {
    "Image generation": 0,
    "Image upload": 1,
    "Requirement filling": 2,
    "Image Confirmation": 3,
    "Requirement confirmation": 4,
    "Model training ready": 5,
    "Model training in process": 6,
    "Model training completed": 7
  };
  // 獲取狀態
  const fetchstep = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get(
        `${g_s}/?username=${userid}&projectname=${projectname}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log("project type is", projectType);
      setStatus(response.data);
      console.log("response data is", response.data);
      setStep(statusToStep[response.data]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // 修改step.js中的狀態 使用async 完成才會下一步
  const changeStep = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const formData = { step: "Model training in process", projectname: projectname, username: userid };
      const response = await axios.post(
        `${c_s}`, formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      console.log(response.data);
      fetchstep();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  console.log("status is", status)
  console.log("step is", step);

  const fetchModel = async () => {

    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get(
        `${get_model}?username=${userid}&projectname=${projectname}`,

        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      if (response.status === 200) {
        console.log(response.data)
        setModel(response.data)
        console.log(model)




      } else if (response.status === 500) {
        console.log(response.data)
      } else {
        console.log("未知錯誤")
      }
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }

  }

  const handleDownloadModel = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      console.log(token);
      const response = await axios({
        method: 'post',
        url: `${download_model}?project_id=${model[0].project_id}`,
        responseType: 'blob', 
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      console.log('Download started');
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/zip' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${model[0].model_name}`); 
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link); 
      window.URL.revokeObjectURL(url); 
  
    } catch (error) {
      console.error('Error downloading model:', error);
    }
  }


  useEffect(() => {
    fetchstep();
    fetchModel();
  }, []);
  // 修改狀態

  // 邏輯判斷區域
  // 狀態一修改 資料上傳
  const Green1 = () => {
    var str = "上傳資料";
    if (step > 1) {
      str = "預覽資料";
    }
    const userConfirm = window.confirm(str);
    if (userConfirm) {
      if (step === 1) {
        navigate(`/UploadImg?projectname=${projectname}`);
      }
      else {
        alert('導覽至上傳圖片顯示');
        navigate(`/ViewData?projectname=${projectname}`);
      }
    }
  };
  // 狀態二修改 需求填寫
  const Green2 = () => {
    var str = "填寫需求";
    if (step > 2) {
      str = "預覽需求";
    }
    const userConfirm = window.confirm(str);
    if (userConfirm) {
      if (step < 2) {
        alert("請照步驟執行")
      }
      else if (step === 2) {
        navigate(`/Requirment?projectname=${projectname}`);
      }
      else if (step > 2) {
        navigate(`/ViewReq?projectname=${projectname}`)
      }
    }
  };
  // 狀態三之一修改 檢查確認資料
  const handleFormDataChange = () => {
    const userConfirm = window.confirm("圖片檢查");
    if (userConfirm) {
      if (step === 3) {
        navigate(`/ConfirmImg?projectname=${projectname}`);
      }
      else {
        alert("請照步驟執行");
      }
    }
  };
  // 狀態三之二修改 檢查確認需求
  const handleForm2DataChange = () => {
    const userConfirm = window.confirm("需求檢查");
    if (userConfirm) {
      if (step === 4) {
        navigate(`/ConfirmReq?projectname=${projectname}`);
      }
      else {
        alert("請照步驟執行");
      }
    }
  };
  //
  const navigateLogic = () => {
    const userConfirm = window.confirm("模型訓練");
    if (userConfirm) {

      changeStep();


      // if (step === 5) {
      //   navigate(`/Model?projectname=${projectname}`);
      // }
      // else {
      //   alert("請照步驟執行");
      // }
    }
    else {
      return;
    }

  }

  // 渲染區域
  const Header = () => {
    return (
      <div className="row d-flex justify-content-between " >
        <div className="col-auto">
          <img src={InstAI_icon} className="img-fluid" alt="InstAi_Icon" style={{ width: '72.8px', height: '72.8px' }} ></img>
        </div>
        <div className="col-auto mt-4">
          <NavLink to={`/Project?&type=1`} className="projectPageLink">
            <button className="btn btn-secondary">返回專案頁面</button>
          </NavLink>
        </div>
        <div className="border border-top  custom-border">
        </div>
      </div>
    )
  }

  const LeftDisplay = () => {
    return (

      <div className='col-2 text-start border-end border-2 ' >

        {projectType === '2' ? (
          <div className='row row-cols-1 '>
            <div className='col mt-3 mb-5' ><h1 className='fw-bold'>Status</h1></div>
            <div className={step === 1 ? 'col mb-5 border-start border-purple' : 'col mb-5 text-body-secondary'} style={{ backgroundColor: step === 1 ? '#EBE7FF' : '' }}><p className='fw-bold fs-4 mt-3'>1.Upload training data</p></div>
            <div className={step < 2 ? 'col mb-5 ' : step ===2 ? 'col mb-5 border-start border-purple' : 'col mb-5 text-body-secondary'} style={{ backgroundColor: step === 2 ? '#EBE7FF' : '' }}><p className='fw-bold fs-4 mt-3'>2.Provide your model training requirements</p></div>
            <div className={step < 3 ? 'col mb-5 ' : step ===3 || step === 4 ? 'col mb-5 border-start border-purple' : 'col mb-5 text-body-secondary'} style={{ backgroundColor: step === 3 || step ===4 ? '#EBE7FF' : '' }}><p className='fw-bold fs-4 mt-3'>3.Confirm data and requirement</p></div>
            <div className={step < 5 ? 'col mb-5 ' : step ===5 || step === 6 ? 'col mb-5 border-start border-purple' : 'col mb-5 text-body-secondary'} style={{ backgroundColor: step === 5 || step ===6 ? '#EBE7FF' : '' }}><p className='fw-bold fs-4 mt-3'>4.Train your AI model</p></div>
            <div className={step < 7 ? 'col mb-5 ' : step ===7 ? 'col mb-5 border-start border-purple ' : 'col mb-5 '} style={{ backgroundColor: step === 7 ? '#EBE7FF' : '' }}><p className='fw-bold fs-4 mt-3 '>5.Download and test AI model</p></div>
          </div>) :
          (
            <div className='row row-cols-1 '>
            <div className='col mt-3 mb-5' ><h1 className='fw-bold'>Status</h1></div>
            <div className={step === 1 ? 'col mb-5 border-start border-purple' : 'col mb-5 text-body-secondary'} style={{ backgroundColor: step === 1 ? '#EBE7FF' : '' }}><p className='fw-bold fs-4 mt-3'>1.Upload training data</p></div>
            <div className={step < 2 ? 'col mb-5 ' : step ===2 ? 'col mb-5 border-start border-purple' : 'col mb-5 text-body-secondary'} style={{ backgroundColor: step === 2 ? '#EBE7FF' : '' }}><p className='fw-bold fs-4 mt-3'>2.Provide your model training requirements</p></div>
            <div className={step < 3 ? 'col mb-5 ' : step ===3 || step === 4 ? 'col mb-5 border-start border-purple' : 'col mb-5 text-body-secondary'} style={{ backgroundColor: step === 3 || step ===4 ? '#EBE7FF' : '' }}><p className='fw-bold fs-4 mt-3'>3.Confirm data and requirement</p></div>
            <div className={step < 5 ? 'col mb-5 ' : step ===5 || step === 6 ? 'col mb-5 border-start border-purple' : 'col mb-5 text-body-secondary'} style={{ backgroundColor: step === 5 || step ===6 ? '#EBE7FF' : '' }}><p className='fw-bold fs-4 mt-3'>4.Train your AI model</p></div>
            <div className={step < 7 ? 'col mb-5 ' : step ===7 ? 'col mb-5 border-start border-purple ' : 'col mb-5 '} style={{ backgroundColor: step === 7 ? '#EBE7FF' : '' }}><p className='fw-bold fs-4 mt-3 '>5.Download and test AI model</p></div>
          </div>)}

      </div>

    )
  }


  const Upload_state = () => {
    return (
      <div className='row row-cols-4 mt-5  align-items-center '>
        <div className='col-1'></div>

        <div className={step === 1 ? 'ms-3 col-3 circleNo1-active' : 'ms-3  col-3 circleNo1-complete '} ></div>

        <div className={step === 1 ? 'p-4 col-6 container rounded-2 border frame-on bg-white' : ' p-4 col-6 container rounded-2 border border-success-subtle bg-white'}>

          <div className='row row-cols-2'>
            <div className='col-9'>
              {projectType === "2" ? (
                <div>
                  <p className='text-start fs-4 fw-bolder'><span className='fs-5 '>●</span> Upload Training data</p>
                  <p className='text-start fs-6 fw-semibold text-secondary'><span className='fs-6 '>●</span> Upload the image data you wish to use to train your style model.</p>
                </div>

              ) : (
                <div>
                  <p className='text-start fs-4 fw-bolder'><span className='fs-5 '>●</span> Upload Training data</p>
                  <p className='text-start fs-6 fw-semibold text-secondary'><span className='fs-5 '>●</span> Upload the image data you wish to use and the stable diffusion's dataset.</p>
                </div>)}
            </div>

            <div className='col-3'>
              {projectType === "2" ? (
                <div className='d-flex justify-content-end'>
                  <button className={step === 1 ? 'btn btn-lg upload-buttonNo1 mt-4' : 'btn btn-lg btn-success mt-4'} onClick={Green1}>
                    {step > 1 ? 'View your data' : 'Upload'}
                  </button>
                </div>

              ) : (
                <div className='d-flex justify-content-end'>
                  <button className={step === 1 ? 'btn btn-lg upload-buttonNo1 mt-4' : 'btn btn-lg btn-success mt-4'} onClick={Green1}>
                    {step > 1 ? 'View your data' : 'Upload '}
                  </button>
                </div>)}
            </div>

          </div>

        </div>
        <div className='col-4'></div>

      </div>
    )
  }
  const Requirmet_state = () => {
    return (

      <div className='row row-cols-4 mt-5  align-items-center '>
        <div className='col-1'></div>

        <div className={step === 1 ? 'ms-3 col-3 circleNo2' : step === 2 ? 'ms-3 col-3 circleNo2-active ' : 'ms-3 col-3 circleNo2-complete '} ></div>

        <div className={step < 2 ? 'p-4 col-6 container rounded-2 border  bg-white' : step === 2 ? 'p-4 col-6 container rounded-2 border frame-on bg-white' : ' p-4 col-6 container rounded-2 border border-success-subtle bg-white'}>

          <div className='row row-cols-2'>
            <div className='col-9'>

              <div>
                <p className='text-start fs-4 fw-bolder'><span className='fs-5 '>●</span> Provide your training requirements</p>
                <p className='text-start fs-6 fw-semibold text-secondary'><span className='fs-5 '>●</span> Tell us your specific needs for AI Model Training.</p>
              </div>
            </div>

            <div className='col-3'>

              <div className='d-flex justify-content-end'>  <button className={step === 1 ? 'btn btn-lg btn-secondary mt-4' : step === 2 ? 'btn btn-lg upload-buttonNo2-active mt-4' : 'btn btn-lg btn-success mt-4'} disabled={step < 2 ? true : false} onClick={Green2}>
                {step > 2 ? 'View your response' : 'Fill out the form'}
              </button></div>


            </div>

          </div>

        </div>
        <div className='col-4'></div>

      </div>

    )
  }

  const Confirm_state = () => {
    return (

      <div className='row row-cols-4 mt-5  align-items-center '>
        <div className='col-1'></div>

        <div className={step <= 2 ? 'ms-3 col-3 circleNo3 ' : step <= 4 ? 'ms-3 col-3 circleNo3-active ' : 'ms-3 col-3 circleNo3-complete'}></div>

        <div className={step < 3 ? ' p-4 col-6 container rounded-2 border bg-white' : step === 3 || step === 4 ? 'p-4 col-6 container rounded-2 border frame-on bg-white' : ' p-4 col-6 container rounded-2 border border-success-subtle bg-white'}>

          <div className='row row-cols-2'>
            <div className='col-9'>

              <div>
                <p className='text-start fs-4 fw-bolder'><span className='fs-5 '>●</span> Confirm data and requirements</p>
                <p className='text-start fs-6 fw-semibold text-secondary'><span className='fs-5 '>●</span> Tell us your needs of AI Model training.</p>
              </div>
            </div>

            <div className='col-3 '>

              <div className='d-flex justify-content-end'><button className={step <= 2 ? 'btn btn-lg btn-secondary' : step === 3 ? 'btn btn-lg upload-buttonNo3-active' : 'btn btn-lg btn-success'} onClick={handleFormDataChange} disabled={step === 3 ? false : true}>Confirm data</button></div>
              <div className='d-flex justify-content-end'><button className={step <= 3 ? 'btn btn-secondary mt-3' : step === 4 ? 'btn  upload-buttonNo4-active mt-3' : 'btn  btn-success mt-3'} onClick={handleForm2DataChange} disabled={step === 4 ? false : true}>Confirm requirements</button></div>

            </div>

          </div>

        </div>
        <div className='col-4'></div>

      </div>
    )
  }
  const Model_state = () => {
    return (

      <div className='row row-cols-4 mt-5  align-items-center '>
        <div className='col-1'></div>

        <div className={step < 5 ? 'ms-3 col-3 circleNo4 ' : step === 5 ? 'ms-3 col-3 circleNo4-active ' : 'ms-3 col-3 circleNo4-complete'}></div>

        <div className={step < 5 ? ' p-4 col-6 container rounded-2 border bg-white' : step === 5 ? 'p-4 col-6 container rounded-2 border frame-on bg-white' : ' p-4 col-6 container rounded-2 border border-success-subtle bg-white'}>

          <div className='row row-cols-2'>
            <div className='col-9'>


              {step < 6 ? <div>
                <p className='text-start fs-4 fw-bolder'><span className='fs-5 '>●</span> Train AI Model</p>
                <p className='text-start fs-6 fw-semibold text-secondary'><span className='fs-5 '>●</span> You haven't submit data yet.</p>
              </div> : <div>
                <p className='text-start fs-4 fw-bolder'><span className='fs-5 '></span> We're working on your AI Model training request</p>
                <p className='text-start fs-6 fw-semibold text-secondary '><span className='fs-5 '></span>We'll notify you with an email if there's any update.</p>

              </div>}


            </div>

            <div className='col-3'>
              <div className='d-flex justify-content-end'>
                <button onClick={navigateLogic} className={step > 5 ? 'btn btn-lg btn-success mt-4' : step === 5 ? 'btn btn-lg upload-buttonNo5-active mt-4' : 'btn btn-lg btn-secondary mt-4'} disabled={step === 5 ? false : true}>
                  Start Training
                </button></div>


            </div>



            {step >= 6 ? <>
              <div className='col-12' ><p className='text-start fs-6 fw-semibold border-top'>Training process:</p></div>

              <div className='col-7'>
                <p className='text-end fs-6 fw-normal'>Model training in process</p>

              </div>
              <div className='col-5'>
                <p className='text-end fs-6 fw-normal'>Model training completed</p>

              </div>
              <div className='col-12'>
                <div className="progress" role="progressbar" aria-label="Animated striped example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                  <div className={step === 6 ? "progress-bar progress-bar-striped progress-bar-animated bg-warning" : "progress-bar progress-bar-striped bg-success"} style={step === 6 ? { width: "50%" } : step === 7 ? { width: "100%" } : { width: "0%" }}></div>
                </div>
              </div>
            </> :
              <div></div>
            }

          </div>

        </div>
        <div className='col-4'></div>

      </div>

    )
  }

  const DownloadAndTest_state = () => {
    return (

      <div className='row row-cols-4 mt-5  align-items-center '>
        <div className='col-1'></div>

        <div className={step < 7 ? 'ms-3 col-3 circleNo4 ' : 'ms-3 col-3 circleNo4-active '}></div>

        <div className={step < 7 ? ' p-4 col-6 container rounded-2 border bg-white' : 'p-4 col-6 container rounded-2 border frame-on bg-white'}>

          <div className='row row-cols-2'>
            <div className='col-9'>

              {model ? (
                <div>
                  <p className='text-start fs-4 fw-bolder'><span className='fs-5 '>●</span> Download and test AI Model</p>
                  <p className='text-start fs-6 fw-semibold text-secondary'><span className='fs-5 '>●</span> Model Name {model[0].model_name}</p>
                  <p className='text-start fs-6 fw-semibold text-secondary'><span className='fs-5 '>●</span> Model version {model[0].version_number} - {model[0].createtime}</p>
                </div>
              ) : (
                <div>
                  <p className='text-start fs-4 fw-bolder'><span className='fs-5 '>●</span> Download and test AI Model</p>
                  <p className='text-start fs-6 fw-semibold text-secondary'><span className='fs-5 '>●</span> No model available for download and test</p>
                </div>
              )}



            </div>

            <div className='col-3 '>

              <div className='d-flex justify-content-end'><button className={step === 7 ? 'btn btn-lg upload-buttonNo5-active mt-4' : 'btn btn-lg btn-secondary mt-4'} onClick={handleDownloadModel}  disabled={step < 7 ? true : false}>Download AI Model</button></div>
              <div className='d-flex justify-content-end'> <button className={step === 7 ? 'btn btn-lg upload-buttonNo5-active mt-4' : 'btn btn-lg btn-secondary mt-4'} disabled={step < 7 ? true : false}>Test model</button></div>


            </div>


          </div>

        </div>
        <div className='col-4'></div>

      </div>

    )
  }
  const Loading = () => (
    <div className="loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
       <BounceLoader color={'black'}  size={120} />
    </div>
 );

  return (
    
    <div className="container-fluid mt-3">
      <Header />
      <h1 className='main-projectTitle'>
        {projectname}
      </h1>
      <div className='container-fluid p-0'>
        <div className='row row-cols-2 border-top border-2 custom-border' style={{ height: "100vh" }}>

          <LeftDisplay />
          {step === undefined || step === null ? <><Loading/></> : 
          <><div className='col-10 text-center bg-light' >
            <Upload_state />
            <Requirmet_state />
            <Confirm_state />
            <Model_state />
            <DownloadAndTest_state />
          </div></>}

        </div>
      </div>

    </div>
  );
}
export default Step;