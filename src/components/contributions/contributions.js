import React, { useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Button, CircularProgress, TextField, Typography } from '@material-ui/core';
import axios from 'axios';
import Chart from './chart';

const STATE_DEFAULT = 'none';
const STATE_SUBMITTING = 'submitting';
const STATE_POLLING = 'polling';
const STATE_SUCCESS = 'success';
const STATE_FAILURE = 'failure';

const useStyles = makeStyles((theme) =>
    createStyles({
    })
);

function Contributions() {
    const classes = useStyles();
    const [username, setUsername] = useState('');
    const [callState, setCallState] = useState(STATE_DEFAULT);
    const [results, setResults] = useState(null);

    async function submitUsername() {
        setCallState(STATE_SUBMITTING);
        const result = await axios.post(`https://twittercontributions.azurewebsites.net/api/SubmitFetchRequest?username=${username}`);
        console.log(result);
        if (result.status === 202) {
            setCallState(STATE_POLLING);
            pollUsername(username);
        } else if (result.status === 200) {
            setResults(result.data);
            setCallState(STATE_SUCCESS);
        } else {
            setCallState(STATE_FAILURE);
        }
    }

    function pollUsername() {
        const timer = setInterval(async () => {
            const result = await axios.get(`https://twittercontributions.azurewebsites.net/api/CheckStatus?username=${username}`);
            console.log(result);
            if (result.status === 404) {
                // eat it
            } else if (result.status === 200) {
                setResults(result.data);
                setCallState(STATE_SUCCESS);
                clearInterval(timer);
            } else {
                setCallState(STATE_FAILURE);
                clearInterval(timer);
            }
        }, 500);
    }

    function handleTextFieldUpdate(e) {
        setUsername(e.target.value);
    }

    if (callState === STATE_DEFAULT || callState === STATE_FAILURE) {
        return (
            <>
                <Typography variant="body1">Lookup your Twitter contribution history over the past year.</Typography>
                <div>
                    <TextField label="Username" onChange={e => handleTextFieldUpdate(e)}/>
                    <Button variant="contained" onClick={() => submitUsername()} disabled={!username.length}>Submit</Button>
                </div>
                {callState === STATE_FAILURE && <Typography variant="caption">We hit an unexpected error. Please try again.</Typography>}
            </>
        );
    }

    if (callState === STATE_SUBMITTING) {
        return (
            <>
                <CircularProgress/>
                <Typography variant="body1">Submitting request..</Typography>
            </>
        )
    }

    if (callState === STATE_POLLING) {
        return (
            <>
                <CircularProgress/>
                <Typography variant="body1">Request submitted! Waiting for results..</Typography>
                <Typography variant="body1">You can leave and come back. We'll hold results for 24 hours.</Typography>
            </>
        )
    }

    if (callState === STATE_SUCCESS) {
        return (
            <Chart summary={results.summary}/>
        )
    }

    return (<p>Unexpected state... Try reloading.</p>);
}

export default Contributions;
