import WebWorker from "../../hooks/webWorker";

export const MyWorker = () => {
  function workerCode(this: Worker) {}
  const myWorker = new WebWorker(workerCode);
  return myWorker;
};
