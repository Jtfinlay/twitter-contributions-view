import React, { useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Button, CircularProgress, TextField, Typography } from '@material-ui/core';
import axios from 'axios';
import moment from 'moment';
import Chart from './chart';

const STATE_DEFAULT = 'none';
const STATE_SUBMITTING = 'submitting';
const STATE_POLLING = 'polling';
const STATE_SUCCESS = 'success';
const STATE_FAILURE = 'failure';

const useStyles = makeStyles((theme) =>
    createStyles({
        form: {
            display: 'flex',
        },
        section: {
            paddingTop: '30px'
        },
        submit: {
            marginTop: 'auto'
        }
    })
);

function Contributions() {
    const classes = useStyles();
    const [username, setUsername] = useState('');
    const [callState, setCallState] = useState(STATE_DEFAULT);
    const [results, setResults] = useState(null);
    const [warning, setWarning] = useState(null);

    async function submitUsername() {
        if (!username.length) {
            return;
        }

        setCallState(STATE_SUBMITTING);
        try {
            const result = await axios.post(`https://twittercontributions.azurewebsites.net/api/SubmitFetchRequest?username=${username}`);
            if (result.status === 202) {
                setCallState(STATE_POLLING);
                pollUsername(username);
            } else if (result.status === 200) {
                setResults(result.data);
                setCallState(STATE_SUCCESS);
            } else {
                setCallState(STATE_FAILURE);
            }
        } catch (err) {
            if (err.response.status === 429) {
                setWarning(`We have hit our API limit with Twitter. Jobs will continue to run: ${moment.unix(err.response.data)}`);
                setCallState(STATE_POLLING);
                pollUsername(username);
            } else {
                setCallState(STATE_FAILURE);
            }
        }
    }

    function pollUsername() {
        const timer = setInterval(async () => {
            try {
                const result = await axios.get(`https://twittercontributions.azurewebsites.net/api/CheckStatus?username=${username}`);
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
            } catch (err) {
                if (err.response.status === 429) {
                    setWarning(`We have hit our API limit with Twitter. Jobs will continue to run: ${moment.unix(err.response.data)}`);
                } else {
                    setCallState(STATE_FAILURE);
                }
            }
        }, 500);
    }

    function handleTextFieldUpdate(e) {
        setUsername(e.target.value);
    }

    if (callState === STATE_DEFAULT || callState === STATE_FAILURE) {
        return (
            <>
                <Typography variant="body1">Look up your (or someone's) Twitter contribution history over the past year.</Typography>
                <div className={classes.form}>
                    <TextField label="Username" onChange={e => handleTextFieldUpdate(e)} onKeyPress={ev => { if (ev.key === 'Enter') submitUsername(); }}/>
                    <Button variant="contained" className={classes.submit} onClick={() => submitUsername()} disabled={!username.length}>Submit</Button>
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
                <Typography variant="caption">⚠ {warning}</Typography>
            </>
        )
    }

    if (callState === STATE_SUCCESS) {
        return (
            <>
                <Chart data={results}/>
                <div className={classes.section}>
                    <Typography variant="caption">This data is cached and expires {moment(results.run_time).add(1, 'days').format('MMMM Do YYYY, h:mm:ss a')}.</Typography>
                </div>
                <div className={classes.section}>
                    <Typography variant="body1">Look up another contribution history?</Typography>
                    <div className={classes.form}>
                        <TextField label="Username" onChange={e => handleTextFieldUpdate(e)} onKeyPress={ev => { if (ev.key === 'Enter') submitUsername(); }}/>
                        <Button variant="contained" className={classes.submit} onClick={() => submitUsername()} disabled={!username.length}>Submit</Button>
                    </div>
                </div>
            </>
        )
    }

    return (<p>Unexpected state... Try reloading.</p>);
}

export default Contributions;
