import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import { Avatar, TextField, Paper, Typography, Button } from '@material-ui/core';
import ColorHash from 'color-hash';
import ConversationsStore from '../stores/ConversationsStore';
import UsersStore from '../stores/UsersStore';
import MessagesStore from '../stores/MessagesStore';
import classNames from 'classnames';

const colorHash = new ColorHash();

@inject(() => ({
    conversations: ConversationsStore,
    currentThread: ConversationsStore.currentThread,
    users: UsersStore,
    messages: MessagesStore,
}))
@observer
class Chat extends Component {
    state = {
        input: ''
    }

    async componentDidMount() {
        const { messages } = this.props;
        await messages.getMessages();
        this.scrollIntoView();
    }

    async componentWillReceiveProps(newProps) {
        if (newProps.currentThread) {
            await this.props.messages.getMessages();
            this.scrollIntoView();
        }
    }

    handlePost = async (evt) => {
        evt.preventDefault();
        await this.props.messages.postMessage(this.state.input);
        this.setState({ input: ''});
        this.scrollIntoView();
    }

    handleLoadMore = () => {
        this.props.messages.loadMoreMessages();
    }

    scrollIntoView = () => {
        this.messagesEnd.scrollIntoView();
    }

    render() {
        const { messages, users, classes } = this.props;
        const { input } = this.state;
        return (<div className={classes.main}>
            <div className={classes.messages}>
                {messages.list.length > 10 && (
                    <Button
                        className={classes.loadBtn}
                        onClick={this.handleLoadMore}
                    >
                        Load older messages
                    </Button>
                )}
                {messages.list.length === 0 && <Typography variant="caption">No messages here</Typography>}
                {messages.list.map(msg => (
                    <div
                        key={msg.id}
                        className={classNames(classes.message, {
                            [classes.self]: users.currentUser === msg.senderId
                        })}
                    >
                        {users.currentUser !== msg.senderId && (
                            <Avatar
                                style={{
                                    backgroundColor: colorHash.hex(msg.senderId)
                                }}
                            >
                                {users.getUserByID(msg.senderId).name.charAt(0).toUpperCase()}
                            </Avatar>
                        )}
                        <Paper className={classes.msgText}>
                            <Typography variant="body1">{msg.message}</Typography>
                            <Typography variant="caption">Sent: {msg.timestamp}</Typography>
                        </Paper>
                    </div>
                ))}
                <div 
                    ref={(el) => { this.messagesEnd = el; }}
                >
                    {/* this enables scrolling to the bottom of the chat */}
                </div>
            </div>
            <div className={classes.input}>
                <form onSubmit={this.handlePost}>
                    <TextField
                        fullWidth
                        value={input}
                        onChange={({target: {value}}) => this.setState({input: value})}
                        variant="outlined"
                        autoFocus
                    />
                </form>
            </div>
        </div>)
    }
}

const styles = theme => ({
    main: {
        position: 'absolute',
        top: 48,
        bottom: 0,
        overflow: 'auto',
        width: '100%'
    },
    input: {
        position: 'absolute', 
        bottom: 0,
        width: '100%',
        padding: theme.spacing.unit,
        boxSizing: 'border-box',
    },
    messages: {
        position: 'absolute', 
        bottom: 72,
        top: 0,
        width: '100%',
        backgroundColor: '#ccc',
        overflow: 'auto',
    },
    message: {
        display: 'flex',
        '& > * ': {
            margin: theme.spacing.unit
        }
    },
    self: {
        justifyContent: 'flex-end',
        'Avatar': {
            display: 'none'
        }
    },
    msgText: {
        padding: theme.spacing.unit
    },
    loadBtn: {
        width: '100%'
    }
})

export default withStyles(styles)(Chat);