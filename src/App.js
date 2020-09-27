import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import GithubIcon from '@material-ui/icons/GitHub';
import Contributions from './components/contributions/contributions';
import Chart from './components/contributions/chart';

const useStyles = makeStyles((theme) =>
    createStyles({
        spacer: {
            flexGrow: 1,
        },
        toolbar: {
            maxWidth: '1081px',
            width: '100%',
            margin: 'auto'
        },
        title: {
            flexGrow: 1
        },
        root: {
            flexGrow: 1
        },
        main: {
            maxWidth: '1081px',
            width: '100%',
            margin: 'auto',
            paddingTop: '80px'
        }
    })
);

function App() {
    const classes = useStyles();
    
    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar className={classes.toolbar}>
                    <Typography className={classes.title} variant="h6">
                        Twitter Contributions
                    </Typography>
                    <IconButton color="inherit" aria-label="menu" href="https://github.com/Jtfinlay/twitter-contributions-service">
                        <GithubIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <main className={classes.main}>
                <Contributions />
                <Chart/>
            </main>
        </div>
    );
}

export default App;
