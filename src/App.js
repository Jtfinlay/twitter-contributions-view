import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import GithubIcon from '@material-ui/icons/GitHub';


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
            paddingTop: '20px'
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
                    <IconButton color="inherit" aria-label="menu">
                        <GithubIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <main className={classes.main}>
                <Typography variant="body">Lookup your Twitter contribution history over the past year.</Typography>
            </main>
        </div>
    );
}

export default App;
