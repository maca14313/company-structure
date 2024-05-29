import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value:[],
  treeChanged:false,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
   
  pushTreeState: (state, action) => {
      state.value=action.payload
       console.log(state.value)
     },
     changeInTree: (state) => {
      state.treeChanged = !state.treeChanged ;
      console.log(state.treeChanged)
    },
   
  },
});

export const {changeInTree,pushTreeState } = counterSlice.actions;

export default counterSlice.reducer;
