import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SnackbarContent } from '@mui/material';
import React, { useEffect, useState } from 'react';
import PLayersDrawer from './components/settingSectoins/Drawer';
import { io } from 'socket.io-client';
import { Message } from './components/socket/Message';
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

import {
  LOAD_USER_SUCCESS,
} from './api/types';
import Board from './components/socket/Board';



const socket = io(process.env.REACT_APP_API_URL, {
  path: process.env.REACT_APP_SOCKET_PATH,
});
export default function Game() {
  const [messages, setMessages] = useState([]);
  const [players, setPlayers] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const user = useSelector(state => state.auth.user);
  let history = useHistory();
  const dispatch = useDispatch();



  const leaveAction  = () => {

    if (user) {

    socket.emit('leave_game', user, (result) => {
      dispatch({
        type: LOAD_USER_SUCCESS,
        payload: {user: result}
      });
      history.push('/');
      const opponent = result.opponent;
    });

  }
  }



  useEffect(() => {

    if (user){
  
      socket.emit('update_player_session', user.username ,(result) => {
        const currentPlayer = result.player;
        dispatch({
          type: LOAD_USER_SUCCESS,
          payload: {user: currentPlayer}
        });
        const opponent = result.opponent;
      });
      
    }

  }, []);


  return (
    <div>
      <Grid container spacing={2} columns={16}>
      <Grid item xs={16}>
              <Paper
                sx={{
                  p: 2,
                  margin: 'auto',
                  maxWidth: 500,
                  flexGrow: 1,
                }}
                elevation={24}
              >

              <Container maxWidth="sm">

                <Box sx={{ bgcolor: '#e3f2fd', minHeight: '10vh' }}>
                <Grid
                  container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                >

                  <Typography variant="h5" gutterBottom>
                          Time
                  </Typography>
                  
                </Grid>
                </Box>
              </Container>
            </Paper>
          </Grid>
          <Grid item xs={16}>
              <Paper
                sx={{
                  p: 2,
                  margin: 'auto',
                  maxWidth: 500,
                  flexGrow: 1,
                }}
                elevation={24}
              >

              <Container maxWidth="sm">
                <Box sx={{ height: '57vh' }}>
                  <div className='game'>
                    <Board/>
                  </div>
                </Box>

              </Container>
            </Paper>
          </Grid>
      </Grid>
    </div>
  );
}


