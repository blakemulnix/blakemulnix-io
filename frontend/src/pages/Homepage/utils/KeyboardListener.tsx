export const getKeyboardListener = (arrowDown: Function, arrowUp: Function, enter: Function) => {
  return (e: any) => {
    if (e.key === "ArrowDown") {
      arrowDown();
    } else if (e.key === "ArrowUp") {
      arrowUp();
    } else if (e.key === "Enter") {
      enter();
    }
  }
}