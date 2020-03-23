import { TextField as MUITextField } from "@material-ui/core";
import styled from "styled-components";
import {
  color,
  flex,
  fontFamily,
  fontSize,
  fontStyle,
  fontWeight,
  lineHeight,
  space,
  SpaceProps,
  textAlign,
} from "styled-system";

type TextFieldProps = SpaceProps;

export const TextField = styled(MUITextField)<TextFieldProps>`
  ${space}
  ${fontSize}
  ${fontFamily}
  ${fontWeight}
  ${fontStyle}
  ${lineHeight}
  ${color}
  ${flex}
  ${textAlign}
`;
