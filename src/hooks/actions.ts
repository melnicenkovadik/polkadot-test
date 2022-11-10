import { useDispatch } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import {tweetsActions} from "../store/tweets/tweets.slice";

const actionCreators = {
  ...tweetsActions,
};
export const useActions = () => {
  const dispatch = useDispatch();
  return bindActionCreators(actionCreators, dispatch);
};
