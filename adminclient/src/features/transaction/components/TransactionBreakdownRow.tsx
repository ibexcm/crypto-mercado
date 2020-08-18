import {
  ClickAwayListener,
  Grid,
  Paper,
  TextField,
  Theme,
  Tooltip,
  WithStyles,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { Typography } from "../../../common/components";
import { styles } from "../../../common/theme";

interface Props extends WithStyles {
  pair: { key: any; value: any };
  onEditKey?: (value: any) => void;
  onEditValue?: (value: any) => void;
}

const Component: React.FC<Props> = ({ classes, pair, onEditValue, onEditKey }) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>("");

  const handleClickawayClose = () => {
    if (Boolean(value)) {
      onEditKey && onEditKey(value);
      onEditValue && onEditValue(value);
    }

    setValue("");
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <Grid container justify="flex-end" spacing={1}>
      <Grid item xs={6} lg={7}>
        {onEditKey ? (
          <ClickAwayListener
            onClickAway={handleClickawayClose}
            mouseEvent={open ? "onClick" : false}
          >
            <div>
              <Tooltip
                PopperProps={{
                  disablePortal: true,
                  className: classes.tooltipPopper,
                }}
                open={open}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                placement="bottom"
                title={
                  <Paper>
                    <TextField
                      autoFocus
                      fullWidth
                      variant="outlined"
                      value={value}
                      onChange={onChange}
                      InputProps={{
                        className: classes.textFieldInput,
                      }}
                    />
                  </Paper>
                }
              >
                <Typography
                  color="textSecondary"
                  component="span"
                  className={onEditKey && classes.editable}
                  onClick={handleTooltipOpen}
                >
                  {pair.key}
                </Typography>
              </Tooltip>
            </div>
          </ClickAwayListener>
        ) : (
          <Typography color="textSecondary" component="span">
            {pair.key}
          </Typography>
        )}
      </Grid>
      <Grid item xs={6} lg={5}>
        {onEditValue ? (
          <ClickAwayListener
            onClickAway={handleClickawayClose}
            mouseEvent={open ? "onClick" : false}
          >
            <div>
              <Tooltip
                PopperProps={{
                  disablePortal: true,
                  className: classes.tooltipPopper,
                }}
                open={open}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                placement="bottom"
                title={
                  <Paper>
                    <TextField
                      autoFocus
                      fullWidth
                      variant="outlined"
                      value={value}
                      onChange={onChange}
                      InputProps={{
                        className: classes.textFieldInput,
                      }}
                    />
                  </Paper>
                }
              >
                <Typography
                  color="textSecondary"
                  component="span"
                  className={onEditValue && classes.editable}
                  onClick={handleTooltipOpen}
                >
                  {pair.value}
                </Typography>
              </Tooltip>
            </div>
          </ClickAwayListener>
        ) : (
          <Typography color="textSecondary" component="span">
            {pair.value}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export const TransactionBreakdownRow = withStyles((theme: Theme) => ({
  ...styles(theme),
  editable: {
    borderBottomColor: theme.palette.info.main,
    borderBottomStyle: "dotted",
    borderBottomWidth: 2,
  },
  textFieldInput: {
    "& input": {
      paddingTop: 7,
      paddingBottom: 7,
    },
  },
  tooltipPopper: {
    "& > div": {
      padding: 0,
    },
  },
}))(Component);
