import { useDispatch } from "react-redux"
import { setAlertMessage, setAlertOpen, setAlertSeverity } from "../Store/Slices/Alert";

const useAlert = () => {
  const dispatch = useDispatch();

  const showAlert = ({ severity, message }) => {
    dispatch(setAlertOpen(true));
    dispatch(setAlertSeverity(severity));
    dispatch(setAlertMessage(message));
  }

  return showAlert;
}

export default useAlert