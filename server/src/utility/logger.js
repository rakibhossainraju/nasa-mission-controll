import chalk from "chalk";

export const logBlue = (message) => {
  if (process.env.NODE_ENV === "development") {
    console.log(chalk.blue(message));
  } else {
    console.log(message);
  }
};
export const logMagenta = (message) => {
  if (process.env.NODE_ENV === "development") {
    console.log(chalk.magenta(message));
  } else {
    // console.log(message);
  }
};
