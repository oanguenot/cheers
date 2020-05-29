import React from "react";

import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

function Copyright({ dispatch }) {
    return (
        <Typography variant="body2" align="center">
            {"Copyright © "}
            <Link color="primary" href="https://www.al-enterprise.com/">
                Alcatel-Lucent Enterprise
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

export default Copyright;
