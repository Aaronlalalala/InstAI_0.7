import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import InstAI_icon from "../../image/instai_icon.png";
import "./AdminPage";
import { BounceLoader } from 'react-spinners';
import { Table, Form } from "react-bootstrap";
import axios from "axios";
import { filter } from 'jszip';

export default function AdminUserManagement() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(15);
    const [filterRole, setFilterRole] = useState('All'); // State for filtering users by role
    const [users, setUsers] = useState([]);
    const get_user = process.env.REACT_APP_GET_USER;

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Function to filter users by role
    const filterUsersByRole = (role) => {
        if (role === 'All') {
            return users;
        } else {
            return users.filter(user => user.role === role);
        }
    }

    // Get current users based on pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const filteredUsers = filterUsersByRole(filterRole); // Filter users based on selected role
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); // 在發送請求之前，設置isLoading為true
            try {
                const token = localStorage.getItem("jwtToken");
                const response = await axios.get(`${get_user}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUsers(response.data)
                console.log(response.data);
                console.log(users);
            } catch (error) {

            } finally {
                setIsLoading(false); // 在接收到響應或捕獲到錯誤後，設置isLoading為false
            }
        };
        fetchData();
    }, []);


    const handleLogout = () => {
        const confirmlogout = window.confirm("確定要登出嗎？");
        if (!confirmlogout) {
            return;
        }
        localStorage.setItem('jwtToken', false);
        console.log('註銷token');
        const token = localStorage.getItem('jwtToken');
        console.log(token);
        navigate("/");
    };

    const handleConfirmLogout = () => {
        setShowLogoutPrompt(false);
        navigate("/");
    };



    const handleCancelLogout = () => {
        setShowLogoutPrompt(false);
    };

    const handleRemove = (user, index) => {
        const { id, firstname, lastname, email, password, role, createtime } = user;
        const queryParams = `userid=${id}&firstname=${firstname}&lastname=${lastname}&email=${email}&password=${password}&role=${role}&createtime=${createtime}`;
        navigate(`/AdminUserRemove?${queryParams}`);


    };

    const handleModify = (user, index) => {
        const { id, firstname, lastname, email, password, role, createtime } = user;
        const queryParams = `userid=${id}&firstname=${firstname}&lastname=${lastname}&email=${email}&password=${password}&role=${role}&createtime=${createtime}`;
        navigate(`/AdminUserModify?${queryParams}`);

    };

    const Loading = () => (
        <div className="loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <BounceLoader color={'black'} loading={isLoading} size={120} />
        </div>
    );

    return (
        <div className="container-fluid mt-3">
            <div className="row d-flex justify-content-between">
                <div className="col-auto">
                    <img src={InstAI_icon} className="img-fluid" alt="InstAi_Icon" style={{ width: '76.8px', height: '76.8px' }}></img>
                </div>
                <div className="col-auto mt-4">
                    <button className="btn logoutButton" onClick={handleLogout}>登出</button>
                </div>
                <div className="custom-border"></div>
            </div>

            <div className="row justify-content-end mt-3">
                <div className='col-auto'>
                    <NavLink to={`/AdminOverview`} className="projectPageLink">
                        <button className="btn add-project-button">返回Admin總覽頁面</button>
                    </NavLink>
                </div>

                <div className="col-auto">
                    <NavLink to={`/AdminCreateUser`}>
                        <button className="btn add-project-button">新增使用者</button>
                    </NavLink>
                </div>
            </div>


            <div className='row justify-content-center mt-5'>
                <div className='col-lg-8 border border'>
                    <div className="d-flex  align-items-start">
                        <h1 className="mt-3 me-3 " style={{ fontWeight: 'bold' }}>Users</h1>
                        <div className="mb-3 ms-1  mt-4 ">

                            <button type="button" className={`btn ${filterRole === 'All' ? 'btn-primary' : 'btn-secondary'}  me-2`} onClick={() => setFilterRole('All')}>All</button>
                            <button type="button" className={`btn ${filterRole === 'normal_user' ? 'btn-primary' : 'btn-secondary'} me-2 `} onClick={() => setFilterRole('normal_user')}>Normal User</button>
                            <button type="button" className={`btn ${filterRole === 'internal_user' ? 'btn-primary' : 'btn-secondary'} me-2`} onClick={() => setFilterRole('internal_user')}>Internal User</button>
                        </div>
                    </div>

                    {isLoading ? <Loading /> : <Table className='table table-hover table-sm mx-auto table-striped mt-3' style={{ maxWidth: "1000px" }}>
                        <thead>
                            <tr className='table-dark text-center align-middle'>
                                <th scope='col'>UserID</th>
                                <th scope="col">FirstName</th>
                                <th scope="col">LastName</th>
                                <th scope="col">Email</th>
                                <th scope="col">Role</th>
                                <th scope="col">Password</th>
                                <th scope="col">CreateTime</th>
                                <th scope="col">Remove</th>
                                <th scope="col">Modify</th>
                            </tr>
                        </thead>
                        <tbody className='table-group-divider'>
                            {currentUsers.map((user, index) => (
                                <tr className='text-center align-middle' key={index}>
                                    <td className='table-dark'>{user.id}</td>
                                    <td className="table-light">{user.firstname}</td>
                                    <td className="table-light">{user.lastname}</td>
                                    <td className="table-light">{user.email}</td>
                                    <td className='table-light'>{user.role}</td>
                                    <td className="table-light">{user.password}</td>
                                    <td className="table-light">{user.createtime}</td>
                                    <td className="table-light"><button><i className="bi bi-trash-fill" onClick={() => handleRemove(user, index)} ></i></button></td>
                                    <td className="table-light"><button><i className="bi bi-pencil-fill" onClick={() => handleModify(user, index)} ></i></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>}


                    {/* Pagination */}
                    <ul className="pagination pagination-sm justify-content-center ">
                        <li className="page-item">
                            <button className="page-link " onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                                &laquo;
                            </button>
                        </li>
                        {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }).map((_, i) => (
                            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button onClick={() => paginate(i + 1)} className="page-link ">{i + 1}</button>
                            </li>
                        ))}
                        <li className="page-item">
                            <button className="page-link" onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}>
                                &raquo;
                            </button>
                        </li>
                    </ul>
                </div>
            </div>


            {showLogoutPrompt && (
                <div className="logout-prompt">
                    <p>確定要登出嗎？</p>
                    <button onClick={handleConfirmLogout}>確定 </button>
                    <button onClick={handleCancelLogout}>取消</button>
                </div>
            )}


        </div>
    )
}
