import React, { useState, useEffect, useContext } from "react";
import moment from "moment";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Divider from "@material-ui/core/Divider";

import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import FolderIcon from "@material-ui/icons/Folder";
import DeleteIcon from "@material-ui/icons/Delete";
import LinkIcon from "@material-ui/icons/Link";

import IconButton from "@material-ui/core/IconButton";

import ConnectionContext from "../contexts/connectionContext";
import ShareContext from "../contexts/shareContext";

import LinearProgress from "@material-ui/core/LinearProgress";
import { getQuota, getSharedFilesFromBubble, getOrCreateRoom } from "../modules/SDK";
import { SET_BUBBLE } from "../actions/shareAction";

function Files({ dispatch }) {
    const [quota, setQuota] = useState(0);
    const [files, setFiles] = useState([]);
    const appState = useContext(ConnectionContext);
    const shareState = useContext(ShareContext);

    useEffect(() => {
        const fetchQuota = async () => {
            const q = await getQuota();
            setQuota((q.currentValue / q.maxValue) * 100);
        };
        fetchQuota();
    }, [files]);

    useEffect(() => {
        const fetchFiles = async () => {
            const bubble = await getOrCreateRoom();
            dispatch({ type: SET_BUBBLE, payload: { bubble: bubble } });
            const f = await getSharedFilesFromBubble(bubble);
            setFiles(f);
        };
        if (appState.connectionState === "connected") {
            fetchFiles();
        }
    }, [appState]);

    useEffect(() => {
        const fetchFiles = async () => {
            const f = await getSharedFilesFromBubble(shareState.bubble);
            setFiles(f);
        };
        if (appState.connectionState === "connected" && shareState.bubble) {
            fetchFiles();
        }
    }, [shareState.lastFilesUpdate]);

    const useStyles = makeStyles((theme) => ({
        icon: {
            marginRight: theme.spacing(2),
        },
        files_list_title: {},
        files_list_placeholder: {
            height: "calc(100% - 200px)",
        },
        files_list_placeholder_text: {
            textAlign: "center",
            paddingTop: "50%",
        },
        files_list: {
            height: "100%",
            overflowY: "scroll",
        },
        cardContainer: {
            paddingTop: theme.spacing(6),
            paddingBottom: theme.spacing(6),
            height: "calc(100% - 200px)",
        },
    }));

    const classes = useStyles();

    return (
        <Container className={classes.cardContainer} maxWidth="md">
            <Grid item xs={12} md={12} style={{ height: "100%" }}>
                <div className={classes.files_list_title}>
                    <Typography variant="h6" className={classes.title}>
                        Files currently shared
                    </Typography>
                </div>
                <div style={{ height: "100%" }}>
                    {files && (
                        <List dense={true} className={classes.files_list}>
                            {files.map((file, index) => {
                                let date = file.uploadedDate ? new Date(file.uploadedDate) : new Date.now();
                                let formatedDate = moment(date).format("lll");

                                return (
                                    <React.Fragment key={index}>
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <FolderIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={file.fileName}
                                                secondary={`Shared since ${formatedDate}`}
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton edge="end" aria-label="delete">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                            <ListItemSecondaryAction>
                                                <IconButton edge="end" aria-label="delete">
                                                    <LinkIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <Divider />
                                    </React.Fragment>
                                );
                            })}
                        </List>
                    )}
                    {!files && (
                        <Container maxWidth="sm" className={classes.files_list_placeholder}>
                            <Typography variant="body1" className={classes.files_list_placeholder_text}>
                                No file currently shared
                            </Typography>
                        </Container>
                    )}
                </div>
                <div>
                    <Typography variant="h6" className={classes.title}>
                        Free space
                    </Typography>
                    <LinearProgress variant="determinate" value={quota} />
                    <Typography variant="body2" align="right">
                        {`${(100 - quota).toFixed(2)}%`}
                    </Typography>
                </div>
            </Grid>
        </Container>
    );
}

export default Files;
