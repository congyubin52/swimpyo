import React, { useEffect, useState } from 'react';
import { Backdrop, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton } from '@mui/material';
import Carousel from 'react-material-ui-carousel'
import { Paper, Button } from '@mui/material'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiPaper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ConfirmOrClose from '../../../components/ConfirmOrClose';
import { Modal } from '@mui/base';
import AdminRoomList from './AdminRoomList';
import api from '../../../hooks/RefreshTokenAuto';


const AdminDetailAccm = () => {



    const Item = styled(MuiPaper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        textAlign: 'center',
        color: theme.palette.text.secondary,
        boxShadow: 'none'
    }));

    const [dataLoaded, setDataLoaded] = useState(false);


    const [backEndData, setBackEndData] = useState({
        accmData: {},
        accmImages: []
    })
    const requestData = useParams(); // 넘어온 데이터
    const navigate = useNavigate();

    // 수정과 삭제 버튼 클릭 시 모달 창 열기 위한 state
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openImg, setOpenImg] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    // 방 등록, 목록을 위한 state
    const [rooms, setRooms] = useState([]); // 방 목록을 저장하는 상태
    const [isAddingRoom, setIsAddingRoom] = useState(false);

    // 등록에 보내기 위한 Props
    const accomNum = backEndData.accmData;


    /* 수정과 삭제를 위한 함수 시작 */

    const handleClickOpen = (type) => {
        // 수정과 삭제 버튼 클릭 시 실행
        if (type === 'edit') {
            setOpenEdit(true); // 수정 버튼 클릭 시 수정 모달을 열도록
        } else if (type === 'delete') {
            setOpenDelete(true); // 삭제 버튼 클릭 시 삭제 모달을 열도록
        }
    }

    const close = (type) => {
        if (type === 'edit') {
            setOpenEdit(false);
        } else if (type === 'delete') {
            setOpenDelete(false);
        }
    };

    const handleEditConfirmation = () => {
        // 이곳에서 수정 페이지로 이동 또는 관련 작업 수행
        // handleClose(); // 작업을 수행한 후 모달 닫기
        navigate(`/admin/accommodation/modifyAccm/${requestData.a_m_no}`)

    };

    const handleDeleteConfirmation = () => {
        // 삭제 버튼 클릭 시
    }

    /* 수정과 삭제를 위한 함수 끝 */



    // console.log("accmData", accmData);





    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.post(`http://localhost:8090/api/admin/accm/show_accm_detail?a_m_no=${requestData.a_m_no}`);
                //  res -> 서버에서 받아온 데이터
                console.log("detail data success");
                // res.data에서 얻은 데이터를 화면에 업데이트 하기 위해 data상태에 설정한다. data 상태를 업데이트 하면 화면이 새로 렌더링 된다.

                // setAccmData(res.data.adminAccmDto);
                setBackEndData({
                    accmData: res.data.adminAccmDto,
                    accmImages: res.data.a_i_images
                });
                setDataLoaded(true);



            } catch (error) {
                setDataLoaded(true);
                console.error("An error occurred:", error);
            }
        };

        fetchData(); // 비동기 함수 호출
    }, [requestData]);


    if (!dataLoaded) {

        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                sx={{
                    backgroundColor: 'background.default',
                    color: 'text.primary',
                }}
            >
                <CircularProgress color="inherit" />
                <Typography variant="h3" component="h1">
                    Loading...
                </Typography>
            </Box>
        );
    }

    else
        return (

            <Container component="main" sx={{ marginBottom: '3rem', marginTop: '3rem' }}>
                <Paper elevation={3} sx={{ padding: '2rem', display: 'flex', flexDirection: 'column', maxWidth: '700px', margin: 'auto' }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        <Typography component="h1" variant="h5" sx={{ mt: 3, fontWeight: "bold" }}>
                            나의 업소 관리
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton aria-label="수정" onClick={() => handleClickOpen('edit')}>
                            <EditIcon />
                        </IconButton>
                        <ConfirmOrClose open={openEdit} close={() => close('edit')} confirmation={() => handleEditConfirmation(backEndData.accmData.a_m_no)} words="수정" />

                        <IconButton aria-label="삭제" onClick={() => handleClickOpen('delete')}>
                            <DeleteIcon />
                        </IconButton>
                        <ConfirmOrClose open={openDelete} close={() => close('delete')} confirmation={handleDeleteConfirmation} words="삭제" />
                    </Box>

                    <Box sx={{ marginBottom: '1rem', marginTop: '1rem', backgroundColor: 'white', padding: '1rem' }}>
                        <Carousel>
                            {backEndData.accmImages.map((imageUrl, index) => (
                                <Paper key={index} sx={{ height: '180px', overflow: 'hidden' }}>
                                    <img src={imageUrl} alt={`Image ${index}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </Paper>
                            ))}
                        </Carousel>
                    </Box>


                    <Item sx={{ marginTop: '1rem' }}>


                        <Grid container alignItems="center" sx={{ paddingLeft: '10px', paddingRight: '10px', fontSize: '30px' }}>
                            {backEndData.accmData.a_acc_name}
                            <Grid item xs={10} sx={{ mt: '10px' }}>
                                <Divider variant="left" sx={{ width: '100%' }} />
                            </Grid>
                        </Grid>

                    </Item>

                    <Item sx={{ marginTop: '1rem' }}>
                        <Grid container sx={{ marginTop: '8px', paddingLeft: '10px', paddingRight: '10px' }}>
                            <Grid item xs={12}>
                                <Box sx={{ fontSize: '15px', textAlign: 'left', marginBottom: 2 }}>
                                    주소 : {backEndData.accmData.a_acc_address}
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ fontSize: '15px', textAlign: 'left', marginBottom: 2 }}>
                                    연락처 : {backEndData.accmData.a_acc_phone}
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ fontSize: '15px', textAlign: 'left', marginBottom: 2 }}>
                                    이메일 : {backEndData.accmData.a_m_email}
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ fontSize: '15px', textAlign: 'left', marginBottom: 2 }}>
                                    사업자 번호 : {backEndData.accmData.a_acc_bn}
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ fontSize: '15px', textAlign: 'left', marginBottom: 2 }}>
                                    대표자 명 : {backEndData.accmData.a_m_name}
                                </Box>
                            </Grid>
                            <Grid container alignItems="center" sx={{ paddingLeft: '10px', paddingRight: '10px' }}>
                                <Grid item xs={10} sx={{ mt: '10px' }}>
                                    <Divider variant="left" sx={{ width: '100%' }} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Item>

                    <Item sx={{ marginTop: '1rem' }}>

                        <Grid container alignItems="center" sx={{ paddingLeft: '10px', paddingRight: '10px', fontSize: '20px' }}>
                            업소 정보
                        </Grid>
                        <Grid container alignItems="center" sx={{ paddingLeft: '10px', paddingRight: '10px' }}>
                            <span dangerouslySetInnerHTML={{ __html: backEndData.accmData.a_acc_intro }}></span>
                        </Grid>

                        <Grid container alignItems="center" sx={{ paddingLeft: '10px', paddingRight: '10px' }}>
                            <Grid item xs={10} sx={{ mt: '10px' }}>
                                <Divider variant="left" sx={{ width: '100%' }} />
                            </Grid>
                        </Grid>

                    </Item>

                    <Item sx={{ marginTop: '1rem' }}>
                        <Grid container alignItems="center" sx={{ paddingLeft: '10px', paddingRight: '10px', fontSize: '20px', mb: 3 }}>
                            객실
                        </Grid>
                        <AdminRoomList accomNum={accomNum} requestData={requestData} />
                    </Item>

                </Paper>
            </Container >


        );
}




export default AdminDetailAccm;