import { Button as MUIButton } from "@material-ui/core";
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

type ButtonProps = SpaceProps;

export const Button = styled(MUIButton)<ButtonProps>`
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
