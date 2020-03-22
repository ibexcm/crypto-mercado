import { Typography as MUITypography } from "@material-ui/core";
import styled from "styled-components";
import {
  color,
  display,
  flex,
  FlexProps,
  fontFamily,
  fontSize,
  fontStyle,
  fontWeight,
  FontWeightProps,
  lineHeight,
  space,
  SpaceProps,
  textAlign,
} from "styled-system";

type TypographyProps = SpaceProps | FlexProps | FontWeightProps;

export const Typography = styled(MUITypography)<any>`
  ${space}
  ${fontSize}
  ${fontFamily}
  ${fontWeight}
  ${fontStyle}
  ${lineHeight}
  ${color}
  ${flex}
  ${textAlign}
  ${display}
`;
