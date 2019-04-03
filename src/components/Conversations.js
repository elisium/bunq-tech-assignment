import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Grid, Chip, Avatar, } from '@material-ui/core';
import ColorHash from 'color-hash';
import ChatList from './ChatList';
import Chat from './Chat';

const colorHash = new ColorHash();

const styles = theme => ({
    container: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh'
    },
    left: {
        boxShadow: theme.shadows[1],
        height: '100vh',
        position: 'relative',
    },
    right: {
        height: '100vh',
        position: 'relative',
    },
    title: {
        position: 'absolute',
        padding: theme.spacing.unit,
        left: 0,
        top: 0,
        width: '100%',
        boxShadow: theme.shadows[1],
        boxSizing: 'border-box',
        '& > * ': {
            marginLeft: theme.spacing.unit
        }
    }
})

@withStyles(styles)
@inject('users', 'conversations')
@observer
class Conversations extends Component {
    componentDidMount() {
        const { users, history } = this.props;
        if (!users.currentUser) {
            return history.push('/');
        }
    }

    render() {
        const { classes, conversations, users } = this.props;
        return (
            <div className={classes.container}>
                <Grid container>
                    <Grid className={classes.left} item xs={4}>
                        <Typography className={classes.title} variant="h6">Conversations</Typography>
                        <ChatList />
                    </Grid>
                    <Grid className={classes.right} item xs={8}>
                        {conversations.currentThread && <Fragment>
                            <Typography className={classes.title} variant="h6">
                                <span>{conversations.currentThread.name}</span>
                                {conversations.currentThreadUsers && conversations.currentThreadUsers.map(({userid}) => {
                                    const { name } = users.getUserByID(userid);
                                    return (
                                        <Chip
                                            key={userid}
                                            avatar={<Avatar
                                                style={{
                                                    backgroundColor: colorHash.hex(userid),
                                                    color: 'white'
                                                }}
                                            >
                                                {name.charAt(0).toUpperCase()}
                                            </Avatar>}
                                            label={name}
                                        />
                                    )
                                })}
                            </Typography>
                            <Chat />
                        </Fragment>}
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default Conversations;