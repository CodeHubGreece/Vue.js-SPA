const express = require('express');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID

const router = express.Router();

const { MONGODB_URL } = process.env

// login
router.post('/auth', async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: 'Bad Request: No email or password.'});
    }

    const collection = await loadUsersCollection();

    if (!collection){
        return res.status(500).send({ message: 'Error: A database error occured.'});
    }

    const userObj = await collection.findOne({ email, password })

    if (!userObj || !userObj.token){
        return res.status(403).send({ message: 'Forbidden: Wrong email or password.'});
    }

    const { token, firstname, lastname } = userObj
    return res.status(200).send({ token, firstname, lastname });
});

// todo items
router.get('/todo-list', async (req, res) => {
    const { token } = req.headers

    if (!token){
        return res.status(403).send({ message: 'Forbidden: No token.'});
    }

    const collection = await loadUsersCollection();

    if (!collection){
        return res.status(500).send({ message: 'Error: A database error occured.'});
    }

    const userObj = await collection.findOne({ token })

    if (!userObj || !userObj.todo_list){
        return res.status(403).send({ message: 'Forbidden: Wrong token.'});
    }

    return res.status(200).send({ todo_list: userObj.todo_list });
});

// insert item
router.post('/todo-list', async (req, res) => {
    const { token } = req.headers

    if (!token){
      return res.status(403).send({ message: 'Forbidden: No token.'});
    }

    const collection = await loadUsersCollection();

    if (!collection){
      return res.status(500).send({ message: 'Error: A database error occured.'});
    }

    const userObj = await collection.findOne({ token })

    if (!userObj || !userObj.todo_list){
        return res.status(403).send({ message: 'Forbidden: Wrong token.'});
    }

    const { title } = req.body

    if (!title || title == ''){
        return res.status(403).send({ message: 'Title field is missing.'});
    }

    const _id = new ObjectID()
    const done = false
    userObj.todo_list.push({ _id, title, done })

    await collection.updateOne({ token }, { $set: { todo_list: userObj.todo_list } });

    //Return created object id
    res.status(200).send( { _id, title, done } );
});

// update item
router.patch('/todo-list/:_id', async (req, res) => {
    const { token } = req.headers

    if (!token){
      return res.status(403).send({ message: 'Forbidden: No token.'});
    }

    const collection = await loadUsersCollection();

    if (!collection){
      return res.status(500).send({ message: 'Error: A database error occured.'});
    }

    const userObj = await collection.findOne({ token })

    if (!userObj || !userObj.todo_list){
        return res.status(403).send({ message: 'Forbidden: Wrong token.'});
    }

    const { _id } = req.params;

    const todoItemIdx = userObj.todo_list.findIndex(f=>f._id == _id)

    if (todoItemIdx <= -1){
        return res.status(403).send({ message: 'Can\'t find todo item with this id.' });
    }

    const { title, done } = req.body

    if (title)
        userObj.todo_list[todoItemIdx].title = title

    if (typeof done !== 'undefined')
        userObj.todo_list[todoItemIdx].done = done

    //Update
    await collection.updateOne({ token }, { $set: { todo_list: userObj.todo_list } });

    //Return updated object id
    res.status(200).send( { _id, title, done } );
});

// delete item
router.delete('/todo-list/:_id', async (req, res) => {
    const { token } = req.headers

    if (!token){
      return res.status(403).send({ message: 'Forbidden: No token.'});
    }

    const collection = await loadUsersCollection();

    if (!collection){
      return res.status(500).send({ message: 'Error: A database error occured.'});
    }

    const userObj = await collection.findOne({ token });

    if (!userObj || !userObj.todo_list){
        return res.status(403).send({ message: 'Forbidden: Wrong token.'});
    }

    const { _id } = req.params;

    if (!_id){
        return res.status(403).send({ message: 'Id is missing.'});
    }

    const todoItemIdx = userObj.todo_list.findIndex(f=>f._id == _id)

    if (todoItemIdx <= -1){
        return res.status(403).send({ message: 'Can\'t find todo item with this id.' });
    }

    //Remove
    userObj.todo_list.splice(todoItemIdx, 1);
    await collection.updateOne({ token }, { $set: { todo_list: userObj.todo_list } });


    //Return all list items
    res.status(200).send( { todo_list: userObj.todo_list } );
});

// catch 404 and forward to error handler
router.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
router.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

async function loadUsersCollection() {
    const client = await MongoClient.connect(MONGODB_URL, { useNewUrlParser: true });
    return client.db('vueJS').collection('users');
}

module.exports = router;
