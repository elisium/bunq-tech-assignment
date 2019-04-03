import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, LinearProgress } from '@material-ui/core';
import ColorHash from 'color-hash';
import classNames from 'classnames';

const colorHash = new ColorHash();

const styles = theme => ({
    main: {
        position: 'absolute',
        top: 48,
        bottom: 0,
        overflow: 'auto',
        width: '100%'
    },
    selected: {
        backgroundColor: '#ccc'
    }
})

@withStyles(styles)
@inject('conversations')
@observer
class ChatList extends Component {
    componentDidMount() {
        const { conversations } = this.props;
        conversations.getConversations();
    }

    render() {
        const { conversations, classes } = this.props;
        console.log(conversations.currentThread);
        return (<Fragment>
            {conversations.list.length === 0 && <LinearProgress variant="indeterminate" />}
            <List className={classes.main}>
                {conversations.list.map(({conversation, users}) => (
                    <ListItem
                        key={conversation.conversationId}
                        className={classNames({
                            [classes.selected]: conversations.currentThread
                                && conversations.currentThread.conversationId === conversation.conversationId
                        })}
                        button
                        onClick={() => conversations.selectCurrentThread(conversation, users)}
                    >
                        <ListItemAvatar>
                            <Avatar
                                style={{
                                    backgroundColor: colorHash.hex(conversation.name)
                                }}
                            >
                                {conversation.name && conversation.name.charAt(0).toUpperCase()}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={conversation.name}
                        />
                    </ListItem>
                ))}
            </List>
        </Fragment>)
    }
}

export default ChatList;