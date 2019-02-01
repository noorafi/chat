const express = require('express');
const mongodb = require('mongodb');
const Joi = require('joi');
const router = express.Router();

router.get('/', async (req, res) => {
  const users = await loadHistoriesCollection();
  res.send(await users.find({}).toArray());
});
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongodb.ObjectID.isValid(id))
    return res.status(400).send('Invalid id format was submitted.');

  const messages = await loadHistoriesCollection();
  const history = await histories.findOne({
    _id: new mongodb.ObjectID(req.params.id)
  });
  if (await !history)
    return res
      .status(404)
      .send(`History number ${req.params.id} was not found!`);

  res.send(await history);
});
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongodb.ObjectID.isValid(id))
    return res.status(400).send('Invalid id format was submitted.');

  const histories = await loadHistoriesCollection();
  const history = await histories.findOne({
    _id: new mongodb.ObjectID(req.params.id)
  });
  if (await !history)
    return res
      .status(404)
      .send(`History number ${req.params.id} was not found!`);

  const { error } = validateHistories(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  history.color = req.body.color;
  history.name = req.body.name;
  history.link = req.body.link;
  history.year = req.body.year;
  history.text = req.body.text;
  res.send(await history);
});
router.post('/', async (req, res) => {
  const histories = await loadHistoriesCollection();

  const { error } = validateHistories(req.body);
  if (await error) return res.status(400).send(error.details[0].message);

  await histories.insertOne({
    color: req.body.color,
    name: req.body.name,
    link: req.body.link,
    year: req.body.year,
    text: req.body.text,
    createdAt: new Date()
  });

  res.status(201).send(await histories);
});
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongodb.ObjectID.isValid(id))
    return res.status(400).send('Invalid id format was submitted.');

  const history = await histories.findOne({
    _id: new mongodb.ObjectID(req.params.id)
  });
  if (await !history)
    return res
      .status(404)
      .send(`History number ${req.params.id} was not found!`);

  await histories.deleteOne({
    _id: new mongodb.ObjectID(id)
  });
  res.status(200).send(`History number ${id} was deleted successfully.`);
});
async function validateHistories(history) {
  const schema = {
    color: Joi.string().required(),
    name: Joi.string().required(),
    link: Joi.string().required(),
    year: Joi.string().required(),
    text: Joi.string()
      .min(5)
      .required()
  };
  return Joi.validate(history, schema);
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
