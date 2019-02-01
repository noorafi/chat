const express = require('express');
const mongodb = require('mongodb');
const Joi = require('joi');
const router = express.Router();

router.get('/', async (req, res) => {
  const messages = await loadMessagesCollection();
  res.send(await messages.find({}).toArray());
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongodb.ObjectID.isValid(id))
    return res.status(400).send('Invalid id format was submitted.');

  const messages = await loadMessagesCollection();
  const message = await messages.findOne({
    _id: new mongodb.ObjectID(req.params.id)
  });

  if (await !message)
    return res
      .status(404)
      .send(`Message number ${req.params.id} was not found!`);

  res.send(await message);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongodb.ObjectID.isValid(id))
    return res.status(400).send('Invalid id format was submitted.');

  const messages = await loadHistoriesCollection();
  const message = await messages.findOne({
    _id: new mongodb.ObjectID(req.params.id)
  });

  if (await !message)
    return res
      .status(404)
      .send(`Message number ${req.params.id} was not found!`);

  const { error } = validateHistories(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  messages.message = req.body.message;
  res.send(await message);
});
router.post('/', async (req, res) => {
  const messages = await loadMessagesCollection();

  const { error } = validateHistories(req.body);
  if (await error) return res.status(400).send(error.details[0].message);

  await messages.insertOne({
    message: req.body.message,
    createdAt: new Date()
  });

  res.status(201).send(await messages);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongodb.ObjectID.isValid(id))
    return res.status(400).send('Invalid id format was submitted.');

  const message = await messages.findOne({
    _id: new mongodb.ObjectID(req.params.id)
  });
  if (await !message)
    return res
      .status(404)
      .send(`Message number ${req.params.id} was not found!`);

  await messages.deleteOne({
    _id: new mongodb.ObjectID(id)
  });
  res.status(200).send(`Message number ${id} was deleted successfully.`);
});

async function validateMessage(message) {
  const schema = {
    message: Joi.string().required()
  };
  return Joi.validate(message, schema);
}

async function loadMessagesCollection() {
  const client = await mongodb.MongoClient.connect(
    'mongodb://wael:wael@localhost:27017chat',
    {
      useNewUrlParser: true
    }
  );
  return client.db('chat').collection('messages');
}
module.exports = router;
