import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Tooltip, Typography } from '@material-ui/core';
import moment from 'moment';

const useStyles = makeStyles((theme) =>
    createStyles({
        container: {
            paddingTop: '30px'
        },
        userDetails: {
            display: 'flex',
            margin: '20px',
        },
        userText: {
            marginLeft: '20px',
        }
    })
);

function Chart(props) {
    const classes = useStyles();

    const numberOfDays = 371;
    const numberOfWeeks = numberOfDays / 7;

    let maxActivityValue = 0;
    props.data.summary.forEach(s => {
        if (maxActivityValue < s.like_count + s.status_count) {
            maxActivityValue = s.like_count + s.status_count;
        }
    });

    function getColor(summary) {
        if (!summary) {
            return 'lightgrey';
        }

        const contribCount = summary.status_count + summary.like_count
        if (contribCount > maxActivityValue * 2 / 3) {
            return '#2D92B3';
        }
        if (contribCount > maxActivityValue / 3) {
            return '#66B3CC';
        }
        if (contribCount > 0) {
            return 'lightblue';
        }

        return 'lightgrey';
    }
    
    const likes = props.data.summary.reduce((acc, curr) => acc + curr.like_count, 0);
    const contrib = props.data.summary.reduce((acc, curr) => acc + curr.status_count, 0);

    return (
        <div className={classes.container}>
            <Typography variant="h4">Twitter Contributions</Typography>
            <div className={classes.userDetails}>
                <img src={props.data.user_details.profile_image_url_https.replace('_normal', '_bigger')}></img>
                <div className={classes.userText}>
                    <Typography variant="h5">{props.data.user_details.name}</Typography>
                    <Typography variant="subtitle1">
                        <a href={`https://twitter.com/${props.data.user_details.screen_name}`} target="_blank">
                            @{props.data.user_details.screen_name}
                        </a>
                    </Typography>
                </div>
            </div>
            <Typography variant="h6">{contrib} contributions and {likes} likes in the last year.</Typography>
            <svg width="828" height="128">
                {
                    [...Array(numberOfWeeks).keys()].map(week => {
                        const startOfWeek = moment().subtract(numberOfWeeks - week, 'weeks');
                        return (
                            <g transform={`translate(${16*week}, 0)`} key={week}>
                                {[...Array(7).keys()].map(day => {
                                    const date = startOfWeek.add(1, 'days').format('YYYY-MM-DD');
                                    const summary = props.data.summary.find(s => s.date === date);
                                    let title = `No contributions on ${date}`;
                                    if (summary) {
                                        title = `${summary.status_count} statuses and ${summary.like_count} likes on ${date}`;
                                    }

                                    return (
                                        <Tooltip key={week*7+day} title={title} placement="top">
                                            <rect
                                                className="day"
                                                width="11"
                                                height="11"
                                                x="16"
                                                y={16*day}
                                                fill={getColor(summary)}
                                                data-date={date}
                                            ></rect>
                                        </Tooltip>
                                    )
                                })}
                            </g>
                        );
                    })
                }
            </svg>
        </div>
    );
}

export default Chart;
