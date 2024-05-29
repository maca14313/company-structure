import React, { useEffect, useState } from 'react'
import { Menu,Center, Card, Image, Badge, Group ,Modal,Accordion, Container, Paper, Button,Select,Input, Text, Collapse, TextInput, Title, Anchor, Notification, Alert, Textarea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import axios from 'axios';
import {firebaseUrl} from './firebaseUrl'

import { useSelector, useDispatch } from 'react-redux';
import { pushTreeState,changeInTree } from './features/counter/counterSlice';











function AddNewPosition() {

  const count = useSelector((state) => state.counter.value);
  const TreeChanged = useSelector((state) => state.counter.treeChanged);
  const dispatch = useDispatch();
  const { register, handleSubmit, watch, formState: { errors }  } = useForm();

     const [treeData,setTreeData]=useState(count)
     const [newPosition,setNewPosition]=useState([])
     const [loading,setLoading] =useState(false);
     const [errorText, setErrorText] = useState('');


    const onAdd=async(data)=>{
        setLoading(true)
        const addedData = { name:data.name, description:data.description,parentId:Number(data.parentId),pId:Date.now() };
        try {
            
            const response=  await axios.post(`${firebaseUrl}/position.json`,addedData);
            const resPosition = { id: response.data.name, ...addedData };

            setNewPosition(resPosition) 
            setLoading(false)

        } catch (error) {

            setLoading(false)
            setErrorText(error.message)
        }

    }

    useEffect(() => {

       const fetchData=async()=>{

          try {

            const response=await axios.get(`${firebaseUrl}/position.json`)
            const data = response.data;
            const usersArray = data ? Object.entries(data).map(([key, value]) => ({ id: key, ...value })) : [];
      
      dispatch(pushTreeState(usersArray))

          } catch (error) {
            setErrorText(error.message)
          }
       }

       fetchData()

      
    }, [newPosition]);

   

    
  return (
    <div className='flex flex-col items-center justify-center w-screen h-screen'>

         {newPosition!=''?<Alert className='w-4/6 mb-7' variant="light" color="blue" title='New Position' >
          <Text className='flex  gap-2'><div className='font-bold ml-2'>Name</div>  {newPosition?.name}</Text> 
          <Text className='flex  gap-2'> <div className='font-bold ml-2'>Description  </div>  {newPosition?.description}  </Text>
          
          </Alert>:''}


         <form onSubmit={handleSubmit(onAdd)} className='flex flex-col  items-center justify-center bg-white  w-4/5 md:w-96  h-3/5  rounded-md shadow-xl'>
          <Title className=' p-8 text-center' order={5}>
         Add a position to our dynamic tree view app
          </Title>


      {errorText!=''?<Button  className='text-xs text-red-700 border-red-500 mb-3 h-12 w-4/6 md:w-4/6 ' variant="outline" >
          {errorText}
        </Button>:''} 


       

       
        

    <TextInput
      {...register('name', { required: true,maxLength:100 })}
      
      size="sm"
      description="Name"
      placeholder="Name"
      type='text'
      className='mt-3 w-4/5 md:w-4/5 '
     /> 
           {errors.name && <span className='text-red-500 text-xs p-3'>This field is required</span>}
 
     
    <Textarea
       {...register('description', { required: true,maxLength: 200 })}
       description="Description"
      placeholder="Description"
      type='text'
      className='mt-3 w-4/5 md:w-4/5 '
      /> 
              {errors.description && <span className='text-red-500 text-xs p-3'>This field is required</span>}



      <div className='flex justify-start  items-end pb-1 h-9 w-4/5 font-normal text-gray-500 md:w-4/5'><label htmlFor="parentId" className='text-xs '>Reports to</label></div>
      <select id='parentId' {...register('parentId',{ required: true })} className='uppercase text-xs  w-4/5 h-9 pl-2 md:w-4/5 border rounded-sm'>
      {count.map((item) => (
            <option type="number" key={item.pId} value={item.pId} >{item.name}</option>
       ))}
     </select>

  {errors.parentId && <span className='text-red-500 text-xs p-3'>You have to choose one from the list</span>}


<Button type='submit' className='bg-blue-500  text-xs mt-6 w-4/5 md:w-4/5 ' loading={loading} fullWidth size="sm"  radius="md">Add New Position</Button>
<Anchor className='text-blue-500 text-xs mt-3'  target="_blank"><Link className='text-blue-500 text-xs mt-3' to='/'>Go-to-home-page</Link></Anchor>




</form>
  </div>
  )
}

export default AddNewPosition