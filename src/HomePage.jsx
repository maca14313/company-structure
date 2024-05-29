import React, { useEffect, useState } from 'react';
import { Menu,Center, Card, Image, Badge, Group ,Modal,Accordion, Container, Paper, Button,Select,Input, Text, Collapse, TextInput, Title, Textarea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import {firebaseUrl} from './firebaseUrl'
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { pushTreeState,changeInTree } from './features/counter/counterSlice';




const Tree= ({ item, depth }) => {


  const count = useSelector((state) => state.counter.value);
  const TreeChanged = useSelector((state) => state.counter.treeChanged);
  const dispatch = useDispatch();

    const [opened, { open, close }] = useDisclosure(false);
    const [loadingD,setLoadingD] =useState(false);
    const [loadingUp,setLoadingUp] =useState(false);
    const [updateId,setUpdateId] =useState();
    const [updateLocalId,setUpdateLocalId] =useState();
    const [errorTextD, setErrorTextD] = useState('');
    const [errorTextUp, setErrorTextUp] = useState('');
    const [isOpen, setIsOpen] = useState(true);
    const hasChildren = item.children && item.children.length > 0;
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const onSubmit = data => console.log(data);






  const deletePosition=async(id)=>{

    setErrorTextD('')
    setLoadingD(true)

    const existingUser = count.filter(user => user.id == id);
    const existingChildren = count.filter(user => user.parentId == existingUser[0].pId);


    try {

      if(existingChildren.length!=0 ){
      
        existingChildren.forEach(async(p) => {
        await axios.put(`${firebaseUrl}/position/${p.id}.json`,{name:p.name, description:p.description,parentId:existingUser[0].parentId,pId:p.pId});

      });
  
      const deleteData=  await axios.delete(`${firebaseUrl}/position/${id}.json`);

      dispatch(pushTreeState(count.filter(po => po.id !== id )))
      setLoadingD(false)
      dispatch(changeInTree())

  
      
      }else{

        const deleteData=  await axios.delete(`${firebaseUrl}/position/${id}.json`);

        dispatch(pushTreeState(count.filter(po => po.id !== id )))
        setLoadingD(false)
        dispatch(changeInTree())

  
      }  
    } catch (error) {
      setLoadingD(false)
      setErrorTextD(error.message)
    } 


  }
 



  const onUpdate = async (data) => {
    setErrorTextUp('')

    

    let updatedPosition=count.filter(user => user.pId == updateLocalId);

let haveChildren=count.filter(user => user.parentId == updateLocalId);

   if (data.parentId != updateLocalId) {

    if(haveChildren.length!=0){

      let matchingChildren = [];
  
  haveChildren.forEach(obj => {
    const children = count.filter(item => item.parentId === obj.pId);
    console.log(children)
  
    matchingChildren.push(...children);
  });
     
  console.log("Initial Matching Children:", matchingChildren);
  
  let result = [];

  while (matchingChildren.length > 0) {
    result.push(...matchingChildren);
  
    // Find next level of children
    const nextLevel = matchingChildren.flatMap(child => 
      count.filter(item => item.parentId === child.pId)
    );
  
    // Update matchingChildren for the next iteration
    matchingChildren = nextLevel;
  }


  const mergedArray = haveChildren.concat(result);

  console.log("Final Result:", result);
  console.log(mergedArray)
  const onTheChildren=mergedArray.filter(user => user.pId == data.parentId);
  
  console.log(onTheChildren.length)
  
  if(onTheChildren.length!=0){
  
    try {
      setLoadingUp(true)
  
    haveChildren.forEach(async(p) => {
    await axios.put(`${firebaseUrl}/position/${p.id}.json`,{name:p.name, description:p.description,parentId:updatedPosition[0].parentId,pId:p.pId});
    })
  
    const updatedData = {name:data.name, description:data.description,parentId:data.parentId,pId:updateLocalId};
        await axios.put(`${firebaseUrl}/position/${updateId}.json`,updatedData);
        dispatch(changeInTree())
        setLoadingUp(false)
    } catch (error) {
      console.error('Error updating user:', error);
        setLoadingUp(false)
          setErrorTextUp(error.message)
    }
  
     }else if (onTheChildren.length==0) {
      try {
        setLoadingUp(true)
        const updatedData = {name:data.name, description:data.description,parentId:data.parentId,pId:updateLocalId};
        await axios.put(`${firebaseUrl}/position/${updateId}.json`,updatedData);
        dispatch(changeInTree())
        setLoadingUp(false)
  
      } catch (error) {
        console.error('Error updating user:', error);
        setLoadingUp(false)
          setErrorTextUp(error.message)
      }
     }
  
  
  
     }else if(haveChildren.length==0 ){
      try {
        setLoadingUp(true)
        const updatedData = {name:data.name, description:data.description,parentId:data.parentId,pId:updateLocalId};
        await axios.put(`${firebaseUrl}/position/${updateId}.json`,updatedData);
        dispatch(changeInTree())
        setLoadingUp(false)
  
      } catch (error) {
        console.error('Error updating user:', error);
        setLoadingUp(false)
          setErrorTextUp(error.message)
      }
     }
  
   }else{
    setErrorTextUp('it can not report to itself')

   }



  

    

   
  };

  return (
    <div className='flex p-3 ' >


        <Modal opened={opened} onClose={close} title="Employee Position" className='text-sm'>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
      

      <Group className='text-sm' justify="space-between" mt="sm" mb="sm">
        <Text fw={500}>{item.name} </Text>

      </Group>

      <Text  size="sm" c="dimmed">
      {item.description} 
      </Text>

     
      <Group  className='flex  justify-end items-center' mt="md" mb="xs">
      {errorTextD!=''?<Button  className='text-xs text-red-700 border-red-500 self-start h-12 w-4/6 md:w-4/6 ' variant="outline" >
          {errorTextD}
        </Button>:''} 
     
      {item.parentId==0?<Button disabled   className='bg-red-200 text-red-700 text-xs '  size="xs" radius="md">
      Delete
      </Button>:<Button onClick={()=>(deletePosition(item.id))}  className='bg-red-200 text-red-700 text-xs ' loading={loadingD}  size="xs" radius="md">
      Delete 
      </Button>}
      </Group>

    </Card>



    <Accordion defaultValue="">
            <Accordion.Item key={'key'} value={'value'}>
      <Accordion.Control >
      <div className='text-xs text-blue-500 font-bold'>Update</div>
      </Accordion.Control>
      <Accordion.Panel className='pt-3 pb-3'>

      <form onSubmit={handleSubmit(onUpdate)}>

      {errorTextUp!=''?<Button  className='text-sm text-red-700 border-red-500 mb-3 h-12 w-4/6 md:w-4/6 ' variant="outline" >
          {errorTextUp}
        </Button>:''} 

      <TextInput
      defaultValue={item.name}
      {...register('name', { required: true,maxLength:100 })}
      size="sm"
      description="Name"
      type='text'
      className='mt-3'
    />  
      {errors.name && <span className='text-red-500 text-xs p-3'>cannot be empty</span>}

     

<Textarea
      {...register('description', { required: true,maxLength: 200 })}
      defaultValue={item.description}
      description="Description"
      placeholder="Input placeholder"
      type='text'
      className='mt-3  '
    />
          {errors.description && <span className='text-red-500 text-xs p-3'>cannot be empty</span>}




    <div className='flex justify-start  items-end pb-1 h-9 w-4/5 font-normal text-gray-500 md:w-4/5'><label htmlFor="parentId" className='text-xs '>Reports to</label></div>
<select id='parentId' defaultValue={item.parentId} {...register('parentId',{ required: true })} className='uppercase text-xs w-auto py-2 px-2 rounded-md   border  rounded-sm' >
  {count.map((item) => (
            <option type="number" key={item.pId}  value={item.pId} >{item.name}</option>
  ))}
  </select>
{errors.parentId && <span className='text-red-500 text-xs p-3'>you have to choose one from the list</span>}  



    

      {item.parentId==0?<Button disabled className='bg-blue-500  text-xs mt-4 ' fullWidth size="sm"  radius="md">
      Update
      </Button>:<Button  onClick={()=>(setUpdateId(item.id),setUpdateLocalId(item.pId))} className='bg-blue-500  text-xs mt-4 ' type='submit' loading={loadingUp}  fullWidth size="sm"  radius="md">
      Update
      </Button>}

    </form>


      </Accordion.Panel>
    </Accordion.Item>    </Accordion>

    
        </Modal>

    <div className="relative" style={{ paddingLeft: `${depth * 20}px` }}>
        <div className='tree-node-line absolute bottom-1 left-0 -z-10 h-[calc(100%+10px)] w-2 bg-customColor-100  '></div>
        
      <div className="mt-3 relative" >
      <Button className='bg-white text-black hover:text-white  active:bg-gray-200 text-xs tracking-wide uppercase'  onClick={open}>{item.name}
        <div className='absolute top-2/4 left-0 -z-10 h-2 bg-customColor-100   ' style={{ minWidth: `${depth * 20}px`,left: `${depth * -20}px` }}></div>
        </Button>
        
      </div>
     
      {isOpen && (
        <div className="item-children">
          {hasChildren && item.children.map((child) => (
            <Tree key={child.pId} item={child} depth={depth + 1}  />
            
          ))}
        </div>
      )}
    </div>
   
    </div>
  );
};







// Main App component
const HomePage = () => {

  const count = useSelector((state) => state.counter.value);
  const TreeChanged = useSelector((state) => state.counter.treeChanged);

  const dispatch = useDispatch();

  const [treeData,setTreeData]=useState([])
  const [newPosition,setNewPosition]=useState([])

  const [loading,setLoading] =useState(false);
    const [loadingStructure,setLoadingStructure] =useState(false);

  const [errorText, setErrorText] = useState('');

  



  useEffect(() => {

    const fetchData=async()=>{

       try {

        setLoadingStructure(true)

             const response=await axios.get(`${firebaseUrl}/position.json`)
             const data = response.data;
             const usersArray = data ? Object.entries(data).map(([key, value]) => ({ id: key, ...value })) : [];

   //setTreeData(usersArray);
   dispatch(pushTreeState(usersArray))
   setLoadingStructure(false)

   setErrorText('')
       } catch (error) {
         console.log(error.message)
         setLoadingStructure(false)
         setErrorText(error.message)
         
       }
    }

    fetchData()
    console.log(newPosition)

   
    console.log(1)
   
 }, [newPosition,TreeChanged]);





  const buildTree = (flatData) => {
  

    const withChildren = {};
    const roots = [];
  
    flatData.forEach((item) => {
      withChildren[item.pId] = { ...item, children: [] };
    });
     
    flatData.forEach((item) => {
      if (item.parentId === 0) {
        roots.push(withChildren[item.pId]);
      } else {
        if (withChildren[item.parentId]) {
          withChildren[item.parentId].children.push(withChildren[item.pId]);
        }
      }
    });
    console.log(roots)
    return roots;
  };

  
  const hierarchicalData = buildTree(count);

  return (
    <div className=' '>


    <div className=' h-96 h-fit    ' >
    <Group justify=" " className='text-center flex justify-center  w-screen md:justify-start' mt="md" mb="xs">
        <Text className='text-2xl text-center md:ml-10 text-blue-600 ' fw={900}>Perago`s Company Structure</Text>
      </Group>
    </div>
    <Card className='flex flex-col sticky items-center justify-center  items-center bg-transparent py-10 mb-8'  padding="lg"  >
      

      <Group justify="space-between" mt="md" mb="xs">
        <Text className='text-2xl text-blue-600 ' fw={900}>Explore Our Structure</Text>
      </Group>

      <Text className='cl text-center  text-white    p-2 px-4 text-mm w-screen md:px-0  md:text-lg md:w-3/4 md:p1 m-7 ' size="lg" c="dimmed">
      Discover  your organizational management with our dynamic tree view app.

Easily edit roles for a clear and visual company hierarchy.

Our intuitive interface allows you to manage your team's structure effortlessly.

Improve efficiency and keep your organization well-organized.

Experience seamless updates and a better overview of your company's hierarchy.</Text>

      <Button  component={Link} to={'/add-new-position'} color="blue" className='bg-blue-500  shadow-xl  text-sm mt-4 ' size='lg' mt="md" radius="md">
        Add New Position
      </Button>
    </Card>

    <div className="tree-view    flex flex-col items-center overflow-scrol  min-w-max max-w-max md:items-center md:min-w-full">
         

        <Container   fluid className="  overflow-scroll max-w-screen min-w-screen sm:flex sm:flex-col sm:items-center  ">
        <div>
        
           <div className='flex flex-col'>
           <Button loading={loadingStructure} onClick={()=>dispatch(changeInTree())} className='w-52 h-12 font-bold bg-customColor-400 bg-indigo-900  hover:text-white  hover:bg-gray-400 rounded-none border-none shadow-2xl text-white text-center text-md  '  shadow="xs">
            Company Structure
           </Button>
           {errorText!=''?<Button  className='text-sm  text-yellow-300 border-2 border-red-500   mt-11 bg-customColor-100 h-12   rounded-none ' variant="outline" >
          {errorText}
        </Button>:''} 
           </div>
      {hierarchicalData.map((item) => (
        <Tree  key={item.pId} item={item} depth={0}  />
      ))}
</div>
      </Container>
    </div>
    </div>
  );
};

export default HomePage;
