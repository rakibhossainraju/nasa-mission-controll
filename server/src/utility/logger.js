import chalk from "chalk";

const createLogger = (color) => (message) => {
  if (process.env.NODE_ENV === "development") {
    console.log(chalk[color](message));
  } else {
    console.log(message);
  }
};
const createLoggerWithBackground = (color) => (message) => {
  if (process.env.NODE_ENV === "development") {
    console.log(chalk[`bg${color}`].black.bold(message));
  } else {
    console.log(message);
  }
};
export const logYellow = createLogger("yellow");
export const logBlue = createLoggerWithBackground("Blue");
export const logMagenta = createLoggerWithBackground("Magenta");
