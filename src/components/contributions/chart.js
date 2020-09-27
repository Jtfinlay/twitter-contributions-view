import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Tooltip, Typography } from '@material-ui/core';
import moment from 'moment';

const useStyles = makeStyles((theme) =>
    createStyles({
        chart: {
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'flex-end'
        },
        container: {
            paddingTop: '30px'
        },
        wday: {
            fontSize: '9px',
            fill: '#767676',
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
    
    function renderWeeks(startDate, numberOfWeeks, data) {
        return [...Array(numberOfWeeks).keys()].map(week => {
            return (
                <g transform={`translate(${16*week}, 0)`} key={week}>
                    {[...Array(7).keys()].map(day => {
                        const date = startDate.format('YYYY-MM-DD');
                        startDate.add(1, 'days')
                        if (date > moment().format('YYYY-MM-DD')) {
                            return null;
                        }

                        const summary = data.find(s => s.date === date);
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
        });
    }

    function renderMonthLabels(startDate) {
        let currentMonth = '';
        return [...Array(numberOfWeeks).keys()].map(week => {
            if (startDate.format('MMM') === currentMonth) {
                startDate.add(1, 'weeks');
                return null;
            }

            currentMonth = startDate.format('MMM');
            startDate.add(1, 'weeks');
            return (
                <text dx={(1+week)*16} y="-8" className={classes.wday}>{currentMonth}</text>
            );
        });
    }
    
    const likes = props.data.summary.reduce((acc, curr) => acc + curr.like_count, 0);
    const contrib = props.data.summary.reduce((acc, curr) => acc + curr.status_count, 0);
    let startDate = moment().subtract(1, 'years');
    while (startDate.format('ddd') !== 'Sun') {
        startDate.add(1, 'days');
    }

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
            <div className={classes.chart}>
                <svg width="1000" height="128">
                    <g transform="translate(10,20)">
                        { renderWeeks(startDate.clone(), numberOfWeeks, props.data.summary) }
                        { renderMonthLabels(startDate.clone()) }
                        <text className={classes.wday} dx="-10" dy="25">Mon</text>
                        <text className={classes.wday} dx="-10" dy="56">Wed</text>
                        <text className={classes.wday} dx="-10" dy="85">Fri</text>
                    </g>
                </svg>
            </div>
        </div>
    );
}

export default Chart;
