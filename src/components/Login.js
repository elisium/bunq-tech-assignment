import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Typography, FormControl, InputLabel, Select, MenuItem, Button } from '@material-ui/core';

const styles = theme => ({
    container: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100vw',
        height: '100vh'
    },
    main: {
        width: 480,
        padding: theme.spacing.unit
    },
    button: {
        marginTop: theme.spacing.unit,
        width: '100%'
    }
})

@withStyles(styles)
@inject('users')
@observer
class Login extends Component {
    state = {
        user: ''
    }

    componentDidMount() {
        this.props.users.getUsers();
    }

    handleChange = ({ target: { value }}) => {
        this.setState({ user: value});
    }

    handleLogin = () => {
        const { user } = this.state;
        const { users, history } = this.props;
        if (user === '') {
            return;
        }
        users.login(user);
        history.push('/conversations')
    }

    render() {
        const { classes, users } = this.props;
        const { user } = this.state;
        return (
            <div className={classes.container}>
                <Paper className={classes.main}>
                    <Typography variant="h5">Login with:</Typography>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="user">Select user</InputLabel>
                        <Select
                            value={user}
                            onChange={this.handleChange}
                            inputProps={{
                                name: 'user',
                                id: 'user',
                            }}
                        >
                            <MenuItem value="" />
                            {users.list.map(usr => (
                                <MenuItem key={usr.id} value={usr.id}>{usr.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={this.handleLogin}
                    >
                        Login
                    </Button>
                </Paper>
            </div>
        )
    }
}

export default Login;