import * as React from "react";
import {
  Button,
  Circle,
  Square,
  SquareProps,
  StyleProps,
  useColorModeValue,
} from "@chakra-ui/react";
import { MotionBox } from "./motion-box";
import { YahtzeeUtils } from "./utils";

const DieContext = React.createContext<
  | {
      dotColor: StyleProps["color"];
      borderColor: StyleProps["color"];
      isSelected: boolean;
      isLoading: boolean;
    }
  | undefined
>(undefined);

const useDieContext = () => {
  const c = React.useContext(DieContext);
  if (!c) {
    throw new Error("no die context");
  }
  return c;
};

const DieSquare: React.FC<SquareProps> = (props) => {
  const { borderColor, isSelected, isLoading } = useDieContext();
  return (
    <MotionBox
      animate={
        isLoading
          ? {
              rotate: YahtzeeUtils.getRandomRotationSequence(),
              x: YahtzeeUtils.getRandomXTranslation(),
              y: YahtzeeUtils.getRandomYTranslation(),
            }
          : {
              rotate: 0,
              x: 0,
              y: 0,
              z: 0,
            }
      }
    >
      <Square
        position="relative"
        size="14"
        borderWidth="1px"
        borderStyle="solid"
        borderRadius="base"
        borderColor={isSelected ? "blue.500" : borderColor}
        {...(isSelected
          ? { outline: "2px solid", outlineColor: "blue.500" }
          : {})}
        {...props}
      />
    </MotionBox>
  );
};

const DieDot: React.FC<SquareProps> = (props) => {
  const { dotColor } = useDieContext();
  return (
    <Circle position="absolute" size="17.5%" bgColor={dotColor} {...props} />
  );
};

const One = () => {
  return (
    <DieSquare>
      <DieDot />
    </DieSquare>
  );
};

const Two = () => {
  return (
    <DieSquare>
      <DieDot top="1.5" left="1.5" />
      <DieDot bottom="1.5" right="1.5" />
    </DieSquare>
  );
};

const Three = () => {
  return (
    <DieSquare>
      <DieDot top="1.5" left="1.5" />
      <DieDot />
      <DieDot bottom="1.5" right="1.5" />
    </DieSquare>
  );
};

const Four = () => {
  return (
    <DieSquare>
      <DieDot top="1.5" left="1.5" />
      <DieDot top="1.5" right="1.5" />
      <DieDot bottom="1.5" left="1.5" />
      <DieDot bottom="1.5" right="1.5" />
    </DieSquare>
  );
};

const Five = () => {
  return (
    <DieSquare>
      <DieDot top="1.5" left="1.5" />
      <DieDot top="1.5" right="1.5" />
      <DieDot />
      <DieDot bottom="1.5" left="1.5" />
      <DieDot bottom="1.5" right="1.5" />
    </DieSquare>
  );
};

const Six = () => {
  return (
    <DieSquare>
      <DieDot top="1.5" left="1.5" />
      <DieDot top="1.5" right="1.5" />
      <DieDot left="1.5" />
      <DieDot right="1.5" />
      <DieDot bottom="1.5" left="1.5" />
      <DieDot bottom="1.5" right="1.5" />
    </DieSquare>
  );
};

const DICE = [One, Two, Three, Four, Five, Six];

export const Die: React.FC<{
  children: number;
  dotColor?: StyleProps["color"];
  borderColor?: StyleProps["color"];
  onClick?: () => void;
  isSelected?: boolean;
  isLoading?: boolean;
}> = ({
  children,
  onClick,
  isSelected = false,
  isLoading = false,
  dotColor: dotColorProp = "gray.800",
  borderColor = "gray.500",
}) => {
  const C = DICE[children - 1];
  const dotColor = useColorModeValue(dotColorProp, "gray.100");
  return (
    <DieContext.Provider
      value={{ dotColor, borderColor, isSelected, isLoading }}
    >
      {C ? (
        <Button variant="unstyled" onClick={onClick} h="auto">
          <C />
        </Button>
      ) : null}
    </DieContext.Provider>
  );
};
