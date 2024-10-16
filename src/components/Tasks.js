import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button, Modal, Form, Navbar, Nav, FormControl, InputGroup, Dropdown, Card } from 'react-bootstrap';
import { fetchTasks, createTask, updateTask, deleteTask } from '../utils/api';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';

function Tasks() {
    const [tasks, setTasks] = useState({ TODO: [], 'IN PROGRESS': [], DONE: [] });
    const [showModal, setShowModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [isNew, setIsNew] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const userId = JSON.parse(localStorage.getItem('user'));

    const [filteredTasks, setFilteredTasks] = useState({ TODO: [], 'IN PROGRESS': [], DONE: [] });

    const loadTaskTimeout = useRef()

    useEffect(() => {
        console.log(process.env.REACT_APP_SUPABASE_URL, "env")

            const user = localStorage.getItem('user');
            if (user) {
              navigate('/tasks');
            } else {
              navigate('/login');
            }
        loadTasks();
    }, []);

    const loadTasks = async () => {
        const { data } = await fetchTasks(userId?.id);
        const newColumns = { TODO: [], 'IN PROGRESS': [], DONE: [] };
        data.forEach(task => {
            newColumns[task.status].push(task);
        });
        setTasks(newColumns);
        setFilteredTasks(newColumns);
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;
        if (result.source.droppableId === result.destination.droppableId &&
            result.source.index === result.destination.index) return;

        const sourceCol = tasks[result.source.droppableId];
        const destCol = tasks[result.destination.droppableId];
        const [movedTask] = sourceCol.splice(result.source.index, 1);
        destCol.splice(result.destination.index, 0, movedTask);

        setTasks({
            ...tasks,
            [result.source.droppableId]: sourceCol,
            [result.destination.droppableId]: destCol
        });

        await updateTask(movedTask.id, { ...movedTask, status: result.destination.droppableId });
    };

    const toggleModal = () => setShowModal(!showModal);
    const toggleDetailsModal = () => setShowDetailsModal(!showDetailsModal);

    const handleSaveTask = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const taskData = {
            title: form.elements.title.value,
            column: form.elements.column.value,
            status: isNew ? 'TODO' : currentTask.status,
            userId : userId?.id
        };

        if (isNew) {
            const { data } = await createTask(taskData);
            setTasks({ ...tasks, [taskData.status]: [...tasks[taskData.status], data] });
        } else {
            await updateTask(currentTask.id, taskData);
        }
        loadTasks();
        toggleModal();
    };

    const handleDeleteTask = async (taskId) => {
        await deleteTask(taskId);
        loadTasks();
    };

    const openModalForNewTask = () => {
        setCurrentTask({ title: '', column: '', status: 'TODO' });
        setIsNew(true);
        toggleModal();
    };

    const openModalForEdit = (task) => {
        setCurrentTask(task);
        setIsNew(false);
        toggleModal();
    };

    const openModalForDetails = (task) => {
        setCurrentTask(task);
        setIsNew(false);
        toggleDetailsModal();
    };

    const handleLogOut = async() => {
        const user =  JSON.parse(localStorage.getItem('user'));
       
        
        if(user.isGoogleLogin) {
          await  signOut(auth);
        } 

        localStorage.removeItem('user');

        navigate('/login');
    };

    const handleSearchChange = (event) => {



        const searchTerm = event.target.value;

        setSearchTerm(searchTerm);

        const filteredTasks = {
            TODO: [],
            'IN PROGRESS': [],
            DONE: []
        };

        Object.keys(tasks).forEach(column => {
            tasks[column].forEach(task => {
                if (task.title.toLowerCase().includes(searchTerm.toLowerCase())) {
                    filteredTasks[column].push(task);
                }
            });
        });

        setFilteredTasks(filteredTasks);

      

        
        
        
    };

    return (
        <>
            <Navbar bg="primary" expand="lg" className="mb-3 d-flex justify-content-between px-3">
                <Navbar.Brand  className='text-white'>Task Manager</Navbar.Brand>
                <Nav className="ml-auto">
                    <Button variant="outline-danger text-white" onClick={() => {handleLogOut()}}>Logout</Button>
                </Nav>
            </Navbar>
            <div className='px-3 d-flex flex-row justify-content-between mb-3'>
                <InputGroup className=''>
                    <div className='d-flex flex-row align-items-center gap-2' style={{ width: '30%' }}>
                        <div className='align-items-center'>Search</div>
                        <FormControl
                            placeholder="Search..."
                            aria-label="Search"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                </InputGroup>
               
            </div>
            <Button onClick={openModalForNewTask} className="ml-4 px-3" style={{marginLeft:"15px"}}>Add Task</Button>
            <DragDropContext onDragEnd={handleDragEnd}>
                <div style={{ display: 'flex', justifyContent: 'space-between'}} className='gap-3 p-3'>
                    {Object.keys(filteredTasks).map((col, index) => (
                        <Droppable key={index} droppableId={col}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    style={{ height: '550px', background: snapshot.isDraggingOver ? '#f8f9fa' : 'white', padding: '20px', width: '33%' }}
                                    className="col bg-white border rounded p-2 overflow-auto">
                                    <h4 className='bg-primary text-white p-2'>{col}</h4>
                                    {filteredTasks[col].map((task, index) => (
                                        <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                                            {(provided, snapshot) => (
                                                <Card
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={{
                                                        userSelect: "none",
                                                        marginBottom: "8px",
                                                        backgroundColor: snapshot.isDragging ? "#e9ecef" : "#f8f9fa",
                                                        ...provided.draggableProps.style
                                                    }}
                                                    className="p-2"
                                                >
                                                    <Card.Body>
                                                        <Card.Title>{task.title}</Card.Title>
                                                        <Card.Text>
                                                            {task.column}
                                                        </Card.Text>
                                                        <div d-flex justify-content-end>
                                                            <Button variant="danger" onClick={() => handleDeleteTask(task.id)}>Delete</Button>
                                                            <Button variant="primary" onClick={() => openModalForEdit(task)} className="ms-2">Edit</Button>
                                                            <Button variant="primary" onClick={() => openModalForDetails(task)} className="ms-2">View Details</Button>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>

            <Modal show={showModal} onHide={toggleModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{isNew ? 'Add New Task' : 'Edit Task'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSaveTask}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" name="title" defaultValue={currentTask?.title} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" name="column" defaultValue={currentTask?.column} rows={3} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                        {!isNew && (
                            <Button variant="danger" onClick={() => handleDeleteTask(currentTask.id)} className="ms-2">
                                Delete
                            </Button>
                        )}
                        <Button variant="secondary" onClick={toggleModal} className="ms-2">
                            Cancel
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showDetailsModal} onHide={toggleDetailsModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{"Task Details"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className='fw-semibold'>Title</Form.Label>
                            <div>
                                {currentTask?.title}
                            </div>
                            
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className='fw-semibold'>Description</Form.Label>
                            <div>
                                {currentTask?.column}
                            </div>
                        </Form.Group>
                        {!isNew && (
                            <Button variant="danger" onClick={() => handleDeleteTask(currentTask.id)} className="ms-2">
                                Delete
                            </Button>
                        )}
                        <Button variant="secondary" onClick={toggleDetailsModal} className="ms-2">
                            Cancel
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Tasks;
