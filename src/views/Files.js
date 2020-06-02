import React, { useState, useEffect, useContext } from "react";
import moment from "moment";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import CloudCircle from "@material-ui/icons/CloudCircleTwoTone";

import ConnectionContext from "../contexts/connectionContext";

import { getQuota, getSharedFilesFromBubble } from "../modules/SDK";
import SharePopup from "./SharePopup";

function Files({ dispatch }) {
    const [quota, setQuota] = useState(0);
    const [files, setFiles] = useState([]);
    const appState = useContext(ConnectionContext);
    const [file, setFile] = useState();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchQuota = async () => {
            const q = await getQuota();
            setQuota((q.currentValue / q.maxValue) * 100);
        };
        fetchQuota();
    }, [files]);

    useEffect(() => {
        const fetchFiles = async () => {
            const f = await getSharedFilesFromBubble(appState.bubble);
            setFiles(f);
        };
        if (appState.connectionState === "connected" && appState.bubble) {
            fetchFiles();
        }
    }, [appState]);

    const useStyles = makeStyles((theme) => ({
        files_list_title: {},
        files_list_placeholder: {
            height: "calc(100% - 64px)",
        },
        files_list_placeholder_text: {
            textAlign: "center",
            paddingTop: "50%",
        },
        files_list: {
            height: "calc(100% - 32px)",
            overflowY: "scroll",
            padding: 0,
        },
        cardContainer: {
            paddingTop: theme.spacing(4),
            height: "calc(100% - 64px)",
        },
        files_quota: {
            height: "64px",
        },
        files_area: {
            height: "calc(100% - 64px)",
        },
    }));

    const classes = useStyles();

    function handleClick(file) {
        setFile(file);
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    return (
        <Container className={classes.cardContainer} maxWidth="md">
            <Container className={classes.files_quota}>
                <Typography variant="body1">Free space</Typography>
                <LinearProgress variant="determinate" value={quota} />
                <Typography variant="body2" align="right">
                    {`${(100 - quota).toFixed(2)}%`}
                </Typography>
            </Container>
            <Grid item xs={12} md={12} className={classes.files_area}>
                <div className={classes.files_list_title}>
                    <Typography variant="h6">Files shared</Typography>
                </div>

                {files.length > 0 && (
                    <List className={classes.files_list} component="nav">
                        {files.map((fileWithMetadata, index) => {
                            let file = fileWithMetadata.file;
                            let formatedDate = moment(fileWithMetadata.expirationDate).calendar();

                            let hasExpired = false;
                            let message = `Shared until ${formatedDate}`;
                            if (moment().isAfter(moment(fileWithMetadata.expirationDate))) {
                                message = `Expired since ${formatedDate}`;
                                hasExpired = true;
                            }

                            return (
                                <React.Fragment key={index}>
                                    <ListItem
                                        button
                                        onClick={() => {
                                            handleClick(fileWithMetadata);
                                        }}
                                    >
                                        <ListItemIcon>
                                            <CloudCircle style={{ fontSize: 36 }} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={<Typography variant="h6">{file.fileName}</Typography>}
                                            secondary={
                                                <Typography
                                                    variant="body2"
                                                    style={{ color: hasExpired ? "#ff0000" : "#cccccc" }}
                                                >
                                                    {message}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            );
                        })}
                    </List>
                )}
                {files.length === 0 && (
                    <Container maxWidth="sm" className={classes.files_list_placeholder}>
                        <Typography variant="body1" className={classes.files_list_placeholder_text}>
                            No file currently shared
                        </Typography>
                    </Container>
                )}
            </Grid>
            <SharePopup open={open} fileData={file} onClose={handleClose} />
        </Container>
    );
}

export default Files;
