import React, { useState, useEffect, useContext } from "react";

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
import IconButton from "@material-ui/core/IconButton";

import ConnectionContext from "../contexts/connectionContext";
import LinearProgress from "@material-ui/core/LinearProgress";
import { getQuota, getSharedFilesFromBubble, getOrCreateRoom } from "../modules/SDK";
import { SET_BUBBLE } from "../actions/shareAction";

function Files({ dispatch }) {
    const [quota, setQuota] = useState(0);
    const [files, setFiles] = useState([]);
    const appState = useContext(ConnectionContext);

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

    const useStyles = makeStyles((theme) => ({
        icon: {
            marginRight: theme.spacing(2),
        },
        files_list_title: {
            marginTop: theme.spacing(4),
        },
        files_list_placeholder: {
            height: "calc(100% - 150px)",
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
            height: "calc(100% - 150px)",
        },
    }));

    const classes = useStyles();

    return (
        <Container className={classes.cardContainer} maxWidth="md">
            <Grid item xs={12} md={12} style={{ height: "100%" }}>
                <div>
                    <Typography variant="h6" className={classes.title}>
                        Quota
                    </Typography>
                    <LinearProgress variant="determinate" value={quota} />
                </div>

                <div className={classes.files_list_title}>
                    <Typography variant="h6" className={classes.title}>
                        Files currently shared
                    </Typography>
                </div>
                <div style={{ height: "100%" }}>
                    {files && (
                        <List dense={true} className={classes.files_list}>
                            {files.map((file, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <FolderIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={file.fileName} secondary={file.uploadedDate} />
                                            <ListItemSecondaryAction>
                                                <IconButton edge="end" aria-label="delete">
                                                    <DeleteIcon />
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
            </Grid>
        </Container>
    );
}

export default Files;
